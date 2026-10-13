/**
 * Living Worlds — theme-specific art direction and rendering contracts.
 *
 * Only status "ready" may be saved on a class. The other worlds are scaffolds,
 * deliberately not surfaced in the class-creation UI until art/QA is complete.
 * Animation is local to the browser; no simulation state goes to the Worker.
 */
export const LIVING_WORLD_CATALOG = Object.freeze({
  'deep-current': Object.freeze({
    id: 'deep-current',
    name: 'Deep Current',
    short: 'Ekspedisi Samudra',
    subtitle: 'Setiap penemuan dimulai dari keberanian menjelajah.',
    status: 'ready',
    style: 'underwater-organic',
    scene: 'ocean',
    creatures: Object.freeze(['reef-fish', 'blue-fish', 'gold-fish', 'jellyfish']),
    effects: Object.freeze(['bubbles', 'ripple', 'flee', 'coral-sway']),
    interactive: true,
    canvas: '#083d58',
    surface: '#104961',
    accent: '#83e4d5',
  }),
  'prism-city': Object.freeze({
    id: 'prism-city', name: 'Prism City', short: 'Kota Prisma',
    subtitle: 'Susun pengetahuan dari ribuan sudut pandang.',
    status: 'planned', style: 'faceted-mosaic', scene: 'prism',
    creatures: Object.freeze(['crystal-sprite']),
    effects: Object.freeze(['facet-drift', 'refract', 'scatter']),
    interactive: true,
  }),
  'paperbound': Object.freeze({
    id: 'paperbound', name: 'Paperbound World', short: 'Dunia Origami',
    subtitle: 'Setiap lembaran menyimpan sebuah petualangan.',
    status: 'planned', style: 'tactile-paper', scene: 'paper',
    creatures: Object.freeze(['origami-bird']),
    effects: Object.freeze(['paper-fall', 'fold', 'flutter']),
    interactive: true,
  }),
  'pixel-frontier': Object.freeze({
    id: 'pixel-frontier', name: 'Pixel Frontier', short: 'Petualangan Pixel',
    subtitle: 'Langkah kecil membangun petualangan besar.',
    status: 'planned', style: 'pixel-block', scene: 'pixel',
    creatures: Object.freeze(['pixel-sprite']),
    effects: Object.freeze(['sprite-walk', 'pixel-dissolve', 'burst']),
    interactive: true,
  }),
  'inventors-workshop': Object.freeze({
    id: 'inventors-workshop', name: "Inventor's Workshop", short: 'Bengkel Penemu',
    subtitle: 'Rakit ide, uji gagasan, temukan sesuatu yang baru.',
    status: 'planned', style: 'isometric-blueprint', scene: 'workshop',
    creatures: Object.freeze(['inventor-bot']),
    effects: Object.freeze(['gear-turn', 'circuit-pulse', 'bot-flee']),
    interactive: true,
  }),
});

export const READY_LIVING_WORLD_IDS = Object.freeze(Object.values(LIVING_WORLD_CATALOG)
  .filter((world) => world.status === 'ready').map((world) => world.id));

export function getLivingWorld(themeId) {
  return Object.hasOwn(LIVING_WORLD_CATALOG, themeId) ? LIVING_WORLD_CATALOG[themeId] : null;
}

export function isLivingWorldReady(themeId) {
  return getLivingWorld(themeId)?.status === 'ready';
}
