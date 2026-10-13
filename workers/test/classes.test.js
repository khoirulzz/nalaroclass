import assert from 'node:assert/strict';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { ClassRepository } from '../src/repositories/class.repository.js';
import { validateClassTheme, validateCreateClass, validateJoinClass } from '../src/validation/classes.js';

test('class validation retains the API contract limits and code normalization', () => {
  assert.deepEqual(validateCreateClass({ name: '  Fisika   Dasar ', description: 'Gelombang' }), { name: 'Fisika Dasar', description: 'Gelombang', themeId: 'classic' });
  assert.deepEqual(validateJoinClass({ code: ' abc234 ' }), { code: 'ABC234' });
  assert.equal(validateCreateClass({ name: 'Geografi', themeId: 'space' }).themeId, 'space');
  assert.equal(validateClassTheme('fantasy'), 'fantasy');
  assert.equal(validateCreateClass({ name: 'Ocean Biology', themeId: 'deep-current' }).themeId, 'deep-current');
  for (const themeId of ['prism-city','paperbound','pixel-frontier','inventors-workshop']) {
    assert.equal(validateCreateClass({ name: 'World ' + themeId, themeId }).themeId,themeId);
  }
  assert.throws(() => validateClassTheme('unknown'), (error) => error.code === 'INVALID_THEME');
  assert.throws(() => validateCreateClass({ name: 'A' }), (error) => error.code === 'VALIDATION_ERROR');
  assert.throws(() => validateJoinClass({ code: 'invalid' }), (error) => error.code === 'VALIDATION_ERROR');
});

test('class repository scopes the owner query and preserves its public response shape', async () => {
  let statement;
  const db = { prepare(sql) {
    statement = { sql, values: [] };
    return { bind(...values) { statement.values = values; return this; }, async all() { return { results: [{ id: 'class-1', code: 'ABC234', name: 'Kimia', description: '', teacher_name: 'Pak Ari', status: 'active', students_count: 2, materials_count: 1, quizzes_count: 3, created_at: '2026-09-30T00:00:00.000Z', updated_at: '2026-09-30T00:00:00.000Z' }] }; } };
  } };
  const classes = await new ClassRepository(db).listOwnedBy('teacher-1');
  assert.match(statement.sql, /WHERE owner_id = \?1/);
  assert.deepEqual(statement.values, ['teacher-1']);
  assert.deepEqual(classes[0], { id: 'class-1', code: 'ABC234', name: 'Kimia', description: '', themeId: 'classic', teacherName: 'Pak Ari', status: 'active', studentsCount: 2, materialsCount: 1, quizzesCount: 3, createdAt: '2026-09-30T00:00:00.000Z', updatedAt: '2026-09-30T00:00:00.000Z', accessRole: 'owner' });
});

test('D1 classroom migration preserves legacy themes and immutable creation-time world', async () => {
  const db = new DatabaseSync(':memory:');
  try {
    db.exec(readFileSync(new URL('../migrations/0001_class_foundation.sql', import.meta.url), 'utf8'));
    db.prepare("INSERT INTO users (id,name,role,created_at,updated_at) VALUES ('teacher-1','Pak Ari','teacher','2026-01-01','2026-01-01')").run();
    db.prepare("INSERT INTO classes (id,code,owner_id,name,created_at,updated_at) VALUES ('old-class','ABC234','teacher-1','Kimia','2026-01-01','2026-01-01')").run();
    db.exec(readFileSync(new URL('../migrations/0020_class_theme.sql', import.meta.url), 'utf8'));
    db.exec(readFileSync(new URL('../migrations/0021_lock_class_theme.sql', import.meta.url), 'utf8'));
    assert.equal(db.prepare("SELECT theme_id FROM classes WHERE id = 'old-class'").get().theme_id, 'classic');
    const adapter = { prepare(sql) { const statement = db.prepare(sql); return { bind(...params) {
      return {
        first: async () => statement.get(...params) || null,
        all: async () => ({ results: statement.all(...params) }),
        run: async () => { const result = statement.run(...params); return { meta: { changes: result.changes } }; },
      };
    } }; } };
    const repo = new ClassRepository(adapter);
    const newClass = await repo.create({ ownerId: 'teacher-1', teacherName: 'Pak Ari', name: 'Fisika', description: 'Energi', themeId: 'space' });
    assert.equal(newClass.themeId, 'space');
    assert.equal((await repo.getForUser(newClass.id, 'teacher-1')).themeId, 'space');
    assert.equal((await repo.getForUser(newClass.id, 'teacher-1')).themeId, 'space');
    assert.equal(typeof repo.updateTheme, 'undefined'); // Theme identity is assigned at creation, not edited later.
    assert.throws(() => db.prepare("UPDATE classes SET theme_id = 'fantasy' WHERE id = ?").run(newClass.id), /THEME_LOCKED/);
    assert.equal(db.prepare("SELECT theme_id FROM classes WHERE id = ?").get(newClass.id).theme_id, 'space');
    assert.throws(() => db.prepare("UPDATE classes SET theme_id = 'space' WHERE id = 'old-class'").run(), /THEME_LOCKED/);
    assert.equal((await repo.listOwnedBy('teacher-1')).find((item) => item.id === 'old-class').themeId, 'classic');
  } finally { db.close(); }
});
