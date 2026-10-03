import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, CalendarIcon, ClassesIcon, QuizIcon } from '../icons';
import { Button, Card, SectionHeader, Skeleton, buttonClassName } from '../ui';
import { agendaErrorMessage, getAgenda } from '../../services/agenda.service';
import { dateKey, jakartaDate, weekDates } from '../../features/agenda/calendar.js';

export function WelcomeBanner({ name, role = 'teacher' }) {
  const teacher = role === 'teacher';
  return (
    <section className={`qz-welcome${teacher ? '' : ' qz-welcome--student'}`}>
      <div className="qz-welcome__copy">
        <span className="qz-welcome__eyebrow"><span /> {teacher ? 'RUANG UNTUK MENGINSPIRASI' : 'LANGKAH KECIL, IDE BESAR'}</span>
        <h1>{teacher ? 'Selamat datang,' : 'Halo,'}<br /><span>{name}.</span></h1>
        <p>{teacher ? 'Kelas yang seru dimulai dari sini. Siapkan ruang belajar dan tumbuhkan rasa ingin tahu.' : 'Ada banyak hal baru untuk dipelajari. Buka kelasmu dan mulai perjalanan hari ini.'}</p>
        <Link to={`/${role}/classes`} className={buttonClassName({ className: 'qz-welcome__button' })}>{teacher ? 'Buka ruang kelas' : 'Jelajahi kelas saya'} <ArrowRightIcon size={18} /></Link>
      </div>
      <div className="qz-welcome-art" aria-hidden="true">
        <div className="qz-art-orbit" />
        <div className="qz-art-card"><span className="qz-art-label">LET'S LEARN</span><ClassesIcon size={54} /><span className="qz-art-line" /><span className="qz-art-line qz-art-line--short" /><div className="qz-art-dots"><i /><i /><i /></div></div>
        <div className="qz-art-note"><QuizIcon size={26} /><span>Ide besar<br /><strong>mulai di sini.</strong></span></div>
        <span className="qz-art-spark">✦</span><span className="qz-art-star">✳</span>
      </div>
    </section>
  );
}

export function QuickAction({ to, icon: Icon, title, description, tone = 'purple' }) {
  return <Link to={to} className={`qz-quick-action qz-tone-${tone}`}><span className="qz-quick-action__icon"><Icon size={23} /></span><span className="qz-quick-action__copy"><span className="qz-quick-action__label">{title}</span><span className="qz-quick-action__hint">{description}</span></span><ArrowRightIcon className="qz-quick-action__arrow" size={18} /></Link>;
}

export function MetricCard({ icon: Icon, label, value, detail, tone = 'purple' }) {
  return <div className={`qz-metric qz-tone-${tone}`}><span className="qz-metric__icon"><Icon size={21} /></span><div><span className="qz-metric__label">{label}</span><strong>{value}</strong><span className="qz-metric__detail">{detail}</span></div></div>;
}

