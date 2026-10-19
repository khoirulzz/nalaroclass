import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import app from '../src/index.js';

const config = JSON.parse(readFileSync(new URL('../wrangler.json', import.meta.url), 'utf8'));
test('all production domains can preflight and read authentication errors', async () => {
  for (const origin of ['https://class.nalaro.digital', 'https://nalaro.web.id', 'https://nalaroclass.pages.dev']) {
    const request = (method) => new Request('https://api.test/classes', { method, headers: { origin, 'access-control-request-headers': 'authorization,content-type' } });
    const preflight = await app.fetch(request('OPTIONS'), config.vars);
    assert.equal(preflight.status, 204, origin);
    assert.equal(preflight.headers.get('access-control-allow-origin'), origin);
    const unauthenticated = await app.fetch(request('GET'), config.vars);
    assert.equal(unauthenticated.status, 401);
    assert.equal(unauthenticated.headers.get('access-control-allow-origin'), origin);
  }
  const denied = await app.fetch(new Request('https://api.test/classes', { method: 'OPTIONS', headers: { origin: 'https://class.nalaro.digital.attacker.test' } }), config.vars);
  assert.equal(denied.status, 403);
});
