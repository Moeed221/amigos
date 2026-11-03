'use client';
import {useEffect,useRef} from 'react';
const positions={heart_eyes:[16,0,100,0,1],cool:[10,0,105,7,1],fire_breathing:[20,0,70,10,-1],sassy:[40,0,110,0,1],sweating:[5,-5,80,0,1],grinning:[20,15,75,-25,1]};
export default function Character({src,expression='heart_eyes',className='',...props}){
 const face=useRef(null);
 useEffect(()=>{let animation,observer,cancelled=false,visible=false;const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  function motion(){if(!animation)return;if(reduced.matches)animation.goToAndStop(20,true);else if(visible)animation.play();else animation.pause()}
  import('lottie-web/build/player/lottie_light').then(({default:lottie})=>{if(cancelled||!face.current)return;animation=lottie.loadAnimation({container:face.current,renderer:'svg',loop:true,autoplay:false,path:'/bucks/motion/'+expression+'.json'});animation.addEventListener('DOMLoaded',motion);observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;motion()});observer.observe(face.current);reduced.addEventListener('change',motion)}).catch(()=>{});
  return()=>{cancelled=true;observer?.disconnect();reduced.removeEventListener('change',motion);animation?.destroy()};
 },[expression]);
 const [top,left,width,rotate,scale]=positions[expression];
 return <span className={'fruit-character '+className} {...props} aria-hidden="true"><img src={src} alt=""/><span ref={face} className="character-face" style={{top:top+'%',left:left+'%',width:width+'%',transform:`rotate(${rotate}deg) scaleX(${scale})`}}/></span>
}
