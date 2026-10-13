/**
 * NalaroClass official mascot set — five cohesive, original 2.5D SVG characters.
 * Simple silhouettes, shared 3.5px round strokes, consistent shadow and highlight.
 * Designed to remain legible at 48px and 180px without clipping.
 */
const labels = {
  superhero: 'Maskot superhero Nalaro dengan jubah koral',
  playground: 'Maskot awan biru yang bersahabat',
  space: 'Maskot robot astronaut dengan helm penjelajah',
  fantasy: 'Maskot rubah dengan mantel petualang',
  studio: 'Maskot pensil studio kreatif',
};

export default function ThemeMascot({ themeId = 'superhero', size = 128, className = '' }) {
  const t = Object.hasOwn(labels, themeId) ? themeId : 'superhero';
  const line = '#303B58';
  return <svg className={className} width={size} height={size} viewBox="0 0 180 180" role="img" aria-label={labels[t]} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id={t + '-light'} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffffff" stopOpacity=".65"/><stop offset="1" stopColor="#ffffff" stopOpacity="0"/></linearGradient>
      <linearGradient id={t + '-dim'} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#152744" stopOpacity="0"/><stop offset="1" stopColor="#152744" stopOpacity=".13"/></linearGradient>
    </defs>
    <ellipse cx="90" cy="164" rx="53" ry="8" fill="#233451" opacity=".13"/>
    {t === 'superhero' && <g stroke={line} strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M60 111 31 150l43-13 20 19 20-19 39 12-29-40Z" fill="#e75b4b"/>
      <path d="M59 127q10-24 31-24c23 0 34 12 38 24l-1 26H54Z" fill="#3569c2"/>
      <path d="m69 153-3 9 22 2 4-11M109 153l3 9-23 2-3-11" fill="#1d4388"/>
      <path d="M83 104v21l11 10 10-10v-21" fill="#e8ad83"/>
      <path d="M57 64q1-40 34-40 37 0 39 41l-10 34H66Z" fill="#263f80"/>
      <ellipse cx="93" cy="81" rx="35" ry="36" fill="#e9b18c"/>
      <path d="M57 72q8-28 25-29l10 10q15-13 35-1v20q-10-6-21-5l-13-6-12 8Z" fill="#293d75"/>
      <path d="M60 81q16-13 29-2l2 16q-18 9-31-2ZM97 78q16-12 29 2v13q-14 11-29 2Z" fill="#416fc4"/>
      <path d="M90 85h7" fill="none"/><circle cx="75" cy="87" r="3.4" fill="#27304d" stroke="none"/><circle cx="111" cy="86" r="3.4" fill="#27304d" stroke="none"/>
      <path d="M84 107q9 7 19 0" fill="none" stroke="#9d625c" strokeWidth="3"/>
      <path d="m93 120 10 10-10 13-10-13Z" fill="#ffd16b"/>
      <path d="M69 38q21-17 44 1" fill="none" stroke="#647fb9" strokeWidth="5" opacity=".75"/>
    </g>}
    {t === 'playground' && <g stroke={line} strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M64 104 47 144q5 12 18 9l19-21M116 103l17 41q-5 12-18 9l-19-21" fill="#86c7db"/>
      <path d="M62 122q28-11 56 0l10 33H52Z" fill="#7bd1bf"/>
      <path d="M47 66Q27 44 47 31q21-10 33 20M117 52q13-30 34-20 20 13-1 36" fill="#9fdbe9"/>
      <path d="M52 56q3-14 14-13M127 45q11-5 18 7" fill="none" stroke="#f8c1d8" strokeWidth="9"/>
      <path d="M38 94c-11-23 4-44 30-48 7-20 34-25 49-9 27-4 50 19 43 45 9 23-8 46-31 47H72c-27 0-44-14-34-35Z" fill="#b5e5ed"/>
      <path d="M44 80q5-25 30-25" fill="none" stroke="#fff" strokeWidth="7" opacity=".66"/>
      <ellipse cx="67" cy="94" rx="11" ry="7" fill="#f8b8cc" stroke="none"/>
      <ellipse cx="129" cy="94" rx="11" ry="7" fill="#f8b8cc" stroke="none"/>
      <ellipse cx="78" cy="80" rx="5" ry="7" fill="#36516c" stroke="none"/><ellipse cx="114" cy="80" rx="5" ry="7" fill="#36516c" stroke="none"/>
      <path d="M85 99q11 14 22-1" fill="none" stroke="#496078" strokeWidth="4"/>
      <path d="m98 18 7 12 14 3-11 9 2 14-12-6-12 6 3-14-11-9 14-3Z" fill="#ffde84" strokeWidth="3"/>
    </g>}
    {t === 'space' && <g stroke={line} strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M55 121 37 133l3 22 24 1 12-23M125 120l18 13-3 22-24 1-12-23" fill="#a5a9e5"/>
      <path d="M67 115q25-9 50 0l15 40H51Z" fill="#d5d8f5"/>
      <path d="m69 154-5 9 21 1 9-10M110 154l6 9 21-1-11-9" fill="#656fc4"/>
      <path d="M39 83q0-53 53-59 51 3 53 58l-7 36H45Z" fill="#ebeefb"/>
      <path d="M62 50q28-26 60 1" fill="none" stroke="#fff" strokeWidth="7" opacity=".8"/>
      <rect x="48" y="58" width="88" height="62" rx="30" fill="#454b91"/>
      <rect x="56" y="65" width="72" height="49" rx="24" fill="#96cce1"/>
      <path d="M60 81q18-18 48-15" fill="none" stroke="#e4f7ff" strokeWidth="6" opacity=".7"/>
      <circle cx="79" cy="90" r="4.2" fill="#344870" stroke="none"/><circle cx="105" cy="90" r="4.2" fill="#344870" stroke="none"/>
      <path d="M83 103q9 8 18 0" fill="none" stroke="#344870" strokeWidth="3"/>
      <path d="M93 22V13" fill="none" stroke="#6f77c9" strokeWidth="6"/>
      <circle cx="93" cy="11" r="6" fill="#ffe299" stroke="#6f77c9" strokeWidth="3"/>
      <circle cx="126" cy="135" r="7" fill="#fbd9a2"/>
      <path d="m21 41 4-10 4 10 10 4-10 4-4 10-4-10-10-4Z" fill="#eff6ff" stroke="none"/>
    </g>}
    {t === 'fantasy' && <g stroke={line} strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M59 117q29-18 61 0l15 38H45Z" fill="#568c68"/>
      <path d="m63 150-4 14 25 1 6-15M109 150l7 14 24-5-13-14" fill="#735942"/>
      <path d="M54 69 40 27l43 26M108 52l39-25-10 48" fill="#d98b47"/>
      <path d="m54 57-6-20 20 15M120 54l16-14-4 24" fill="#f6d2a7" stroke="none"/>
      <path d="M38 84q0-45 51-48 51 0 57 48l-13 37H55Z" fill="#df9a52"/>
      <path d="M38 80q2 36 54 45 53-9 54-45-22 21-54 4-32 17-54-4Z" fill="#f8dfbc"/>
      <path d="M43 68q10-35 47-40 40 0 54 39l-16-4q-37-13-68 3Z" fill="#427a61"/>
      <path d="M69 73q25-18 47 0" fill="none" stroke="#a5be89" strokeWidth="5"/>
      <circle cx="72" cy="88" r="4.5" fill="#454033" stroke="none"/><circle cx="115" cy="88" r="4.5" fill="#454033" stroke="none"/>
      <path d="m88 102 9 0-5 7Z" fill="#7d5540" stroke="none"/>
      <path d="M82 113q11 7 23-1" fill="none" stroke="#a56d53" strokeWidth="3"/>
      <path d="m82 126 10 8 11-8" fill="none" stroke="#efcf8c" strokeWidth="6"/>
      <path d="M129 126l24-11 9 26-23 10Z" fill="#f8e7bf" stroke="#a58858" strokeWidth="3"/>
      <path d="m140 128 9 4-7 10" fill="none" stroke="#b49461" strokeWidth="3"/>
    </g>}
    {t === 'studio' && <g stroke={line} strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M58 124 39 136l4 20 22 1 12-19M122 124l19 12-4 20-22 1-12-19" fill="#3875c0"/>
      <path d="M62 122q30-13 59 0l8 34H53Z" fill="#3975ce"/>
      <path d="m69 153-5 11 24 1 5-12M105 153l9 12 24-6-12-12" fill="#e8af60"/>
      <path d="M50 62q2-38 40-41 44 0 47 42l-7 42-39 27-37-27Z" fill="#ffd080"/>
      <path d="m51 70 24-45q24-16 49 2l17 43-20-11-29-4-27 5Z" fill="#f8bc59"/>
      <path d="M51 60q16-45 51-44 35-2 46 31" fill="none" stroke="#3667ba" strokeWidth="9"/>
      <path d="M84 14q29-10 50 13" fill="none" stroke="#80a8dc" strokeWidth="5"/>
      <rect x="67" y="78" width="51" height="30" rx="15" fill="#fbefce" stroke="none"/>
      <circle cx="80" cy="89" r="4.3" fill="#303b58" stroke="none"/><circle cx="108" cy="89" r="4.3" fill="#303b58" stroke="none"/>
      <path d="M85 101q10 9 19 0" fill="none" stroke="#9e765e" strokeWidth="3"/>
      <path d="m130 42 18-23 11 9-16 23Z" fill="#e97e6b"/>
      <path d="m148 19 8-10 11 10-8 9Z" fill="#3859a6"/>
      <path d="m15 73 17-11 10 18-17 11Z" fill="#bdd57c" stroke="none"/>
      <circle cx="149" cy="92" r="8" fill="#f2af8e" stroke="none"/>
    </g>}
    <ellipse cx="89" cy="153" rx="37" ry="6" fill={'url(#' + t + '-dim)'} opacity=".25"/>
  </svg>;
}
