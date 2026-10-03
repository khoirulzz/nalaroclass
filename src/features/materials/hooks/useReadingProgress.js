import { useEffect, useMemo, useRef, useState } from 'react';
import { materialErrorMessage, saveProgress } from '../../../services/material.service';
import { createProgressSaver, createReadingTracker, estimateMaterialReading } from '../reading-progress.js';

export default function useReadingProgress({ material, classId, materialId, role, contentRef, onSaved }) {
  const estimate = useMemo(() => estimateMaterialReading(material?.blocks), [material?.blocks]);
  const [percent, setPercent] = useState(material?.progress?.percent || 0);
  const [error, setError] = useState('');
  const [completing, setCompleting] = useState(false);
  const saverRef = useRef(null);
  const materialRef = useRef(material);
  materialRef.current = material;
  const ready = Boolean(material);
  const onSavedRef = useRef(onSaved);
  onSavedRef.current = onSaved;

  useEffect(() => {
    const initial = materialRef.current?.progress?.percent || 0;
    setPercent(initial);
    setError('');
    setCompleting(false);
    if (!ready || role !== 'student') return undefined;
    const tracker = createReadingTracker(estimate, initial);
    const saver = createProgressSaver({ initialPercent: initial,
      save: (value) => saveProgress(classId, materialId, value),
      onSaved: (progress) => { setError(''); setPercent((current) => Math.max(current, progress.percent)); onSavedRef.current(progress); },
      onError: (caught) => { if (caught.name !== 'AbortError') setError(materialErrorMessage(caught)); },
    });
    saverRef.current = saver;
    let lastTick = performance.now();
    let lastActivity = lastTick;
    let lastSave = lastTick;
    const touch = () => { lastActivity = performance.now(); };
    const visibility = () => {
      lastTick = performance.now();
      if (document.hidden) void saver.flush();
      else touch();
    };
    const pagehide = () => { void saver.flush(); };
    for (const event of ['pointerdown', 'pointermove', 'keydown', 'scroll', 'focus']) window.addEventListener(event, touch, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('pagehide', pagehide);
    const timer = window.setInterval(() => {
      const now = performance.now();
      const elapsed = (now - lastTick) / 1000;
      lastTick = now;
      const active = !document.hidden && document.hasFocus() && now - lastActivity < 90_000;
      const visible = [...(contentRef.current?.children || [])].map((element) => {
        const rect = element.getBoundingClientRect();
        const height = Math.max(1, rect.height);
        const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
        return { id: element.dataset.readingBlock, fraction: visibleHeight / height, coverage: (window.innerHeight - rect.top) / height };
      });
      const value = tracker.tick(elapsed, visible, active);
      setPercent((current) => Math.max(current, value));
      saver.request(value);
      if (now - lastSave >= 5000) { lastSave = now; void saver.flush(); }
    }, 1000);
    return () => {
      window.clearInterval(timer);
      for (const event of ['pointerdown', 'pointermove', 'keydown', 'scroll', 'focus']) window.removeEventListener(event, touch);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('pagehide', pagehide);
      // This last write is best effort on navigation; no stale UI callbacks.
      void saver.flush();
      saver.dispose();
      saverRef.current = null;
    };
  // Progress responses do not restart the timer. The reader remounts per material.
  }, [classId, materialId, role, estimate, ready, contentRef]);

  const complete = async () => {
    const saver = saverRef.current;
    if (!saver || completing) return;
    setCompleting(true);
    setError('');
    saver.request(100);
    const saved = await saver.flush();
    if (saverRef.current === saver) {
      if (saved) setPercent(100);
      setCompleting(false);
    }
  };
  const retry = () => { void saverRef.current?.flush(); };
  return { estimate, percent, error, completing, complete, retry };
}
