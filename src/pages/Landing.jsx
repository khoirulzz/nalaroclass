import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Check, MessageCircle, Pause, Play } from 'lucide-react';
import Brand from '../components/Brand';
import LearningArtwork from '../components/LearningArtwork';
import '../styles/landing.css';

const formats = [
  { title: 'Pilihan ganda', question: 'Kenapa langit terlihat biru?', kind: 'choice' },
  { title: 'Hotspot gambar', question: 'Di mana letak inti sel?', kind: 'hotspot' },
  { title: 'Susun urutan', question: 'Dari benih, lalu jadi apa?', kind: 'order' },
  { title: 'Pilihan gambar', question: 'Mana yang punya tiga sisi?', kind: 'image' },
];

function Reveal({ children, className = '', ...props }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.65 }} {...props}>{children}</motion.div>;
}

function QuizPreview({ format }) {
  return <div className="nlr-quiz-paper" aria-live="polite" aria-atomic="true">
    <div className="nlr-paper-meta"><span>COBA BAYANGKAN</span><span>0{format + 1} / 04</span></div>
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
  const [paused, setPaused] = useState(false);
  return (
    <div className={`nlr-landing${paused ? ' nlr-motion-paused' : ''}`}>
      <a className="nlr-skip" href="#isi">Lewati navigasi</a>
      <header className="nlr-site-header"><div className="nlr-wrap nlr-site-header__inner">
        <a href="#atas" aria-label="Nalaro Class, ke awal"><Brand /></a>
        <nav aria-label="Navigasi halaman"><a href="#platform">Ruang belajar</a><a href="#soal">Jelajahi kuis</a></nav>
        <button type="button" className="nlr-header-login" onClick={onEnterApp}>Masuk <ArrowUpRight size={18} /></button>
      </div></header>
      <main id="isi">
        <section className="nlr-hero nlr-wrap" id="atas">
          <div className="nlr-hero__copy">
            <h1>Berawal dari<br />rasa <em>ingin tahu.</em></h1>
            <p>Ada pertanyaan, ada penemuan. Ada tempat untuk keduanya di kelasmu.</p>
            <button type="button" className="nlr-action nlr-action--primary" onClick={onEnterApp}>Masuk ke Nalaro <ArrowUpRight size={21} /></button>
            <a className="nlr-hero__scroll" href="#platform"><span><ArrowDown size={18} /></span>Kenali ruang belajarmu</a>
          </div>
          <div className="nlr-hero__art"><LearningArtwork /><span className="nlr-art-note">Ide besar boleh dimulai<br />dari pertanyaan kecil.</span></div>
          <div className="nlr-hero__foot"><span>Untuk yang mengajar. Untuk yang ingin belajar.</span><button className="nlr-motion-control" type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? <Play size={14} /> : <Pause size={14} />}{paused ? 'Putar animasi' : 'Jeda animasi'}</button></div>
        </section>
        <div className="nlr-word-strip" aria-hidden="true"><span>bertanya</span><i>↗</i><span>mencoba</span><i>✳</i><span>memahami</span><i>↗</i><span>bertumbuh</span><i>✳</i></div>
        <section className="nlr-journey nlr-wrap" id="platform" aria-labelledby="journey-title">
          <div className="nlr-journey__intro"><span className="nlr-margin-note">Di dalam kelasmu</span><h2 id="journey-title">Pelajaran<br />boleh usai.<br /><em>Penemuan<br />jalan terus.</em></h2><p>Dari materi pertama sampai momen “oh, begitu!”, semuanya punya tempat.</p><a href="#fitur" className="nlr-inline-link">Lihat yang bisa kamu lakukan <ArrowDown size={18} /></a></div>
          <div className="nlr-journey__pages">
            <Reveal className="nlr-chapter nlr-chapter--blue"><div className="nlr-chapter__top"><span>01 / BUKA WAWASAN</span><BookOpen size={21} /></div><div className="nlr-lesson-art" aria-hidden="true"><div className="nlr-orbit"><i /><i /><i /></div><span>Setiap hal<br />punya cerita.</span></div><h3>Bukan sekadar<br />baca lalu selesai.</h3><p>Materi, video, dan catatan ada di satu tempat. Buka lagi kapan pun kamu membutuhkannya.</p></Reveal>
            <Reveal className="nlr-chapter nlr-chapter--peach"><div className="nlr-chapter__top"><span>02 / TANYA SAJA</span><MessageCircle size={21} /></div><div className="nlr-conversation" aria-hidden="true"><span>“Kalau caranya dibalik,<br />hasilnya sama nggak?”</span><span>“Menarik. Yuk, kita coba.”<i>↗</i></span></div><h3>Pertanyaan bagus<br />butuh ruang.</h3><p>Lanjutkan obrolan langsung di materi. Guru dan teman sekelas bisa ikut menanggapi.</p></Reveal>
            <Reveal className="nlr-chapter nlr-chapter--yellow"><div className="nlr-chapter__top"><span>03 / BERANI MENCOBA</span><ArrowUpRight size={23} /></div><div className="nlr-score-art" aria-hidden="true"><span>coba.</span><span>pahami.</span><span>coba lagi.<i>✳</i></span></div><h3>Belum tepat?<br />Belum selesai.</h3><p>Uji pemahaman lewat kuis mandiri atau main bersama di Nalaro Live. Lihat hasilnya, temukan yang bisa dipelajari lagi.</p></Reveal>
          </div>
        </section>
        <section className="nlr-classroom" id="fitur"><div className="nlr-wrap">
          <Reveal className="nlr-classroom__heading"><h2>Kamu urus<br /><em>serunya belajar.</em></h2><p>Nalaro bantu merapikan sisanya.</p></Reveal>
          <div className="nlr-classroom__rows">
            {[['01', 'Kelas punya rumah.', 'Bagikan kode kelas. Materi, tugas, dan pertemuan tersimpan bersama.'], ['02', 'Yang hadir, tercatat.', 'Buka presensi per sesi dan lihat kembali riwayat kehadiran.'], ['03', 'Persiapan lebih ringan.', 'Susun draf materi dan soal dengan Nalaro Assist. Kamu tetap yang meninjau.'], ['04', 'Saatnya main bersama.', 'Bagikan PIN Nalaro Live, atur waktu, lalu lihat hasil kuis kelasmu.']].map(([n, title, copy]) => <Reveal key={n} className="nlr-classroom__row"><span>{n}</span><h3>{title}</h3><p>{copy}</p><ArrowUpRight aria-hidden="true" size={22} /></Reveal>)}
          </div>
        </div></section>
        <section className="nlr-quiz-section nlr-wrap" id="soal" aria-labelledby="quiz-title">
          <Reveal className="nlr-quiz-intro"><span className="nlr-margin-note">Banyak cara untuk mencoba</span><h2 id="quiz-title">Jawaban bisa<br />punya banyak<br /><em>bentuk.</em></h2><p>Pilih formatnya. Beri rasa baru di setiap kuis.</p><div className="nlr-format-list" role="group" aria-label="Contoh format soal">{formats.map((item, index) => <button type="button" key={item.kind} aria-pressed={format === index} onClick={() => setFormat(index)}><span>0{index + 1}</span>{item.title}<ArrowUpRight size={19} /></button>)}</div></Reveal>
          <Reveal className="nlr-quiz-stage"><div className="nlr-quiz-sun" aria-hidden="true">✳</div><QuizPreview format={format} /><span className="nlr-handwritten">Satu pertanyaan,<br />banyak jalan berpikir.</span></Reveal>
        </section>
        <section className="nlr-cta"><div className="nlr-wrap nlr-cta__inner"><span className="nlr-cta__asterisk" aria-hidden="true">✳</span><Reveal><h2>Besok belajar apa?<br /><em>Mulai dari sini.</em></h2><button type="button" className="nlr-action nlr-action--primary" onClick={onEnterApp}>Buka ruang belajarmu <ArrowUpRight size={22} /></button></Reveal><span className="nlr-cta__scribble" aria-hidden="true">↗</span></div></section>
      </main>
      <footer className="nlr-footer"><div className="nlr-wrap nlr-footer__inner"><a href="#atas" aria-label="Nalaro Class, ke awal"><Brand /></a><p>Ruang untuk rasa ingin tahu.</p><span>© {new Date().getFullYear()} Nalaro Class</span></div></footer>
    </div>
  );
}
