import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import LandingPhoto from './LandingPhoto';

const stories = [
  { label: 'Materi', title: 'Bahan belajar mudah ditemukan.', body: 'Buka catatan, video, dan lampiran yang dibagikan guru. Lanjutkan membaca dari ruang kelas yang sama.', image: 'classroom', alt: 'Guru mendampingi dua siswa mempelajari materi di laptop' },
  { label: 'Diskusi', title: 'Ada yang belum jelas? Tanyakan.', body: 'Tulis pertanyaan langsung pada materi. Guru dan teman sekelas bisa ikut menjawab, termasuk setelah jam pelajaran.', image: 'students', alt: 'Tiga siswa Indonesia berdiskusi sambil melihat tablet dan buku catatan' },
  { label: 'Nalaro Live', title: 'Kerjakan kuis bersama sekelas.', body: 'Guru membagikan PIN, siswa bergabung, lalu soal dimainkan bersama. Hasil sesi bisa dibuka kembali oleh guru.', image: 'students', alt: 'Siswa Indonesia mengerjakan kuis bersama menggunakan tablet' },
];

export default function RealClassroomStory() {
  const [selected, setSelected] = useState(0);
  const story = stories[selected];
  return <section className="nlr-realclass" id="cerita" aria-labelledby="nlr-realclass-title">
    <div className="nlr-wrap nlr-realclass__layout">
      <div className="nlr-story-photo"><LandingPhoto name={story.image} alt={story.alt} /><span className="nlr-photo-note">Belajar bersama,<br />saling bantu memahami.</span></div>
      <div className="nlr-realclass__copy">
        <span className="nlr-realclass__chapter">Untuk guru dan siswa</span>
        <h2 id="nlr-realclass-title">Tetap terhubung,<br/><em>di luar jam kelas.</em></h2>
        <p>Materi, tanya jawab, dan kuis ada di ruang yang sama. Siswa tahu harus membuka apa, guru bisa mengikuti kegiatan kelasnya.</p>
        <div className="nlr-realclass__switcher" role="group" aria-label="Jelajahi kegiatan kelas">
          {stories.map((item, index) => <button key={item.label} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}><span>0{index + 1}</span>{item.label}<ArrowUpRight size={16} aria-hidden="true" /></button>)}
        </div>
        <div className="nlr-realclass__detail" aria-live="polite"><h3>{story.title}</h3><p>{story.body}</p></div>
      </div>
    </div>
  </section>;
}
