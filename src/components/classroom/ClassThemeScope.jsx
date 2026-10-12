import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getClass } from '../../services/class.service';
import { classThemeClass, getClassTheme } from '../../features/classes/classThemes';
import '../../styles/class-themes.css';

/** Apply theme to every route INSIDE a class, without touching account dashboards. */
export default function ClassThemeScope({ children }) {
  const { pathname } = useLocation();
  const match = /^\/(?:teacher|student)\/classes\/([^/]+)\//.exec(pathname);
  const classId = match?.[1] || null;
  const [state, setState] = useState({ classId: null, themeId: null });
  useEffect(() => {
    if (!classId) return;
    const controller = new AbortController();
    getClass(classId, { signal: controller.signal }).then((item) => {
      if (!controller.signal.aborted) setState({ classId, themeId: item.themeId });
    }).catch(() => { if (!controller.signal.aborted) setState({ classId, themeId: null }); });
    return () => controller.abort();
  }, [classId]);
  const activeTheme = classId && state.classId === classId ? getClassTheme(state.themeId) : null;
  return <div className={activeTheme ? 'qz-class-world-scope ' + classThemeClass(activeTheme.id) : 'qz-class-world-scope'}>{children}</div>;
}
