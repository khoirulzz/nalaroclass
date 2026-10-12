import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clipboard,
  ClipboardCheck,
  FileQuestion,
  ListChecks,
  PencilRuler,
  Sparkles,
  Table2,
} from 'lucide-react';
import { Badge, Button, Card, Input, PageHeader, ProcessLoader, SectionHeader, Tabs, Textarea } from '../../components/ui';
import { ArrowRightIcon } from '../../components/icons';
import { askQuizzyAi } from '../../services/ai.service';

const MAX_CONTEXT_LENGTH = 5000;

const emptyForm = {
  topic: '',
  gradeLevel: 'SMP kelas 7',
  subject: '',
  duration: '2 x 40 menit',
  learningGoal: '',
  studentContext: '',
  constraints: '',
  reference: '',
};

const previewTabs = [
  { value: 'plan', label: 'Rencana' },
  { value: 'materials', label: 'Materi' },
  { value: 'quiz', label: 'Kuis' },
  { value: 'task', label: 'Tugas' },
  { value: 'rubric', label: 'Rubrik' },
];

const fallbackPlan = {
  overview: '',
  objectives: [],
  lessonFlow: [],
  materials: [],
  activities: [],
  quiz: { title: '', questions: [] },
  task: { title: '', instructions: [], submission: '', successCriteria: [], estimatedMinutes: '' },
  assessment: { diagnostic: [], formative: [], summative: [], rubric: [] },
  differentiation: { support: [], challenge: [], accessibility: [] },
  schedule: [],
  teacherNotes: [],
};

const safeArray = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);
const field = (value, fallback = '-') => (value === 0 || value === false || value ? String(value) : fallback);

function parsePlan(content) {
  const source = String(content || '').replace(/^```json|```$/g, '').trim();
  try {
    return { ...fallbackPlan, ...JSON.parse(source) };
  } catch {
    return { ...fallbackPlan, overview: source };
  }
}

function bulletLines(items, mapItem = (item) => item) {
  const values = safeArray(items).map(mapItem).filter(Boolean);
  return values.length ? values.map((item) => `- ${item}`).join('\n') : '-';
}

function copyPlanText(plan) {
  const quiz = plan.quiz || {};
  const task = plan.task || {};
  const assessment = plan.assessment || {};
  return [
    `Ringkasan\n${plan.overview || '-'}`,
    `Tujuan\n${bulletLines(plan.objectives)}`,
    `Alur Pembelajaran\n${bulletLines(plan.lessonFlow, (item) => `${field(item.phase, 'Tahap')} (${field(item.minutes)} menit): ${field(item.activity)}`)}`,
    `Materi\n${bulletLines(plan.materials, (item) => `${field(item.title)} - ${field(item.format, 'bahan')}: ${safeArray(item.outline).join('; ')}`)}`,
    `Kuis\n${field(quiz.title, 'Kuis singkat')}\n${bulletLines(quiz.questions, (item) => `${field(item.prompt)} Jawaban: ${field(item.correctAnswer)}`)}`,
    `Tugas\n${field(task.title, 'Tugas')}\n${bulletLines(task.instructions)}\nProduk: ${field(task.submission)}`,
    `Rubrik\n${bulletLines(assessment.rubric, (item) => `${field(item.criterion)}: Mahir - ${field(item.excellent)} | Berkembang - ${field(item.developing)} | Butuh bantuan - ${field(item.needsSupport)}`)}`,
    `Catatan Guru\n${bulletLines(plan.teacherNotes)}`,
  ].join('\n\n');
}

function StudioBlock({ title, icon: Icon, children, wide = false }) {
  return (
    <Card className={`qz-studio-block${wide ? ' qz-studio-block--wide' : ''}`}>
      <div className="qz-studio-block__head"><Icon size={18} /><h3>{title}</h3></div>
      {children}
    </Card>
  );
}

function PlainList({ items, empty = 'Belum ada isi.' }) {
  const values = safeArray(items);
  return values.length ? <ul className="qz-studio-list">{values.map((item, index) => <li key={index}>{item}</li>)}</ul> : <p className="qz-studio-empty">{empty}</p>;
}

