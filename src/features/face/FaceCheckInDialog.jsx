import { useEffect, useState } from 'react';
import { Camera, RefreshCw } from 'lucide-react';
import { Button, Dialog } from '../../components/ui';
import { createFaceChallenge } from './face-challenge';
import { verificationSteps } from './guided-face-scan';
import FaceScanner from './FaceScanner';
import useGuidedFaceScan from './useGuidedFaceScan';
import { requestFaceVerification, faceApiErrorMessage } from './face-verification';

/**
 * FaceCheckInDialog — guides the student through face scanning, calls the
 * Python Face API for server-side verification, then calls onVerified(token)
 * so the parent can include the JWT in the Worker check-in request.
 *
 * Props:
 *   open          {boolean}          - Whether the dialog is visible
 *   onClose       {() => void}       - Called when the user dismisses
 *   profile       {object|null}      - Face profile (embedding from Firestore)
 *   required      {boolean}          - If true, shows "Batal" instead of "Kembali"
 *   busy          {boolean}          - External busy state (parent saving)
 *   attendanceId  {string}           - Current attendance session ID
 *   classId       {string}           - Current class ID
 *   onVerified    {(token: string) => Promise<boolean>}
 *                                    - Called with verificationToken on success.
 *                                      Must return true if check-in was saved.
 */
export default function FaceCheckInDialog({
  open,
  onClose,
  profile,
  onVerified,
  busy = false,
  required = false,
  attendanceId,
  classId,
}) {
  const [challenge, setChallenge] = useState(() => createFaceChallenge());
  const scanner = useGuidedFaceScan();
  const { cancel } = scanner;
  const [started, setStarted] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (!open) {
      cancel();
      setStarted(false);
      setApiError('');
      setChallenge(createFaceChallenge());
    }
  }, [open, cancel]);

  const close = () => { scanner.cancel(); onClose(); };

  const start = () => {
    setStarted(true);
    setApiError('');
    const steps = verificationSteps(challenge);

    void scanner.start({
      steps,
      profile,
      finishStage: 'verifying',
      onComplete: async (result, { signal }) => {
        // result.embedding is the averaged embedding from Human.js scan
        // Send to Python API for server-side verification
        let verificationToken;
        try {
          const apiResult = await requestFaceVerification({
            liveEmbedding: result.embedding,
            attendanceId,
            classId,
            signal,
          });
          verificationToken = apiResult.verificationToken;
        } catch (err) {
          setApiError(faceApiErrorMessage(err));
          throw err; // propagate to scanner — shows error state
        }

        // Hand token to parent (ClassAttendance) to call Worker check-in
        const saved = await onVerified(verificationToken);
        if (saved === false) {
          throw new Error('Presensi belum tercatat. Periksa pesan di halaman kelas lalu coba lagi.');
        }
      },
    });
  };

  const steps = verificationSteps(challenge);
  const submitting = busy || scanner.scan.stage === 'verifying';

  return (
    <Dialog
      className="qz-dialog--face"
      open={open}
      onClose={() => !submitting && close()}
      title="Presensi wajah"
      description="Tekan mulai, lalu ikuti panduan. Presensi dicatat otomatis setelah wajah terverifikasi oleh server."
      footer={
        <>
          <Button variant="secondary" disabled={submitting} onClick={close}>
            {required ? 'Batal' : 'Kembali ke presensi'}
          </Button>
          {!started || scanner.scan.stage === 'error' ? (
            <Button disabled={submitting || !profile} onClick={start}>
              {started ? <RefreshCw size={17} aria-hidden="true" /> : <Camera size={17} aria-hidden="true" />}
              {started ? 'Coba lagi' : 'Mulai pemindaian'}
            </Button>
          ) : null}
        </>
      }
    >
      {started
        ? <FaceScanner videoRef={scanner.videoRef} scan={scanner.scan} steps={steps} label="Pratinjau kamera untuk presensi wajah" />
        : (
          <div className="qz-face-start">
            <span className="qz-card-icon"><Camera size={26} aria-hidden="true" /></span>
            <h3>Siapkan wajah di depan kamera</h3>
            <p>Hadap depan, putar kepala sesuai arah di layar, lalu kembali ke depan. Tidak perlu menekan tombol di setiap langkah.</p>
            <small>Pastikan hanya satu wajah terlihat dan pencahayaan cukup.</small>
          </div>
        )}
      {(scanner.error || apiError) && started
        ? <p className="qz-inline-state qz-inline-state--error" role="alert">{apiError || scanner.error}</p>
        : null}
      <p className="qz-face-disclaimer">
        Verifikasi dilakukan di server. Foto tidak disimpan. Proses menggunakan tantangan gerak sederhana.
      </p>
    </Dialog>
  );
}
