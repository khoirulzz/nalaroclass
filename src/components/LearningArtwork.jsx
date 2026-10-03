// Decorative study still life shared only by the public landing and auth pages.
export default function LearningArtwork({ compact = false }) {
  return <div className={`nlr-learning-art${compact ? ' nlr-learning-art--compact' : ''}`} aria-hidden="true">
    <svg viewBox="0 0 600 570" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="318" cy="282" r="218" fill="#E8EDFA" />
      <ellipse cx="311" cy="292" rx="272" ry="180" stroke="#8497C9" strokeDasharray="3 8" transform="rotate(-31 311 292)" />
      <g className="nlr-art-spark"><path d="M470 36V112M432 74H508M443 47L497 101M443 101L497 47" stroke="#EA775B" strokeWidth="14" /></g>
      <g className="nlr-art-book">
        <path d="M103 195L307 219L510 167L500 418L297 474L94 430Z" fill="#2349AC" />
        <path d="M108 184Q205 153 306 204Q407 137 500 159L491 404Q401 385 301 454Q204 404 104 417Z" fill="#FFFEF6" stroke="#243F80" strokeWidth="2" />
        <path d="M306 204L301 454" stroke="#9AA4B7" />
        <path d="M112 425Q211 412 297 465M309 462Q407 403 490 415" stroke="#A8B9E3" strokeWidth="3" />
        <path d="M137 221Q206 203 273 233M137 234Q206 216 273 246" stroke="#C4CCE0" strokeWidth="3" />
        <path d="M339 345L458 317M339 361L458 333M339 377L427 356" stroke="#B3BFD8" strokeWidth="3" />
        <path d="M138 370Q206 354 266 385M138 384Q206 368 227 390" stroke="#B3BFD8" strokeWidth="3" />
        <path d="M156 334L204 268L251 351Z" fill="#F0BC5C" />
        <path d="M165 338L211 276L255 353" stroke="#283F77" strokeWidth="2" />
        <circle cx="397" cy="261" r="48" fill="#B9CBB4" />
        <ellipse cx="397" cy="261" rx="25" ry="48" stroke="#4A6852" strokeWidth="1.5" />
        <path d="M350 261H444M358 236H436M358 286H436" stroke="#4A6852" strokeWidth="1.5" />
        <path d="M320 209L335 204L329 289L322 281L315 292Z" fill="#ED775C" />
      </g>
      <g className="nlr-art-pencil" transform="rotate(28 495 375)"><path d="M485 288H503V457L494 480L485 457Z" fill="#F3C766" /><path d="M485 288H492V457H485Z" fill="#DCA640" /><path d="M485 457H503L494 480Z" fill="#E5C6A0" /><path d="M491 472H497L494 480Z" fill="#233858" /><path d="M485 280Q494 270 503 280V296H485Z" fill="#ED775C" /></g>
      <g className="nlr-art-dot"><circle cx="91" cy="165" r="31" fill="#EC8268" /><path d="M79 165L88 174L105 155" stroke="#FFF9EA" strokeWidth="3" /></g>
      <path d="M139 486C92 486 75 466 84 443M84 443L71 450M84 443L91 456" stroke="#354F88" strokeWidth="2" strokeLinecap="round" />
      <circle cx="360" cy="65" r="7" fill="#E7B752" /><circle cx="546" cy="302" r="6" fill="#3157B8" />
      <path d="M230 105L246 88M232 88L244 105" stroke="#4564A9" strokeWidth="2" />
    </svg>
  </div>;
}
