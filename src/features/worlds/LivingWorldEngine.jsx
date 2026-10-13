import { useEffect, useMemo, useRef, useState } from 'react';
import { getLivingWorld } from './worldCatalog.js';
import { findNearestCreature, getFleeVector, getWorldEntityBudget } from './worldMotion.js';
import OceanSprites from './OceanSprites.jsx';
import ExtendedLivingWorld from './ExtendedLivingWorld.jsx';
import './living-worlds-extended.css';
import './living-worlds.css';

/** Deterministic lanes avoid layout jank and hydration/refresh movement jumps. */
const FISH_LANES = [
  { id:'f1', species:'blue', y:19, duration:29, delay:-11, scale:.95, reverse:false, width:71 },
  { id:'f2', species:'gold', y:38, duration:37, delay:-21, scale:.8, reverse:true, width:65 },
  { id:'f3', species:'reef', y:69, duration:33, delay:-9, scale:1.05, reverse:false, width:80 },
  { id:'f4', species:'gold', y:84, duration:43, delay:-30, scale:.75, reverse:true, width:60 },
  { id:'f5', species:'blue', y:55, duration:36, delay:-18, scale:1.1, reverse:false, width:92 },
];
const BUBBLE_LANES = [
  [5,0,19,5],[13,-10,15,3],[25,-5,23,7],[36,-15,18,4],[48,-8,24,3],
  [59,-22,22,5],[68,-17,17,4],[76,-2,28,7],[84,-12,19,4],[91,-6,25,6],
  [33,-17,21,3],[97,-23,18,4],
];

function browserBudget() {
  if (typeof window === 'undefined') return getWorldEntityBudget({ reducedMotion:true });
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return getWorldEntityBudget({
    width: window.innerWidth,
    reducedMotion: motion,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: navigator.deviceMemory,
    saveData: Boolean(navigator.connection?.saveData),
  });
}

function useAdaptiveDensity() {
  const [budget, setBudget] = useState(browserBudget);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let resizeFrame = 0;
    const update = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => setBudget(browserBudget()));
    };
    window.addEventListener('resize', update, { passive:true });
    media.addEventListener?.('change', update);
    return () => {
      window.removeEventListener('resize', update);
      media.removeEventListener?.('change', update);
      cancelAnimationFrame(resizeFrame);
    };
  }, []);
  // One short measurement at mount; never run a permanent JS animation loop.
  useEffect(() => {
    if (budget.tier === 'still' || budget.tier === 'low') return undefined;
    let raf = 0;
    let count = 0;
    let jank = 0;
    let previous = 0;
    const frame = (now) => {
      if (previous && now - previous > 45) jank += 1;
      previous = now;
      count += 1;
      if (count >= 36) {
        if (jank >= 10) setBudget((current) => current.tier === 'full'
          ? getWorldEntityBudget({ width:700 })
          : getWorldEntityBudget({ width:380 }));
      } else raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  // The initial sample only: density changes from resize/media still work via the other effect.
  }, []);
  return budget;
}

