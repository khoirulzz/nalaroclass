import assert from 'node:assert/strict';
import test from 'node:test';
import { assertCloudflareApiTarget } from '../../../config/backend-target.js';
import { createProgressSaver, createReadingTracker, estimateMaterialReading } from './reading-progress.js';
import { dateKey, jakartaDate, weekDates } from '../agenda/calendar.js';

test('reading estimate counts loaded paragraphs, headings, lists and media allowances', () => {
  const estimate = estimateMaterialReading([{ id: 'text', type: 'paragraph', content: 'kata '.repeat(400) }, { id: 'list', type: 'bullet_list', items: ['satu dua', 'tiga empat'] }, { id: 'image', type: 'image' }, { id: 'file', type: 'file' }, { id: 'divider', type: 'divider' }]);
  assert.equal(estimate.wordCount, 404);
  assert.equal(estimate.entries.length, 4);
  assert.equal(estimate.minutes, 5);
  assert.equal(estimate.hasExternalContent, true);
  assert.equal(estimateMaterialReading([]).minutes, 0);
  assert.equal(estimateMaterialReading([{ id: 'text', type: 'paragraph', content: 'kata '.repeat(400) }]).minutes, 2);
});

test('reading requires active visible time, distributes elapsed time and caps automatic completion at 99', () => {
  const estimate = estimateMaterialReading([{ id: 'a', type: 'paragraph', content: 'kata '.repeat(100) }, { id: 'b', type: 'paragraph', content: 'kata '.repeat(100) }]);
  const tracker = createReadingTracker(estimate);
  const visible = [{ id: 'a', fraction: 1, coverage: 1 }, { id: 'b', fraction: 1, coverage: 1 }];
  assert.equal(tracker.tick(1, visible, false), 0);
  assert.equal(tracker.tick(1, []), 0);
  for (let index = 0; index < 30; index++) tracker.tick(1, visible);
  assert.equal(tracker.tick(0, visible), 50);
  for (let index = 0; index < 60; index++) tracker.tick(1, visible);
  assert.equal(tracker.tick(0, visible), 99);
  assert.equal(createReadingTracker(estimate, 100).tick(1, visible), 100);
});

test('a long block cannot accrue credit beyond its viewed portion, and a suspended timer is clamped', () => {
  const estimate = estimateMaterialReading([{ id: 'a', type: 'paragraph', content: 'kata '.repeat(200) }]);
  const tracker = createReadingTracker(estimate);
  const visible = [{ id: 'a', fraction: 0.25, coverage: 0.25 }];
  assert.equal(tracker.tick(60, visible), 3);
  for (let i = 0; i < 60; i++) tracker.tick(1, visible);
  assert.equal(tracker.tick(0, visible), 25);
  const resumed = createReadingTracker(estimate, 80);
  assert.equal(resumed.tick(1, visible), 80);
  for (let i = 0; i < 6; i++) resumed.tick(1, [{ id: 'a', fraction: 1, coverage: 1 }]);
  assert.equal(resumed.tick(0, visible), 90);
});

test('completion waits for an in-flight automatic write and sends 100 last', async () => {
  let release;
  const calls = []; const responses = [];
  const saver = createProgressSaver({ save: async (percent) => {
    calls.push(percent);
    if (percent < 100) await new Promise((resolve) => { release = resolve; });
    return { percent };
  }, onSaved: (progress) => responses.push(progress.percent), onError: assert.fail });
  saver.request(10); const first = saver.flush();
  saver.request(100); const completed = saver.flush();
  assert.equal(first, completed);
  release(); assert.equal(await completed, true);
  saver.request(50); await saver.flush();
  assert.deepEqual(calls, [10, 100]);
  assert.deepEqual(responses, [10, 100]);
});

test('failed progress remains pending for retry and disposed reader has no callbacks', async () => {
  let failure = true; const errors = []; const saved = [];
  const saver = createProgressSaver({ save: async (percent) => { if (failure) throw new Error('offline'); return { percent }; }, onSaved: (progress) => saved.push(progress.percent), onError: (error) => errors.push(error.message) });
  saver.request(40); assert.equal(await saver.flush(), false);
  failure = false; assert.equal(await saver.flush(), true);
  assert.deepEqual(errors, ['offline']); assert.deepEqual(saved, [40]);
  saver.request(100); const pending = saver.flush(); saver.dispose(); await pending;
  assert.deepEqual(saved, [40]);
});

test('agenda calendar keeps WIB dates across UTC midnight and week/month changes', () => {
  assert.equal(jakartaDate(new Date('2026-10-02T18:00:00Z')), '2026-10-03');
  assert.deepEqual(weekDates('2026-10-03').map(dateKey), ['2026-09-28', '2026-09-29', '2026-09-30', '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04']);
  assert.equal(dateKey(weekDates('2026-10-03', 1)[0]), '2026-10-05');
});

test('production build rejects the legacy AWS API and accepts Cloudflare and custom HTTPS hosts', () => {
  assert.throws(() => assertCloudflareApiTarget('https://legacy.lambda-url.ap-southeast-1.on.aws'), /Cloudflare/);
  assert.throws(() => assertCloudflareApiTarget('http://localhost:8787'), /HTTPS/);
  assert.doesNotThrow(() => assertCloudflareApiTarget('https://nalaro-api.uniquefactuhl.workers.dev'));
  assert.doesNotThrow(() => assertCloudflareApiTarget('https://api.example.test'));
});
