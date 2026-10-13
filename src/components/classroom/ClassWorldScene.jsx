import LivingWorldArtwork from '../../features/worlds/LivingWorldArtwork.jsx';
import '../../features/worlds/living-worlds-extended.css';
import DeepCurrentArtwork from '../../features/worlds/DeepCurrentArtwork.jsx';
/**
 * Five bespoke scalable classroom environments. Decorative, self-contained SVG:
 * no image network requests, no blurry raster scaling, and no borrowed characters.
 */
export default function ClassWorldScene({ themeId, className = '' }) {
  if (themeId === 'deep-current') return <DeepCurrentArtwork className={className} />;
  if (['prism-city','paperbound','pixel-frontier','inventors-workshop'].includes(themeId)) return <LivingWorldArtwork themeId={themeId} className={className} />;
  return <svg className={className} viewBox="0 0 400 190" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
    {themeId === 'superhero' && <g strokeLinejoin="round">
      <circle cx="284" cy="80" r="64" fill="#ffd46b" opacity=".92" />
      <path d="M244 15 260 38 245 51 269 47 279 63 286 38 307 33 284 25 279 7 271 24Z" fill="#fff2b7"/>
      <path d="M17 154V77h34v77M50 154V59h41v95M96 154V39h56v115M153 154V80h47v74M202 154V57h53v97M254 154V90h35v64M290 154V47h65v107M356 154V91h33v63" fill="#2e5b9a" stroke="#1e3765" strokeWidth="4"/>
      <path d="M95 40 125 22 154 40M290 48 321 30 357 48" fill="#254b87" stroke="#1e3765" strokeWidth="4"/>
      {Array.from({length:16},(_,i)=><rect key={i} x={31+(i%8)*40} y={94+Math.floor(i/8)*26} width="9" height="14" rx="1" fill="#8bc8ed" opacity=".85"/>)}
      <path d="M0 151h400v39H0Z" fill="#e65c48"/><path d="M0 162h400" stroke="#172f5e" strokeWidth="6"/>
      <path d="m21 42 21-28M13 62l35-7M366 18l-16 21M378 35l-18 17" stroke="#f3bb4e" strokeWidth="7" strokeLinecap="round"/>
    </g>}
    {themeId === 'playground' && <g strokeLinejoin="round">
      <path d="M0 154c85-73 150-59 214-16 72-45 129-28 186 5v47H0Z" fill="#92dac9"/>
      <path d="M0 170c85-45 151-18 225 2 57-26 110-32 175-11v29H0Z" fill="#4fafaf"/>
      <circle cx="305" cy="44" r="31" fill="#ffd99e"/>
      <path d="M66 98h100v57H66Z" fill="#fbd4e6"/><path d="m54 96 63-57 63 57Z" fill="#df73a1"/>
      <path d="M100 116h30v39h-30Z" fill="#9ccfe3"/><circle cx="123" cy="137" r="2" fill="#f7fbff"/>
      <path d="M229 153V85l58-29v97" fill="none" stroke="#f1b57a" strokeWidth="13" strokeLinecap="round"/>
      <path d="m230 85 55 69-55 0Z" fill="#ffc5a3"/><path d="M247 98h-50v11h50" fill="#f29b8a"/>
      <path d="M337 150V74" stroke="#956eaa" strokeWidth="8" strokeLinecap="round"/>
      <circle cx="337" cy="54" r="33" fill="#bfc9f0"/><circle cx="309" cy="62" r="24" fill="#d8d0fa"/><circle cx="358" cy="70" r="22" fill="#abc5ee"/>
      <path d="M19 57c6-16 29-16 36 0 13-10 34-1 34 12H15c-4-5-3-10 4-12ZM223 31c6-13 25-11 30 0 13-9 29 0 31 12h-65c-6-6-3-9 4-12Z" fill="#fff" opacity=".85"/>
      <circle cx="45" cy="156" r="8" fill="#ed83ab"/><circle cx="362" cy="156" r="9" fill="#ffbd69"/>
    </g>}
    {themeId === 'space' && <g strokeLinejoin="round">
      <circle cx="310" cy="61" r="47" fill="#625da9" stroke="#9a91e3" strokeWidth="2"/>
      <path d="M274 52c23-19 39-1 72-18M280 80c19-17 42-18 62-9" fill="none" stroke="#c4bafa" strokeWidth="9" opacity=".33"/>
      <ellipse cx="309" cy="62" rx="88" ry="17" transform="rotate(-24 309 62)" fill="none" stroke="#b3d9f7" strokeWidth="6"/>
      <path d="M0 170q102-49 201-10 91-35 199 9v21H0Z" fill="#273b71"/>
      <path d="M69 162q20-46 48-52 28 15 44 53" fill="#465aa0"/>
      <path d="M90 145V86h41v59M82 86l28-27 29 27" fill="#cbd9f8" stroke="#8294cb" strokeWidth="4"/>
      <rect x="97" y="97" width="26" height="26" rx="5" fill="#6baedb"/><path d="M90 141h41" stroke="#9fbce9" strokeWidth="5"/>
      {[[25,30,2],[56,48,3],[78,16,2],[141,31,2],[177,51,3],[203,13,2],[230,80,2],[362,21,3],[381,62,2],[352,112,2],[18,116,2],[208,114,2]].map(([x,y,r],i)=><circle key={i} cx={x} cy={y} r={r} fill="#e8eeff"/>)}
      <path d="m166 89 9-20 9 20 20 8-20 8-9 19-9-19-20-8Z" fill="#abf0e0"/>
      <path d="M19 66 33 49l12 16-13 15Z" fill="#f5d792"/>
      <path d="M0 161h400" fill="none" stroke="#8595d6" strokeWidth="3" opacity=".5"/>
    </g>}
    {themeId === 'fantasy' && <g strokeLinejoin="round">
      <circle cx="318" cy="49" r="28" fill="#ebd39c"/>
      <path d="M0 149q85-58 177 0 110-49 223 2v39H0Z" fill="#a3bc91"/>
      <path d="M0 171q60-38 140-7 115-37 260 5v21H0Z" fill="#6c9d7b"/>
      <path d="M133 157V73l61-48 58 49v83" fill="#f7e5c6" stroke="#805e42" strokeWidth="4"/>
      <path d="m119 76 73-59 74 59" fill="none" stroke="#6b5540" strokeWidth="9"/>
      <path d="M180 157v-49h30v49" fill="#876a50"/><path d="M153 90h16v20h-16ZM218 90h16v20h-16Z" fill="#b6ccac"/>
      <path d="M47 156V66" stroke="#5c6545" strokeWidth="11"/><path d="M16 106 44 26l33 80ZM18 132 44 58l35 74Z" fill="#488063" stroke="#315d50" strokeWidth="4"/>
      <path d="M345 159V71" stroke="#5c6545" strokeWidth="12"/><path d="M302 110 346 22l41 88ZM308 143 346 68l42 75Z" fill="#568b69" stroke="#315d50" strokeWidth="4"/>
      <path d="M276 168c-9-27 12-32 18-48 18 23 25 29 13 48" fill="#6d916b"/>
      <path d="m265 33 6-13 6 13 13 6-13 6-6 13-6-13-13-6Z" fill="#dfbd79"/>
    </g>}
    {themeId === 'studio' && <g strokeLinejoin="round">
      <rect x="25" y="45" width="139" height="108" rx="2" fill="#285dd9" transform="rotate(-9 95 99)"/>
      <rect x="37" y="59" width="111" height="78" rx="1" fill="#f8f2db" transform="rotate(-9 92 98)"/>
      <circle cx="88" cy="96" r="27" fill="#e87855"/><path d="m72 106 15-29 21 18" fill="none" stroke="#1f458a" strokeWidth="5"/>
      <rect x="176" y="18" width="130" height="125" rx="3" fill="#c4d96b" transform="rotate(8 241 80)"/>
      <rect x="196" y="37" width="94" height="88" fill="#f8fbf2" transform="rotate(8 243 81)"/>
      <path d="M218 63h53M218 81h38M218 99h48" stroke="#264fa1" strokeWidth="8" strokeLinecap="square" transform="rotate(8 244 80)"/>
      <path d="m322 145 26-105 29 8-26 104Z" fill="#f3b45d" stroke="#9d6537" strokeWidth="3"/>
      <path d="m324 147 15 21 13-17Z" fill="#f5e5be" stroke="#9d6537" strokeWidth="3"/>
      <circle cx="348" cy="23" r="16" fill="#f17d65"/>
      <path d="M0 177h400" stroke="#233764" strokeWidth="6"/>
      <path d="M11 19h29M25 4v30M360 168h30" stroke="#3869ca" strokeWidth="5"/>
    </g>}
  </svg>;
}
