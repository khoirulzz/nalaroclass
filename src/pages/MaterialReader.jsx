import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ClassWorkspaceNav from '../components/classroom/ClassWorkspaceNav';
import { BookmarkIcon, DiscussionIcon, EditIcon, MaterialIcon } from '../components/icons';
import { Badge, Button, Card, EmptyState, Progress, Skeleton, buttonClassName } from '../components/ui';
import MaterialBlocks from '../features/materials/components/MaterialBlocks';
import useReadingProgress from '../features/materials/hooks/useReadingProgress';
import { getMaterial, materialErrorMessage, setMaterialBookmark } from '../services/material.service';

export default function MaterialReader(props) {
  const { classId, materialId } = useParams();
  return <MaterialReaderPage key={`${classId}/${materialId}`} {...props} />;
}

function MaterialReaderPage({ role }) {
  const { classId, materialId } = useParams();
  const [state, setState] = useState({ status: 'loading', material: null, error: null });
  const [actionError, setActionError] = useState('');
  const contentRef = useRef(null);
  const [bookmarkBusy, setBookmarkBusy] = useState(false);
  const reading = useReadingProgress({ material: state.material, classId, materialId, role, contentRef,
    onSaved: (progress) => setState((current) => ({ ...current, material: { ...current.material, progress } })),
  });

  useEffect(() => {
    const controller = new AbortController();
    getMaterial(classId, materialId, { signal: controller.signal })
      .then((material) => {
        if (controller.signal.aborted) return;
        setState({ status: 'success', material, error: null });
      })
      .catch((error) => { if (error.name !== 'AbortError') setState({ status: 'error', material: null, error }); });
    return () => controller.abort();
  }, [classId, materialId, role]);

  const toggleBookmark = async () => {
    if (bookmarkBusy) return;
    const next = !state.material.bookmarked;
    setActionError('');
    setBookmarkBusy(true);
    try {
      await setMaterialBookmark(classId, materialId, next);
      setState((current) => ({ ...current, material: { ...current.material, bookmarked: next } }));
    } catch (error) { setActionError(materialErrorMessage(error)); }
    finally { setBookmarkBusy(false); }
  };

  if (state.status === 'loading') return <div className="qz-dashboard"><Skeleton width="52%" height={42} /><Skeleton height={560} /></div>;
  if (state.status === 'error') return <Card className="qz-placeholder"><EmptyState icon={MaterialIcon} title="Materi tidak dapat dibuka" description={materialErrorMessage(state.error)} action={<Link to={`/${role}/classes/${classId}/materials`} className={buttonClassName()}>Kembali ke materi</Link>} /></Card>;
  const material = state.material;
  const completed = reading.percent === 100;
  return (
    <div className="qz-dashboard qz-enter">
      <ClassWorkspaceNav role={role} classId={classId} />
      <article className="qz-reader">
        <header className="qz-reader__header"><div className="qz-reader__meta"><Badge tone={material.status === 'published' ? 'success' : 'warning'}>{material.status === 'published' ? 'Terbit' : 'Draf'}</Badge><span>{material.blocksCount} blok</span><span>{reading.estimate.minutes ? `Estimasi belajar ${reading.estimate.minutes} menit` : 'Belum ada isi materi'}</span></div><h1>{material.title}</h1>{material.summary ? <p>{material.summary}</p> : null}</header>
        {role === 'student' ? <div className="qz-reader__student-actions"><div><Progress value={reading.percent} label={completed ? 'Materi selesai' : `Progres membaca ${reading.percent}%`} /><small className="qz-reader__progress-note">Waktu baca aktif dicatat otomatis. Tandai selesai setelah memahami materi.</small></div><Link to={`/student/classes/${classId}/materials/${materialId}/discussions`} className="qz-reader-discussion"><span><DiscussionIcon size={19} /></span><span><strong>Buka diskusi</strong><small>Tanya atau bagikan pemahamanmu</small></span></Link><Button variant="secondary" onClick={toggleBookmark} disabled={bookmarkBusy}><BookmarkIcon size={17} /> {material.bookmarked ? 'Hapus simpanan' : 'Simpan materi'}</Button><Button onClick={reading.complete} disabled={completed || reading.completing}>{completed ? 'Sudah selesai' : reading.completing ? 'Menyimpan...' : 'Tandai selesai'}</Button></div> : <div className="qz-reader__teacher-actions"><Link to={`/teacher/classes/${classId}/materials/${materialId}/discussions`} className={buttonClassName({ variant: 'secondary' })}><DiscussionIcon size={17} /> Diskusi</Link><Link to={`/teacher/classes/${classId}/materials/${materialId}/edit`} className={buttonClassName()}><EditIcon size={17} /> Edit materi</Link></div>}
        {actionError ? <div className="qz-inline-state qz-inline-state--error" role="alert">{actionError}</div> : null}
        {reading.error ? <div className="qz-inline-state qz-inline-state--error" role="alert">Progres belum tersimpan: {reading.error} <Button variant="ghost" size="sm" onClick={reading.retry}>Coba simpan lagi</Button></div> : null}
        {reading.estimate.hasExternalContent ? <p className="qz-reader__progress-note">Estimasi mencakup alokasi waktu untuk tautan, file, atau video. Durasi dan isi lengkapnya tidak terbaca otomatis.</p> : null}
        <MaterialBlocks blocks={material.blocks} contentRef={contentRef} />
      </article>
    </div>
  );
}
