import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';

// Public UI + isolated auth smoke. Synthetic accounts only; no Firebase requests.
const root = path.resolve(import.meta.dirname, '../..');
const artifacts = path.join(root, 'workers/.wrangler/public-ui-artifacts');
const base = process.env.NALARO_PUBLIC_URL || 'http://127.0.0.1:5173';
const { chromium } = createRequire(path.join(process.env.NALARO_BROWSER_TOOLS || path.join(os.tmpdir(), 'nalaro-release-tools'), 'package.json'))('playwright');
await mkdir(artifacts, { recursive: true });
await writeFile(path.join(artifacts, 'preview.html'), '<!doctype html><html lang="id"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><div id="root"></div><script type="module" src="./preview.jsx"></script></html>');
await writeFile(path.join(artifacts, 'preview.jsx'), `
import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import '/src/index.css';
import Auth from '/src/pages/Auth.jsx';
import Landing from '/src/pages/Landing.jsx';
const auth = new URLSearchParams(location.search).has('auth');
createRoot(document.getElementById('root')).render(<MemoryRouter>{auth ? <Auth onAuthComplete={role => { window.__completed = role; }} /> : <Landing onEnterApp={() => { window.__entered = true; }} />}</MemoryRouter>);
`);
const browser = await chromium.launch({ headless: true, executablePath: process.env.NALARO_CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
try {
const context = await browser.newContext({ reducedMotion: 'reduce' });
await context.route('**/*', route => {
  const url = new URL(route.request().url());
  if (url.origin !== new URL(base).origin) return route.abort();
  if (url.pathname === '/src/context/useAuth.js') return route.fulfill({ contentType: 'application/javascript', body: `
const user={uid:'synthetic-user',displayName:'Contoh',email:'example@example.test'};
const call=async method=>{(window.__calls ||= []).push(method); await new Promise(r=>setTimeout(r,150)); if(window.__fail) throw {code:'auth/network-request-failed'}; return {user};};
export const useAuth=()=>({
signInWithGoogle:()=>call('google'),signInAsGuest:()=>call('guest'),signInWithEmailAndPassword:()=>call('email'),createAccountWithEmail:()=>call('register'),
signOut:async()=>{window.__signedOut=true;},saveUserProfile:async(uid,profile)=>{window.__saved=profile;},readUserProfile:async()=>window.__existingRole?{role:window.__existingRole}:null
});` });
  return route.continue();
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const url = `${base}/workers/.wrangler/public-ui-artifacts/preview.html`;
async function goto(auth = false) { await page.goto(`${url}${auth ? '?auth' : ''}`); await page.locator(auth ? '.nlr-auth__form' : '.nlr-hero').waitFor(); await page.evaluate(() => document.fonts.ready); }
async function layout(label) {
  const result = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth, clipped: [...document.querySelectorAll('button,input,h1,h2,h3')].filter(e => { const r=e.getBoundingClientRect(); return r.width && (r.left < -2 || r.right > innerWidth+2 || e.scrollWidth > e.clientWidth+3); }).map(e=>e.textContent || e.tagName) }));
  assert.ok(result.scroll <= result.width, `${label}: document overflow ${JSON.stringify(result)}`);
  assert.deepEqual(result.clipped, [], `${label}: clipped controls/headings`);
}
const widths = [320, 390, 768, 1024, 1440];
for (const width of widths) {
  await page.setViewportSize({width,height:900});
  await goto(); await layout(`landing ${width}`);
  await page.screenshot({path:path.join(artifacts,`landing-${width}.png`),fullPage:true});
  for (const name of ['Hotspot gambar','Susun urutan','Pilihan gambar','Pilihan ganda']) {
    await page.getByRole('button',{name:new RegExp(name)}).click();
    await layout(`format ${name} ${width}`);
  }
  await page.getByRole('button',{name:'Masuk ke Nalaro',exact:true}).click();
  assert.equal(await page.evaluate(()=>window.__entered),true);
  await goto(true);
  for (const role of ['Guru','Siswa']) {
    await page.getByRole('button',{name:role,exact:true}).click();
    for (const mode of ['Masuk','Daftar']) {
      await page.getByRole('button',{name:mode,exact:true}).click();
      await layout(`auth ${role} ${mode} ${width}`);
    }
  }
  await page.getByRole('button',{name:'Masuk',exact:true}).click();
  await page.getByRole('button',{name:'Guru',exact:true}).click();
  await page.screenshot({path:path.join(artifacts,`auth-${width}.png`),fullPage:true});
  console.log(`Layout passed: ${width}px, landing, four formats, four auth states`);
}
// Existing auth behavior remains wired to the same actions and role guard.
for (const role of ['Guru','Siswa']) {
  for (const method of ['google','email','register']) {
    await goto(true);
    await page.getByRole('button',{name:role,exact:true}).click();
    if(method==='register') await page.getByRole('button',{name:'Daftar',exact:true}).click();
    if(method==='google') await page.getByRole('button',{name:'Lanjutkan dengan Google'}).click();
    else {
      await page.getByLabel('Email',{exact:true}).fill('example@example.test');
      await page.getByLabel('Kata sandi',{exact:true}).fill('synthetic-only');
      if(method==='register') await page.getByLabel('Ulangi kata sandi').fill('synthetic-only');
      await page.getByRole('button',{name:`${method==='register'?'Daftar':'Masuk'} sebagai ${role}`,exact:true}).click();
    }
    await page.waitForFunction(()=>window.__completed);
    assert.equal(await page.evaluate(()=>window.__completed),role==='Guru'?'teacher':'student');
    assert.deepEqual(await page.evaluate(()=>window.__calls),[method]);
  }
}
await goto(true);
await page.getByRole('button',{name:'Siswa',exact:true}).click();
await page.getByRole('button',{name:'Gabung kuis sebagai tamu'}).click();
await page.waitForFunction(()=>window.__completed);
assert.equal(await page.evaluate(()=>window.__saved.isAnonymous),true);
await goto(true);
await page.evaluate(()=>{window.__existingRole='student';});
await page.getByRole('button',{name:'Lanjutkan dengan Google'}).click();
await page.getByRole('alert').waitFor();
assert.match(await page.getByRole('alert').innerText(),/terdaftar sebagai siswa/);
assert.equal(await page.evaluate(()=>window.__signedOut),true);
assert.equal(await page.evaluate(()=>window.__completed),undefined);
await goto(true);
await page.getByRole('button',{name:'Daftar',exact:true}).click();
await page.getByLabel('Email',{exact:true}).fill('example@example.test');
await page.getByLabel('Kata sandi',{exact:true}).fill('synthetic-only');
await page.getByLabel('Ulangi kata sandi').fill('different-value');
await page.getByRole('button',{name:'Daftar sebagai Guru'}).click();
assert.match(await page.getByRole('alert').innerText(),/belum sama/);
assert.equal(await page.evaluate(()=>window.__calls),undefined);
await goto(true);
await page.evaluate(()=>{window.__fail=true;});
await page.getByRole('button',{name:'Lanjutkan dengan Google'}).click();
await page.getByRole('alert').waitFor();
assert.equal(await page.getByRole('button',{name:'Lanjutkan dengan Google'}).isEnabled(),true);
// Quotes fade, pause, and reduced-motion fallback.
await page.emulateMedia({reducedMotion:'no-preference'});
await goto(true);
await page.getByRole('button',{name:'Jeda catatan belajar'}).click();
assert.equal(await page.locator('.nlr-learning-notes__quotes p').first().evaluate(e=>getComputedStyle(e).animationPlayState),'paused');
await page.getByRole('button',{name:'Putar catatan belajar'}).click();
await page.locator('.nlr-learning-notes__quotes p').evaluateAll(nodes=>nodes.forEach(n=>n.getAnimations().forEach(a=>{a.pause();a.currentTime=8000;})));
assert.equal(await page.locator('.nlr-learning-notes__quotes p').nth(1).evaluate(e=>getComputedStyle(e).visibility),'visible');
await page.emulateMedia({reducedMotion:'reduce'});
assert.equal(await page.locator('.nlr-learning-notes__quotes p').nth(1).isVisible(),false);
await goto();
await page.keyboard.press('Tab');
assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Lewati navigasi');
// Direct comparison is independent of browser fixtures: no auth handler edits.
const before=execFileSync('git',['show','HEAD:src/pages/Auth.jsx'],{cwd:root,encoding:'utf8'});
const after=await readFile(path.join(root,'src/pages/Auth.jsx'),'utf8');
const handlers=s=>s.slice(s.indexOf('const profileSeed'),s.indexOf('  return (\n    <main')).replaceAll('\r','');
assert.equal(handlers(after.replaceAll('\r','')),handlers(before.replaceAll('\r','')));
assert.deepEqual(errors,[]);
console.log('PASS: 45 layout states, 6 auth method/role combinations, guest, role mismatch, confirmation validation, Google failure recovery, motion controls, reduced motion, keyboard skip link, unchanged auth handlers; no browser runtime errors.');
} finally {
  await browser.close();
}
