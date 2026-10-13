/** Small world-native companions. All 4 use their own geometry and material. */
export default function LivingWorldSprites({ worldId }) {
  if (worldId === 'prism-city') return <svg viewBox="0 0 110 116" aria-hidden="true" focusable="false">
    <g stroke="#39406e" strokeWidth="2.5" strokeLinejoin="round">
      <path d="M55 4 91 35 96 86 54 110 14 85 19 32Z" fill="#cc8df2"/>
      <path d="M55 4 19 32 14 85 54 110Z" fill="#f6b8cc"/><path d="M55 4 91 35 96 86 54 110Z" fill="#82daea"/>
      <path d="M19 32 91 35 54 110Z" fill="#b9a5eb" opacity=".7"/>
      <path d="M55 4 54 110 14 85 19 32Z" fill="none" stroke="#fff0fa" strokeWidth="2" opacity=".7"/>
      <path d="m21 77-16 8 24 13M88 79l15 10-25 13" fill="none" strokeWidth="4"/>
      <circle cx="40" cy="65" r="3.6" fill="#343456" stroke="none"/><circle cx="70" cy="65" r="3.6" fill="#343456" stroke="none"/>
      <path d="M44 80q11 9 23 0" fill="none" strokeWidth="3"/>
      <path d="m47 11 8-5 7 6" fill="none" stroke="#fff6ed" strokeWidth="3"/>
    </g>
  </svg>;
  if (worldId === 'paperbound') return <svg viewBox="0 0 130 95" aria-hidden="true" focusable="false">
    <g strokeLinejoin="round" stroke="#94796a" strokeWidth="2">
      <path d="m7 47 46-16 8-26 26 33 36 6-42 13-20 30-12-28Z" fill="#fff5e4"/>
      <path d="M61 5 87 38 61 47Z" fill="#eeb9a7"/>
      <path d="M61 47 123 44 81 61Z" fill="#bdc9ae"/>
      <path d="M7 47 61 47 49 59Z" fill="#e1c09c"/>
      <path d="m49 59 12-12 20 14-20 26Z" fill="#f2cfaf"/>
      <path d="M53 31 61 5l-4 42" fill="#d9b38b"/>
      <path d="m7 47 40 18" fill="none" stroke="#fff5e4" strokeWidth="3"/>
      <circle cx="78" cy="39" r="2.7" fill="#655855" stroke="none"/>
    </g>
  </svg>;
  if (worldId === 'pixel-frontier') return <svg viewBox="0 0 80 94" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
    <path d="M16 81h20v11H12V81Zm30 0h20v11H43V81Z" fill="#333c69"/>
    <path d="M22 52h34v30H18V60h4Z" fill="#327db7"/>
    <path d="M17 53h9v21h-9ZM56 53h9v21h-9Z" fill="#f4ad74"/>
    <path d="M20 19h41v33H20Z" fill="#f6c59a"/>
    <path d="M16 16h46v12H16Zm5-10h33v12H21Z" fill="#453f6c"/>
    <rect x="24" y="35" width="8" height="8" fill="#243c56"/><rect x="47" y="35" width="8" height="8" fill="#243c56"/>
    <rect x="35" y="44" width="11" height="4" fill="#be6d75"/>
    <rect x="16" y="57" width="8" height="8" fill="#f5db8f"/><rect x="56" y="57" width="8" height="8" fill="#f5db8f"/>
    <path d="M25 51h30v10H25Z" fill="#efae72"/>
  </svg>;
  if (worldId === 'inventors-workshop') return <svg viewBox="0 0 110 119" aria-hidden="true" focusable="false">
    <g stroke="#2c4f63" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
      <path d="M30 81 12 92M80 81l18 11" fill="none" strokeWidth="8"/>
      <path d="M39 107v8M73 107v8" fill="none" strokeWidth="9"/>
      <rect x="26" y="72" width="59" height="38" rx="12" fill="#96bbb6"/>
      <rect x="17" y="27" width="76" height="55" rx="15" fill="#e7d6ae"/>
      <rect x="25" y="35" width="60" height="35" rx="11" fill="#3a7992"/>
      <circle cx="42" cy="52" r="6" fill="#e6fcfa" stroke="none"/><circle cx="69" cy="52" r="6" fill="#e6fcfa" stroke="none"/>
      <path d="M47 63q8 6 17 0" fill="none" stroke="#c0f7e7" strokeWidth="3"/>
      <path d="M55 27V12" fill="none" stroke="#b58b65" strokeWidth="5"/><circle cx="55" cy="10" r="7" fill="#ffcd7b"/>
      <rect x="39" y="87" width="34" height="12" rx="6" fill="#f1bc81"/>
      <circle cx="16" cy="95" r="5" fill="#e7a16a"/><circle cx="95" cy="95" r="5" fill="#e7a16a"/>
    </g>
  </svg>;
  return null;
}
