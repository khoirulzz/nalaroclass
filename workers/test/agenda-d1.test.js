import assert from 'node:assert/strict';
import test from 'node:test';
import app from '../src/index.js';
import { AgendaRepository, validateAgendaRange } from '../src/repositories/agenda.repository.js';
import { createD1Fixture } from './d1-fixture.js';

test('agenda validates real calendar dates and a bounded inclusive date range', () => {
  assert.deepEqual(validateAgendaRange('2026-10-01', '2026-10-31'), { from: '2026-10-01', to: '2026-10-31' });
  for (const range of [[undefined, undefined], ['2026-02-30', '2026-03-01'], ['2026-10-03', '2026-10-02'], ['2026-10-01', '2026-11-01']]) {
    assert.throws(() => validateAgendaRange(...range), { code: 'INVALID_AGENDA_RANGE' });
  }
});

test('agenda respects ownership, membership, publication and WIB task boundaries', async (t) => {
  const fixture = createD1Fixture(); t.after(fixture.close);
  const sql = fixture.sqlite;
  const now = '2026-10-03T00:00:00Z';
  sql.prepare("INSERT INTO users(id,name,role,created_at,updated_at) VALUES('teacher-2','Guru lain','teacher',?1,?1)").run(now);
  sql.prepare("INSERT INTO classes(id,code,owner_id,teacher_name,name,status,created_at,updated_at) VALUES('class-2','DEF456','teacher-2','Guru lain','Kelas lain','active',?1,?1)").run(now);
  const session = sql.prepare("INSERT INTO learning_sessions(id,class_id,owner_id,title,meeting_date,status,sort_order,created_at,updated_at) VALUES(?1,?2,?3,?1,'2026-10-03',?4,1,?5,?5)");
  session.run('published', 'class-1', 'teacher-1', 'published', now);
  session.run('draft', 'class-1', 'teacher-1', 'draft', now);
  session.run('archive', 'class-1', 'teacher-1', 'archived', now);
  session.run('other', 'class-2', 'teacher-2', 'published', now);
  const task = sql.prepare("INSERT INTO tasks(id,class_id,owner_id,title,due_at,response_mode,status,created_at,updated_at) VALUES(?1,'class-1','teacher-1',?1,?2,'text',?3,?4,?4)");
  task.run('start', '2026-10-02T17:00:00Z', 'published', now);
  task.run('end', '2026-10-03T16:59:59.000Z', 'published', now);
  task.run('draft-task', '2026-10-03T01:00:00.000Z', 'draft', now);
  task.run('before', '2026-10-02T16:59:59Z', 'published', now);
  task.run('after', '2026-10-03T17:00:00Z', 'published', now);
  const repository = new AgendaRepository(fixture.db);
  const range = { from: '2026-10-03', to: '2026-10-03' };
  const student = await repository.list({ ...range, uid: 'student-1', role: 'student' });
  assert.deepEqual(student.events.map((event) => event.id).sort(), ['end', 'published', 'start']);
  assert.ok(student.events.every((event) => event.date === '2026-10-03'));
  const teacher = await repository.list({ ...range, uid: 'teacher-1', role: 'teacher' });
  assert.equal(teacher.events.length, 5);
  assert.equal(teacher.timeZone, 'Asia/Jakarta');
  assert.equal((await repository.list({ ...range, uid: 'outsider', role: 'student' })).events.length, 0);
  sql.prepare("DELETE FROM class_members WHERE user_id='student-1'").run();
  assert.equal((await repository.list({ ...range, uid: 'student-1', role: 'student' })).events.length, 0);
  sql.prepare("UPDATE classes SET status='archived' WHERE id='class-1'").run();
  assert.equal((await repository.list({ ...range, uid: 'teacher-1', role: 'teacher' })).events.length, 0);
});

test('agenda makes truncation visible and registers an authenticated API route', async (t) => {
  const fixture = createD1Fixture(); t.after(fixture.close);
  const insert = fixture.sqlite.prepare("INSERT INTO learning_sessions(id,class_id,owner_id,title,meeting_date,status,sort_order,created_at,updated_at) VALUES(?1,'class-1','teacher-1',?1,'2026-10-03','published',1,'2026-10-03','2026-10-03')");
  for (let i = 0; i < 105; i++) insert.run(`event-${i}`);
  const agenda = await new AgendaRepository(fixture.db).list({ uid: 'student-1', role: 'student', from: '2026-10-03', to: '2026-10-03' });
  assert.equal(agenda.events.length, 100);
  assert.equal(agenda.truncated, true);
  const response = await app.fetch(new Request('https://api.test/learning/agenda?from=2026-10-03&to=2026-10-03'), { ALLOWED_ORIGINS: 'https://app.test', FIREBASE_PROJECT_ID: 'test' });
  assert.equal(response.status, 401);
});
