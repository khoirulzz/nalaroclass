import { useState } from 'react';
import { ArrowUpRight, BookOpen, MessagesSquare, Radio, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const stories = [
  { label: 'Materi', title: 'Buka materi kapan pun.', body: 'Catatan, video, dan bahan belajar tersimpan rapi. Tidak perlu mencari ulang di banyak tempat.', stat: '12 materi', hint: 'Siap dipelajari', icon: BookOpen },
  { label: 'Diskusi', title: 'Ide tidak berhenti di bel kelas.', body: 'Siswa dapat bertanya, berdiskusi, dan melanjutkan percakapan langsung dari ruang belajarnya.', stat: '8 percakapan', hint: 'Di kelas ini', icon: MessagesSquare },
  { label: 'Nalaro Live', title: 'Tiba-tiba kelas jadi meriah.', body: 'Buat momen belajar bersama lewat kuis interaktif yang terasa menyenangkan, bukan menegangkan.', stat: 'Nalaro Live', hint: 'Siap dimainkan', icon: Radio },
];

export default function RealClassroomStory() {
  const [selected, setSelected] = useState(0);
  const reduced = useReducedMotion();
  const story = stories[selected];
  const Icon = story.icon;
  return <section className="nlr-realclass" id="cerita" aria-labelledby="nlr-realclass-title">
    <div className="nlr-wrap nlr-realclass__layout">
      <div className="nlr-realclass__photos">
        <div className="nlr-realclass__photo nlr-realclass__photo--main">
          <img loading="lazy" decoding="async" src="https://images.unsplash.com/photo-1758270704226-db897b180243?auto=format&fit=crop&w=960&h=1150&q=78" alt="Kegiatan diskusi di kelas saat siswa aktif mengangkat tangan" />
        </div>
        <div className="nlr-realclass__photo nlr-realclass__photo--secondary">
          <img loading="lazy" decoding="async" src="https://images.unsplash.com/photo-1764720573370-5008f1ccc9fa?auto=format&fit=crop&w=560&h=630&q=75" alt="Siswa Indonesia menggunakan perangkat digital di kelas" />
        </div>
        <motion.div className="nlr-realclass__livecard" key={selected} initial={reduced ? false : { y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .3 }} aria-live="polite">
          <span><Icon size={19} /></span><div><strong>{story.stat}</strong><small>{story.hint}</small></div><Sparkles size={15} aria-hidden="true"/>
        </motion.div>
      </div>
      <div className="nlr-realclass__copy">
        <span className="nlr-realclass__chapter">Cerita dari ruang belajar</span>
        <h2 id="nlr-realclass-title">Lebih dekat.<br/><em>Lebih terasa.</em></h2>
        <p>Belajar paling berkesan ketika setiap orang ikut terlibat. NalaroClass membantu guru menghidupkan pengalaman itu, di dalam maupun di luar kelas.</p>
        <div className="nlr-realclass__switcher" role="group" aria-label="Jelajahi pengalaman kelas">
          {stories.map((item, index) => <button key={item.label} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}><span>0{index + 1}</span>{item.label}<ArrowUpRight size={16}/></button>)}
        </div>
        <div className="nlr-realclass__detail" aria-live="polite"><h3>{story.title}</h3><p>{story.body}</p></div>
      </div>
    </div>
    <div className="nlr-wrap nlr-realclass__credit">Fotografi pendidikan: <a href="https://unsplash.com/photos/teacher-pointing-at-students-with-raised-hands-HIheRKI9mTs" target="_blank" rel="noopener noreferrer">Unsplash</a></div>
  </section>;
}
