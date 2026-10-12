import { motion, useReducedMotion } from 'framer-motion';
import { BookOpen, CheckCircle2, Sparkles, Users } from 'lucide-react';
export default function ClassroomEditorialArt() {
  const reduced = useReducedMotion();
  return <div className="nlr-editorial-art">
    <svg className="nlr-editorial-art__scene" viewBox="0 0 610 600" role="img" aria-label="Ilustrasi orisinal guru membawa tablet dengan dua siswa sedang belajar">
      <defs><linearGradient id="nlr-bg" x2="0.8" y2="1"><stop stopColor="#b9d4f0"/><stop offset="1" stopColor="#f6e7c8"/></linearGradient><linearGradient id="nlr-tablet" x2="1" y2="1"><stop stopColor="#253f78"/><stop offset="1" stopColor="#132448"/></linearGradient></defs>
      <rect x="22" y="20" width="565" height="556" rx="230" fill="url(#nlr-bg)"/><circle cx="472" cy="138" r="75" fill="#e9f4ff" opacity=".73"/><path d="M47 432c115-88 224-62 323-18 79 35 138 12 209-25v171H47z" fill="#d5edb6"/>
      <path d="M175 555c-23-108-12-193 28-252l108-22 89 35 61 239" fill="#e6a259"/><path d="M258 291c-31 3-49 18-53 53l-30 112 51 16 32-112z" fill="#cf8e4d"/><path d="M373 314c35 17 53 52 62 116l-45 11-34-105z" fill="#cf8e4d"/>
      <path d="M248 195c-12-48 0-103 58-114 62-12 109 18 107 87l-18 91-117 16z" fill="#232a39"/><ellipse cx="323" cy="205" rx="81" ry="99" fill="#bf7d55"/><path d="M243 174c16-84 127-100 169-20-42-12-73-34-103-30-14 28-38 38-66 50z" fill="#272b37"/><path d="M297 239q27 20 55-2" fill="none" stroke="#693e36" strokeWidth="5" strokeLinecap="round"/><circle cx="292" cy="199" r="5" fill="#3a2826"/><circle cx="357" cy="199" r="5" fill="#3a2826"/><path d="M302 279v43c17 28 45 26 66 0v-47" fill="#bd7951"/><path d="M288 311q44 35 87-2" fill="none" stroke="#fff5e8" strokeWidth="14"/>
      <g transform="rotate(-13 339 417)"><rect x="247" y="365" width="198" height="149" rx="17" fill="url(#nlr-tablet)" stroke="#fff" strokeWidth="5"/><rect x="262" y="381" width="168" height="114" rx="8" fill="#eff7ff"/><rect x="277" y="396" width="138" height="20" rx="5" fill="#4678de"/><rect x="277" y="430" width="56" height="47" rx="7" fill="#ffd18e"/><rect x="342" y="430" width="73" height="20" rx="5" fill="#a6dbca"/><rect x="342" y="457" width="73" height="20" rx="5" fill="#d5d6fa"/></g>
      <path d="M236 447q-30-6-45-25l-16 32q20 33 62 32" fill="#bf7d55"/><path d="M433 438q15-21 8-47l-30-5q-4 24-23 43" fill="#bf7d55"/>
      <g transform="translate(15 370) scale(.65)"><ellipse cx="110" cy="104" rx="58" ry="68" fill="#9d623f"/><path d="M57 84c-8-80 108-96 120-8-34-24-71-24-120 8z" fill="#232e39"/><path d="M49 157q50-40 112 0l38 144H11z" fill="#5eaa9a"/><circle cx="88" cy="107" r="4"/><circle cx="130" cy="107" r="4"/><path d="M92 133q16 13 32 0" fill="none" stroke="#653d2e" strokeWidth="4"/></g>
      <g transform="translate(493 389) scale(.58)"><ellipse cx="60" cy="89" rx="57" ry="65" fill="#ce956a"/><path d="M5 90q-16-87 55-87 80 4 59 95-22-38-52-35-32 18-62 27z" fill="#372e31"/><path d="M7 153q61-37 112 0l26 143H-18z" fill="#617abb"/><circle cx="41" cy="101" r="4"/><circle cx="80" cy="101" r="4"/><path d="M45 126q15 12 28 0" fill="none" stroke="#754d3a" strokeWidth="4"/></g>
    </svg>
    <motion.div className="nlr-editorial-art__float nlr-editorial-art__float--one" animate={reduced?{}:{y:[0,-9,0]}} transition={{duration:4.5,repeat:Infinity,ease:'easeInOut'}}><CheckCircle2 size={21}/><div><strong>Tugas selesai</strong><small>Kerja bagus hari ini!</small></div></motion.div>
    <motion.div className="nlr-editorial-art__float nlr-editorial-art__float--two" animate={reduced?{}:{y:[0,8,0]}} transition={{duration:5.3,repeat:Infinity,ease:'easeInOut'}}><Users size={21}/><div><strong>28 siswa aktif</strong><small>Kelas makin hidup</small></div></motion.div>
    <span className="nlr-editorial-art__spark" aria-hidden="true"><Sparkles size={32}/></span>
  </div>;
}
