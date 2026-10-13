import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUpRight, BarChart3, BookOpen, CalendarDays, Check, ClipboardList, GraduationCap, Menu, MessageCircle, Pause, Play, Radio, Sparkles, Users, X } from 'lucide-react';
import Brand from '../components/Brand';
import ProductPreview from '../components/landing/ProductPreview';
import LandingQuiz from '../components/landing/LandingQuiz';
import WorldShowcase from '../components/landing/WorldShowcase';
import '../styles/landing-saas.css';

const features = [
  { icon: ClipboardList, title: 'Tugas dan penilaian', copy: 'Atur tenggat, tinjau pengumpulan, dan berikan umpan balik yang bisa ditindaklanjuti siswa.', color: 'peach' },
  { icon: CalendarDays, title: 'Pertemuan dan presensi', copy: 'Hubungkan aktivitas dengan pertemuan. Catat kehadiran dan buka kembali riwayatnya.', color: 'sage' },
  { icon: BarChart3, title: 'Progres pembelajaran', copy: 'Tinjau hasil kuis, nilai tugas, dan aktivitas belajar sebagai bahan evaluasi kelas.', color: 'blue' },
];
const faqs = [
  ['Apa yang bisa dilakukan guru di NalaroClass?', 'Guru dapat membuat kelas, mengundang siswa melalui kode kelas, membagikan materi, mengelola pertemuan dan presensi, memberikan tugas, serta membuat kuis mandiri atau kuis langsung.'],
  ['Bagaimana siswa bergabung ke kelas?', 'Siswa masuk dengan peran Siswa, lalu menggunakan kode kelas yang dibagikan guru. Setelah bergabung, siswa dapat mengakses aktivitas yang dipublikasikan di kelas tersebut.'],
  ['Apa perbedaan kuis mandiri dan Nalaro Live?', 'Kuis mandiri dikerjakan siswa melalui aktivitas yang tersedia. Nalaro Live dipandu oleh pengajar dan diikuti peserta menggunakan PIN sesi, dengan soal serta hasil dalam sesi bersama.'],
  ['Apakah bisa digunakan melalui ponsel?', 'NalaroClass dapat diakses melalui browser di ponsel, tablet, dan laptop. Ukuran tampilan menyesuaikan perangkat. Koneksi internet diperlukan untuk mengakses kelas dan menyimpan aktivitas.'],
  ['Apa fungsi Nalaro Assist?', 'Nalaro Assist membantu guru menyiapkan draf materi dan soal. Guru tetap perlu memeriksa isi, menyesuaikannya dengan kebutuhan kelas, dan menentukan apa yang akan dipublikasikan.'],
];

function Reveal({ children, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { element.classList.add('is-visible'); observer.disconnect(); } }, { threshold: .08 });
    element.classList.add('nc-reveal-ready'); observer.observe(element);
    return () => { observer.disconnect(); element.classList.remove('nc-reveal-ready'); };
  }, []);
  return <div ref={ref} className={`nc-reveal ${className}`}>{children}</div>;
}

