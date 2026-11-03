'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
export function Motion(){
 const path=usePathname();
 useEffect(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');obs.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('[data-reveal]').forEach(e=>obs.observe(e));
  let tick=0;
  function update(){tick=0;document.documentElement.style.setProperty('--page-scroll',scrollY+'px');document.documentElement.classList.toggle('page-scrolled',scrollY>140);document.querySelectorAll('[data-word-reveal]').forEach(e=>{const r=e.getBoundingClientRect(),words=e.querySelectorAll('[data-word]'),progress=(innerHeight*.82-r.top)/(innerHeight*.62);words.forEach((w,i)=>w.style.setProperty('--word-opacity',reduced?1:Math.max(.22,Math.min(1,progress*words.length-i))))});if(reduced)return;document.querySelectorAll('[data-parallax]').forEach(e=>{const r=e.getBoundingClientRect(),speed=Number(e.dataset.parallax);e.style.setProperty('--drift',Math.max(-180,Math.min(180,(innerHeight/2-r.top-r.height/2)*speed))+'px')})}
  function scroll(){if(!tick)tick=requestAnimationFrame(update)}
  update();window.addEventListener('scroll',scroll,{passive:true});return()=>{obs.disconnect();cancelAnimationFrame(tick);window.removeEventListener('scroll',scroll)};
 },[path]);return null;
}
export function Roll({children}){return <span className="roll"><span>{children}</span><span aria-hidden="true">{children}</span></span>}
export function Flourish(){return <svg className="flourish" width="150" height="55" viewBox="0 0 150 55" fill="none" aria-hidden="true"><path d="M9 18C-9-5 31 0 75 29s70 27 64 8C130 9 24 70 12 39S95 9 138 15C168 20 129 57 75 29S3 5 9 18Z" stroke="currentColor" strokeWidth="2"/></svg>}

export function RevealText({children}){return <span data-word-reveal>{children.split(' ').map((word,i)=><span key={i} data-word>{word}{' '}</span>)}</span>}
