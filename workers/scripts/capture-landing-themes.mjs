import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { CLASS_THEMES } from '../../src/features/classes/classThemes.js';

// Capture the current classroom components, never production accounts or data.
// Run with Vite on port 5173, then export the PNGs to WebP for the landing page.
const root = path.resolve(import.meta.dirname, '../..');
const directory = path.join(root, 'workers/.wrangler/landing-theme-captures');
const base = process.env.NALARO_PUBLIC_URL || 'http://127.0.0.1:5173';
const { chromium } = createRequire(path.join(process.env.NALARO_BROWSER_TOOLS || path.join(os.tmpdir(), 'nalaro-release-tools'), 'package.json'))('playwright');
await mkdir(directory, { recursive: true });
await writeFile(path.join(directory, 'preview.html'), '<!doctype html><html lang="id"><meta charset="UTF-8"><div id="root"></div><script type="module" src="./preview.jsx"></script></html>');
await writeFile(path.join(directory, 'preview.jsx'), `
import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '/src/index.css';
import ClassThemeScope from '/src/components/classroom/ClassThemeScope.jsx';
import ClassOverview from '/src/pages/ClassOverview.jsx';
createRoot(document.getElementById('root')).render(<MemoryRouter initialEntries={['/student/classes/preview/overview']}><div id="capture"><ClassThemeScope><Routes><Route path="/student/classes/:classId/overview" element={<ClassOverview role="student" />} /></Routes></ClassThemeScope></div></MemoryRouter>);
`);
const browser = await chromium.launch({ headless: true, executablePath: process.env.NALARO_CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
try {
  const context = await browser.newContext({ viewport: { width: 1120, height: 820 }, reducedMotion: 'reduce' });
  await context.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.origin !== new URL(base).origin) return route.abort();
    if (url.pathname === '/src/services/class.service.js') return route.fulfill({ contentType: 'application/javascript', body: `
      export const getClass=async()=>({id:'preview',name:'Matematika · Kelas 7A',description:'Materi, diskusi, dan latihan untuk pertemuan minggu ini.',themeId:new URLSearchParams(location.search).get('theme'),status:'active',teacherName:'Guru contoh',studentsCount:28});
      export const listClassMembers=async()=>[];
      export const classErrorMessage=()=> 'Contoh kelas';
    ` });
    return route.continue();
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  for (const theme of CLASS_THEMES) {
    await page.goto(`${base}/workers/.wrangler/landing-theme-captures/preview.html?theme=${theme.id}`);
    await page.getByRole('heading', { name: 'Matematika · Kelas 7A', exact: true }).waitFor();
    await page.locator(`[data-world="${theme.id}"]`).waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: '#capture { width:1120px;height:1080px;overflow:hidden; } .qz-enter { animation:none!important; } .qz-overview-grid > section:nth-child(n+3) { display:none; }' });
    await page.locator('.qz-world-banner').waitFor();
    // Let lazy world artwork settle before freezing the representative frame.
    await page.waitForTimeout(350);
    await page.locator('#capture').screenshot({ path: path.join(directory, `${theme.id}.png`) });
    console.log(`Captured ${theme.id}`);
  }
  if (errors.length) throw new Error(errors.join('\n'));
} finally {
  await browser.close();
}
