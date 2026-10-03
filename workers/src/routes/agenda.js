import { forbidden } from '../http/errors.js';
import { json } from '../http/response.js';
import { assertAccountRole, getAuth, requireAuth } from '../middleware/auth.js';
import { AgendaRepository, validateAgendaRange } from '../repositories/agenda.repository.js';

export function registerAgendaRoutes(app) {
  app.get('/learning/agenda', requireAuth, async (c) => {
    const auth = getAuth(c);
    if (auth.signInProvider === 'anonymous') throw forbidden('Masuk dengan akun kelas untuk membuka agenda.');
    const role = await assertAccountRole(c, 'teacher', 'student');
    const range = validateAgendaRange(c.req.query('from'), c.req.query('to'));
    const agenda = await new AgendaRepository(c.env.DB).list({ uid: auth.uid, role, ...range });
    return json(c, 200, { data: { agenda } });
  });
}
