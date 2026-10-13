# NalaroClass — Living Worlds Implementation Blueprint

**Phase:** Deep Current pilot implemented; four worlds scaffolded but not released.
**Last updated:** 2026-10-13.
**Scope:** `/:role/classes/:classId/*` only; global dashboards, account pages, and existing five themes remain unchanged.

## 1. Contract and rollout

- `src/features/worlds/worldCatalog.js` is the source of truth for Living World art direction, texture, character and effects manifests.
- World `status: 'ready'` is the **only** status eligible for `CLASS_THEMES` (see `src/features/classes/classThemes.js`). Currently only `deep-current`.
- `status: 'planned'` worlds are **not** selectable and are not accepted by the Worker.
- Worker `workers/src/validation/classes.js` enumerates only completed theme IDs. This protects permanent theme identity in D1.
- `GET /classes/capabilities` advertises `themeIds`. Teacher class creation shows a new Living World only after the deployed Worker lists it, maintaining compatibility when Pages deploys before the Worker. No database migrations are required.
- Theme cannot be edited after creating the class; the existing `trg_classes_theme_immutable` D1 trigger continues to enforce this.

## 2. Frontend-only runtime architecture

```text
ClassThemeScope  (gets stored themeId from existing class API)
 ├── ClassWorldScene / DeepCurrentArtwork  (static SVG hero)
 ├── LivingWorldEngine  (React.lazy; imported only for ready worlds)
 │    ├── worldCatalog + worldMotion (pure JS, tested)
 │    ├── OceanSprites (custom SVG fish and jellyfish)
 │    ├── CSS-driven ambient animation (fish, bubbles, lights)
 │    ├── pointerdown event listener on class root (passive)
 │    └── Web Animations API (one-shot flee) + CSS one-shot ripple
 └── Class modules (existing LMS components unchanged)
```

No server renders frames, no simulation data is saved, no extra API or D1 table for effects.
SVG is bundled with frontend assets served by Cloudflare Pages CDN.

## 3. Layering and click safety

```text
z-index 0   class canvas + static CSS textures
z-index 1   class navigation, reading content, quiz inputs, cards
z-index 6   ambient overlay with pointer-events:none
```

The overlay has **no hitbox**. A passive pointerdown listener on the actual classroom root checks screen coordinates against the closest SVG creature's bounding box. It animates an inner `lw-reaction` wrapper, **never calls preventDefault or stopPropagation**, and therefore leaves native links, buttons and touch scrolling functional. Limit a reaction to the nearest creature within 90px (mobile) or 145px (desktop).

For high-concentration actions (reading a material, answering a quiz/task), `quiet` mode automatically keeps only one fish and up to three bubbles, with reduced opacity, and skips pointer reactions.

## 4. Automated density (no settings UI)

| Environment | Fish | Bubbles | Jellyfish |
| --- | ---: | ---: | ---: |
| Desktop capable | 5 | 12 | 1 |
| Ordinary tablet / modest hardware | 3 | 7 | 1 |
| Narrow mobile / constrained hardware | 2 | 4 | 0 |
| OS reduced-motion | 0 | 0 | 0 |

Pure policy in `worldMotion.js`, tested by `worldMotion.test.js`.
Initial rendering uses conservative hints from viewport, CPU concurrency, available device memory, and `saveData`; an optional **short** 36-frame sample can downgrade density when frames are frequently delayed. Never poll a performance endpoint or update React state on each animation frame.

- CSS `transform` and `opacity` are animated; no scrolling canvas redraw.
- Pause CSS animations when `document.hidden`.
- Reduced motion has a static reef fallback and no decorative moving creatures.
- Do not add translucent animated blur layers, video backgrounds, WebGL or Three.js.
- Use deterministic arrays, not random positions created on every render.

## 5. Art and component contracts for the next four worlds

Each new world requires:

1. Fill/extend its `worldCatalog.js` preset, keeping `status:'planned'` until visual QA.
2. Build original static environment artwork, theme tokens and a custom SVG sprite vocabulary. No generic mascot reused from other worlds.
3. Implement a browser-only scene adapter using the shared `worldMotion.js` helpers and a click-through overlay. Keep reactions scoped to a character's inner transform wrapper.
4. Add matching shapes/texture for canvas, navigation, cards, quiz/progress, inputs, badges, and class gallery.
5. Add test cases and mobile reduced-motion QA.
6. Change `status` to `ready`, add the ID to Worker validation/capabilities and deploy Worker **before** exposing the new option in the frontend.

### Scene directions

| World ID | Material & atmosphere | Ambient | Tap response |
| --- | --- | --- | --- |
| `prism-city` | Faceted mosaic, cut-corner cards | Floating shards, refractive glints | Small facet scatter / regroup |
| `paperbound` | Paper fibres, offset layers, bookmark tabs | Origami birds, paper leaves | Short paper flutter / flee |
| `pixel-frontier` | Pixel-block terrain, stepped borders | Sprites, pixel clouds | Burst of pixel squares and sprite run |
| `inventors-workshop` | Blueprint grid, mechanical panels | Robot walkers, slow gears | Circuit pulse and bot avoidance |

Only the runtime's **visual behavior** varies. All LMS material/task/quiz data flows remain the existing backend APIs.

## 6. QA and deployment

- `npm run validate` covers lint/build and frontend/backend/Worker unit tests, including the new pure world policy.
- Test the original five themes and Classic as regression baselines.
- Check Deep Current in teacher/student overview, materials, tasks, quizzes, attendance, analytics, mobile screens 390px and desktop 1440px.
- Test browser clicking an LMS button while a fish is visually in front: the underlying click must still register.
- Check no horizontal overflow, no fish blocking focus rings or labels, and text contrast.
- Test on `prefers-reduced-motion: reduce`, a narrow device and with a hidden tab.
- Check Cloudflare Pages branch preview before merging.
- **Worker must be deployed from the same main commit** to make `deep-current` selectable; the frontend gates the option based on API capabilities so older Workers still work.
- No D1 migration and no additional Worker, Durable Object or WebSocket deployment for the animation engine.
