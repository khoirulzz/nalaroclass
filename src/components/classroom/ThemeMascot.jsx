/**
 * Original layered vector character artwork for the five classroom worlds.
 * Pure SVG: crisp at any resolution, tiny payload, no network dependency.
 */
export default function ThemeMascot({ themeId = 'superhero', size = 128, className = '' }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 180 180" role="img" aria-label={ ({
    superhero: 'Maskot pahlawan orisinal dengan jubah merah',
    playground: 'Maskot makhluk biru yang ramah',
    space: 'Maskot astronaut penjelajah galaksi',
    fantasy: 'Maskot rubah penjelajah hutan',
    studio: 'Maskot pensil kreatif dengan baret',
  })[themeId] || 'Maskot kelas'} xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="92" cy="156" rx="61" ry="11" fill="#17243b" opacity=".12"/>
    {themeId === 'superhero' && <g strokeLinejoin="round" strokeLinecap="round">
      <path d="M57 113 17 148 55 135 76 148 89 119Z" fill="#d63e4d" stroke="#243a67" strokeWidth="5"/>
      <path d="m111 114 53 27-42-5-12 17-20-29Z" fill="#fb5d54" stroke="#243a67" strokeWidth="5"/>
      <path d="M56 111c0-19 19-28 37-28s39 10 39 30l-4 35H61Z" fill="#3268c5" stroke="#26365f" strokeWidth="5"/>
      <path d="M67 147h23v14H65ZM105 147h22v14h-23Z" fill="#142a63" stroke="#233152" strokeWidth="4"/>
      <path d="M75 105 50 118l-4 26 20 3 13-21ZM113 105l26 14 4 26-22 2-13-23Z" fill="#e9b384" stroke="#243a67" strokeWidth="4"/>
      <path d="M91 99 76 122l18 16 17-16Z" fill="#ffca45" stroke="#243a67" strokeWidth="3"/>
      <path d="m92 109 6 9-6 10-6-10Z" fill="#e84b3e"/>
      <path d="M54 67c-12-17-3-44 19-49 25-8 53 3 55 26 16 11 13 31 2 38Z" fill="#273a62" stroke="#213052" strokeWidth="4"/>
      <ellipse cx="93" cy="72" rx="38" ry="41" fill="#e6a478" stroke="#233658" strokeWidth="4"/>
      <path d="M55 68c8-10 20-12 35-10l5-15c10 18 23 21 36 20" fill="none" stroke="#243a67" strokeWidth="12"/>
      <path d="M61 73q13-7 27 1v14q-13 9-26-1ZM98 74q14-9 28-2l-2 16q-14 9-26-1Z" fill="#3268c5" stroke="#20305a" strokeWidth="4"/>
      <path d="M89 79h9" stroke="#20305a" strokeWidth="4"/><circle cx="76" cy="80" r="3.5" fill="#162950"/><circle cx="112" cy="80" r="3.5" fill="#162950"/>
      <path d="M85 96q10 9 21 0" fill="none" stroke="#8b453a" strokeWidth="4"/>
      <path d="m28 46 9-15-2 15 11 3-19 11 4-13Z" fill="#ffd14e" stroke="#d48527" strokeWidth="2"/>
    </g>}
    {themeId === 'playground' && <g strokeLinejoin="round" strokeLinecap="round">
      <path d="M55 105c-18 1-28 17-20 30l19 7 15-22ZM128 109c21-2 30 14 24 26l-22 10-15-25Z" fill="#7ad3ce" stroke="#427b92" strokeWidth="4"/>
      <ellipse cx="89" cy="126" rx="55" ry="43" fill="#75c7e4" stroke="#4878a7" strokeWidth="5"/>
      <path d="M65 146 58 163l25-3 4-13ZM113 146l13 16 20-7-16-19Z" fill="#4ba0c1" stroke="#4878a7" strokeWidth="4"/>
      <path d="M46 75C25 53 36 30 55 27l27 26ZM123 53c13-29 39-29 43-10l-18 39Z" fill="#8bd5e9" stroke="#4878a7" strokeWidth="5"/>
      <path d="M54 49c-14-21-6-30 3-35 11 4 18 16 18 30Z" fill="#f1a6cd"/>
      <path d="M130 43c7-19 16-21 27-18 5 12-2 26-17 34Z" fill="#f1a6cd"/>
      <ellipse cx="93" cy="89" rx="61" ry="57" fill="#9addf0" stroke="#4878a7" strokeWidth="5"/>
      <ellipse cx="71" cy="99" rx="13" ry="8" fill="#f5a6c8" opacity=".9"/><ellipse cx="117" cy="98" rx="13" ry="8" fill="#f5a6c8" opacity=".9"/>
      <ellipse cx="73" cy="77" rx="6" ry="9" fill="#274c66"/><ellipse cx="115" cy="77" rx="6" ry="9" fill="#274c66"/>
      <circle cx="75" cy="75" r="2.5" fill="#fff"/><circle cx="117" cy="75" r="2.5" fill="#fff"/>
      <path d="M83 96q11 18 24 0" fill="none" stroke="#39546b" strokeWidth="5"/>
      <path d="m86 37 8-16 8 16 17 3-13 12-1 14-11-8-12 7 1-14-11-10Z" fill="#ffd974" stroke="#dcb261" strokeWidth="3"/>
    </g>}
    {themeId === 'space' && <g strokeLinejoin="round" strokeLinecap="round">
      <path d="M51 116C33 78 52 55 81 51l39 4c28 11 41 37 23 69l-19 28H66Z" fill="#ece8ff" stroke="#6869ae" strokeWidth="5"/>
      <path d="M56 113 37 120l-4 28 23 7 20-27ZM128 111l24 12-3 25-25 6-19-27Z" fill="#bbb1f5" stroke="#6063a6" strokeWidth="5"/>
      <path d="m70 143-7 19 24 3 8-18ZM110 146l9 19 25-5-14-20Z" fill="#5969b6" stroke="#555e96" strokeWidth="5"/>
      <path d="M43 54C46 20 66 8 95 8s49 15 52 49l4 30-15 28H52L38 88Z" fill="#f5f3ff" stroke="#7673bc" strokeWidth="6"/>
      <ellipse cx="95" cy="74" rx="47" ry="46" fill="#433d85" stroke="#aaa0ea" strokeWidth="5"/>
      <ellipse cx="95" cy="74" rx="37" ry="37" fill="#b0ddf1"/>
      <path d="M58 78Q77 31 129 58" fill="none" stroke="#fff" strokeWidth="10" opacity=".55"/>
      <ellipse cx="95" cy="82" rx="26" ry="27" fill="#e4af89"/>
      <path d="M76 70q17-18 37 0" fill="none" stroke="#5a4a5c" strokeWidth="10"/>
      <circle cx="86" cy="82" r="3.5" fill="#392e4e"/><circle cx="105" cy="82" r="3.5" fill="#392e4e"/>
      <path d="M87 95q8 7 16-1" fill="none" stroke="#8d5e59" strokeWidth="3"/>
      <circle cx="135" cy="112" r="9" fill="#ffce74" stroke="#6363a5" strokeWidth="3"/>
      <path d="m22 31 4-13 5 13 13 3-13 6-5 13-4-13-13-6Z" fill="#e8dcff"/>
      <circle cx="161" cy="39" r="12" fill="#ffcb83"/><path d="M146 40q19-15 31 0" fill="none" stroke="#e9a46a" strokeWidth="3"/>
    </g>}
    {themeId === 'fantasy' && <g strokeLinejoin="round" strokeLinecap="round">
      <path d="M51 88 37 34 76 56ZM119 54l39-24-10 61Z" fill="#dc9b57" stroke="#704b35" strokeWidth="5"/>
      <path d="m50 78-7-32 23 15ZM130 58l18-18-8 35Z" fill="#f4c6a0"/>
      <path d="M45 107c-13 11-18 31-14 46l35 10 19-20Z" fill="#3a8767" stroke="#3c634c" strokeWidth="5"/>
      <path d="M91 112c-12 15-15 30-9 49h48c8-22 4-41-14-53Z" fill="#337853" stroke="#2b5743" strokeWidth="5"/>
      <path d="m82 145-13 17 25 4 10-14ZM113 147l11 17 26-10-19-15Z" fill="#70503a" stroke="#453b31" strokeWidth="4"/>
      <ellipse cx="92" cy="80" rx="57" ry="48" fill="#db9651" stroke="#704b35" strokeWidth="5"/>
      <path d="M41 77Q91 31 143 76q-9 36-50 44Q51 112 41 77Z" fill="#f8d3a2"/>
      <path d="M43 66q14-45 48-44c31-3 51 22 56 45l-13-4q-39-24-81 1Z" fill="#3b7857" stroke="#315e49" strokeWidth="5"/>
      <path d="M82 29q15-15 34 1" fill="none" stroke="#d7b56a" strokeWidth="7"/>
      <ellipse cx="71" cy="79" rx="6" ry="8" fill="#49352c"/><ellipse cx="115" cy="79" rx="6" ry="8" fill="#49352c"/>
      <path d="m88 96 10 0-5 7Z" fill="#68453a"/>
      <path d="M77 110q15 9 32-1" fill="none" stroke="#9b6949" strokeWidth="4"/>
      <path d="m87 123 11 9 10-9" fill="none" stroke="#d5b263" strokeWidth="6"/>
      <path d="M123 119 154 105l13 35-31 13Z" fill="#e9c488" stroke="#8b714c" strokeWidth="4"/>
      <path d="m139 120 12 8-10 12" fill="none" stroke="#a8814f" strokeWidth="3"/>
    </g>}
    {themeId === 'studio' && <g strokeLinejoin="round" strokeLinecap="round">
      <path d="M49 108 22 122l2 24 23 1 25-32ZM126 105l31 17-5 24-28-2-19-30Z" fill="#3b79d5" stroke="#243f77" strokeWidth="4"/>
      <path d="M58 106q32-18 68 1l4 47H52Z" fill="#3c70d7" stroke="#24457d" strokeWidth="5"/>
      <path d="m65 147-3 17 24 1 8-19ZM107 146l11 19 24-5-12-20Z" fill="#f3a63d" stroke="#89643b" strokeWidth="4"/>
      <path d="M53 63q2-34 34-41l44 9 8 54-42 50-45-42Z" fill="#ffd27d" stroke="#73523f" strokeWidth="5"/>
      <path d="M52 63 88 20l22 5-49 65Z" fill="#f9c85b"/>
      <path d="M100 22 121 2l23 26-21 20Z" fill="#f1716f" stroke="#9e4c5c" strokeWidth="4"/>
      <path d="m122 3 13-2 12 17-4 12Z" fill="#3154a9"/>
      <path d="M67 83c8-9 17-9 24-2M105 80c10-9 19-8 26 1" fill="none" stroke="#745444" strokeWidth="3"/>
      <circle cx="81" cy="90" r="5" fill="#363b5a"/><circle cx="115" cy="91" r="5" fill="#363b5a"/>
      <path d="M88 108q12 11 26-2" fill="none" stroke="#9c5a4e" strokeWidth="4"/>
      <path d="M36 45q-19-20-27 4 16 2 24 13Z" fill="#94ce9f"/>
      <circle cx="150" cy="72" r="13" fill="#f27565"/><circle cx="31" cy="76" r="7" fill="#7fc9d2"/>
    </g>}
  </svg>;
}