function LessonFlow({ items }) {
  const values = safeArray(items);
  return (
    <StudioBlock title="Alur pembelajaran" icon={CalendarDays} wide>
      {values.length ? (
        <ol className="qz-studio-flow">
          {values.map((item, index) => (
            <li key={`${item.phase || 'phase'}-${index}`}>
              <span>{field(item.minutes)} menit</span>
              <div>
                <strong>{field(item.phase, 'Tahap belajar')}</strong>
                <p>{field(item.activity)}</p>
                <small>Guru: {field(item.teacherMove)}<br />Siswa: {field(item.studentMove)}</small>
              </div>
            </li>
          ))}
        </ol>
      ) : <p className="qz-studio-empty">Belum ada alur.</p>}
    </StudioBlock>
  );
}

function MaterialsPanel({ items }) {
  const values = safeArray(items);
  return (
    <StudioBlock title="Draft materi ajar" icon={BookOpen} wide>
      {values.length ? (
        <div className="qz-studio-materials">
          {values.map((item, index) => (
            <article key={`${item.title || 'material'}-${index}`}>
              <div><Badge tone="primary">{field(item.format, 'bahan')}</Badge><strong>{field(item.title, 'Materi ajar')}</strong></div>
              <PlainList items={item.outline} />
              {safeArray(item.studentHandout).length ? <section><b>Handout siswa</b><PlainList items={item.studentHandout} /></section> : null}
              {safeArray(item.teacherScript).length ? <section><b>Narasi guru</b><PlainList items={item.teacherScript} /></section> : null}
            </article>
          ))}
        </div>
      ) : <p className="qz-studio-empty">Belum ada materi.</p>}
    </StudioBlock>
  );
}

function QuizPanel({ quiz = {} }) {
  const questions = safeArray(quiz.questions);
  return (
    <StudioBlock title={quiz.title || 'Draft kuis'} icon={FileQuestion} wide>
      {questions.length ? (
        <div className="qz-studio-questions">
          {questions.map((item, index) => (
            <article key={`${item.prompt || 'question'}-${index}`}>
              <span>Soal {index + 1} - {field(item.type, 'pertanyaan')} - {field(item.points, 10)} poin</span>
              <strong>{field(item.prompt)}</strong>
              {safeArray(item.choices).length ? <PlainList items={item.choices.map((choice) => `Pilihan: ${choice}`)} /> : null}
              <p><b>Jawaban:</b> {field(item.correctAnswer)}</p>
              <p><b>Pembahasan:</b> {field(item.explanation)}</p>
            </article>
          ))}
        </div>
      ) : <p className="qz-studio-empty">Belum ada draf kuis.</p>}
    </StudioBlock>
  );
}

function TaskPanel({ task = {} }) {
  return (
    <StudioBlock title={task.title || 'Draft tugas'} icon={Clipboard} wide>
      <div className="qz-studio-task">
        <div><b>Instruksi</b><PlainList items={task.instructions} /></div>
        <div><b>Produk dikumpulkan</b><p>{field(task.submission)}</p></div>
        <div><b>Kriteria berhasil</b><PlainList items={task.successCriteria} /></div>
        <div><b>Estimasi waktu</b><p>{field(task.estimatedMinutes)} menit</p></div>
      </div>
    </StudioBlock>
  );
}

function RubricPanel({ assessment = {} }) {
  const rubric = safeArray(assessment.rubric);
  return (
    <StudioBlock title="Asesmen dan rubrik" icon={Table2} wide>
      <div className="qz-studio-assessment">
        <div><strong>Diagnostik</strong><PlainList items={assessment.diagnostic} /></div>
        <div><strong>Formatif</strong><PlainList items={assessment.formative} /></div>
        <div><strong>Sumatif</strong><PlainList items={assessment.summative} /></div>
      </div>
      {rubric.length ? (
        <div className="qz-studio-rubric">
          {rubric.map((item, index) => (
            <article key={`${item.criterion || 'criterion'}-${index}`}>
              <div><strong>{field(item.criterion, 'Kriteria')}</strong>{item.weight ? <Badge>{item.weight}</Badge> : null}</div>
              <p><b>Mahir:</b> {field(item.excellent)}</p>
              <p><b>Berkembang:</b> {field(item.developing)}</p>
              <p><b>Butuh bantuan:</b> {field(item.needsSupport)}</p>
            </article>
          ))}
        </div>
      ) : null}
    </StudioBlock>
  );
}

