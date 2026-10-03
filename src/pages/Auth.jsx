import { useState } from 'react';
import { ArrowLeft, ArrowRight, Gamepad2, GraduationCap, Pause, Play, School } from 'lucide-react';
import { Link } from 'react-router-dom';
import Brand from '../components/Brand';
import LearningArtwork from '../components/LearningArtwork';
import { ProcessLoader } from '../components/ui';
import { useAuth } from '../context/useAuth';
import '../styles/landing.css';

const roleCopy = {
  teacher: { label: 'Guru', description: 'Buat dan kelola kelas', icon: School },
  student: { label: 'Siswa', description: 'Belajar dan ikut kuis', icon: GraduationCap },
};

function LearningNotes() {
  const [paused, setPaused] = useState(false);
  return <div className={`nlr-learning-notes${paused ? ' nlr-motion-paused' : ''}`}>
    <div className="nlr-learning-notes__quotes">
      <p>Tak harus langsung paham.<br /><em>Mulai saja dari penasaran.</em></p>
      <p>Pertanyaan kecil hari ini.<br /><em>Penemuan baru esok hari.</em></p>
      <p>Pelan juga tidak apa.<br /><em>Yang penting, terus mencoba.</em></p>
    </div>
    <div className="nlr-learning-notes__footer"><span>Catatan kecil dari Nalaro</span><button type="button" className="nlr-motion-control" aria-label={paused ? 'Putar catatan belajar' : 'Jeda catatan belajar'} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? <Play size={16} /> : <Pause size={16} />}</button></div>
  </div>;
}

function GoogleMark() {
  return <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.52h3.24c1.89-1.74 2.98-4.3 2.98-7.37Z" /><path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.4l-3.24-2.52c-.9.6-2.05.97-3.38.97-2.6 0-4.8-1.76-5.59-4.12H3.07v2.6A10 10 0 0 0 12 22Z" /><path fill="#FBBC05" d="M6.41 13.93a6 6 0 0 1 0-3.86v-2.6H3.07a10 10 0 0 0 0 9.06l3.34-2.6Z" /><path fill="#EA4335" d="M12 5.95c1.47 0 2.79.5 3.83 1.5L18.7 4.6A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.93 5.47l3.34 2.6A5.99 5.99 0 0 1 12 5.95Z" /></svg>;
}
const profileSeed = (user, role) => ({ uid: user.uid, name: user.displayName || '', nickname: '', email: user.email || '', role, subject: 'Umum', institution: '', gender: '', avatar: user.photoURL || null, isAnonymous: false, profileCompleted: false, createdAt: new Date().toISOString() });
function authErrorMessage(error, mode) {
  if (error.message?.includes('terdaftar sebagai')) return error.message;
  if (error.code === 'auth/email-already-in-use') return 'Email ini sudah terdaftar. Pilih Masuk untuk melanjutkan.';
  if (error.code === 'auth/invalid-email') return 'Format email belum tepat.';
  if (error.code === 'auth/weak-password') return 'Kata sandi terlalu lemah. Gunakan minimal 6 karakter.';
  if (error.code === 'auth/too-many-requests') return 'Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.';
  if (error.code === 'auth/network-request-failed') return 'Koneksi terputus. Periksa internet lalu coba lagi.';
  return mode === 'register' ? 'Pendaftaran belum berhasil. Coba lagi.' : 'Email atau kata sandi belum tepat.';
}

