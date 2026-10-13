import { useId } from 'react';

/** Original scalable reef environment: shared by previews, class banners and world UI. */
export default function DeepCurrentArtwork({ className = '' }) {
  const id = useId().replace(/:/g, '');
  return <svg className={className} viewBox="0 0 640 280" role="img" aria-label="Ilustrasi samudra dengan karang, anemon, bintang laut dan ikan" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id={id + '-sea'} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1d7899"/><stop offset=".58" stopColor="#126481"/><stop offset="1" stopColor="#083b57"/>
      </linearGradient>
      <linearGradient id={id + '-coral'} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffc3a5"/><stop offset="1" stopColor="#e98b87"/>
      </linearGradient>
    </defs>
    <rect width="640" height="280" rx="18" fill={'url(#' + id + '-sea)'} />
    <path d="M72 -12 130 -12 283 230 206 230ZM226 -12 262 -12 401 177 352 187Z" fill="#c2f6e5" opacity=".065"/>
    <path d="M0 254 Q85 211 156 241 T318 235 T478 245 T640 220 V280 H0Z" fill="#2b8d94"/>
    <path d="M0 265 Q112 249 188 262 T343 256 T500 263 T640 254 V280H0Z" fill="#76c8b0"/>
    <g opacity=".62" fill="none" stroke="#ade2db" strokeWidth="2.2">
      <circle cx="113" cy="45" r="8"/><circle cx="119" cy="19" r="4"/><circle cx="526" cy="105" r="6"/>
      <circle cx="486" cy="35" r="3"/><circle cx="502" cy="63" r="4"/>
    </g>
    <g strokeLinecap="round" strokeLinejoin="round">
      <path d="M42 264Q38 206 27 164 M49 265Q59 202 84 180 M60 267Q77 223 100 210" fill="none" stroke="#70bea5" strokeWidth="10"/>
      <path d="M515 266Q504 209 486 170 M532 267Q540 206 574 166 M548 268Q567 218 605 197" fill="none" stroke="#7bd0a9" strokeWidth="9"/>
      <path d="M63 266v-56M63 243Q31 224 33 200M65 244Q94 226 105 202" fill="none" stroke="#358d86" strokeWidth="8"/>
      <path d="M152 269Q157 228 132 202M151 248Q175 211 174 184M154 260Q195 250 215 210M154 264Q126 231 107 229" fill="none" stroke={'url(#' + id + '-coral)'} strokeWidth="10"/>
      <path d="M153 263Q153 231 146 210M176 217Q176 198 183 183" fill="none" stroke="#ffdbbc" strokeWidth="3" opacity=".7"/>
      <path d="M402 268Q398 224 422 195M401 251Q382 219 374 199M410 260Q442 254 453 217 M401 258Q391 241 365 244" fill="none" stroke="#a5d1a7" strokeWidth="12"/>
      <path d="M276 268Q265 244 248 239 M279 266Q283 223 284 211M285 262Q310 244 321 222" stroke="#5ed1be" fill="none" strokeWidth="9"/>
    </g>
    <g fill="#ffd399" stroke="#a87475" strokeWidth="2.5" strokeLinejoin="round" transform="translate(334 256) rotate(-16)">
      <path d="M0-21 7-8 22-7 11 3 15 19 0 12-14 20-10 4-21-7-7-9Z"/>
      <circle cy="-1" r="4" fill="#e9a878" stroke="none"/>
    </g>
    <g transform="translate(472 203)">
      <ellipse cx="0" cy="18" rx="30" ry="10" fill="#19495d" opacity=".3"/>
      <path d="M-33 15Q-33-21 0-24Q32-19 32 15" fill="#ecaa9e" stroke="#ce8b90" strokeWidth="2"/>
      <path d="M-21 17 Q-18 42-11 45 M-7 17Q-2 43 3 48 M8 17Q17 41 15 46 M25 17Q33 34 30 41" fill="none" stroke="#f5c2ab" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="-10" cy="3" r="3" fill="#594e62"/><circle cx="10" cy="3" r="3" fill="#594e62"/>
    </g>
    <g transform="translate(414 93) scale(.8)">
      <path d="m-27 0-22-15v30Z" fill="#f1b86f"/>
      <ellipse rx="31" ry="17" fill="#ffd58d"/>
      <path d="M-12 -11Q5-17 19-11" fill="none" stroke="#fff3c8" strokeWidth="4"/>
      <circle cx="18" cy="-3" r="3.3" fill="#26435a"/>
    </g>
    <g transform="translate(222 83) scale(.62)">
      <path d="m-27 0-22-15v30Z" fill="#7fd9e0"/>
      <ellipse rx="31" ry="17" fill="#a6edf1"/>
      <path d="m-5 -14 14 -12 8 18" fill="#6bc5d1"/>
      <circle cx="17" cy="-3" r="3.3" fill="#26435a"/>
    </g>
    <g opacity=".65" fill="#c2f5f0">
      <circle cx="187" cy="38" r="2"/><circle cx="374" cy="44" r="2"/><circle cx="584" cy="63" r="3"/>
      <circle cx="309" cy="115" r="2"/><circle cx="344" cy="95" r="1.5"/><circle cx="63" cy="113" r="2.5"/>
    </g>
  </svg>;
}
