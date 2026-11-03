'use client';
import {useRef,useState} from 'react';
import clips from '../../data/reference-clips.json';
function Clip({clip,index}){
 const ref=useRef(null),[playing,setPlaying]=useState(false),[error,setError]=useState(false);
 async function toggle(){if(playing){ref.current.pause();setPlaying(false)}else{try{await ref.current.play();setPlaying(true)}catch{setError(true)}}}
 return <figure><video ref={ref} poster={'/bucks/clip-'+index+'.jpg'} src={clip.src} playsInline muted loop preload="none" aria-label={'Sauce video by '+clip['aria-label']} onPause={()=>setPlaying(false)} onError={()=>setError(true)}/><button className="clip-play" onClick={toggle} aria-label={(playing?'Pause':'Play')+' video by '+clip['aria-label']}><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">{playing?<path d="M6 4h4v16H6zm8 0h4v16h-4z" fill="currentColor"/>:<path d="m7 3 15 9-15 9z" fill="currentColor"/>}</svg></button><figcaption>{clip['aria-label']}{error&&<small>Video unavailable</small>}</figcaption></figure>
}
export default function Community(){const [paused,setPaused]=useState(false);return <section className="community"><h2 data-reveal>Sauce in <span className="outline-type">the wild</span></h2><div className={'community-track '+(paused?'paused':'')}>{[...clips,...clips].map((c,i)=><Clip key={i} clip={c} index={i%clips.length}/>)}</div><button className="marquee-toggle" onClick={()=>setPaused(p=>!p)} aria-pressed={paused}>{paused?'Resume motion':'Pause motion'}</button></section>}
