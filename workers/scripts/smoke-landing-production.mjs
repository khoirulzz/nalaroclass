import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { CLASS_THEMES } from '../../src/features/classes/classThemes.js';

// Public read-only smoke against the real built app. No login is submitted.
const root = path.resolve(import.meta.dirname, '../..');
const base = process.env.NALARO_PUBLIC_URL || 'https://nalaroclass.pages.dev';
const directory = path.join(root, 'workers/.wrangler/landing-production-artifacts');
const { chromium } = createRequire(path.join(process.env.NALARO_BROWSER_TOOLS || path.join(os.tmpdir(), 'nalaro-release-tools'), 'package.json'))('playwright');
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.NALARO_CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
try {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => { if (r.status() >= 400 && new URL(r.url()).origin === new URL(base).origin) errors.push(`${r.status()} ${r.url()}`); });
  const results = [];
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto(base);
    assert.equal(response.status(), 200);
    await page.getByRole('heading', { name: 'Belajar bersama, lebih terarah.' }).waitFor();
    for (const img of await page.locator('.nlr-landing img').all()) {
      await img.scrollIntoViewIfNeeded();
      await img.evaluate(e => e.decode());
    }
    for (const theme of CLASS_THEMES) {
      await page.locator('.nlr-theme-options button').nth(CLASS_THEMES.indexOf(theme)).click();
      await page.locator('.nlr-theme-preview > img').evaluate(e => e.decode());
      assert.equal(await page.locator('.nlr-theme-preview > img').getAttribute('src'), `/images/class-themes/${theme.id}.webp`);
    }
    await page.locator('.nlr-theme-options button').first().click();
    for (const name of ['Titik pada gambar', 'Susun urutan', 'Pilihan gambar', 'Pilihan ganda']) {
      await page.getByRole('button', { name: new RegExp(name) }).click();
    }
    for (const name of ['Diskusi', 'Nalaro Live', 'Materi']) {
      await page.locator('.nlr-realclass__switcher').getByRole('button', { name: new RegExp(name) }).click();
      await page.locator('.nlr-story-photo img').evaluate(e => e.decode());
    }
    await page.evaluate(() => scrollTo(0, 0));
    const layout = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth, clipped: [...document.querySelectorAll('.nlr-landing button,.nlr-landing h1,.nlr-landing h2,.nlr-landing h3')].filter(e => {const r=e.getBoundingClientRect(); return r.width && (r.left < -2 || r.right > innerWidth+2 || e.scrollWidth > e.clientWidth+3);}).map(e => e.textContent) }));
    assert.equal(layout.scroll, layout.width);
    assert.deepEqual(layout.clipped, []);
    await page.screenshot({ path: path.join(directory, `landing-${width}.png`), fullPage: true });
    if (width === 1440) {
      for (const [label, id] of [['Tema kelas','dunia'],['Ruang belajar','platform'],['Jelajahi kuis','soal']]) {
        await page.getByRole('navigation').getByRole('link', { name: label }).click();
        const top = await page.locator(`#${id}`).evaluate(e => e.getBoundingClientRect().top);
        assert.ok(top >= 90 && top < 130, `${id}: heading hidden by header (${top})`);
      }
    }
    await page.locator('.nlr-header-login').click();
    await page.locator('.nlr-auth__form').waitFor();
    assert.equal(await page.getByRole('button', { name: 'Lanjutkan dengan Google' }).isVisible(), true);
    results.push({ width, themes: CLASS_THEMES.length, photos: 'decoded', quiz: '4 formats', story: '3 panels', auth: 'navigation only', layout: 'no overflow' });
    console.log(`PASS public landing ${width}px`);
  }
  assert.deepEqual(errors, []);
  await writeFile(path.join(directory, 'results.json'), JSON.stringify({ base, results, errors }, null, 2));
  console.log('PASS built landing: 5 viewport widths, 10 themes each, all photos, quiz/story switches, desktop anchors, auth navigation, no runtime/HTTP errors.');
} finally {
  await browser.close();
}