function PlanPanel({ plan }) {
  return (
    <div className="qz-studio-preview__grid">
      <StudioBlock title="Tujuan pembelajaran" icon={CheckCircle2}><PlainList items={plan.objectives} /></StudioBlock>
      <LessonFlow items={plan.lessonFlow} />
      <StudioBlock title="Aktivitas kelas" icon={PencilRuler}><PlainList items={safeArray(plan.activities).map((item) => `${field(item.title, 'Aktivitas')}: ${field(item.purpose)} ${safeArray(item.steps).join(' ')}`)} /></StudioBlock>
      <StudioBlock title="Diferensiasi" icon={Sparkles}>
        <PlainList items={[
          ...safeArray(plan.differentiation?.support).map((item) => `Dukungan: ${item}`),
          ...safeArray(plan.differentiation?.challenge).map((item) => `Tantangan: ${item}`),
          ...safeArray(plan.differentiation?.accessibility).map((item) => `Aksesibilitas: ${item}`),
        ]} />
      </StudioBlock>
      <StudioBlock title="Jadwal modul" icon={CalendarDays}><PlainList items={safeArray(plan.schedule).map((item) => `${field(item.week, 'Minggu')} - ${field(item.focus)}: ${field(item.deliverable)}`)} /></StudioBlock>
      <StudioBlock title="Catatan guru" icon={Clipboard}><PlainList items={plan.teacherNotes} /></StudioBlock>
    </div>
  );
}

function PlanPreview({ plan, onCopy, copied }) {
  const [tab, setTab] = useState('plan');
  return (
    <section className="qz-studio-preview">
      <div className="qz-studio-preview__head">
        <div>
          <span className="qz-eyebrow">DRAFT SIAP DITINJAU</span>
          <h2>Paket ajar dari Teaching Studio</h2>
          <p>{plan.overview || 'Draft akan muncul setelah dibuat.'}</p>
        </div>
        <Button variant="secondary" onClick={onCopy}>{copied ? <ClipboardCheck size={17} /> : <Clipboard size={17} />}{copied ? 'Tersalin' : 'Salin paket'}</Button>
      </div>
      <div className="qz-studio-preview__toolbar">
        <Tabs items={previewTabs} value={tab} onChange={setTab} label="Bagian draft Teaching Studio" />
      </div>
      {tab === 'plan' ? <PlanPanel plan={plan} /> : null}
      {tab === 'materials' ? <MaterialsPanel items={plan.materials} /> : null}
      {tab === 'quiz' ? <QuizPanel quiz={plan.quiz} /> : null}
      {tab === 'task' ? <TaskPanel task={plan.task} /> : null}
      {tab === 'rubric' ? <RubricPanel assessment={plan.assessment} /> : null}
    </section>
  );
}