/** Absolutely positioned, click-through ambient layer mounted only for ready worlds. */
export default function LivingWorldEngine({ themeId, quiet = false }) {
  const world = getLivingWorld(themeId);
  const overlayRef = useRef(null);
  const budget = useAdaptiveDensity();
  const active = world?.status === 'ready' && world.scene === 'ocean';
  const fishCount = quiet ? Math.min(1, budget.fish) : budget.fish;
  const bubbleCount = quiet ? Math.min(3, budget.bubbles) : budget.bubbles;
  const fish = useMemo(() => FISH_LANES.slice(0, fishCount), [fishCount]);
  const bubbles = useMemo(() => BUBBLE_LANES.slice(0, bubbleCount), [bubbleCount]);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!active || !overlay) return undefined;
    const classRoot = overlay.closest('.qz-class-world-scope');
    const onVisibility = () => { overlay.dataset.paused = document.hidden ? 'true' : 'false'; };
    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);

    const onPointerDown = (event) => {
      if (!event.isPrimary || !budget.fx || quiet || document.hidden) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      // The scene has pointer-events:none: normal buttons and links receive clicks.
      const windowBox = overlay.querySelector('.lw-viewport')?.getBoundingClientRect();
      if (!windowBox) return;
      const creatures = [...overlay.querySelectorAll('[data-lw-creature]')].map((node) => {
        const rect = node.getBoundingClientRect();
        return { node, x:rect.left + rect.width / 2, y:rect.top + rect.height / 2 };
      });
      const nearest = findNearestCreature(creatures, event.clientX, event.clientY,
        window.innerWidth < 650 ? 90 : 145);
      if (!nearest) return;
      const displacement = getFleeVector(nearest.x, nearest.y, event.clientX, event.clientY, 66);
      const reaction = nearest.node.querySelector('.lw-reaction');
      if (reaction?.animate) {
        reaction.getAnimations().forEach((animation) => animation.cancel());
        reaction.animate([
          { transform:'translate3d(0,0,0) rotate(0deg)', opacity:1 },
          { transform:`translate3d(${displacement.x}px,${displacement.y}px,0) rotate(${displacement.x > 0 ? 11 : -11}deg)`, opacity:.74, offset:.32 },
          { transform:'translate3d(0,0,0) rotate(0deg)', opacity:1 },
        ], { duration:920, easing:'cubic-bezier(.24,.75,.28,1)' });
      }
      const ripple = document.createElement('span');
      ripple.className = 'lw-touch-ripple';
      ripple.style.left = (event.clientX - windowBox.left) + 'px';
      ripple.style.top = (event.clientY - windowBox.top) + 'px';
      ripple.addEventListener('animationend', () => ripple.remove(), { once:true });
      overlay.querySelector('.lw-viewport')?.appendChild(ripple);
    };

    classRoot?.addEventListener('pointerdown', onPointerDown, { passive:true });
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      classRoot?.removeEventListener('pointerdown', onPointerDown);
    };
  }, [active, budget.fx, quiet]);

  if (world?.status === 'ready' && world.scene !== 'ocean') return <ExtendedLivingWorld world={world} budget={budget} quiet={quiet} />;
  if (!active) return null;
  return <div className="lw-overlay" ref={overlayRef} aria-hidden="true" data-density={budget.tier} data-quiet={quiet ? 'true' : 'false'}>
    <div className="lw-viewport">
      <div className="lw-water-rays"/>
      <div className="lw-seafloor">
        <svg viewBox="0 0 1200 125" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 95q120-38 245-16 120 27 240-6 150-35 303 11 168-22 412-17v58H0Z" fill="#126c79"/>
          <path d="M0 115q80-19 200-9t230-10 210 12 250-15 310 5v27H0Z" fill="#248d87"/>
          <g fill="none" strokeLinecap="round">
            <g className="lw-anemone lw-anemone--a"><path d="M80 120Q50 71 76 44M83 119Q98 79 128 66" stroke="#6db59e" strokeWidth="10"/></g>
            <g className="lw-anemone lw-anemone--c"><path d="M265 124Q244 89 255 51M288 121Q310 78 336 74" stroke="#6db59e" strokeWidth="10"/></g>
            <g className="lw-anemone lw-anemone--b"><path d="M980 125Q955 68 976 37M1006 125Q1032 78 1050 54" stroke="#e8a49a" strokeWidth="10"/></g>
            <g className="lw-anemone lw-anemone--d"><path d="M1120 125Q1099 72 1118 41" stroke="#e8a49a" strokeWidth="10"/></g>
            <g className="lw-anemone lw-anemone--e"><path d="M620 125Q607 90 587 79M623 125Q648 82 659 69" stroke="#8fd0b0" strokeWidth="9"/></g>
            <g className="lw-anemone lw-anemone--f" stroke="#e6a8a0" strokeWidth="8">
              <path d="M438 125Q416 101 419 68M445 125Q445 90 463 61M455 125Q474 100 482 83"/>
              <circle cx="419" cy="68" r="6" fill="#f5b5a3" stroke="none"/>
              <circle cx="463" cy="61" r="6" fill="#ffd0ae" stroke="none"/>
              <circle cx="482" cy="83" r="6" fill="#f5b5a3" stroke="none"/>
            </g>
          </g>
          <path d="m424 110 8-17 12 13 16-5-7 18 8 13-17-7-13 10-1-19Z" fill="#eec08d"/>
        </svg>
      </div>
      {bubbles.map(([x,delay,duration,size],i) => <i key={i} className="lw-bubble"
        style={{ '--lw-x':x + '%', '--lw-delay':delay + 's', '--lw-duration':duration + 's', '--lw-size':size + 'px' }}/>)}
      {fish.map((item) => <span key={item.id} className={'lw-swimmer ' + (item.reverse ? 'lw-swimmer--reverse' : '')}
        data-lw-creature="true" style={{
          '--lw-y':item.y + '%', '--lw-duration':item.duration + 's',
          '--lw-delay':item.delay + 's', '--lw-width':item.width + 'px'
        }}>
        <span className="lw-reaction"><span className="lw-fish-facing"><OceanSprites species={item.species}/></span></span>
      </span>)}
      {budget.jellyfish > 0 && !quiet ? <span className="lw-jellyfish" data-lw-creature="true">
        <span className="lw-reaction"><OceanSprites species="jellyfish" /></span>
      </span> : null}
    </div>
  </div>;
}
