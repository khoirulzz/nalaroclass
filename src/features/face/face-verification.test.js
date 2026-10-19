import assert from 'node:assert/strict';
import test from 'node:test';
import { faceApiErrorMessage, requestFaceVerification } from './face-verification.js';

test('faceApiErrorMessage translates known error codes to Indonesian user messages', () => {
  assert.equal(
    faceApiErrorMessage({ code: 'FACE_API_NOT_CONFIGURED' }),
    'Layanan verifikasi wajah belum dikonfigurasi.'
  );
  assert.equal(
    faceApiErrorMessage({ code: 'FACE_API_TIMEOUT' }),
    'Server verifikasi lambat merespons (kemungkinan sedang dimulai). Tunggu sebentar lalu coba lagi.'
  );
  assert.equal(
    faceApiErrorMessage({ code: 'FACE_MISMATCH' }),
    'Wajah belum cocok dengan profil yang terdaftar. Atur pencahayaan lalu coba lagi.'
  );
  assert.equal(
    faceApiErrorMessage({ code: 'FACE_PROFILE_NOT_FOUND' }),
    'Profil wajah belum didaftarkan. Daftarkan profil wajah terlebih dahulu di halaman profil.'
  );
  assert.equal(
    faceApiErrorMessage({ code: 'FACE_TOKEN_EXPIRED' }),
    'Token verifikasi wajah tidak valid atau kedaluwarsa. Ulangi pemindaian.'
  );
  assert.equal(
    faceApiErrorMessage(new Error('Pesan kustom')),
    'Pesan kustom'
  );
});

test('requestFaceVerification validates input before making requests', async () => {
  // Invalid embedding (too short)
  await assert.rejects(
    () => requestFaceVerification({ liveEmbedding: [1, 2], attendanceId: 'att-1', classId: 'cls-1' }),
    (err) => err.code === 'INVALID_EMBEDDING' || err.code === 'FACE_API_NOT_CONFIGURED'
  );
});

test('verification handles FastAPI errors, requires complete proof, and forwards cancellation', async () => {
  const { initializeApp, deleteApp } = await import('firebase/app');
  const { getAuth } = await import('firebase/auth');
  const app = initializeApp({ apiKey: 'synthetic-api-key', projectId: 'test' });
  await getAuth(app).authStateReady();
  getAuth(app).currentUser = { getIdToken: async () => 'synthetic-id-token' };
  const oldUrl = process.env.VITE_FACE_API_URL;
  const oldFetch = globalThis.fetch;
  process.env.VITE_FACE_API_URL = 'https://face.test/';
  const input = { liveEmbedding: Array(512).fill(0.5), attendanceId: 'a', classId: 'c' };
  try {
    globalThis.fetch = async () => new Response(JSON.stringify({ detail: { reason: 'PROFILE_UNAVAILABLE', message: 'Profil tidak dapat diambil.' } }), { status: 503 });
    await assert.rejects(() => requestFaceVerification(input), { code: 'PROFILE_UNAVAILABLE', message: 'Profil tidak dapat diambil.' });
    globalThis.fetch = async () => new Response('null');
    await assert.rejects(() => requestFaceVerification(input), { code: 'FACE_API_RESPONSE_INVALID' });
    globalThis.fetch = async () => new Response(JSON.stringify({ verified: true, similarity: 0.9 }));
    await assert.rejects(() => requestFaceVerification(input), { code: 'FACE_API_RESPONSE_INVALID' });
    globalThis.fetch = async (url, options) => {
      assert.equal(url, 'https://face.test/verify-face');
      assert.equal(JSON.parse(options.body).idToken, 'synthetic-id-token');
      return new Response(JSON.stringify({ verified: true, similarity: 0.9, verificationToken: 'signed-proof', expiresAt: new Date(Date.now() + 60000).toISOString() }));
    };
    assert.equal((await requestFaceVerification(input)).verificationToken, 'signed-proof');
    globalThis.fetch = (_url, { signal }) => new Promise((resolve, reject) => {
      signal.addEventListener('abort', () => reject(new DOMException('Cancelled', 'AbortError')), { once: true });
    });
    const controller = new AbortController();
    const pending = requestFaceVerification({ ...input, signal: controller.signal });
    await new Promise((resolve) => setTimeout(resolve, 0));
    controller.abort();
    await assert.rejects(() => pending, { name: 'AbortError' });
  } finally {
    globalThis.fetch = oldFetch;
    if (oldUrl === undefined) delete process.env.VITE_FACE_API_URL;
    else process.env.VITE_FACE_API_URL = oldUrl;
    getAuth(app).currentUser = null;
    await deleteApp(app);
  }
});
