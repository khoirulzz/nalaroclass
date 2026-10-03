import { badRequest } from '../http/errors.js';

export function validateAgendaRange(from, to) {
  const valid = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
  if (!valid(from) || !valid(to) || to < from || (Date.parse(to) - Date.parse(from)) / 86400000 > 30) {
    throw badRequest('INVALID_AGENDA_RANGE', 'Pilih rentang agenda yang valid, maksimal 31 hari.');
  }
  return { from, to };
}

export class AgendaRepository {
  constructor(db) { this.db = db; }
  async list({ uid, role, from, to }) {
    validateAgendaRange(from, to);
    const teacher = role === 'teacher';
    const access = teacher ? 'c.owner_id = ?1' : 'EXISTS (SELECT 1 FROM class_members cm WHERE cm.class_id = c.id AND cm.user_id = ?1)';
    const status = teacher ? "IN ('draft', 'published')" : "= 'published'";
    const start = new Date(`${from}T00:00:00+07:00`).toISOString();
    const end = new Date(Date.parse(`${to}T00:00:00+07:00`) + 86400000).toISOString();
    const [meetings, tasks] = await Promise.all([
      this.db.prepare(`SELECT s.id, s.class_id, s.title, s.status, s.meeting_date, c.name AS class_name
        FROM learning_sessions s JOIN classes c ON c.id = s.class_id
        WHERE c.status = 'active' AND ${access} AND s.status ${status}
          AND s.meeting_date >= ?2 AND s.meeting_date <= ?3
        ORDER BY s.meeting_date, s.title, s.id LIMIT 101`).bind(uid, from, to).all(),
      this.db.prepare(`SELECT t.id, t.class_id, t.title, t.status, t.due_at, c.name AS class_name
        FROM tasks t JOIN classes c ON c.id = t.class_id
        WHERE c.status = 'active' AND ${access} AND t.status ${status}
          AND julianday(t.due_at) >= julianday(?2) AND julianday(t.due_at) < julianday(?3)
        ORDER BY julianday(t.due_at), t.title, t.id LIMIT 101`).bind(uid, start, end).all(),
    ]);
    const events = [
      ...(meetings.results || []).map((row) => ({ id: row.id, kind: 'session', classId: row.class_id, className: row.class_name, title: row.title, status: row.status, date: row.meeting_date, dueAt: null })),
      ...(tasks.results || []).map((row) => ({ id: row.id, kind: 'task', classId: row.class_id, className: row.class_name, title: row.title, status: row.status, date: new Date(Date.parse(row.due_at) + 7 * 3600000).toISOString().slice(0, 10), dueAt: row.due_at })),
    ].sort((a, b) => a.date.localeCompare(b.date) || (a.dueAt || '').localeCompare(b.dueAt || '') || a.id.localeCompare(b.id));
    return { events: events.slice(0, 100), truncated: events.length > 100, timeZone: 'Asia/Jakarta' };
  }
}
