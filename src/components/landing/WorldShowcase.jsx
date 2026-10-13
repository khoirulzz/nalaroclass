import { useState } from 'react';
import { ArrowRight, BookOpen, ClipboardList, MessageCircle, Palette } from 'lucide-react';
import { CLASS_THEMES } from '../../features/classes/classThemes';

// Lightweight, original landscape compositions. No classroom simulation is loaded on the landing.
function WorldArtwork({ id }) {
  const ocean = id === 'deep-current';
  const space = id === 'space';
  const city = id === 'prism-city' || id === 'superhero';
  const paper = id === 'paperbound';
  const pixel = id === 'pixel-frontier';
  const workshop = id === 'inventors-workshop';
  return <svg viewBox="0 0 560 260" fill="none" aria-hidden="true" className="nc-world-art">
    {ocean ? <>
      <path d="m180 0 180 260H170L85 0Zm170 0 80 260h90L430 0Z" fill="#9ce5df" opacity=".09" />
      <path d="M0 213c96-42 138 30 238 2s148-12 322-35v80H0Z" fill="#175975" /><path d="M0 241c160-29 251 12 365-15s144-19 195-11v45H0Z" fill="#20788a" />
      {[['110','165','1'],['335','100','.8'],['410','169','.65']].map(([x,y,s]) => <g key={x} transform={`translate(${x} ${y}) scale(${s})`}><path d="M-22 0c13-25 45-25 63 0-18 25-50 25-63 0Zm-1 0-23-18v36Z" fill={x === '335' ? '#e8b573' : '#8cd1dc'} /><path d="m4-16 11-12 8 13" fill="#dcefeb" /><circle cx="29" cy="-3" r="2.5" fill="#083d58" /></g>)}
      <g stroke="#a4e1d4" strokeWidth="6" strokeLinecap="round"><path d="M40 252c-5-36 23-37 16-71m-10 38-15-13m22-3 13-10M498 252c-5-24-24-30-17-57m13 35 18-14" /></g>
      <g stroke="#b3e9e1" opacity=".6">{[[80,80,5],[280,49,4],[463,82,6],[465,52,3],[227,167,3]].map(([x,y,r])=><circle key={`${x}${y}`} cx={x} cy={y} r={r}/>)}</g>
    </> : space ? <>
      <circle cx="380" cy="110" r="68" fill="#817bc1" /><path d="M278 150c-7-13 36-42 98-65s117-30 122-17-37 43-99 66-115 29-121 16Z" stroke="#d8bda0" strokeWidth="13" /><circle cx="147" cy="67" r="21" fill="#dfb685" />
      <g fill="#e6e4f7">{[[71,100],[235,54],[310,201],[450,210],[510,37],[188,195]].map(([x,y])=><path key={x} d={`M${x} ${y-4}v8m-4-4h8`} stroke="currentColor" strokeWidth="1.5" />)}</g><path d="M0 245c90-32 148-18 243-9s176-24 317-19v43H0Z" fill="#363864" />
    </> : city ? <>
      <circle cx="398" cy="68" r="39" fill="#efba82" opacity=".8" />
      {[['65',128,64],['145',76,81],['243',114,54],['318',92,77],['419',119,61],['499',152,48]].map(([x,y,w],i)=><g key={x}><path d={`M${x} 240V${y}l${w/2}-28 ${w/2} 28v${240-y}Z`} fill={['#496483','#6676aa','#93a0c1'][i%3]} /><path d={`M${Number(x)+w/2} ${y-28}v268`} stroke="#cdd6ee" opacity=".35" /><path d={`M${Number(x)+12} ${y+22}h${w-24}m-${w-24} 25h${w-24}m-${w-24} 25h${w-24}`} stroke="#dfe8ff" opacity=".55" /></g>)}<path d="M0 240h560v20H0Z" fill="#293f68" />
    </> : paper ? <>
      <circle cx="414" cy="66" r="37" fill="#d8a166" opacity=".6" /><path d="m0 248 135-177 142 177Z" fill="#c8b699" /><path d="m135 71 23 177h119Z" fill="#e5d4b6" /><path d="m193 260 170-189 184 189Z" fill="#8b9e87" /><path d="m363 71-29 189h213Z" fill="#afc2a8" /><g transform="translate(223 48)"><path d="m0 38 39-33 25 42Z" fill="#aa765c" /><path d="m39 5 46 9-21 33Z" fill="#dfb79b" /><path d="m39 5 25 42-8-35Z" fill="#785b4c" /></g>
    </> : pixel ? <>
      <path d="M420 34h42v42h-42Z" fill="#e8bd65" /><path d="M0 206h64v-38h64v38h64v-57h64v57h64v-23h64v23h64v-43h64v43h48v54H0Z" fill="#6d976c" /><path d="M0 231h112v-13h128v13h96v-16h128v16h96v29H0Z" fill="#37664d" /><path d="M70 89h20V69h40v20h20v20H70Zm234-42h20V27h40v20h20v20h-80Z" fill="#fffdf0" /><path d="M324 188v-63h-30v-22h-18V81h64v22h18v22h-18v63Z" fill="#41695b" />
    </> : workshop ? <>
      <g stroke="#31718a" opacity=".16">{[60,120,180,240,300,360,420,480].map(x=><path key={x} d={`M${x} 0v260M0 ${x/2}h560`} />)}</g><g stroke="#3d7c83" strokeWidth="2"><path d="m147 144 93-52 94 52-94 53Z" fill="#a5c5b9" /><path d="m147 144 93 53v47l-93-54Z" fill="#75a798" /><path d="m240 197 94-53v46l-94 54Z" fill="#467e7b" /><path d="M390 74v100h80" /><circle cx="390" cy="66" r="8" fill="#fff7db" /><circle cx="480" cy="174" r="8" fill="#fff7db" /></g><g transform="translate(224 115)"><circle r="30" fill="#e5bb75" /><circle r="14" fill="#f5e7c5" /><path d="M0-43v17m0 52v17M-43 0h17m52 0h17m-60-30 12 12m38 38 12 12m-62 0 12-12m38-38 12-12" stroke="#e5bb75" strokeWidth="12" /></g>
    </> : <>
      <circle cx="408" cy="68" r="44" fill={id === 'playground' ? '#e5aa8e' : '#d8b76a'} /><path d="M0 224c87-105 169-50 260-25s147-57 300-23v84H0Z" fill={id === 'studio' ? '#a6b4db' : '#8ca888'} /><path d="M0 254c97-50 138 3 229-22s208-3 331-14v42H0Z" fill={id === 'studio' ? '#657ba8' : '#53765d'} /><path d="m153 216 40-114 42 114Z" fill="#416553" /><path d="M194 212v40" stroke="#655c44" strokeWidth="7" /><path d="m291 229 26-78 29 78Z" fill="#627e63" />
    </>}
  </svg>;
}

