/**
 * Server-side face verification via the Nalaro Face API (Python, Render).
 *
 * Flow:
 *  1. Browser extracts a face embedding from the live camera frame using
 *     Human.js (already running for UI guidance).
 *  2. This module sends the embedding + Firebase ID token to the Python API.
 *  3. The API verifies the token, fetches the stored profile from Firestore,
 *     computes cosine similarity server-side, and returns a short-lived JWT.
 *  4. The JWT is forwarded to the Cloudflare Worker check-in endpoint.
 *
 * This replaces the previous all-client-side matching with a server-authoritative
 * result while keeping the UX guidance (bounding box, pose feedback) in the browser.
 */

import { getAuth } from 'firebase/auth';

/** URL of the Python Face API on Render — set via VITE_FACE_API_URL */
const getFaceApiUrl = () => ((typeof import.meta !== 'undefined' && import.meta?.env?.VITE_FACE_API_URL) || (typeof process !== 'undefined' && process?.env?.VITE_FACE_API_URL) || '').trim().replace(/\/+$/, '');

/** Timeout for the verify-face network call (ms) */
const REQUEST_TIMEOUT_MS = 90_000; // 90 s to accommodate cold-start

export class FaceApiError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'FaceApiError';
    this.code = code;
  }
}

/**
 * Capture one JPEG frame from a video element and return it as a base64 string.
 * @param {HTMLVideoElement} video
 * @param {number} [quality=0.85]  JPEG quality 0..1
 * @returns {string} base64-encoded JPEG (without the data:... prefix)
 */
export function captureFrameBase64(video, quality = 0.85) {
  if (!video?.videoWidth || !video?.videoHeight) {
    throw new FaceApiError('CAMERA_NOT_READY', 'Kamera belum siap untuk mengambil frame.');
  }
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d')?.drawImage(video, 0, 0);
  const dataUrl = canvas.toDataURL('image/jpeg', quality);
  const base64 = dataUrl.split(',')[1];
  if (!base64) throw new FaceApiError('FRAME_CAPTURE_FAILED', 'Gagal mengambil frame dari kamera.');
  return base64;
}

/**
 * Send the live face embedding to the Python Face API for server-side verification.
 *
 * @param {object} params
 * @param {number[]} params.liveEmbedding  512-dim embedding from Human.js
 * @param {string}  params.attendanceId
 * @param {string}  params.classId
 * @param {AbortSignal} [params.signal]
 * @returns {Promise<{verified: boolean, verificationToken: string, similarity: number, expiresAt: string}>}
 */
