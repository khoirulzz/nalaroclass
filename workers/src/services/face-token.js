/**
 * Face token verification for Cloudflare Worker.
 *
 * Verifies the short-lived HS256 JWT issued by the Python Face API
 * (nalarofaceapi.onrender.com) using a shared secret stored in Worker env vars.
 * No network call required — verification is pure crypto.
 *
 * Token payload expected:
 *   { uid, attendanceId, classId, similarity, iat, exp, iss }
 */

const ISSUER = 'nalaro-face-api';
const ALG = { name: 'HMAC', hash: 'SHA-256' };

/**
 * Decode a base64url string to a Uint8Array.
 * Works in the Cloudflare Workers runtime (no Node.js Buffer needed).
 */
function base64urlDecode(str) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

/**
 * Import the shared HMAC-SHA256 key from the raw secret string.
 * @param {string} secret
 * @returns {Promise<CryptoKey>}
 */
async function importKey(secret) {
  const enc = new TextEncoder();
  return crypto.subtle.importKey('raw', enc.encode(secret), ALG, false, ['verify']);
}

/**
 * Verify a face verification JWT and return the decoded payload.
 *
 * @param {string} token     - The JWT string from the browser.
 * @param {string} secret    - FACE_API_SECRET from Worker env.
 * @param {object} expected  - Expected payload fields to assert:
 *                             { uid, attendanceId, classId }
 * @returns {Promise<object>} The verified payload.
 * @throws {Error} with .code set to a descriptive constant on failure.
 */
export async function verifyFaceToken(token, secret, { uid, attendanceId, classId }) {
  if (!token || typeof token !== 'string') {
    throw Object.assign(new Error('Token verifikasi wajah tidak ada.'), { code: 'FACE_TOKEN_MISSING' });
  }
  if (!secret || secret.length < 32) {
    throw Object.assign(new Error('Konfigurasi token verifikasi tidak valid.'), { code: 'FACE_TOKEN_CONFIG_ERROR' });
  }

  const invalid = () => Object.assign(new Error('Format token verifikasi tidak valid.'), { code: 'FACE_TOKEN_INVALID' });
  if (token.length > 2048 || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token)) throw invalid();
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw Object.assign(new Error('Format token tidak valid.'), { code: 'FACE_TOKEN_INVALID' });
  }

  const [headerB64, payloadB64, sigB64] = parts;

  let header;
  let payload;
  let signature;
  try {
    header = JSON.parse(new TextDecoder().decode(base64urlDecode(headerB64)));
    payload = JSON.parse(new TextDecoder().decode(base64urlDecode(payloadB64)));
    signature = base64urlDecode(sigB64);
  } catch { throw invalid(); }
  if (header?.alg !== 'HS256' || header?.typ !== 'JWT' || !payload || typeof payload !== 'object' || Array.isArray(payload) || signature.length !== 32) throw invalid();

  // Verify signature
  const key = await importKey(secret);
  const enc = new TextEncoder();
  const signingInput = enc.encode(`${headerB64}.${payloadB64}`);
  const valid = await crypto.subtle.verify(ALG, key, signature, signingInput);
  if (!valid) {
    throw Object.assign(new Error('Token verifikasi wajah tidak valid.'), { code: 'FACE_TOKEN_INVALID' });
  }

  // Check expiry
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isInteger(payload.exp) || payload.exp <= now) {
    throw Object.assign(new Error('Token verifikasi wajah sudah kedaluwarsa. Ulangi pemindaian wajah.'), { code: 'FACE_TOKEN_EXPIRED' });
  }

  if (!Number.isInteger(payload.iat) || payload.iat > now + 5 || payload.exp <= payload.iat || payload.exp - payload.iat > 120) throw invalid();

  // Check issuer
  if (payload.iss !== ISSUER) {
    throw Object.assign(new Error('Token verifikasi wajah tidak dikenal.'), { code: 'FACE_TOKEN_INVALID' });
  }

  // Check uid and attendanceId match the request
  if (payload.uid !== uid) {
    throw Object.assign(new Error('Token verifikasi tidak cocok dengan pengguna ini.'), { code: 'FACE_TOKEN_UID_MISMATCH' });
  }
  if (payload.attendanceId !== attendanceId) {
    throw Object.assign(new Error('Token verifikasi tidak cocok dengan sesi presensi ini.'), { code: 'FACE_TOKEN_ATTENDANCE_MISMATCH' });
  }

  if (!classId || payload.classId !== classId) {
    throw Object.assign(new Error('Token verifikasi tidak cocok dengan kelas ini.'), { code: 'FACE_TOKEN_CLASS_MISMATCH' });
  }
  return payload;
}

