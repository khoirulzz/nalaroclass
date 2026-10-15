import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Check, MessageCircle } from 'lucide-react';
import Brand from '../components/Brand';
import LandingPhoto from '../components/landing/LandingPhoto';
import WorldShowcase from '../components/landing/WorldShowcase';
import RealClassroomStory from '../components/landing/RealClassroomStory';
import '../styles/landing-story.css';
import '../styles/landing.css';
import '../styles/landing-photos.css';

const formats = [
  { title: 'Pilihan ganda', question: 'Kenapa langit terlihat biru?', kind: 'choice' },
  { title: 'Titik pada gambar', question: 'Di mana letak inti sel?', kind: 'hotspot' },
  { title: 'Susun urutan', question: 'Dari benih, lalu jadi apa?', kind: 'order' },
  { title: 'Pilihan gambar', question: 'Mana yang punya tiga sisi?', kind: 'image' },
];

function Reveal({ children, className = '', ...props }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.65 }} {...props}>{children}</motion.div>;
}

function QuizPreview({ format }) {
  return <div className="nlr-quiz-paper" aria-live="polite" aria-atomic="true">
    <div className="nlr-paper-meta"><span>CONTOH SOAL</span><span>0{format + 1} / 04</span></div>
    <h3>{formats[format].question}</h3>
    {format === 0 && <div className="nlr-demo-choices"><span><b>A</b> Warna laut terpantul ke langit</span><span className="is-answer"><b>B</b> Cahaya biru lebih banyak tersebar <Check size={18} /></span><span><b>C</b> Awan memberi warna biru</span></div>}
    {format === 1 && <div className="nlr-demo-cell" aria-label="Ilustrasi sel dengan inti di tengah"><i /><span>Inti sel<ArrowDown size={20} /></span></div>}
    {format === 2 && <div className="nlr-demo-order"><span>01<b>Benih</b><i>·</i></span><ArrowRight /><span>02<b>Tunas</b><i>ʏ</i></span><ArrowRight /><span>03<b>Tanaman</b><i>♧</i></span></div>}
    {format === 3 && <div className="nlr-demo-shapes" aria-label="Lingkaran, segitiga, dan persegi"><i /><i /><i /></div>}
    <div className="nlr-paper-bottom"><span>Contoh tampilan soal</span><BookOpen size={18} /></div>
  </div>;
}