export function WeekAgenda({ role = 'teacher' }) {
  const [today] = useState(() => jakartaDate());
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState(today);
  const [reload, setReload] = useState(0);
  const [state, setState] = useState({ status: 'loading', events: [], error: '', truncated: false });
  const days = weekDates(today, offset);
  const from = dateKey(days[0]);
  const to = dateKey(days[6]);
  const dateFormat = (value, options) => new Intl.DateTimeFormat('id-ID', { ...options, timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));
  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading', events: [], error: '', truncated: false });
    getAgenda(from, to, { signal: controller.signal })
      .then((agenda) => { if (!controller.signal.aborted) setState({ status: 'success', events: agenda.events, truncated: agenda.truncated, error: '' }); })
      .catch((error) => { if (!controller.signal.aborted) setState({ status: 'error', events: [], error: agendaErrorMessage(error), truncated: false }); });
    return () => controller.abort();
  }, [from, to, role, reload]);
  const events = state.events.filter((event) => event.date === selected);
  const changeWeek = (direction) => {
    setOffset((value) => value + direction);
    setSelected(dateKey(new Date(Date.parse(`${selected}T00:00:00Z`) + direction * 7 * 86400000)));
  };
  return (
    <Card className="qz-agenda">
      <SectionHeader title="Agenda belajar" description="Pertemuan dan tenggat tugas · WIB" action={<CalendarIcon size={20} />} />
      <div className="qz-agenda__month"><span>{dateFormat(selected, { month: 'long', year: 'numeric' })}</span><div><button type="button" onClick={() => changeWeek(-1)} aria-label="Minggu sebelumnya">‹</button><button type="button" onClick={() => changeWeek(1)} aria-label="Minggu berikutnya">›</button></div></div>
      <div className="qz-week" role="group" aria-label="Pilih tanggal">
        {days.map((day) => { const key = dateKey(day); const count = state.events.filter((event) => event.date === key).length; return <button type="button" key={key} aria-pressed={key === selected} aria-current={key === today ? 'date' : undefined} aria-label={`${dateFormat(key, { dateStyle: 'full' })}${count ? `, ${count} agenda` : ''}`} onClick={() => setSelected(key)}><span>{dateFormat(key, { weekday: 'short' })}</span><strong>{day.getUTCDate()}</strong><i className={count ? 'has-events' : undefined} /></button>; })}
      </div>
      <div className="qz-agenda__content" aria-live="polite">
        <span className="qz-agenda__date">{dateFormat(selected, { weekday: 'long', day: 'numeric', month: 'short' })}</span>
        {state.status === 'loading' ? <div role="status" aria-label="Memuat agenda"><Skeleton height={84} /></div> : state.status === 'error' ? <div className="qz-inline-state qz-inline-state--error" role="alert">{state.error}<Button variant="ghost" size="sm" onClick={() => setReload((value) => value + 1)}>Coba lagi</Button></div> : events.length ? <ul className="qz-agenda__events">{events.map((event) => <li key={`${event.kind}-${event.id}`}><Link to={event.kind === 'task' ? `/${role}/classes/${event.classId}/tasks/${event.id}` : `/${role}/classes/${event.classId}/sessions`}><small>{event.kind === 'task' ? `Tenggat ${new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }).format(new Date(event.dueAt))} WIB` : 'Pertemuan'}{event.status === 'draft' ? ' - Draf' : ''}</small><strong>{event.title}</strong><span>{event.className}</span></Link></li>)}</ul> : <div className="qz-agenda__empty"><CalendarIcon size={28} /><strong>Belum ada agenda hari ini</strong><p>Pertemuan dan tenggat tugas kelasmu akan muncul sesuai tanggalnya.</p></div>}
        {state.truncated ? <p className="qz-agenda__note">Menampilkan 100 agenda pertama. Buka kelas untuk melihat jadwal lainnya.</p> : null}
      </div>
      <button type="button" className="qz-text-button" onClick={() => { setOffset(0); setSelected(today); }}>Kembali ke hari ini <ArrowRightIcon size={15} /></button>
    </Card>
  );
}

export function GettingStarted({ role = 'teacher' }) {
  const teacher = role === 'teacher';
  return <aside className="qz-start-guide"><span className="qz-start-guide__eyebrow">SATU LANGKAH PERTAMA</span><h2>{teacher ? 'Bangun ruang belajar Anda.' : 'Temukan ruang belajarmu.'}</h2><p>{teacher ? 'Buat kelas, bagikan kodenya, dan sambut siswa di satu tempat.' : 'Minta kode kelas dari guru, lalu bergabung bersama teman-temanmu.'}</p><Link to={`/${role}/classes`}>{teacher ? 'Mulai dari kelas' : 'Gabung ke kelas'} <ArrowRightIcon size={17} /></Link><ClassesIcon className="qz-start-guide__art" size={88} /></aside>;
}
