import { getLivingWorld, READY_LIVING_WORLD_IDS } from '../worlds/worldCatalog.js';
export const CLASS_THEMES = [
  { id: 'superhero', name: 'Superhero Academy', short: 'Akademi Pahlawan', subtitle: 'Setiap pelajaran adalah kekuatan baru.', symbol: '✦', accent: '#e9493b', backdrop: '#fff0d6', icon: 'shield' },
  { id: 'playground', name: 'Happy Playground', short: 'Taman Ceria', subtitle: 'Belajar, bermain, dan tumbuh bersama.', symbol: '✿', accent: '#e66b9c', backdrop: '#ffedf5', icon: 'smile' },
  { id: 'space', name: 'Space Explorers', short: 'Penjelajah Angkasa', subtitle: 'Pengetahuan baru menanti di setiap orbit.', symbol: '✧', accent: '#8274ed', backdrop: '#1c2452', icon: 'rocket' },
  { id: 'fantasy', name: 'Fantasy Quest', short: 'Petualangan Fantasi', subtitle: 'Buka halaman baru dalam petualanganmu.', symbol: '❖', accent: '#3f8360', backdrop: '#edf4df', icon: 'trees' },
  { id: 'studio', name: 'Creative Studio', short: 'Studio Kreatif', subtitle: 'Ruang untuk semua ide hebatmu.', symbol: '◈', accent: '#315deb', backdrop: '#f5f3e9', icon: 'palette' },
  ...READY_LIVING_WORLD_IDS.map((id) => {
    const world = getLivingWorld(id);
    return {
      id:world.id, name:world.name, short:world.short, subtitle:world.subtitle,
      symbol:'◉', accent:world.accent, backdrop:world.canvas, icon:'waves',
      collection:'living-worlds',
    };
  }),
];
export const DEFAULT_CLASS_THEME = 'classic';
export function getClassTheme(themeId) { return CLASS_THEMES.find((theme) => theme.id === themeId) || null; }
export function classThemeClass(themeId) { return getClassTheme(themeId) ? 'qz-theme-' + themeId : 'qz-theme-classic'; }
