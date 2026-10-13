import { useEffect, useRef } from 'react';
import { findNearestCreature, getFleeVector } from './worldMotion.js';
import LivingWorldSprites from './LivingWorldSprites.jsx';

const PATHS = [
  { id:'wander-a', x:11, y:21, delay:-12, duration:34, size:74, reverse:false },
  { id:'wander-b', x:77, y:64, delay:-22, duration:44, size:66, reverse:true },
  { id:'wander-c', x:26, y:78, delay:-7, duration:39, size:62, reverse:false },
  { id:'wander-d', x:86, y:36, delay:-30, duration:48, size:55, reverse:true },
  { id:'wander-e', x:46, y:50, delay:-15, duration:47, size:63, reverse:false },
];
const SHARDS = [
  {x:8,y:12,d:12,w:20},{x:21,y:65,d:16,w:12},{x:39,y:19,d:22,w:24},
  {x:58,y:74,d:13,w:17},{x:76,y:13,d:18,w:22},{x:91,y:59,d:21,w:14},
  {x:34,y:85,d:14,w:11},{x:69,y:41,d:19,w:14},{x:13,y:80,d:18,w:19},
  {x:84,y:88,d:12,w:10},{x:52,y:6,d:23,w:14},{x:97,y:30,d:17,w:11},
];

export default function ExtendedLivingWorld({ world, budget, quiet = false }) {
  const rootRef = useRef(null);
  const still = budget.tier === 'still';
  const creatureCount = still ? 0 : quiet ? 1 : budget.fish;
  const travelPaths = PATHS.slice(0,creatureCount).map((path,index) => world.scene === 'workshop'
    ? { ...path, y: 68 + (index % 3) * 9 }
    : path);
  const particleCount = still ? 0 : quiet ? Math.min(3,budget.bubbles) : budget.bubbles;
  useEffect(() => {
    const root = rootRef.current;
    if (!root || still) return undefined;
    const classScope = root.closest('.qz-class-world-scope');
    const syncVisibility = () => { root.dataset.paused = document.hidden ? 'true' : 'false'; };
    syncVisibility();
    document.addEventListener('visibilitychange',syncVisibility);
    const reactToTouch = (event) => {
      if (quiet || !budget.fx || document.hidden || !event.isPrimary) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      const creatures = Array.from(root.querySelectorAll('[data-lw-creature]')).map((node)=>{
        const rect=node.getBoundingClientRect();
        return {node,x:rect.left+rect.width/2,y:rect.top+rect.height/2};
      });
      const nearest=findNearestCreature(creatures,event.clientX,event.clientY,
        window.innerWidth < 650 ? 88 : 140);
      if (!nearest) return;
      const offset=getFleeVector(nearest.x,nearest.y,event.clientX,event.clientY,64);
      const actor=nearest.node.querySelector('.lw-reaction');
      if (actor?.animate) {
        actor.getAnimations().forEach((a)=>a.cancel());
        actor.animate([
          {transform:'translate3d(0,0,0) rotate(0deg)',opacity:1},
          {transform:`translate3d(${offset.x}px,${offset.y}px,0) rotate(${offset.x > 0 ? 13 : -13}deg)`,
            opacity:.66,offset:.3},
          {transform:'translate3d(0,0,0) rotate(0deg)',opacity:1},
        ],{duration:world.scene==='pixel'?430:860,easing:world.scene==='pixel'?'steps(5,end)':'cubic-bezier(.22,.78,.3,1)'});
      }
      const viewport=root.querySelector('.lw-viewport');
      if (viewport) {
        const bounds=viewport.getBoundingClientRect();
        const effect=document.createElement('i');
        effect.className='lw-touch-ripple lw-touch-ripple--'+world.scene;
        effect.style.left=(event.clientX-bounds.left)+'px';
        effect.style.top=(event.clientY-bounds.top)+'px';
        viewport.appendChild(effect);
        effect.addEventListener('animationend',()=>effect.remove(),{once:true});
      }
    };
    classScope?.addEventListener('pointerdown',reactToTouch,{passive:true});
    return ()=>{
      document.removeEventListener('visibilitychange',syncVisibility);
      classScope?.removeEventListener('pointerdown',reactToTouch);
    };
  },[world.id,world.scene,quiet,budget.fx,still]);
  return <div ref={rootRef}
    className={'lw-overlay lw-overlay--'+world.scene}
    data-paused="false" data-quiet={quiet?'true':'false'} data-density={budget.tier}
    aria-hidden="true">
    <div className="lw-viewport">
      <div className="lw-environment" />
      {SHARDS.slice(0,particleCount).map((item,i)=><i key={i}
        className={'lw-world-particle lw-world-particle--'+world.scene}
        style={{'--p-x':item.x+'%','--p-y':item.y+'%','--p-size':item.w+'px',
          '--p-dur':item.d+'s','--p-delay':(-i*3.3)+'s'}} />)}
      {travelPaths.map((path)=><span key={path.id}
        className={'lw-world-creature '+(path.reverse?'lw-world-creature--reverse':'')}
        data-lw-creature="true"
        style={{'--lw-y':path.y+'%','--lw-duration':path.duration+'s',
          '--lw-delay':path.delay+'s','--lw-width':path.size+'px'}}>
        <span className="lw-reaction"><span className="lw-world-character">
          <LivingWorldSprites worldId={world.id} />
        </span></span>
      </span>)}
    </div>
  </div>;
}
