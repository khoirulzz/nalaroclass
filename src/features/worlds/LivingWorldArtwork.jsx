import { useId } from 'react';

/**
 * Four original scalable scenes. Each world has its own material language:
 * faceted crystal, tactile cut paper, pixel blocks or isometric blueprints.
 * Pure SVG, no external images or network dependencies.
 */
export default function LivingWorldArtwork({ themeId, className = '' }) {
  const uid = useId().replace(/:/g, '');
  return <svg className={className} viewBox="0 0 640 280" role="img" aria-label={{
    'prism-city':'Kota prisma berlapis kaca geometris dan kristal warna',
    paperbound:'Lanskap origami dan karton bertumpuk dengan burung kertas',
    'pixel-frontier':'Petualangan pixel 16-bit dengan pegunungan dan desa',
    'inventors-workshop':'Bengkel penemuan isometrik dengan robot dan mesin',
  }[themeId] || 'Ilustrasi dunia kelas'} xmlns="http://www.w3.org/2000/svg">
    {themeId === 'prism-city' && <>
      <defs><linearGradient id={uid+'-prism'} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#26346e"/><stop offset="1" stopColor="#6a3a86"/></linearGradient></defs>
      <rect width="640" height="280" rx="18" fill={'url(#'+uid+'-prism)'}/>
      <path d="M0 205 96 92l93 113 76-122 108 126 102-109 165 96v84H0Z" fill="#303f88"/>
      <path d="M0 224 100 150l86 77 87-93 84 91 94-102 189 100v57H0Z" fill="#814c9c" opacity=".78"/>
      <path d="M0 249 142 195l112 44 90-69 124 72 77-75 95 69v44H0Z" fill="#f4aa73"/>
      <g strokeLinejoin="round" strokeWidth="2.5" stroke="#28265d">
        <path d="m68 196 50-98 46 95-44 33Z" fill="#ffb886"/><path d="m118 98 46 95-44 33Z" fill="#f2799c"/>
        <path d="m68 196 50-98 2 128Z" fill="#f5d29d"/><path d="m188 201 68-149 80 150-74 37Z" fill="#77daf2"/>
        <path d="m256 52 80 150-74 37Z" fill="#4f92c9"/><path d="m188 201 68-149 6 187Z" fill="#b0f0f5"/>
        <path d="m337 214 73-120 71 118-69 46Z" fill="#e7a0f6"/><path d="m410 94 71 118-69 46Z" fill="#ad78d2"/>
        <path d="m337 214 73-120 2 164Z" fill="#f6c5e1"/><path d="m483 222 67-160 66 148-64 42Z" fill="#ffd080"/>
        <path d="m550 62 66 148-64 42Z" fill="#f3828c"/><path d="m483 222 67-160 2 190Z" fill="#fff0be"/>
      </g>
      <g stroke="#cbeaff" strokeWidth="2" fill="none" opacity=".46"><path d="m118 98 138-46 154 42 140-32M164 193l92-141 80 150 74-108M336 202l145 10 69-150"/></g>
      <g fill="#fff9d1"><path d="m79 55 7-19 7 19 20 7-20 7-7 20-7-20-19-7Z"/><path d="m375 43 4-13 4 13 14 5-14 5-4 14-4-14-14-5Z"/><circle cx="509" cy="35" r="5"/></g>
      <g transform="translate(296 209)" stroke="#344068" strokeWidth="2.6" strokeLinejoin="round">
        <path d="m-32 1 30-50 32 49-28 29Z" fill="#e1c4ff"/><path d="m-32 1 30-50 2 79Z" fill="#c692ff"/><path d="m-2-49 32 49-30 30Z" fill="#8ad5ed"/>
        <circle cx="-10" cy="0" r="3" fill="#252852"/><circle cx="9" cy="0" r="3" fill="#252852"/><path d="M-9 12q8 6 17 0" fill="none"/>
      </g>
      <path d="M0 261 141 228 267 266 400 242 517 264 640 236v44H0Z" fill="#303e7e"/>
    </>}
    {themeId === 'paperbound' && <>
      <defs><pattern id={uid+'-paper'} width="11" height="11" patternUnits="userSpaceOnUse"><path d="M2 2h1M7 8h1" stroke="#7c715d" strokeWidth=".7" opacity=".17"/></pattern></defs>
      <rect width="640" height="280" rx="18" fill="#f7e9d4"/>
      <rect width="640" height="280" rx="18" fill={'url(#'+uid+'-paper)'}/>
      <circle cx="486" cy="55" r="42" fill="#e9c980"/><circle cx="480" cy="47" r="42" fill="#f8daa0"/>
      <path d="M0 170 120 90l106 102 129-92 144 72 141-94v202H0Z" fill="#dbc8af"/>
      <path d="M0 166 120 86l106 102 129-92 144 72 141-94v206H0Z" fill="#b0bca4"/>
      <path d="M0 221 110 169l119 52 125-79 145 59 141-47v126H0Z" fill="#a3b2a0"/>
      <path d="M0 214 110 162l119 52 125-79 145 59 141-47v133H0Z" fill="#da987b"/>
      <path d="M0 250 170 202l95 39 137-36 115 33 123-37v79H0Z" fill="#d1c1a2"/>
      <path d="M0 244 170 195l95 39 137-36 115 33 123-37v86H0Z" fill="#9ab19b"/>
      <g transform="translate(300 164)" stroke="#806f64" strokeWidth="2" strokeLinejoin="round">
        <path d="M-48 14-18-42 38-52 70-9 18 30-48 14Z" fill="#f9ddb8"/>
        <path d="m-18-42 18 58-48-2Z" fill="#eca9a3"/><path d="m-18-42 56-10L0 16Z" fill="#fff0d8"/>
        <path d="M0 16 70-9 18 30Z" fill="#d6b38f"/><path d="m38-52 32 43-70 25Z" fill="#e6c5a2"/>
      </g>
      <g transform="translate(137 74) rotate(-14)" strokeLinejoin="round">
        <path d="m-41 0 25-14 16-26 8 29 44 4-32 12-19 31-15-29Z" fill="#fbf8ea" stroke="#b4aba0" strokeWidth="2"/>
        <path d="m0-40 8 29 44 4L2 4Z" fill="#f1c09a"/><path d="M-41 0 2 4l-16 3Z" fill="#dfac8c"/>
        <circle cx="18" cy="-8" r="2" fill="#5e606a"/>
      </g>
      <g transform="translate(516 114) scale(.69) rotate(18)" strokeLinejoin="round">
        <path d="m-41 0 25-14 16-26 8 29 44 4-32 12-19 31-15-29Z" fill="#dfe7dd" stroke="#869a8c" strokeWidth="2"/>
        <path d="m0-40 8 29 44 4L2 4Z" fill="#9abbb1"/><circle cx="18" cy="-8" r="2" fill="#5e606a"/>
      </g>
      <g fill="#fff4de" stroke="#ae9175" strokeWidth="1.7"><path d="M46 145 67 129l26 23-21 18Z"/><path d="M542 179 566 157l35 18-20 29Z"/></g>
      <path d="M0 265c160-21 290-17 380-8s165 1 260-9v32H0Z" fill="#dbc8aa"/>
    </>}
    {themeId === 'pixel-frontier' && <>
      <rect width="640" height="280" rx="15" fill="#bde6e8" shapeRendering="crispEdges"/>
      <path d="M0 107h85V87h33V65h75v22h46v20h111V91h68v16h125V80h47v27h50v35H0Z" fill="#e9f4e4" shapeRendering="crispEdges"/>
      <path d="M0 198h76v-32h60v-28h60v-31h58v31h36v25h61v35h68v-32h50v-25h49v-24h45v24h77v139H0Z" fill="#679ab5" shapeRendering="crispEdges"/>
      <path d="M0 220h45v-28h63v29h65v-32h100v29h86v-29h63v27h87v-32h131v96H0Z" fill="#609d81" shapeRendering="crispEdges"/>
      <path d="M0 237h105v-13h80v13h92v-15h69v15h76v-14h118v17h100v40H0Z" fill="#92b775" shapeRendering="crispEdges"/>
      <path d="M0 258h76v-14h136v14h96v-15h85v15h145v-15h102v37H0Z" fill="#5f8b68" shapeRendering="crispEdges"/>
      <g shapeRendering="crispEdges">
        <path d="M120 227v-68h20v-25h31v25h20v68Z" fill="#a6725d"/><path d="M110 160v-21h21v-21h50v21h22v21Z" fill="#d9a479"/>
        <rect x="147" y="183" width="17" height="44" fill="#4a5b72"/><rect x="123" y="170" width="14" height="14" fill="#dff2e7"/>
        <path d="M443 245v-65h18v-23h32v23h20v65Z" fill="#749779"/><path d="M430 183v-21h24v-18h43v18h27v21Z" fill="#456c5e"/>
        <rect x="461" y="193" width="18" height="24" fill="#d6efd4"/>
        <rect x="54" y="187" width="13" height="52" fill="#785b58"/><rect x="32" y="163" width="56" height="31" fill="#3f8b68"/><rect x="43" y="140" width="35" height="25" fill="#58a779"/>
        <rect x="553" y="201" width="12" height="40" fill="#6c6456"/><rect x="533" y="181" width="49" height="22" fill="#428b6a"/><rect x="545" y="160" width="25" height="25" fill="#5fa776"/>
        <rect x="316" y="57" width="13" height="13" fill="#ffecad"/><rect x="329" y="70" width="13" height="13" fill="#ffecad"/>
        <rect x="296" y="86" width="9" height="9" fill="#fff8dd"/><rect x="515" y="68" width="10" height="10" fill="#f8df8f"/>
      </g>
      <g transform="translate(354 209)" shapeRendering="crispEdges">
        <rect x="-20" y="-20" width="40" height="34" fill="#edac77"/><rect x="-17" y="-24" width="33" height="10" fill="#684e73"/>
        <rect x="-24" y="11" width="48" height="20" fill="#355d9f"/><rect x="-27" y="31" width="20" height="8" fill="#403f62"/><rect x="7" y="31" width="20" height="8" fill="#403f62"/>
        <rect x="-10" y="-8" width="6" height="6" fill="#253650"/><rect x="9" y="-8" width="6" height="6" fill="#253650"/>
        <rect x="-1" y="1" width="8" height="4" fill="#da776f"/>
      </g>
    </>}
    {themeId === 'inventors-workshop' && <>
      <defs><pattern id={uid+'-grid'} width="22" height="22" patternUnits="userSpaceOnUse"><path d="M22 0H0V22" stroke="#97c0d0" fill="none" strokeWidth=".75" opacity=".3"/></pattern></defs>
      <rect width="640" height="280" rx="18" fill="#163e5b"/><rect width="640" height="280" fill={'url(#'+uid+'-grid)'}/>
      <g strokeLinejoin="round" stroke="#94c8cf" strokeWidth="2.5">
        <path d="m46 213 163-91 176 90-169 85Z" fill="#315d75"/>
        <path d="m209 122 5-84 177 86-6 88Z" fill="#376e83"/><path d="m214 38 173-24 177 89-173 21Z" fill="#d4a977"/>
        <path d="m391 124 173-21-4 105-175 4Z" fill="#23536c"/>
        <path d="m64 209 143-79 115 63-146 77Z" fill="#659198"/>
      </g>
      <g stroke="#31536e" strokeWidth="3" strokeLinejoin="round">
        <path d="m126 140 87-48 80 40-87 52Z" fill="#d6a97c"/><path d="m126 140 80 44v39l-80-40Z" fill="#8aafa8"/><path d="m206 184 87-52v40l-87 51Z" fill="#9ab8b1"/>
        <path d="m316 127 55-31 58 31-56 34Z" fill="#a4c5b4"/><path d="m316 127 57 34v45l-57-33Z" fill="#4d8892"/><path d="m373 161 56-34v46l-56 33Z" fill="#6e9d9d"/>
      </g>
      <g transform="translate(222 125)" strokeLinejoin="round" stroke="#284660" strokeWidth="3">
        <circle r="36" fill="#f1c081"/><circle r="23" fill="#a87863"/><circle r="9" fill="#e7e4bf"/>
        {Array.from({length:8},(_,i)=><rect key={i} x="-6" y="-45" width="12" height="17" rx="2" fill="#e9b480" transform={'rotate('+(i*45)+')'}/>)}
      </g>
      <g transform="translate(470 159)" stroke="#2a4a65" strokeWidth="3" strokeLinejoin="round">
        <path d="m-33 9 33-19 36 19v38l-35 21-34-21Z" fill="#c6d7cd"/>
        <path d="m-33 9 33 20 36-20" fill="none"/><path d="M0 29v39" fill="none"/>
        <rect x="-24" y="-35" width="49" height="34" rx="8" fill="#e9d6b4"/><rect x="-18" y="-28" width="36" height="20" rx="5" fill="#3d7891"/>
        <circle cx="-8" cy="-19" r="4" fill="#e7f7ec" stroke="none"/><circle cx="9" cy="-19" r="4" fill="#e7f7ec" stroke="none"/>
        <path d="M0-35v-13" fill="none"/><circle cy="-50" r="5" fill="#f4c37e"/>
      </g>
      <path d="m87 73 56-26 56 27m262-20 46-19 44 22" fill="none" stroke="#80ced1" strokeDasharray="8 7" strokeWidth="2" opacity=".76"/>
      <g fill="#ffc984"><circle cx="91" cy="72" r="4"/><circle cx="552" cy="57" r="5"/></g>
      <path d="M0 262 172 244l152 26 169-33 147 21v22H0Z" fill="#12344f"/>
    </>}
  </svg>;
}