export default function Landing({ onEnterApp }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const hero = useRef(null);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting));
    observer.observe(hero.current); return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const close = event => { if (event.key === 'Escape') { setMenuOpen(false); document.getElementById('nc-menu-toggle')?.focus(); } };
    window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close);
  }, [menuOpen]);
  const closeMenu = () => setMenuOpen(false);
  return <div className={`nc-landing${paused ? ' nc-motion-paused' : ''}`}>
    <a className="nc-skip" href="#nc-main">Lewati navigasi</a>
    <header className="nc-header"><div className="nc-container nc-header-inner"><a href="#atas" aria-label="NalaroClass, ke awal" onClick={closeMenu}><Brand /></a>
      <nav id="nc-navigation" className={menuOpen ? 'is-open' : ''} aria-label="Navigasi utama"><a href="#platform" onClick={closeMenu}>Platform</a><a href="#guru" onClick={closeMenu}>Untuk guru</a><a href="#kuis" onClick={closeMenu}>Kuis interaktif</a><a href="#tema" onClick={closeMenu}>Tema kelas</a></nav>
      <div className="nc-header-actions"><button type="button" className="nc-login" onClick={onEnterApp}>Masuk <ArrowUpRight size={16} /></button><button id="nc-menu-toggle" className="nc-menu-toggle" type="button" aria-label={menuOpen ? 'Tutup navigasi' : 'Buka navigasi'} aria-expanded={menuOpen} aria-controls="nc-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button></div>
    </div></header>
    <main id="nc-main">
      <section className="nc-hero nc-container" id="atas" ref={hero}>
        <div className="nc-hero-copy"><h1>Kelas terarah.<br />Belajar lebih<br /><span>bermakna.</span></h1><p>Satukan materi, tugas, presensi, dan kuis dalam satu ruang kelas. Lebih mudah dikelola guru, lebih jelas diikuti siswa.</p><div className="nc-actions"><button type="button" className="nc-button nc-button--primary" onClick={onEnterApp}>Buat kelasmu <ArrowUpRight size={19} /></button><a className="nc-button nc-button--text" href="#platform">Lihat platform <ArrowDown size={17} /></a></div><div className="nc-hero-note"><GraduationCap size={19} /><span>Untuk guru dan siswa. Di laptop, tablet, dan ponsel.</span></div></div>
        <div className={`nc-hero-visual${heroVisible ? ' is-in-view' : ''}`}><div className="nc-student-photo"><img src="/images/landing/students-1440.webp" srcSet="/images/landing/students-640.webp 640w, /images/landing/students-1440.webp 1440w" sizes="(max-width: 760px) 92vw, (max-width: 1100px) 52vw, 650px" alt="Dua siswa belajar bersama dengan laptop" width="1440" height="1080" fetchPriority="high" decoding="async" /></div>
          <div className="nc-float nc-float--material"><span className="nc-float-icon nc-float-icon--blue"><BookOpen size={20} /></span><div><small>Materi kelas</small><strong>Ekosistem dan kehidupan</strong><span>Bacaan dan video pembelajaran</span></div></div>
          <div className="nc-float nc-float--live"><span className="nc-live-indicator" /><div><small>Nalaro Live</small><strong>Siap belajar bersama?</strong></div><Radio size={22} /></div>
          <div className="nc-float nc-float--progress"><div className="nc-progress-ring"><Check size={19} /></div><div><small>Progres belajar</small><strong>2 dari 3 materi selesai</strong><div className="nc-mini-progress"><i /></div></div></div>
          <span className="nc-visual-caption">Ilustrasi aktivitas kelas</span>
        </div>
      </section>
      <div className="nc-platform-strip"><div className="nc-container"><span>Satu alur pembelajaran, dari awal sampai evaluasi.</span><div>{[[BookOpen,'Materi'],[MessageCircle,'Diskusi'],[ClipboardList,'Tugas'],[Users,'Presensi'],[Radio,'Kuis live']].map(([Icon,label])=><span key={label}><Icon size={17} strokeWidth={1.6} />{label}</span>)}</div></div></div>
      <section className="nc-section nc-platform nc-container" id="platform" aria-labelledby="nc-platform-title"><Reveal className="nc-section-heading"><h2 id="nc-platform-title">Semua kebutuhan kelas.<br />Dalam satu tempat.</h2><p>Materi tidak tercecer, tugas punya tujuan yang jelas, dan percakapan tetap terhubung dengan pembelajaran.</p></Reveal><Reveal><ProductPreview /></Reveal></section>
      <section className="nc-teacher-section" id="guru" aria-labelledby="nc-teacher-title"><div className="nc-container nc-teacher-layout"><Reveal className="nc-teacher-visual"><img src="/images/landing/teacher-1000.webp" srcSet="/images/landing/teacher-640.webp 640w, /images/landing/teacher-1000.webp 1000w" sizes="(max-width: 760px) 90vw, 480px" alt="Guru dengan tablet, siap mengelola pembelajaran" width="1000" height="1250" loading="lazy" decoding="async" /><div className="nc-teacher-note"><span className="nc-float-icon"><CalendarDays size={22} /></span><div><small>Pertemuan berikutnya</small><strong>Materi, tugas, dan presensi siap.</strong></div><Check size={18} /></div></Reveal>
        <Reveal className="nc-teacher-copy"><h2 id="nc-teacher-title">Lebih banyak waktu<br />untuk mengajar.</h2><p>Siapkan pembelajaran dan kelola aktivitas kelas dalam alur yang sama. Dari membagikan materi hingga meninjau hasil siswa.</p><ul>{[['Susun kelas sesuai pembelajaranmu', 'Hubungkan materi, tugas, dan kuis dengan pertemuan.'],['Berikan arahan yang mudah diikuti', 'Tulis petunjuk, tetapkan tenggat, dan sampaikan umpan balik.'],['Tinjau perkembangan siswa', 'Gunakan hasil dan aktivitas kelas sebagai bahan evaluasi.']].map(([title,copy])=><li key={title}><Check size={18} /><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ul><button type="button" className="nc-text-link" onClick={onEnterApp}>Siapkan kelas pertama <ArrowRight size={19} /></button></Reveal>
      </div></section>
      <section className="nc-section nc-container nc-features" aria-labelledby="nc-features-title"><Reveal className="nc-section-heading"><h2 id="nc-features-title">Aktivitas tertata.<br />Kemajuan lebih terlihat.</h2><p>Perangkat yang membantu guru mengelola kelas dan siswa memahami apa yang perlu dikerjakan.</p></Reveal><div className="nc-feature-grid">{features.map(({icon:Icon,title,copy,color})=><Reveal key={title}><article className="nc-feature-card"><span className={`nc-feature-icon nc-feature-icon--${color}`}><Icon size={27} strokeWidth={1.5} /></span><h3>{title}</h3><p>{copy}</p></article></Reveal>)}</div>
        <Reveal className="nc-assist"><div className="nc-assist-mark"><Sparkles size={27} strokeWidth={1.4} /></div><div><h3>Mulai dari draf bersama Nalaro Assist.</h3><p>Siapkan ide materi dan soal, lalu tinjau dan sesuaikan sebelum dipublikasikan ke kelas.</p></div><button type="button" className="nc-text-link" onClick={onEnterApp}>Buka ruang guru <ArrowRight size={18} /></button></Reveal>
      </section>
      <section className="nc-quiz-section" id="kuis" aria-labelledby="nc-quiz-title"><div className="nc-container nc-quiz-layout"><Reveal className="nc-quiz-copy"><h2 id="nc-quiz-title">Uji pemahaman.<br /><span>Hidupkan partisipasi.</span></h2><p>Gunakan kuis mandiri untuk latihan atau ajak kelas bermain bersama melalui Nalaro Live.</p><div className="nc-quiz-benefits"><div><Radio size={21} /><h3>Satu PIN, satu sesi bersama.</h3><p>Guru memandu kuis, peserta bergabung menggunakan PIN sesi.</p></div><div><BarChart3 size={21} /><h3>Hasil untuk langkah berikutnya.</h3><p>Tinjau jawaban dan hasil kuis sebagai bahan pembahasan kelas.</p></div></div><Link to="/quiz/join" className="nc-button nc-button--dark">Gabung kuis live <ArrowUpRight size={18} /></Link></Reveal><Reveal><LandingQuiz /></Reveal></div></section>
      <WorldShowcase />
      <section className="nc-section nc-container nc-start" aria-labelledby="nc-start-title"><Reveal className="nc-section-heading"><h2 id="nc-start-title">Kelas pertama dimulai<br />dengan langkah sederhana.</h2><p>Guru menyiapkan ruang kelas. Siswa bergabung dan mengikuti aktivitas yang tersedia.</p></Reveal><div className="nc-start-grid">{[['01','Buat ruang kelas','Masuk sebagai guru, buat kelas, lalu pilih tema yang sesuai.'],['02','Bagikan kode kelas','Undang siswa untuk bergabung menggunakan kode kelas.'],['03','Mulai pembelajaran','Publikasikan materi, berikan tugas, dan jalankan kuis kelas.']].map(([n,title,copy])=><Reveal key={n}><div className="nc-start-step"><span>{n}</span><h3>{title}</h3><p>{copy}</p></div></Reveal>)}</div></section>
      <section className="nc-faq-section nc-container" id="faq" aria-labelledby="nc-faq-title"><div><h2 id="nc-faq-title">Sebelum mulai.</h2><p>Beberapa hal yang perlu kamu ketahui.</p></div><div className="nc-faq-list">{faqs.map(([q,a])=><details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>
      <section className="nc-final-cta"><div className="nc-container"><div><h2>Siapkan ruang untuk<br />pembelajaran berikutnya.</h2><p>Mulai kelasmu dan hubungkan setiap aktivitas belajar.</p></div><button type="button" className="nc-button nc-button--light" onClick={onEnterApp}>Buat kelasmu <ArrowUpRight size={20} /></button></div></section>
    </main>
    <footer className="nc-footer"><div className="nc-container"><div className="nc-footer-top"><div><a href="#atas" aria-label="NalaroClass, ke awal"><Brand /></a><p>Ruang kelas digital untuk pembelajaran yang terarah.</p></div><nav aria-label="Navigasi footer"><a href="#platform">Platform</a><a href="#tema">Tema kelas</a><a href="#faq">FAQ</a><a href="https://nalaro.digital" target="_blank" rel="noopener noreferrer">Nalaro Digital <ArrowUpRight size={13} /></a></nav></div><div className="nc-footer-bottom"><span>© {new Date().getFullYear()} NalaroClass</span><button type="button" className="nc-motion-control" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? <Play size={14} /> : <Pause size={14} />}{paused ? 'Putar animasi' : 'Jeda animasi'}</button></div></div></footer>
  </div>;
}
