import assert from 'node:assert/strict';
import test from 'node:test';
import app from '../src/index.js';
import { ClassRepository } from '../src/repositories/class.repository.js';
import { MaterialRepository } from '../src/repositories/material.repository.js';
import { validateMaterialInput } from '../src/validation/materials.js';
import { createD1Fixture } from './d1-fixture.js';

test('D1 persists partial progress, completion, bookmarks and never regresses on delayed writes', async (t) => {
  const fixture = createD1Fixture(); t.after(fixture.close);
  const repository = new MaterialRepository({ db: fixture.db, classRepository: new ClassRepository(fixture.db) });
  const input = validateMaterialInput({ title: 'Energi dan gaya', status: 'published', blocks: [{ id: 'b1', type: 'paragraph', content: 'Energi dapat berubah bentuk.' }] });
  const material = await repository.create({ classId: 'class-1', ownerId: 'teacher-1', ...input });
  const save = (percent, now) => repository.setProgress({ classId: 'class-1', materialId: material.id, uid: 'student-1', percent, now });
  assert.equal((await save(27, '2026-10-03T01:00:00Z')).percent, 27);
  assert.equal((await repository.get('class-1', material.id, 'student-1')).progress.percent, 27);
  await repository.setBookmark({ classId: 'class-1', materialId: material.id, uid: 'student-1', saved: true });
  assert.equal((await repository.list('class-1', 'student-1'))[0].bookmarked, true);
  const completed = await save(100, '2026-10-03T02:00:00Z');
  const stale = await save(5, '2026-10-03T01:30:00Z');
  assert.deepEqual(stale, completed);
  assert.equal((await save(100, '2026-10-03T03:00:00Z')).completedAt, completed.completedAt);
  assert.equal((await repository.listUserState('student-1', 'progress'))[0].progress.percent, 100);
  await repository.setBookmark({ classId: 'class-1', materialId: material.id, uid: 'student-1', saved: false });
  assert.equal((await repository.get('class-1', material.id, 'student-1')).bookmarked, false);
});

test('drafts, nonmembers and owners cannot write student progress; library hides revoked membership', async (t) => {
  const fixture = createD1Fixture(); t.after(fixture.close);
  const repository = new MaterialRepository({ db: fixture.db, classRepository: new ClassRepository(fixture.db) });
  const material = await repository.create({ classId: 'class-1', ownerId: 'teacher-1', ...validateMaterialInput({ title: 'Materi draf' }) });
  const save = (uid) => repository.setProgress({ classId: 'class-1', materialId: material.id, uid, percent: 100 });
  await assert.rejects(() => save('student-1'), { code: 'NOT_FOUND' });
  await assert.rejects(() => save('teacher-1'), { code: 'FORBIDDEN' });
  await assert.rejects(() => save('outsider'), { code: 'FORBIDDEN' });
  await repository.update({ classId: 'class-1', materialId: material.id, ownerId: 'teacher-1', ...validateMaterialInput({ title: 'Materi terbit', status: 'published' }) });
  await save('student-1');
  await repository.setBookmark({ classId: 'class-1', materialId: material.id, uid: 'student-1', saved: true });
  fixture.sqlite.prepare("DELETE FROM class_members WHERE class_id='class-1' AND user_id='student-1'").run();
  assert.deepEqual(await repository.listUserState('student-1', 'progress'), []);
  assert.deepEqual(await repository.listUserState('student-1', 'bookmarks'), []);
});

test('100 student materials use a bounded query count rather than two extra queries per item', async (t) => {
  const fixture = createD1Fixture(); t.after(fixture.close);
  const insert = fixture.sqlite.prepare("INSERT INTO materials(id,class_id,owner_id,title,status,blocks_json,created_at,updated_at) VALUES(?1,'class-1','teacher-1','Materi','published','[]',?2,?2)");
  for (let i = 0; i < 100; i++) insert.run(`m${i}`, '2026-10-03T00:00:00Z');
  let queries = 0;
  const db = { ...fixture.db, prepare(sql) { queries++; return fixture.db.prepare(sql); } };
  const repository = new MaterialRepository({ db, classRepository: new ClassRepository(db) });
  assert.equal((await repository.list('class-1', 'student-1')).length, 100);
  assert.ok(queries <= 3, `Expected bounded queries, got ${queries}`);
});

test('material progress and student analytics routes require authentication on Cloudflare', async () => {
  const env = { ALLOWED_ORIGINS: 'https://app.test', FIREBASE_PROJECT_ID: 'test' };
  for (const [path, method] of [['/classes/class-1/materials/m1/progress', 'PUT'], ['/classes/class-1/analytics/me', 'GET']]) {
    const response = await app.fetch(new Request(`https://api.test${path}`, { method }), env);
    assert.equal(response.status, 401);
  }
});
