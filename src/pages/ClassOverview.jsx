import { useEffect, useState } from 'react';
import { BarChart3, Palette } from 'lucide-react';
import ThemeMascot from '../components/classroom/ThemeMascot';
import { Link, useParams } from 'react-router-dom';
import ThemePicker from '../features/classes/components/ThemePicker';
import { getClassTheme, classThemeClass } from '../features/classes/classThemes';
import { updateClassTheme } from '../services/class.service';
import '../styles/class-themes.css';
import ClassWorkspaceNav from '../components/classroom/ClassWorkspaceNav';
import ClassSummary from '../components/classroom/ClassSummary';
import { ClassesIcon, MaterialIcon, MembersIcon } from '../components/icons';
import { Card, EmptyState, PageHeader, SectionHeader, Skeleton, buttonClassName } from '../components/ui';
import { classErrorMessage, getClass, listClassMembers } from '../services/class.service';

function OverviewLoading() {
  return <div className="qz-dashboard" aria-label="Memuat ruang kelas"><Skeleton width="45%" height={34} /><Skeleton width="70%" height={16} /><div className="qz-overview-grid"><Skeleton height={230} /><Skeleton height={230} /></div></div>;
}

function joinedDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'baru-baru ini' : new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(date);
}

export default function ClassOverview({ role }) {
  const { classId } = useParams();
  const [state, setState] = useState({ status: 'loading', classItem: null, members: [], error: null });
  const [copyNotice, setCopyNotice] = useState('');
  const [themeSaving, setThemeSaving] = useState(false);
  const [themeEditing, setThemeEditing] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setCopyNotice('');
      setState((current) => ({ ...current, status: 'loading', error: null }));
      try {
        const classItem = await getClass(classId, { signal: controller.signal });
        const members = role === 'teacher' ? await listClassMembers(classId, { signal: controller.signal }) : [];
        setState({ status: 'success', classItem, members, error: null });
      } catch (error) {
        if (error.name !== 'AbortError') setState((current) => ({ ...current, status: 'error', error }));
      }
    }
    load();
    return () => controller.abort();
  }, [classId, role]);

  if (state.status === 'loading') return <OverviewLoading />;
  if (state.status === 'error') {
    return <Card className="qz-placeholder"><EmptyState icon={ClassesIcon} title="Ruang kelas tidak dapat dibuka" description={classErrorMessage(state.error)} action={<Link className={buttonClassName()} to={`/${role}/classes`}>Kembali ke kelas</Link>} /></Card>;
  }

  const classItem = state.classItem;
  const theme = getClassTheme(classItem.themeId);
  const saveTheme = async (themeId) => {
    if (themeSaving) return;
    setThemeSaving(true);
    try {
      const updated = await updateClassTheme(classId, themeId);
      setState((current) => ({ ...current, classItem: updated }));
      window.dispatchEvent(new CustomEvent('nalaro:class-theme-changed', { detail: { classId, themeId: updated.themeId } }));
      setCopyNotice('Tema kelas berhasil diperbarui untuk seluruh anggota.');
      setThemeEditing(false);
    } catch (error) { setCopyNotice(classErrorMessage(error)); }
    finally { setThemeSaving(false); }
  };
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(classItem.code);
      setCopyNotice('Kode kelas berhasil disalin. Bagikan kepada siswa agar mereka dapat bergabung.');
    } catch {
      setCopyNotice('Kode belum dapat disalin otomatis. Pilih kode kelas di atas untuk menyalinnya secara manual.');
    }
  };
  return (
    <div className={`qz-dashboard qz-enter ${theme ? `qz-themed-workspace ${classThemeClass(theme.id)}` : ''}`}>
      <PageHeader eyebrow={role === 'teacher' ? 'Ruang guru · Kelas' : 'Ruang siswa · Kelas'} title={classItem.name} description={classItem.description || 'Belum ada deskripsi kelas.'} actions={<Link to={`/${role}/classes`} className={buttonClassName({ variant: 'secondary' })}>Semua kelas</Link>} />
      <ClassWorkspaceNav role={role} classId={classId} />
      {theme ? <section className="qz-world-banner" aria-label={'Tema kelas ' + theme.name}>
        <div><span className="qz-world-banner__label">{theme.name}</span><h2>{theme.short}</h2><p>{theme.subtitle}</p></div>
        <span className="qz-world-banner__art" aria-hidden="true"><ThemeMascot themeId={theme.id} size={86} /></span>
      </section> : null}
      {role === 'teacher' ? <div className="qz-class-theme-controls">
        <button type="button" className={buttonClassName({ variant: 'secondary', size: 'sm' })} onClick={() => setThemeEditing(!themeEditing)} aria-expanded={themeEditing}><Palette size={16} /> {themeEditing ? 'Tutup pilihan tema' : 'Ganti tema kelas'}</button>
        {themeEditing ? <div className="qz-theme-setting"><ThemePicker value={classItem.themeId || 'classic'} onChange={saveTheme} compact />{themeSaving ? <p role="status">Menyimpan tema...</p> : null}</div> : null}
      </div> : null}

      <ClassSummary classItem={classItem} role={role} onCopyCode={copyCode} />
      {copyNotice ? <div className="qz-inline-state" role="status">{copyNotice}</div> : null}

      <div className="qz-overview-grid">
        <section>
          <SectionHeader title="Materi dan aktivitas" description="Konten pembelajaran untuk kelas ini." action={<Link to={`/${role}/classes/${classId}/materials`} className={buttonClassName({ variant: 'secondary', size: 'sm' })}>Buka materi</Link>} />
          <Card className="qz-class-empty"><EmptyState icon={MaterialIcon} title="Materi kelas siap digunakan" description={role === 'teacher' ? 'Susun, simpan sebagai draf, dan terbitkan konten pembelajaran dari satu ruang.' : 'Baca konten yang telah diterbitkan guru dan lanjutkan progres belajarmu.'} action={<Link to={`/${role}/classes/${classId}/materials`} className={buttonClassName()}>Lihat materi kelas</Link>} /></Card>
        </section>

        <section>
          <SectionHeader title="Learning Insights" description={role === 'teacher' ? 'Baca pemahaman, tren, konsistensi, dan keterlibatan seluruh siswa dari evidence kelas.' : 'Lihat perkembangan belajarmu dari kuis, tugas, materi, presensi, dan diskusi.'} action={<Link to={`/${role}/classes/${classId}/analytics`} className={buttonClassName({ variant: 'secondary', size: 'sm' })}>Buka analitik</Link>} />
          <Card className="qz-class-empty"><EmptyState icon={BarChart3} title={role === 'teacher' ? 'Analitik belajar kelas' : 'Analitik belajarmu'} description={role === 'teacher' ? 'Nalaro menggabungkan evidence pembelajaran tanpa membuat ranking kemampuan siswa.' : 'Lihat apa yang sudah kuat, tren terbaru, dan topik yang masih perlu diperkuat.'} action={<Link to={`/${role}/classes/${classId}/analytics`} className={buttonClassName()}>Lihat Learning Insights</Link>} /></Card>
        </section>

        <section>
          <SectionHeader title={role === 'teacher' ? 'Anggota kelas' : 'Tentang kelas'} description={role === 'teacher' ? 'Siswa yang telah bergabung menggunakan kode kelas.' : 'Informasi ruang belajar yang kamu ikuti.'} />
          <Card>
            {role === 'teacher' ? (state.members.length ? <ul className="qz-member-list">{state.members.map((member) => <li key={member.uid}><span className="qz-member-avatar" aria-hidden="true">{member.name.charAt(0).toUpperCase()}</span><div><strong>{member.name}</strong><span>Bergabung {joinedDate(member.joinedAt)}</span></div></li>)}</ul> : <EmptyState icon={MembersIcon} title="Belum ada anggota" description="Bagikan kode kelas agar siswa dapat bergabung." />) : <div className="qz-class-about"><ClassesIcon size={24} /><p>Kamu terdaftar sebagai anggota kelas ini. Gunakan tab Materi untuk melihat konten terbaru dan melanjutkan progres belajar.</p></div>}
          </Card>
        </section>
      </div>
    </div>
  );
}
