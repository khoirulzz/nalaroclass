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