export async function requestFaceVerification({ liveEmbedding, attendanceId, classId, signal }) {
  const faceApiUrl = getFaceApiUrl();
  if (!faceApiUrl) {
    throw new FaceApiError(
      'FACE_API_NOT_CONFIGURED',
      'Layanan verifikasi wajah belum dikonfigurasi. Hubungi pengelola aplikasi.',
    );
  }
  if (!Array.isArray(liveEmbedding) || liveEmbedding.length < 64 || liveEmbedding.length > 2048 || liveEmbedding.some((value) => !Number.isFinite(value) || Math.abs(value) > 100)) {
    throw new FaceApiError('INVALID_EMBEDDING', 'Data wajah tidak lengkap. Ulangi pemindaian.');
  }

  // Get Firebase ID token
  const currentUser = getAuth().currentUser;
  if (!currentUser) {
    throw new FaceApiError('AUTH_REQUIRED', 'Sesi masuk diperlukan. Silakan masuk kembali.');
  }
  let idToken;
  try {
    idToken = await currentUser.getIdToken();
  } catch {
    throw new FaceApiError('AUTH_TOKEN_FAILED', 'Gagal memperbarui sesi masuk. Coba lagi.');
  }

  // Build abort signal with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const abort = () => controller.abort();
  if (signal?.aborted) abort();
  else signal?.addEventListener('abort', abort, { once: true });
  const combinedSignal = controller.signal;

  let response;
  let data;
  try {
    response = await fetch(`${faceApiUrl}/verify-face`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken, liveEmbedding, attendanceId, classId }),
      signal: combinedSignal,
    });
    try { data = await response.json(); }
    catch (error) {
      if (error?.name === 'AbortError') throw error;
      throw new FaceApiError('FACE_API_RESPONSE_INVALID', 'Respons server verifikasi tidak dapat dibaca.');
    }
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new FaceApiError('FACE_API_RESPONSE_INVALID', 'Respons server verifikasi tidak dapat dibaca.');
    }
  } catch (err) {
    if (err instanceof FaceApiError) throw err;
    if (signal?.aborted) throw new DOMException('Pemindaian dibatalkan.', 'AbortError');
    if (err?.name === 'AbortError') {
      throw new FaceApiError(
        'FACE_API_TIMEOUT',
        'Server verifikasi wajah memerlukan waktu lebih lama (kemungkinan cold-start). Tunggu sebentar lalu coba lagi.',
      );
    }
    throw new FaceApiError('FACE_API_NETWORK_ERROR', 'Gagal menghubungi server verifikasi wajah. Periksa koneksi internet.');
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener('abort', abort);
  }

  if (!response.ok || !data.verified) {
    const detail = data.detail && typeof data.detail === 'object' ? data.detail : data;
    const code = detail.reason || (response.status === 401 ? 'AUTH_INVALID' : response.ok ? 'FACE_MISMATCH' : 'FACE_API_UNAVAILABLE');
    const message = detail.message || faceApiErrorMessage({ code });
    throw new FaceApiError(code, message);
  }

  if (typeof data.verificationToken !== 'string' || !data.verificationToken || !Number.isFinite(data.similarity) || !Number.isFinite(Date.parse(data.expiresAt))) {
    throw new FaceApiError('FACE_API_RESPONSE_INVALID', 'Respons server verifikasi tidak lengkap. Ulangi pemindaian.');
  }
  return {
    verified: true,
    verificationToken: data.verificationToken,
    similarity: data.similarity,
    expiresAt: data.expiresAt,
  };
}

/**
 * Map FaceApiError codes to user-friendly messages.
 * @param {Error|{code?: string}} error
 * @returns {string}
 */
export function faceApiErrorMessage(error) {
  const code = error?.code;
  if (code === 'FACE_API_NOT_CONFIGURED') return 'Layanan verifikasi wajah belum dikonfigurasi.';
  if (code === 'FACE_API_TIMEOUT') return 'Server verifikasi lambat merespons (kemungkinan sedang dimulai). Tunggu sebentar lalu coba lagi.';
  if (code === 'FACE_API_NETWORK_ERROR') return 'Tidak dapat menghubungi server verifikasi wajah. Periksa koneksi internet.';
  if (code === 'FACE_PROFILE_NOT_FOUND') return 'Profil wajah belum didaftarkan. Daftarkan profil wajah terlebih dahulu di halaman profil.';
  if (code === 'FACE_PROFILE_EMPTY') return 'Data profil wajah tidak lengkap. Daftarkan ulang profil wajah.';
  if (code === 'FACE_MISMATCH') return 'Wajah belum cocok dengan profil yang terdaftar. Atur pencahayaan lalu coba lagi.';
  if (code === 'AUTH_REQUIRED') return 'Sesi masuk diperlukan. Silakan masuk kembali.';
  if (code === 'AUTH_INVALID') return 'Token autentikasi tidak valid. Masuk kembali lalu coba lagi.';
  if (code === 'INVALID_EMBEDDING') return 'Data wajah tidak lengkap. Ulangi pemindaian.';
  if (code === 'EMBEDDING_DIMENSION_MISMATCH') return 'Profil wajah perlu didaftarkan ulang (model tidak cocok).';
  if (code === 'FACE_TOKEN_REQUIRED') return 'Token verifikasi wajah hilang. Ulangi pemindaian wajah.';
  if (code === 'FACE_TOKEN_INVALID' || code === 'FACE_TOKEN_EXPIRED') return 'Token verifikasi wajah tidak valid atau kedaluwarsa. Ulangi pemindaian.';
  return error?.message || 'Verifikasi wajah gagal. Coba lagi.';
}
