import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const migrations = fileURLToPath(new URL('../migrations/', import.meta.url));

export function createD1Fixture({ throughMigration = null } = {}) {
  const sqlite = new DatabaseSync(':memory:');
  for (const filename of readdirSync(migrations).filter((name) => name.endsWith('.sql') && (!throughMigration || name <= throughMigration)).sort()) {
    sqlite.exec(readFileSync(new URL(`../migrations/${filename}`, import.meta.url), 'utf8'));
  }
  const prepare = (query, values) => {
    const bound = [];
    const normalized = query.replace(/\?(\d+)/g, (_, index) => {
      bound.push(values[Number(index) - 1]);
      return '?';
    });
    return { statement: sqlite.prepare(normalized), values: bound.length ? bound : values };
  };
  const wrap = (query, values = []) => ({
    bind(...next) { return wrap(query, next); },
    async first() { const current = prepare(query, values); return current.statement.get(...current.values) || null; },
    async all() { const current = prepare(query, values); return { results: current.statement.all(...current.values) }; },
    async run() { const current = prepare(query, values); const result = current.statement.run(...current.values); return { meta: { changes: Number(result.changes) } }; },
  });
  const db = {
    prepare(query) { return wrap(query); },
    async batch(statements) {
      sqlite.exec('BEGIN');
      try {
        const results = [];
        for (const statement of statements) results.push(await statement.run());
        sqlite.exec('COMMIT');
        return results;
      } catch (error) { sqlite.exec('ROLLBACK'); throw error; }
    },
  };
  const exposedSqlite = {
    exec(query) { return sqlite.exec(query); },
    close() { return sqlite.close(); },
    prepare(query) {
      return {
        get(...values) { const current = prepare(query, values); return current.statement.get(...current.values); },
        all(...values) { const current = prepare(query, values); return current.statement.all(...current.values); },
        run(...values) { const current = prepare(query, values); return current.statement.run(...current.values); },
      };
    },
  };
  const now = '2026-09-30T00:00:00.000Z';
  sqlite.prepare('INSERT INTO users(id,name,role,created_at,updated_at) VALUES(?,?,?,?,?)').run('teacher-1', 'Guru', 'teacher', now, now);
  sqlite.prepare('INSERT INTO users(id,name,role,created_at,updated_at) VALUES(?,?,?,?,?)').run('student-1', 'Siswa', 'student', now, now);
  sqlite.prepare("INSERT INTO classes(id,code,owner_id,teacher_name,name,description,status,created_at,updated_at) VALUES(?,'ABC123',?,'Guru','Kelas 1','','active',?,?)").run('class-1', 'teacher-1', now, now);
  sqlite.prepare("INSERT INTO class_members(class_id,user_id,name,role,joined_at) VALUES('class-1','student-1','Siswa','student',?)").run(now);
  return { db, sqlite: exposedSqlite, close: () => sqlite.close() };
}
