import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CLASS_THEMES } from '../../features/classes/classThemes';

export default function WorldShowcase() {
  const [active, setActive] = useState(CLASS_THEMES[0].id);
  const theme = CLASS_THEMES.find((item) => item.id === active) || CLASS_THEMES[0];
  return <section className="nlr-worlds" id="dunia" aria-labelledby="worlds-title">
    <div className="nlr-wrap">
      <div className="nlr-worlds__heading"><p>{CLASS_THEMES.length} tema untuk kelasmu</p><h2 id="worlds-title">Kelasmu, <em>karaktermu.</em></h2><span>Dari angkasa sampai samudra, pilih suasana yang cocok untuk kelasmu. Tema dipilih guru saat membuat kelas dan digunakan bersama oleh seluruh siswa.</span></div>
      <div className="nlr-theme-options" role="group" aria-label="Pilih pratinjau tema kelas">
        {CLASS_THEMES.map((item, index) => <button key={item.id} type="button" aria-pressed={active === item.id} aria-controls="theme-preview" onClick={() => setActive(item.id)}><span>{String(index + 1).padStart(2, '0')}</span>{item.name}<ArrowUpRight size={16} aria-hidden="true" /></button>)}
      </div>
      <figure className="nlr-theme-preview" id="theme-preview">
        <div className="nlr-theme-preview__bar"><span aria-hidden="true">● ● ●</span><span>Ruang kelas · {theme.name}</span><span>Contoh tampilan</span></div>
        <img src={`/images/class-themes/${theme.id}.webp`} width="1120" height="1080" loading="lazy" decoding="async" alt={`Pratinjau ruang kelas ${theme.name}: latar, navigasi, dan kartu mengikuti tema ${theme.short}`} />
        <figcaption aria-live="polite"><strong>{theme.name}</strong><span>Tampilan kelas dengan data contoh. Pilih tema lain untuk membandingkan.</span></figcaption>
      </figure>
    </div>
  </section>;
}
