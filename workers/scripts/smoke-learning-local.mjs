import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';

// Synthetic local component/API fixtures. No login, production writes or user data.
const root = path.resolve(import.meta.dirname, '../..');
const artifacts = path.join(root, 'workers/.wrangler/learning-artifacts');
await mkdir(artifacts, { recursive: true });
const { chromium } = createRequire(path.join(process.env.NALARO_BROWSER_TOOLS || path.join(os.tmpdir(), 'nalaro-release-tools'), 'package.json'))('playwright');
const base = process.env.NALARO_UX_LOCAL_URL || 'http://127.0.0.1:5173';
await writeFile(path.join(artifacts, 'preview.html'), '<!doctype html><html lang="id"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><div id="root"></div><script type="module" src="./preview.jsx"></script></html>');
await writeFile(path.join(artifacts, 'preview.jsx'), `
import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '/src/index.css';
import MaterialReader from '/src/pages/MaterialReader.jsx';
import { WeekAgenda } from '/src/components/dashboard/DashboardWidgets.jsx';
const params = new URLSearchParams(location.search);
const role = params.get('role') || 'student';
const reader = params.get('page') !== 'agenda';
createRoot(document.getElementById('root')).render(<MemoryRouter initialEntries={['/'+role+'/classes/demo/materials/m1']}><div className="qz-content"><Routes><Route path="/:role/classes/:classId/materials/:materialId" element={reader ? <MaterialReader role={role}/> : <div style={{maxWidth:360}}><WeekAgenda role={role}/></div>} /></Routes></div></MemoryRouter>);
`);
const material = { id: 'm1', classId: 'demo', title: 'Materi belajar contoh', summary: 'Materi sintetis untuk pengujian.', blocksCount: 1, status: 'published', blocks: [{ id: 'text', type: 'paragraph', content: 'Bacalah kalimat ini dengan teliti. '.repeat(10) }] };
const browser = await chromium.launch({ headless: true, executablePath: process.env.NALARO_CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 1000 } });
const errors = []; const writes = [];
let persisted = 0; let rejectProgress = false; let rejectAgenda = false;
await context.route('**/*', async (route) => {
  const url = new URL(route.request().url());
  if (url.origin !== new URL(base).origin) return route.abort();
  if (url.pathname === '/src/services/api.js') return route.fulfill({ contentType: 'application/javascript', body: `
    export async function apiRequest(path,options={}){const r=await fetch('/fixture'+path,{method:options.method||'GET',body:options.body?JSON.stringify(options.body):undefined,signal:options.signal});const p=await r.json();if(!r.ok){const e=new Error(p.error.message);e.status=r.status;throw e;}return p.data;}
    export const optionalAuthApiRequest=apiRequest,publicApiRequest=apiRequest; export async function apiDownload(){}
  ` });
  if (url.pathname.startsWith('/fixture')) {
    const pathname = url.pathname.slice('/fixture'.length);
    if (pathname.endsWith('/progress')) {
      const percent = route.request().postDataJSON().percent; writes.push(percent);
      if (rejectProgress) return route.fulfill({ status: 503, json: { error: { message: 'Koneksi contoh terputus.' } } });
      persisted = Math.max(persisted, percent);
      return route.fulfill({ json: { data: { progress: { percent: persisted, status: persisted === 100 ? 'completed' : 'started' } } } });
    }
    if (pathname === '/learning/agenda') {
      if (rejectAgenda) return route.fulfill({ status: 503, json: { error: { message: 'Agenda contoh sedang gagal.' } } });
      const day = '2026-10-03';
      const events = url.searchParams.get('from') <= day && url.searchParams.get('to') >= day ? [
        { id: 's1', kind: 'session', classId: 'demo', className: 'Kelas contoh', title: 'Pertemuan contoh', date: day, status: 'published', dueAt: null },
        { id: 't1', kind: 'task', classId: 'demo', className: 'Kelas contoh', title: 'Tugas contoh', date: day, status: 'published', dueAt: '2026-10-03T02:00:00Z' },
      ] : [];
      return route.fulfill({ json: { data: { agenda: { events, truncated: false } } } });
    }
    return route.fulfill({ json: { data: { material: { ...material, progress: { percent: persisted } } } } });
  }
  return route.continue();
});
const page = await context.newPage();
page.on('pageerror', (error) => errors.push(error.message));
await page.clock.install({ time: new Date('2026-10-03T03:00:00Z') });
const goto = async (name, role = 'student') => {
  await page.goto(`${base}/workers/.wrangler/learning-artifacts/preview.html?page=${name}&role=${role}`);
  await page.bringToFront();
};
const percent = () => page.locator('[role="progressbar"]').getAttribute('aria-valuenow').then(Number);
try {
  await goto('reader');
  await page.getByRole('heading', { name: material.title }).waitFor();
  await page.getByText('Estimasi belajar 1 menit').waitFor();
  await page.locator('[data-reading-block="text"]').scrollIntoViewIfNeeded();
  await page.clock.runFor(5000);
  await page.waitForFunction(() => Number(document.querySelector('[role="progressbar"]').getAttribute('aria-valuenow')) > 5);
  assert.ok(persisted > 5);
  const before = await percent();
  await page.evaluate(() => Object.defineProperty(document, 'hidden', { configurable: true, value: true }));
  await page.clock.runFor(5000);
  assert.equal(await percent(), before);
  await page.evaluate(() => { delete document.hidden; });
  await page.getByRole('button', { name: 'Tandai selesai', exact: true }).click();
  await page.getByRole('button', { name: 'Sudah selesai' }).waitFor();
  assert.equal(persisted, 100);
  await page.reload();
  await page.getByRole('button', { name: 'Sudah selesai' }).waitFor();
  assert.equal(await percent(), 100);
  console.log('Reader: automatic progress above 5%, estimate, hidden pause, completion and reload PASS');

  persisted = 0; rejectProgress = true;
  await goto('reader');
  await page.getByRole('button', { name: 'Tandai selesai', exact: true }).click();
  await page.getByRole('alert').waitFor();
  assert.ok(await percent() < 100);
  rejectProgress = false;
  await page.getByRole('button', { name: 'Coba simpan lagi' }).click();
  await page.getByRole('button', { name: 'Sudah selesai' }).waitFor();
  console.log('Reader: failed completion does not show success; explicit retry PASS');

  for (const role of ['student', 'teacher']) {
    await goto('agenda', role);
    await page.getByRole('link', { name: /Pertemuan contoh/ }).waitFor();
    assert.equal(await page.getByRole('link', { name: /Pertemuan contoh/ }).getAttribute('href'), `/${role}/classes/demo/sessions`);
    assert.equal(await page.getByRole('link', { name: /Tugas contoh/ }).getAttribute('href'), `/${role}/classes/demo/tasks/t1`);
    await page.getByRole('button', { name: 'Minggu berikutnya' }).click();
    await page.getByText('Belum ada agenda hari ini').waitFor();
    await page.getByRole('button', { name: /Kembali ke hari ini/ }).click();
    await page.getByRole('link', { name: /Pertemuan contoh/ }).waitFor();
  }
  rejectAgenda = true;
  await goto('agenda');
  await page.getByRole('alert').waitFor();
  rejectAgenda = false;
  await page.getByRole('button', { name: 'Coba lagi', exact: true }).click();
  await page.getByRole('link', { name: /Pertemuan contoh/ }).waitFor();
  console.log('Agenda: role links, week navigation, empty state and API failure/retry PASS');

  const writesBeforePreview = writes.length;
  await goto('reader', 'teacher');
  await page.getByRole('heading', { name: material.title }).waitFor();
  await page.clock.runFor(5000);
  assert.equal(await page.getByRole('button', { name: 'Tandai selesai', exact: true }).count(), 0);
  assert.equal(writes.length, writesBeforePreview);
  console.log('Teacher preview: no student progress writes PASS');

  for (const size of [{ width: 320, height: 900 }, { width: 1440, height: 1000 }]) {
    await page.setViewportSize(size);
    for (const name of ['reader', 'agenda']) {
      await goto(name);
      await page.locator(name === 'reader' ? '.qz-reader' : '.qz-agenda__events').waitFor();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${name} overflow at ${size.width}px`);
      await page.screenshot({ path: path.join(artifacts, `${name}-${size.width}.png`), fullPage: true });
    }
  }
  assert.deepEqual(errors, []);
  console.log(`Layout: 320/1440px PASS; runtime errors: 0; progress writes: ${writes.length}`);
} finally { await browser.close(); }
