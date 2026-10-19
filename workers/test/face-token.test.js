import assert from 'node:assert/strict';
import test from 'node:test';
import { verifyFaceToken } from '../src/services/face-token.js';

const TEST_SECRET = 'a_very_secure_and_long_secret_key_at_least_32_chars!';
const ISSUER = 'nalaro-face-api';

function base64urlEncode(bufferOrStr) {
  const binary = typeof bufferOrStr === 'string'
    ? bufferOrStr
    : String.fromCharCode(...new Uint8Array(bufferOrStr));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function createTestJwt(payload, secret = TEST_SECRET, alg = 'HS256') {
  const header = { alg, typ: 'JWT' };
  const headerB64 = base64urlEncode(JSON.stringify(header));
  const payloadB64 = base64urlEncode(JSON.stringify(payload));
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(`${headerB64}.${payloadB64}`));
  const sigB64 = base64urlEncode(signature);
  return `${headerB64}.${payloadB64}.${sigB64}`;
}

test('verifyFaceToken succeeds with valid token and matching claims', async () => {
  const now = Math.floor(Date.now() / 1000);
  const token = await createTestJwt({
    uid: 'student-123',
    attendanceId: 'session-456',
    classId: 'class-789',
    similarity: 0.88,
    iss: ISSUER,
    iat: now,
    exp: now + 60,
  });

  const verified = await verifyFaceToken(token, TEST_SECRET, {
    uid: 'student-123',
    attendanceId: 'session-456',
    classId: 'class-789',
  });

  assert.equal(verified.uid, 'student-123');
  assert.equal(verified.attendanceId, 'session-456');
  assert.equal(verified.similarity, 0.88);
});

test('verifyFaceToken rejects expired token', async () => {
  const past = Math.floor(Date.now() / 1000) - 100;
  const token = await createTestJwt({
    uid: 'student-123',
    attendanceId: 'session-456',
    classId: 'class-789',
    similarity: 0.88,
    iss: ISSUER,
    iat: past - 60,
    exp: past,
  });

  await assert.rejects(
    () => verifyFaceToken(token, TEST_SECRET, { uid: 'student-123', attendanceId: 'session-456', classId: 'class-789' }),
    (err) => err.code === 'FACE_TOKEN_EXPIRED'
  );
});

test('verifyFaceToken rejects tampered token or wrong secret', async () => {
  const now = Math.floor(Date.now() / 1000);
  const token = await createTestJwt({
    uid: 'student-123',
    attendanceId: 'session-456',
    iss: ISSUER,
    iat: now,
    exp: now + 60,
  }, 'different_secret_that_is_at_least_32_characters_long!');

  await assert.rejects(
    () => verifyFaceToken(token, TEST_SECRET, { uid: 'student-123', attendanceId: 'session-456', classId: 'class-789' }),
    (err) => err.code === 'FACE_TOKEN_INVALID'
  );
});

test('verifyFaceToken rejects uid mismatch', async () => {
  const now = Math.floor(Date.now() / 1000);
  const token = await createTestJwt({
    uid: 'different-student',
    attendanceId: 'session-456',
    iss: ISSUER,
    iat: now,
    exp: now + 60,
  });

  await assert.rejects(
    () => verifyFaceToken(token, TEST_SECRET, { uid: 'student-123', attendanceId: 'session-456', classId: 'class-789' }),
    (err) => err.code === 'FACE_TOKEN_UID_MISMATCH'
  );
});

test('verifyFaceToken rejects attendanceId mismatch', async () => {
  const now = Math.floor(Date.now() / 1000);
  const token = await createTestJwt({
    uid: 'student-123',
    attendanceId: 'other-session',
    iss: ISSUER,
    iat: now,
    exp: now + 60,
  });

  await assert.rejects(
    () => verifyFaceToken(token, TEST_SECRET, { uid: 'student-123', attendanceId: 'session-456', classId: 'class-789' }),
    (err) => err.code === 'FACE_TOKEN_ATTENDANCE_MISMATCH'
  );
});

test('verifyFaceToken rejects invalid issuer', async () => {
  const now = Math.floor(Date.now() / 1000);
  const token = await createTestJwt({
    uid: 'student-123',
    attendanceId: 'session-456',
    iss: 'fake-issuer',
    iat: now,
    exp: now + 60,
  });

  await assert.rejects(
    () => verifyFaceToken(token, TEST_SECRET, { uid: 'student-123', attendanceId: 'session-456', classId: 'class-789' }),
    (err) => err.code === 'FACE_TOKEN_INVALID'
  );
});


test('face token binds class, rejects bad header, malformed timestamps and exact expiry', async () => {
  const now = Math.floor(Date.now() / 1000);
  const payload = { uid: 'u', attendanceId: 'a', classId: 'c', iss: ISSUER, iat: now, exp: now + 60 };
  const expected = { uid: 'u', attendanceId: 'a', classId: 'c' };
  await assert.rejects(() => verifyFaceToken('%.%.%', TEST_SECRET, expected), { code: 'FACE_TOKEN_INVALID' });
  const wrongClass = await createTestJwt({ ...payload, classId: 'other' });
  await assert.rejects(() => verifyFaceToken(wrongClass, TEST_SECRET, expected), { code: 'FACE_TOKEN_CLASS_MISMATCH' });
  const wrongHeader = await createTestJwt(payload, TEST_SECRET, 'HS512');
  await assert.rejects(() => verifyFaceToken(wrongHeader, TEST_SECRET, expected), { code: 'FACE_TOKEN_INVALID' });
  for (const change of [{ exp: 'forever' }, { iat: now + 60 }, { exp: now + 600 }]) {
    const token = await createTestJwt({ ...payload, ...change });
    await assert.rejects(() => verifyFaceToken(token, TEST_SECRET, expected));
  }
  const expired = await createTestJwt({ ...payload, iat: now - 60, exp: now });
  await assert.rejects(() => verifyFaceToken(expired, TEST_SECRET, expected), { code: 'FACE_TOKEN_EXPIRED' });
});
