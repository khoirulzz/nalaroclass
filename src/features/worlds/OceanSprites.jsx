/** Small original SVG creatures; no video, WebGL or remote sprite dependencies. */
export default function OceanSprites({ species = 'reef', className = '' }) {
  if (species === 'jellyfish') {
    return <svg className={className} viewBox="0 0 92 100" aria-hidden="true" focusable="false">
      <path d="M17 51Q15 11 46 11Q78 11 76 51Q46 68 17 51Z" fill="#f7b5cd" stroke="#d789ba" strokeWidth="3"/>
      <path d="M19 45Q22 18 45 18" fill="none" stroke="#ffedfa" strokeWidth="6" strokeLinecap="round" opacity=".8"/>
      <path d="M25 55Q18 70 29 85 M40 58Q35 79 41 93 M52 59Q58 76 52 90 M67 54Q75 72 66 87" stroke="#f9d8e7" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <circle cx="38" cy="46" r="3" fill="#644d7f"/><circle cx="55" cy="46" r="3" fill="#644d7f"/>
      <path d="M40 53q7 5 14 0" fill="none" stroke="#a36688" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>;
  }
  if (species === 'gold') {
    return <svg className={className} viewBox="0 0 112 70" aria-hidden="true" focusable="false">
      <g strokeLinejoin="round" strokeLinecap="round">
        <path className="lw-fish-tail" d="M33 34 4 10Q7 31 4 57L34 40Z" fill="#f3a369" stroke="#ca7f64" strokeWidth="2"/>
        <path d="M45 17 61 2 75 20Z" fill="#f2a46c"/><path d="M46 54 66 65 80 49Z" fill="#e7a97a"/>
        <path d="M25 34Q43 10 72 15Q100 15 108 34Q95 57 66 57Q41 56 25 34Z" fill="#ffcf8b" stroke="#da9771" strokeWidth="2"/>
        <path d="M46 22q16 13 0 27M65 18q15 16 0 34" fill="none" stroke="#fff1cb" strokeWidth="5" opacity=".8"/>
        <circle cx="92" cy="29" r="4.4" fill="#304859"/><circle cx="93" cy="27.5" r="1.6" fill="#fff"/>
      </g>
    </svg>;
  }
  if (species === 'blue') {
    return <svg className={className} viewBox="0 0 112 70" aria-hidden="true" focusable="false">
      <g strokeLinejoin="round">
        <path className="lw-fish-tail" d="M31 34 3 11 7 34 3 58 33 43Z" fill="#74c9d9" stroke="#30889b" strokeWidth="2"/>
        <path d="M46 19 57 4 74 19Z" fill="#8dd7e7"/>
        <path d="M26 34Q42 13 70 14Q95 17 108 34Q94 54 70 56Q39 55 26 34Z" fill="#8cdee5" stroke="#4aa5b9" strokeWidth="2"/>
        <path d="M40 33Q67 13 92 31Q71 52 42 44Z" fill="#60bed4" opacity=".58"/>
        <path d="M47 25Q59 31 48 47" fill="none" stroke="#dffaff" strokeWidth="4" opacity=".9"/>
        <circle cx="91" cy="30" r="4.5" fill="#234b65"/><circle cx="92" cy="28.5" r="1.5" fill="#fff"/>
      </g>
    </svg>;
  }
  return <svg className={className} viewBox="0 0 112 70" aria-hidden="true" focusable="false">
    <g strokeLinejoin="round" strokeLinecap="round">
      <path className="lw-fish-tail" d="M31 35 4 16 9 34 4 54 33 42Z" fill="#e88984" stroke="#c77779" strokeWidth="2"/>
      <path d="M49 19 64 5 75 20Z" fill="#f1b694"/>
      <path d="M25 35Q42 13 71 17Q95 18 107 35Q93 55 71 55Q42 54 25 35Z" fill="#f5b4aa" stroke="#d3888b" strokeWidth="2"/>
      <path d="M48 21Q54 35 48 50M68 20Q74 35 68 51" fill="none" stroke="#ffeadc" strokeWidth="6" opacity=".72"/>
      <circle cx="91" cy="30" r="4.5" fill="#32465b"/><circle cx="92" cy="28" r="1.5" fill="#fff"/>
    </g>
  </svg>;
}
