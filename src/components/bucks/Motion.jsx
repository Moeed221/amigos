'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
const clamp=(n,min=0,max=1)=>Math.min(max,Math.max(min,n));
export function Motion(){
 const path=usePathname();
 useEffect(()=>{
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  let tick=0,words=[],parallax=[],stacks=[],reasons=[],hero=null;
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target)}}),{threshold:.08});
  function collect(){document.querySelectorAll('[data-reveal]:not(.is-visible)').forEach(e=>observer.observe(e));words=[...document.querySelectorAll('[data-word-reveal]')];parallax=[...document.querySelectorAll('[data-parallax]')];stacks=[...document.querySelectorAll('[data-card-stack]')];hero=document.querySelector('[data-hero-scene]');reasons=[...document.querySelectorAll('[data-reasons]')];schedule()}
  function update(){
   tick=0;const reduced=media.matches,h=innerHeight;
   document.documentElement.classList.toggle('page-scrolled',scrollY>140);
   for(const e of words){const rect=e.getBoundingClientRect(),spans=e.querySelectorAll('[data-word]'),progress=clamp((h*.86-rect.top)/(h*.54));spans.forEach((w,i)=>w.style.setProperty('--word-opacity',reduced?1:.22+.78*clamp(progress*(spans.length+3)-i)))}
   for(const e of parallax){const r=e.getBoundingClientRect();if(r.bottom< -300||r.top>h+300)continue;const speed=Number(e.dataset.parallax)||0;e.style.setProperty('--drift',(reduced?0:clamp((h*.5-r.top-r.height*.5)*speed,-160,160))+'px')}
   for(const stack of stacks){const rect=stack.getBoundingClientRect(),cards=[...stack.querySelectorAll('[data-stack-card]')],travel=rect.height-h;const progress=clamp(-rect.top/Math.max(1,travel));cards.forEach((card,i)=>{const entered=i===0?1:clamp(progress*(cards.length+.2)-i+.7);const settled=clamp(progress*(cards.length+.2)-i-.3);card.style.setProperty('--stack-y',reduced?'0%':(1-entered)*135+'%');card.style.setProperty('--stack-x',reduced?'0%':(1-entered)*(i%2?-25:25)+'%');card.style.setProperty('--stack-angle',reduced?'0deg':((1-entered)*(i%2?5:-5))+'deg');card.style.setProperty('--stack-alpha',reduced||entered>0?1:0)})}
   if(innerWidth>800){for(const section of reasons){const r=section.getBoundingClientRect(),progress=clamp(-r.top/Math.max(1,r.height-h))*2;section.querySelectorAll('[data-reason]').forEach((card,i)=>{const angle=(i-progress)*.62;card.style.setProperty('--reason-x',Math.sin(angle)*Math.max(1000,innerWidth*.9)+'px');card.style.setProperty('--reason-y',(1-Math.cos(angle))*700+'px');card.style.setProperty('--reason-turn',angle*180/Math.PI+'deg');card.style.setProperty('--reason-opacity',1)})}}
   if(hero){const r=hero.getBoundingClientRect(),amount=reduced?0:clamp(-r.top,0,h);hero.style.setProperty('--hero-drift',amount*.22+'px');hero.style.setProperty('--hero-turn',amount*.014+'deg');hero.style.setProperty('--hero-heading-drift',amount*.06+'px')}
  }
  function schedule(){if(!tick)tick=requestAnimationFrame(update)}
  const mutations=new MutationObserver(collect);mutations.observe(document.getElementById('main'),{childList:true,subtree:true});
  collect();window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);media.addEventListener('change',schedule);
  return()=>{observer.disconnect();mutations.disconnect();cancelAnimationFrame(tick);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);media.removeEventListener('change',schedule)};
 },[path]);return null;
}
export function Roll({children}){return <span className="roll"><span>{children}</span><span aria-hidden="true">{children}</span></span>}
export function Flourish(){return <svg className="flourish" width="150" height="55" viewBox="0 0 150 55" fill="none" aria-hidden="true"><path d="M9 18C-9-5 31 0 75 29s70 27 64 8C130 9 24 70 12 39S95 9 138 15C168 20 129 57 75 29S3 5 9 18Z" stroke="currentColor" strokeWidth="2"/></svg>}
export function RevealText({children}){return <span data-word-reveal>{children.split(' ').map((word,i)=><span key={i} data-word>{word}{' '}</span>)}</span>}
