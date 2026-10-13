import { useState } from 'react';
import { ArrowRight, Check, CircleHelp, RotateCcw } from 'lucide-react';
const questions = [
  { label: 'Pilihan ganda', title: 'Apa peran tumbuhan dalam rantai makanan?', options: ['Produsen', 'Konsumen', 'Pengurai'], answer: 0, explanation: 'Tumbuhan menghasilkan makanan sendiri melalui fotosintesis, sehingga berperan sebagai produsen.' },
  { label: 'Pilihan gambar', title: 'Manakah bangun yang memiliki tiga sisi?', options: ['Lingkaran', 'Segitiga', 'Persegi'], answer: 1, explanation: 'Segitiga memiliki tiga sisi dan tiga sudut.' },
];
export default function LandingQuiz() {
  const [format, setFormat] = useState(0);
  const [selected, setSelected] = useState(null);
  const question = questions[format];
  return <div className="nc-quiz-demo"><div className="nc-quiz-demo-top"><span><CircleHelp size={17} />Coba contoh soal</span><span>Demo interaktif</span></div>
    <div className="nc-quiz-formats" role="group" aria-label="Pilih format demo kuis">{questions.map((q, i) => <button key={q.label} type="button" aria-pressed={format === i} onClick={() => { setFormat(i); setSelected(null); }}>{q.label}</button>)}</div>
    <h3>{question.title}</h3><div className={`nc-quiz-options${format ? ' nc-quiz-options--shapes' : ''}`}>{question.options.map((option, i) => <button type="button" key={option} aria-pressed={selected === i} className={selected === i ? (i === question.answer ? 'is-correct' : 'is-incorrect') : ''} onClick={() => setSelected(i)}>{format ? <svg viewBox="0 0 100 90" aria-hidden="true"><g fill="currentColor">{i === 0 ? <circle cx="50" cy="45" r="28" /> : i === 1 ? <path d="M50 12 85 75H15Z" /> : <rect x="21" y="16" width="58" height="58" rx="3" />}</g></svg> : <span className="nc-option-letter">{String.fromCharCode(65 + i)}</span>}<span>{option}</span>{selected === i && i === question.answer && <Check size={18} />}</button>)}</div>
    <div className="nc-quiz-response" aria-live="polite">{selected === null ? <p>Pilih jawaban untuk melihat umpan balik.<ArrowRight size={17} /></p> : <><strong>{selected === question.answer ? 'Jawabanmu tepat.' : 'Coba perhatikan lagi.'}</strong><p>{selected === question.answer ? question.explanation : 'Kamu dapat mencoba jawaban lain pada contoh ini.'}</p><button type="button" onClick={() => setSelected(null)}><RotateCcw size={14} />Ulangi contoh</button></>}</div>
  </div>;
}