export default function Landing({ onEnterApp }) {
  const [format, setFormat] = useState(0);
  return (
    <div className="nlr-landing">
      <a className="nlr-skip" href="#isi">Lewati navigasi</a>
      <header className="nlr-site-header"><div className="nlr-wrap nlr-site-header__inner">
        <a href="#atas" aria-label="Nalaro Class, ke awal"><Brand /></a>
        <nav aria-label="Navigasi halaman"><a href="#dunia">Tema kelas</a><a href="#platform">Ruang belajar</a><a href="#soal">Jelajahi kuis</a></nav>
        <button type="button" className="nlr-header-login" onClick={onEnterApp}>Masuk <ArrowUpRight size={18} /></button>
      </div></header>
      <main id="isi">
        <section className="nlr-hero nlr-wrap" id="atas">
          <div className="nlr-hero__copy">
            <span className="nlr-hero__eyebrow">Ruang kelas digital untuk guru dan siswa</span><h1>Belajar bersama,<br /><em>lebih terarah.</em></h1>
            <p>Bagikan materi, lanjutkan diskusi, dan kerjakan kuis dalam satu kelas. Guru lebih mudah mengajar, siswa tahu harus mulai dari mana.</p>
            <button type="button" className="nlr-action nlr-action--primary" onClick={onEnterApp}>Mulai sekarang <ArrowUpRight size={21} /></button>
            <a className="nlr-hero__scroll" href="#platform"><span><ArrowDown size={18} /></span>Lihat kegiatan kelas</a>
          </div>
          <figure className="nlr-hero__art nlr-hero-photo"><LandingPhoto name="classroom" priority alt="Guru Indonesia mendampingi dua siswa belajar dengan laptop dan buku catatan" /><figcaption><BookOpen size={19} aria-hidden="true" /><span>Guru mendampingi.<br /><strong>Siswa ikut terlibat.</strong></span></figcaption><span className="nlr-photo-spark" aria-hidden="true">✳</span></figure>
          <div className="nlr-hero__foot"><span>Materi, diskusi, tugas, dan kuis dalam satu tempat.</span><a href="#dunia">Temukan tema kelasmu <ArrowDown size={15} aria-hidden="true" /></a></div>
        </section>
        <WorldShowcase />
        <div className="nlr-word-strip" aria-hidden="true"><span>bertanya</span><i>↗</i><span>mencoba</span><i>✳</i><span>memahami</span><i>↗</i><span>bertumbuh</span><i>✳</i></div>
        <section className="nlr-journey nlr-wrap" id="platform" aria-labelledby="journey-title">
          <div className="nlr-journey__intro"><span className="nlr-margin-note">Di dalam kelasmu</span><h2 id="journey-title">Dari membaca,<br /><em>sampai memahami.</em></h2><p>Buka bahan belajar, tanyakan yang belum jelas, lalu uji pemahamanmu lewat kuis.</p><a href="#fitur" className="nlr-inline-link">Lihat fitur kelas <ArrowDown size={18} /></a></div>
          <div className="nlr-journey__pages">
            {[
              { color: 'blue', number: '01', label: 'MATERI', image: 'teacher', alt: 'Guru menyiapkan bahan pelajaran dengan laptop dan catatan', title: 'Bahan belajar, tinggal buka.', body: 'Catatan, video, dan lampiran dibagikan guru di kelas. Buka kembali saat ingin mengulang pelajaran.', Icon: BookOpen },
              { color: 'peach', number: '02', label: 'DISKUSI', image: 'students', alt: 'Siswa berdiskusi dan saling menjelaskan pelajaran', title: 'Belum paham? Tanya di sini.', body: 'Tulis pertanyaan pada materi yang sedang dibaca. Guru dan teman sekelas bisa ikut menanggapi.', Icon: MessageCircle },
              { color: 'yellow', number: '03', label: 'KUIS', image: 'classroom', alt: 'Guru dan siswa melihat latihan bersama di laptop', title: 'Coba soal, lihat hasilnya.', body: 'Kerjakan kuis mandiri atau ikuti Nalaro Live bersama kelas. Buka hasilnya untuk melihat jawaban yang perlu dipelajari lagi.', Icon: ArrowUpRight },
            ].map(({ color, number, label, image, alt, title, body, Icon }) => <Reveal key={number} className={`nlr-chapter nlr-chapter--${color}`}><div className="nlr-chapter__top"><span>{number} / {label}</span><Icon size={21} aria-hidden="true" /></div><LandingPhoto className="nlr-chapter__photo" name={image} alt={alt} sizes="(max-width: 700px) 85vw, 40vw" /><h3>{title}</h3><p>{body}</p></Reveal>)}
          </div>
        </section>
        <RealClassroomStory />
        <section className="nlr-classroom" id="fitur"><div className="nlr-wrap">
          <div className="nlr-teacher-intro"><LandingPhoto name="teacher" alt="Guru Indonesia menyiapkan pelajaran di meja kelas" /><Reveal className="nlr-classroom__heading"><span className="nlr-margin-note">Untuk persiapan sampai penilaian</span><h2>Lebih siap<br /><em>mengajar besok.</em></h2><p>Atur materi, pertemuan, presensi, dan kuis dari ruang kelasmu. Draf pelajaran juga bisa disiapkan di Studio Guru.</p></Reveal></div>
          <div className="nlr-classroom__rows">
            {[['01', 'Bagikan kode, mulai kelas.', 'Siswa bergabung lewat kode kelas. Materi, tugas, dan jadwal pertemuan bisa ditemukan di sana.'], ['02', 'Catat kehadiran per sesi.', 'Buka presensi per sesi dan lihat kembali riwayat kehadiran.'], ['03', 'Siapkan draf pelajaran.', 'Gunakan Nalaro Assist untuk menyusun draf materi dan soal, lalu periksa isinya sebelum dibagikan.'], ['04', 'Ajak sekelas ikut kuis.', 'Bagikan PIN Nalaro Live, atur waktu, lalu lihat hasil kuis kelasmu.']].map(([n, title, copy]) => <Reveal key={n} className="nlr-classroom__row"><span>{n}</span><h3>{title}</h3><p>{copy}</p><ArrowUpRight aria-hidden="true" size={22} /></Reveal>)}
          </div>
        </div></section>
        <section className="nlr-quiz-section nlr-wrap" id="soal" aria-labelledby="quiz-title">
          <Reveal className="nlr-quiz-intro"><span className="nlr-margin-note">Kenali format kuisnya</span><h2 id="quiz-title">Soalnya beragam.<br /><em>Tetap mudah<br />dikerjakan.</em></h2><p>Pilihan ganda, gambar, titik pada gambar, atau susun urutan. Pilih salah satu untuk melihat contohnya.</p><div className="nlr-format-list" role="group" aria-label="Contoh format soal">{formats.map((item, index) => <button type="button" key={item.kind} aria-pressed={format === index} onClick={() => setFormat(index)}><span>0{index + 1}</span>{item.title}<ArrowUpRight size={19} /></button>)}</div></Reveal>
          <Reveal className="nlr-quiz-stage"><div className="nlr-quiz-sun" aria-hidden="true">✳</div><QuizPreview format={format} /><span className="nlr-handwritten">Sesuaikan bentuk soal<br />dengan pelajaranmu.</span></Reveal>
        </section>
        <section className="nlr-cta"><div className="nlr-wrap nlr-cta__inner"><span className="nlr-cta__asterisk" aria-hidden="true">✳</span><Reveal><h2>Kelas berikutnya,<br /><em>siapkan di Nalaro.</em></h2><button type="button" className="nlr-action nlr-action--primary" onClick={onEnterApp}>Masuk ke Nalaro <ArrowUpRight size={22} /></button></Reveal><span className="nlr-cta__scribble" aria-hidden="true">↗</span></div></section>
      </main>
      <footer className="nlr-footer"><div className="nlr-wrap nlr-footer__inner"><a href="#atas" aria-label="Nalaro Class, ke awal"><Brand /></a><p>Ruang belajar untuk guru dan siswa.</p><span>© {new Date().getFullYear()} Nalaro Class</span></div></footer>
    </div>
  );
}
