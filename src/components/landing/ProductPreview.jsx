import { useState } from 'react';
import { BookOpen, CalendarDays, Check, ChevronRight, ClipboardList, FileText, MessageCircle, Play, Users } from 'lucide-react';

const panels = [
  { id: 'materi', name: 'Materi', icon: BookOpen, title: 'Bahan belajar, tersusun per topik.', copy: 'Bagikan materi dan lampiran. Siswa dapat melanjutkan membaca serta berdiskusi dari materi yang sama.' },
  { id: 'tugas', name: 'Tugas', icon: ClipboardList, title: 'Tugas jelas. Umpan balik terarah.', copy: 'Tetapkan tenggat, terima pengumpulan, lalu berikan nilai dan masukan untuk membantu siswa memperbaiki pekerjaannya.' },
  { id: 'presensi', name: 'Presensi', icon: Users, title: 'Kehadiran tercatat per pertemuan.', copy: 'Kelola sesi presensi dan tinjau riwayatnya dari ruang kelas, bersama aktivitas pembelajaran lainnya.' },
  { id: 'diskusi', name: 'Diskusi', icon: MessageCircle, title: 'Percakapan tetap dekat dengan pelajaran.', copy: 'Sediakan tempat untuk pertanyaan dan tanggapan, baik di ruang kelas maupun pada materi tertentu.' },
];

function PanelContent({ active }) {
  if (active === 'tugas') return <div className="nc-preview-tasks">
    <div className="nc-preview-section-title"><h4>Tugas kelas</h4><span>2 tugas</span></div>
    {[['Laporan pengamatan ekosistem', 'Jumat, 16 Oktober', 'Belum dikumpulkan'], ['Peta konsep rantai makanan', 'Senin, 12 Oktober', 'Sudah dinilai']].map(([title, date, state], i) => <div className="nc-task-row" key={title}><span className="nc-ui-icon"><ClipboardList size={20} /></span><div><strong>{title}</strong><small>Tenggat: {date}</small></div><span className={`nc-status ${i ? 'nc-status--green' : ''}`}>{state}</span></div>)}
    <div className="nc-feedback"><Check size={18} /><div><strong>Umpan balik guru</strong><p>Hubungan antarkomponen sudah jelas. Tambahkan contoh organisme pada setiap tingkat.</p></div></div>
  </div>;
  if (active === 'presensi') return <div className="nc-attendance-preview"><div className="nc-preview-section-title"><h4>Presensi pertemuan</h4><span>Contoh rekap</span></div><div className="nc-session"><CalendarDays size={23} /><div><strong>Pertemuan 4: Ekosistem</strong><small>Selasa, 13 Oktober</small></div><span className="nc-status nc-status--green">Selesai</span></div><div className="nc-attendance-metrics"><div><b>28</b><span>Hadir</span></div><div><b>2</b><span>Izin</span></div><div><b>1</b><span>Sakit</span></div></div>{['Alya Putri', 'Bagas Pratama', 'Citra Lestari'].map(name => <div className="nc-attendance-row" key={name}><span>{name}</span><span><Check size={14} /> Hadir</span></div>)}</div>;
  if (active === 'diskusi') return <div className="nc-discussion-preview"><div className="nc-preview-section-title"><h4>Diskusi materi</h4><span>Ekosistem</span></div><div className="nc-comment"><span className="nc-avatar">A</span><div><strong>Alya Putri <small>Siswa</small></strong><p>Apa yang terjadi jika salah satu konsumen dalam rantai makanan berkurang?</p></div></div><div className="nc-comment nc-comment--reply"><span className="nc-avatar nc-avatar--teacher">R</span><div><strong>Bu Ratna <small>Guru</small></strong><p>Coba perhatikan organisme sebelum dan sesudahnya. Populasi mana yang akan berubah?</p></div></div><div className="nc-comment-input">Diskusi terhubung dengan materi <MessageCircle size={18} /></div></div>;
  return <><div className="nc-preview-section-title"><h4>Materi minggu ini</h4><span>3 materi</span></div><div className="nc-material-grid">{[
    ['Ekosistem dan komponennya', 'Materi bacaan', BookOpen, 'green'],
    ['Mengenal rantai makanan', 'Video pembelajaran', Play, 'peach'],
    ['Lembar pengamatan', 'Lampiran PDF', FileText, 'blue'],
  ].map(([title, type, Icon, color], i) => <div className="nc-material" key={title}><div className={`nc-material-art nc-material-art--${color}`}><Icon size={34} strokeWidth={1.4} /><span>0{i + 1}</span></div><small>{type}</small><strong>{title}</strong><div className="nc-material-bottom"><span>{i === 0 ? 'Lanjutkan membaca' : 'Buka materi'}</span><ChevronRight size={14} /></div></div>)}</div><div className="nc-reading-progress"><span><Check size={16} /> Progres membaca</span><strong>2 dari 3 materi selesai</strong><i><b /></i></div></>;
}

export default function ProductPreview() {
  const [active, setActive] = useState('materi');
  const panel = panels.find(item => item.id === active);
  return <div className="nc-product-showcase">
    <div className="nc-product-tabs" role="tablist" aria-label="Jelajahi fitur ruang kelas">{panels.map(({ id, name, icon: Icon }) => <button type="button" id={`nc-tab-${id}`} role="tab" key={id} aria-selected={id === active} aria-controls={`nc-panel-${id}`} tabIndex={id === active ? 0 : -1} onClick={() => setActive(id)} onKeyDown={event => {
      const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      const index = panels.findIndex(item => item.id === active);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? panels.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + panels.length) % panels.length;
      setActive(panels[next].id); document.getElementById(`nc-tab-${panels[next].id}`)?.focus();
    }}><Icon size={18} />{name}</button>)}</div>
    <div className="nc-product-panel" role="tabpanel" id={`nc-panel-${active}`} aria-labelledby={`nc-tab-${active}`} tabIndex={0}>
      <div className="nc-product-window"><div className="nc-window-bar"><span className="nc-window-dots"><i /><i /><i /></span><span>Preview ruang kelas</span><span>Data contoh</span></div>
        <div className="nc-product-body"><aside className="nc-preview-sidebar"><div className="nc-class-avatar">B</div><strong>Biologi X-A</strong><small>Bu Ratna</small><div>{panels.map(({ id, name, icon: Icon }) => <button type="button" key={id} aria-pressed={active === id} onClick={() => setActive(id)}><Icon size={17} />{name}</button>)}</div><span className="nc-preview-members"><Users size={15} />31 siswa</span></aside>
          <div className="nc-preview-main"><div className="nc-preview-breadcrumb">Kelas saya <ChevronRight size={12} /> Biologi X-A</div><div className="nc-preview-class-header"><div><small>Pertemuan 4</small><h3>Memahami ekosistem</h3><p>Pelajari hubungan makhluk hidup dan lingkungannya.</p></div><BookOpen size={49} strokeWidth={1.2} /></div><div className="nc-panel-content" key={active}><PanelContent active={active} /></div></div>
        </div>
      </div>
      <div className="nc-product-caption" aria-live="polite"><h3>{panel.title}</h3><p>{panel.copy}</p></div>
    </div>
  </div>;
}