export default function WorldShowcase() {
  const [active, setActive] = useState('deep-current');
  const theme = CLASS_THEMES.find(item => item.id === active);
  return <section className="nc-worlds nc-section" id="tema" aria-labelledby="nc-world-title"><div className="nc-container">
    <div className="nc-section-heading"><h2 id="nc-world-title">Ruang kelas dengan<br />karakter yang kamu pilih.</h2><p>Guru menentukan tema kelas. Warna dan suasananya mengikuti siswa saat membuka materi, tugas, dan kuis.</p></div>
    <div className="nc-world-layout"><div className="nc-world-picker"><div className="nc-world-picker-heading"><Palette size={20} /><span>Pilih preview tema</span></div><div role="group" aria-label="Tema kelas">{CLASS_THEMES.map(item => <button type="button" key={item.id} aria-pressed={active === item.id} onClick={() => setActive(item.id)}><span style={{ background: item.backdrop, borderColor: item.accent }} /><strong>{item.name}</strong>{active === item.id && <ArrowRight size={16} />}</button>)}</div><p>Preview ilustratif. Dunia interaktif tersedia di dalam ruang kelas.</p></div>
      <div className="nc-world-window" aria-live="polite"><div className="nc-window-bar"><span className="nc-window-dots"><i /><i /><i /></span><span>{theme.name}</span><span>Preview tema</span></div><div className="nc-world-banner" style={{ background: theme.backdrop, color: ['space','deep-current','prism-city'].includes(theme.id) ? '#fff' : '#243d37' }} key={theme.id}><div><small>Biologi X-A</small><h3>{theme.short}</h3><p>{theme.subtitle}</p></div><WorldArtwork id={theme.id} /></div><div className="nc-world-modules">{[[BookOpen,'Materi'],[ClipboardList,'Tugas & kuis'],[MessageCircle,'Diskusi']].map(([Icon,label])=><div key={label}><Icon size={22} strokeWidth={1.5} style={{ color: ['space','deep-current','prism-city'].includes(theme.id) ? '#346576' : theme.accent }}/><strong>{label}</strong><span>Dalam satu ruang kelas</span></div>)}</div></div>
    </div>
  </div></section>;
}
