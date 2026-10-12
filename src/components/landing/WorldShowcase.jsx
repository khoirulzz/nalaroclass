import { useState } from 'react';
import { ArrowUpRight, BookOpen, CheckCircle2, MessageCircle, Palette, Trophy } from 'lucide-react';
import ThemeMascot from '../classroom/ThemeMascot';
import { CLASS_THEMES } from '../../features/classes/classThemes';
import '../../styles/class-themes.css';
export default function WorldShowcase() {
  const [active, setActive] = useState('superhero');
  const theme = CLASS_THEMES.find((item) => item.id === active) || CLASS_THEMES[0];
  return <section className="nlr-worlds" id="dunia" aria-labelledby="worlds-title">
    <div className="nlr-wrap">
      <div className="nlr-worlds__heading"><p>Lima dunia. Satu tempat belajar.</p><h2 id="worlds-title">Kelasmu, <em>karaktermu.</em></h2><span>Guru memilih dunia kelas. Semua siswa merasakan pengalaman yang sama, dari materi sampai kuis.</span></div>
      <div className="nlr-worlds__layout">
        <div className="nlr-worlds__tabs" role="group" aria-label="Pilih preview tema kelas">
          {CLASS_THEMES.map((item, index) => <button key={item.id} type="button" aria-pressed={active === item.id} onClick={() => setActive(item.id)}><span>0{index + 1}</span><strong>{item.name}</strong><ArrowUpRight size={18} /></button>)}
        </div>
        <div className={`nlr-worlds__stage qz-theme-${theme.id}`} key={theme.id} aria-live="polite">
          <div className="nlr-worlds__window"><div className="nlr-worlds__window-top"><span className="nlr-worlds__window-dots"><i/><i/><i/></span><span>nalaroclass / kelas 7A</span><Palette size={16}/></div>
            <div className="nlr-worlds__window-body">
              <div className="nlr-worlds__hero"><div><span>MATEMATIKA · KELAS 7A</span><h3>{theme.short}</h3><p>{theme.subtitle}</p><span className="nlr-worlds__cta">Jelajahi materi <ArrowUpRight size={17}/></span></div><div className="nlr-worlds__character" aria-hidden="true"><span className="nlr-worlds__orbit"/><ThemeMascot themeId={theme.id} size={125} /><span>{theme.symbol}</span></div></div>
              <div className="nlr-worlds__cards"><div><BookOpen size={23}/><strong>Materi</strong><small>12 tersedia</small></div><div><Trophy size={23}/><strong>Tugas & kuis</strong><small>3 aktivitas baru</small></div><div><MessageCircle size={23}/><strong>Diskusi</strong><small>Temukan ide bersama</small></div></div>
              <div className="nlr-worlds__progress"><span><CheckCircle2 size={18}/> Perjalanan belajar</span><strong>68%</strong><i><b/></i></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>;
}