export default function TeacherStudio() {
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const context = useMemo(() => [
    `Topik: ${form.topic}`,
    `Mata pelajaran: ${form.subject || '-'}`,
    `Jenjang/kelas: ${form.gradeLevel}`,
    `Durasi: ${form.duration}`,
    `Tujuan awal guru: ${form.learningGoal || '-'}`,
    `Kondisi siswa: ${form.studentContext || '-'}`,
    `Batasan atau kebutuhan khusus: ${form.constraints || '-'}`,
    `Referensi guru: ${form.reference.slice(0, MAX_CONTEXT_LENGTH) || '-'}`,
  ].join('\n'), [form]);

  const change = (name) => (event) => setForm((current) => ({ ...current, [name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setCopied(false);
    try {
      const instruction = [
        'Buat paket draft mengajar yang bisa langsung ditinjau guru.',
        'Wajib mencakup rencana ajar, materi ajar, kuis singkat, tugas, rubrik, diferensiasi, dan catatan pelaksanaan.',
        'Utamakan aktivitas kreatif, asesmen bermakna, serta instruksi yang jelas untuk guru dan siswa.',
        'Jangan mengarang data siswa, angka capaian, atau kebijakan sekolah yang tidak diberikan guru.',
      ].join(' ');
      const response = await askQuizzyAi({ task: 'teaching_plan', context, instruction });
      setResult(parsePlan(response.content));
    } catch (caught) {
      setError(caught?.message || 'Teaching Studio belum dapat membuat draft. Coba lagi sebentar.');
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard?.writeText(copyPlanText(result));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="qz-dashboard qz-enter">
      <PageHeader
        eyebrow="Nalaro Teaching Studio"
        title="Buat paket ajar tanpa mulai dari halaman kosong."
        description="Rancang draft rencana ajar, materi, kuis, tugas, dan rubrik dari satu brief. Hasil AI tetap perlu ditinjau dan disesuaikan oleh guru."
        actions={<Link className="qz-text-link" to="/teacher/classes">Buka kelas <ArrowRightIcon size={16} /></Link>}
      />
      <div className="qz-studio-layout">
        <Card className="qz-studio-form-card">
          <SectionHeader title="Brief pembelajaran" description="Semakin jelas konteksnya, semakin siap draftnya untuk dipakai." />
          {error ? <div className="qz-inline-state qz-inline-state--error" role="alert">{error}</div> : null}
          <form className="qz-studio-form" onSubmit={submit}>
            <Input label="Topik utama" value={form.topic} onChange={change('topic')} maxLength={120} placeholder="Contoh: Ekosistem dan rantai makanan" required />
            <div className="qz-studio-form__row">
              <Input label="Mata pelajaran" value={form.subject} onChange={change('subject')} maxLength={80} placeholder="IPA, Bahasa Indonesia, PPKn..." />
              <Input label="Jenjang / kelas" value={form.gradeLevel} onChange={change('gradeLevel')} maxLength={80} />
            </div>
            <Input label="Durasi" value={form.duration} onChange={change('duration')} maxLength={80} />
            <Textarea label="Tujuan awal guru" value={form.learningGoal} onChange={change('learningGoal')} rows={3} maxLength={500} placeholder="Siswa mampu menjelaskan, membandingkan, membuat..." />
            <Textarea label="Kondisi siswa" value={form.studentContext} onChange={change('studentContext')} rows={3} maxLength={500} placeholder="Contoh: kemampuan beragam, sebagian siswa pasif berdiskusi, kelas besar..." />
            <Textarea label="Batasan / kebutuhan khusus" value={form.constraints} onChange={change('constraints')} rows={3} maxLength={500} placeholder="Contoh: tanpa internet, 35 siswa, butuh aktivitas kelompok, inklusi..." />
            <Textarea label="Referensi atau materi dasar" value={form.reference} onChange={change('reference')} rows={5} maxLength={MAX_CONTEXT_LENGTH} placeholder="Tempel ringkasan buku, ATP/CP, catatan guru, atau poin materi..." hint={`${form.reference.length}/${MAX_CONTEXT_LENGTH} karakter`} />
            <Button type="submit" disabled={busy || form.topic.trim().length < 3}>{busy ? <><ProcessLoader size={16} label="Membuat draft" /> Membuat draft...</> : <><Sparkles size={17} /> Buat paket ajar</>}</Button>
          </form>
        </Card>
        <aside className="qz-studio-side">
          <Card className="qz-studio-note">
            <Sparkles size={22} />
            <h2>Yang akan dibuat</h2>
            <ul>
              <li>Rencana ajar dan alur kelas</li>
              <li>Materi ajar siap disunting</li>
              <li>Kuis singkat dengan jawaban</li>
              <li>Tugas, produk, dan kriteria berhasil</li>
              <li>Rubrik serta diferensiasi siswa</li>
            </ul>
          </Card>
          <Card className="qz-studio-note qz-studio-note--soft">
            <ListChecks size={22} />
            <h2>Masuk ke alur kerja</h2>
            <p>Salin bagian yang sudah cocok, lalu pecah menjadi materi, kuis, tugas, atau pertemuan di ruang kelas.</p>
          </Card>
        </aside>
      </div>
      {result ? <PlanPreview plan={result} onCopy={copy} copied={copied} /> : null}
    </div>
  );
}