export default function Auth({ onAuthComplete }) {
  const { signInWithGoogle, signInAsGuest, signInWithEmailAndPassword, createAccountWithEmail, signOut, saveUserProfile, readUserProfile } = useAuth();
  const [role, setRole] = useState('teacher');
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const finish = async (firebaseUser, requestedRole, isNew = false) => {
    const existing = await readUserProfile(firebaseUser.uid);
    if (existing?.role && existing.role !== requestedRole) {
      await signOut();
      throw new Error(`Akun ini sudah terdaftar sebagai ${existing.role === 'teacher' ? 'guru' : 'siswa'}. Gunakan pilihan masuk ${existing.role === 'teacher' ? 'Guru' : 'Siswa'}.`);
    }
    const profile = existing || profileSeed(firebaseUser, requestedRole);
    if (!existing || isNew) await saveUserProfile(firebaseUser.uid, profile);
    onAuthComplete(profile.role);
  };
  const google = async () => {
    setBusy(true); setError('');
    try { const result = await signInWithGoogle(); await finish(result.user, role); }
    catch (caught) { setError(caught.message?.includes('terdaftar sebagai') ? caught.message : 'Login Google belum berhasil. Pastikan popup tidak diblokir.'); }
    finally { setBusy(false); }
  };
  const emailAuth = async (event) => {
    event.preventDefault(); setError('');
    if (password.length < 6) return setError('Kata sandi minimal 6 karakter.');
    if (mode === 'register' && password !== confirmPassword) return setError('Konfirmasi kata sandi belum sama.');
    setBusy(true);
    try {
      const result = mode === 'register' ? await createAccountWithEmail(email.trim(), password) : await signInWithEmailAndPassword(email.trim(), password);
      await finish(result.user, role, mode === 'register');
    } catch (caught) { setError(authErrorMessage(caught, mode)); }
    finally { setBusy(false); }
  };
  const guest = async () => {
    setBusy(true); setError('');
    try {
      const result = await signInAsGuest();
      await saveUserProfile(result.user.uid, { uid: result.user.uid, name: 'Siswa Tamu', nickname: 'Tamu', email: '', role: 'student', subject: 'Umum', institution: 'Akun tamu', gender: '', avatar: null, isAnonymous: true, profileCompleted: true, createdAt: new Date().toISOString() });
      onAuthComplete('student');
    } catch { setError('Akun tamu belum dapat dibuat. Coba lagi.'); }
    finally { setBusy(false); }
  };

  return (
    <main className="nlr-auth">
      <aside className="nlr-auth__aside">
        <Link to="/" aria-label="Kembali ke Nalaro Class"><Brand /></Link>
        <div className="nlr-auth__story"><LearningArtwork compact /><LearningNotes /></div>
        <small>Ruang untuk rasa ingin tahu.</small>
      </aside>
      <div className="nlr-auth__main">
        <section className="nlr-auth__card" aria-labelledby="nlr-auth-title">
          <Link className="nlr-auth__back" to="/"><ArrowLeft size={16} /> Beranda</Link>
          <div className="nlr-auth__mode" role="group" aria-label="Masuk atau daftar">
            <button type="button" aria-pressed={mode === 'login'} onClick={() => { setMode('login'); setError(''); }}>Masuk</button>
            <button type="button" aria-pressed={mode === 'register'} onClick={() => { setMode('register'); setError(''); }}>Daftar</button>
          </div>
          <h1 id="nlr-auth-title">{mode === 'login' ? 'Halo, selamat datang.' : 'Senang kamu bergabung.'}</h1>
          <p className="nlr-auth__lead">{mode === 'login' ? 'Mau mengajar atau belajar hari ini?' : 'Buat akun dan temukan ruang belajarmu.'}</p>
          <div className="nlr-auth__roles" role="group" aria-label="Pilih peran akun">
            {Object.entries(roleCopy).map(([value, copy]) => { const Icon = copy.icon; return <button key={value} type="button" aria-pressed={role === value} onClick={() => { setRole(value); setError(''); }}><Icon size={21} /><span>{copy.label}</span></button>; })}
          </div>
          {error ? <div className="nlr-auth__error" role="alert">{error}</div> : null}
          <button type="button" className="nlr-auth__google" disabled={busy} onClick={google}>{busy ? <ProcessLoader size={19} label="Memproses login Google" /> : <GoogleMark />} Lanjutkan dengan Google</button>
          <div className="nlr-auth__divider">atau dengan email</div>
          <form className="nlr-auth__form" onSubmit={emailAuth}>
            <label>Email<input type="email" autoComplete="email" placeholder="nama@email.com" value={email} required onChange={(event) => setEmail(event.target.value)} /></label>
            <label>Kata sandi<input type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} placeholder="Minimal 6 karakter" minLength={6} value={password} required onChange={(event) => setPassword(event.target.value)} /></label>
            {mode === 'register' ? <label>Ulangi kata sandi<input type="password" autoComplete="new-password" placeholder="Ketik ulang kata sandi" minLength={6} value={confirmPassword} required onChange={(event) => setConfirmPassword(event.target.value)} /></label> : null}
            <button className="nlr-auth__submit" disabled={busy} type="submit">{busy ? <><ProcessLoader size={20} label={mode === 'login' ? 'Memproses login' : 'Memproses pendaftaran'} /> Memproses...</> : <>{mode === 'login' ? `Masuk sebagai ${roleCopy[role].label}` : `Daftar sebagai ${roleCopy[role].label}`} <ArrowRight size={18} /></>}</button>
          </form>
          {role === 'student' ? <><div className="nlr-auth__divider">atau</div><button type="button" className="nlr-auth__guest" disabled={busy} onClick={guest}>{busy ? <ProcessLoader size={18} label="Membuat akun tamu" /> : <Gamepad2 size={17} />} Gabung kuis sebagai tamu</button></> : null}
        </section>
      </div>
    </main>
  );
}
