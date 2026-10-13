import { lazy, Suspense, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { classThemeClass, getClassTheme } from '../../features/classes/classThemes';
import ClassWorldScene from './ClassWorldScene';
import '../../styles/class-themes.css';
import '../../styles/class-world-root.css';

const LivingWorldEngine = lazy(() => import('../../features/worlds/LivingWorldEngine.jsx'));

const sectionNames = {
  sessions: 'Pertemuan', materials: 'Materi', discussions: 'Diskusi',
  quizzes: 'Kuis', tasks: 'Tugas', attendance: 'Presensi',
  analytics: 'Learning Insights',
};

/**
 * The active class, not the signed-in account, owns the visual world.
 * Every nested teacher/student class route inherits the same scoped tokens.
 */
export default function ClassThemeScope({ children }) {
  const { pathname } = useLocation();
  const match = /^\/(?:teacher|student)\/classes\/([^/]+)\//.exec(pathname);
  const classId = match?.[1] || null;
  const [state, setState] = useState({ classId: null, themeId: null, name: '' });

  useEffect(() => {
    if (!classId) return undefined;
    const controller = new AbortController();
    // Do not import Firebase-dependent API modules on the public landing page.
    import('../../services/class.service')
      .then(({ getClass }) => getClass(classId, { signal: controller.signal }))
      .then((item) => {
        if (!controller.signal.aborted) {
          setState({ classId, themeId: item.themeId || 'classic', name: item.name || '' });
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ classId, themeId: null, name: '' });
      });
    return () => controller.abort();
  }, [classId]);

  const theme = classId && state.classId === classId ? getClassTheme(state.themeId) : null;
  const isOverview = pathname.endsWith('/overview');
  const section = sectionNames[pathname.split('/')[4]] || 'Ruang belajar';
  const quiet = /\/(?:materials|quizzes|tasks|sessions)\/[^/]+/.test(pathname) || /\/analytics\/[^/]+/.test(pathname);

  return <div
    className={theme ? 'qz-class-world-scope ' + classThemeClass(theme.id) : 'qz-class-world-scope'}
    data-world={theme?.id}
  >
    {theme?.collection === 'living-worlds' ? <Suspense fallback={null}><LivingWorldEngine themeId={theme.id} quiet={quiet} /></Suspense> : null}
    {theme && !isOverview ? <section className="qz-world-ribbon" aria-label={'Identitas tema ' + theme.name}>
      <div className="qz-world-ribbon__copy">
        <span className="qz-world-ribbon__eyebrow">{theme.name} <span aria-hidden="true">/</span> {section}</span>
        <strong>{state.name || 'Ruang kelas'}</strong>
        <span className="qz-world-ribbon__subtitle">{theme.subtitle}</span>
      </div>
      <ClassWorldScene themeId={theme.id} className="qz-world-ribbon__scene"/>
    </section> : null}
    {children}
  </div>;
}
