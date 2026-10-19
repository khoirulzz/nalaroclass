import assert from 'node:assert/strict';
import test from 'node:test';
import { authErrorMessage } from './auth-error.js';
test('domain and profile failures are distinguished from password and popup failures', () => {
  assert.match(authErrorMessage({ code: 'auth/unauthorized-domain' }, 'google'), /Authorized domains/);
  assert.match(authErrorMessage({ code: 'permission-denied' }), /Profil akun/);
  assert.match(authErrorMessage({ code: 'auth/popup-blocked' }, 'google'), /diblokir browser/);
  assert.match(authErrorMessage({ code: 'auth/invalid-credential' }), /kata sandi/);
});
