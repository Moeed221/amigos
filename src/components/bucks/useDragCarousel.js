'use client';
import {useRef} from 'react';
// Native touch scrolling for rails; pointer gestures for mouse dragging and slides.
export default function useDragCarousel({ref,onSwipe}={}){
 const gesture=useRef(null),dragged=useRef(false);
 function finish(e,cancel=false){const g=gesture.current;if(!g)return;gesture.current=null;const el=ref?.current||e.currentTarget;el.classList.remove('is-dragging');if(el.hasPointerCapture?.(e.pointerId))el.releasePointerCapture(e.pointerId);if(!cancel&&g.horizontal&&onSwipe&&Math.abs(e.clientX-g.x)>45)onSwipe(e.clientX<g.x?1:-1);}
 return {
  onDragStart:e=>e.preventDefault(),
  onPointerDown:e=>{dragged.current=false;if(e.button!==0||!onSwipe&&e.pointerType!=='mouse'||e.target.closest('button,input,select,textarea'))return;const el=ref?.current||e.currentTarget;gesture.current={x:e.clientX,y:e.clientY,left:el.scrollLeft,horizontal:false};},
  onPointerMove:e=>{const g=gesture.current;if(!g)return;const dx=e.clientX-g.x,dy=e.clientY-g.y;if(!g.horizontal&&Math.abs(dy)>12&&Math.abs(dy)>Math.abs(dx)){gesture.current=null;return;}if(!g.horizontal&&Math.abs(dx)>8&&Math.abs(dx)>Math.abs(dy)){g.horizontal=true;dragged.current=true;const el=ref?.current||e.currentTarget;el.setPointerCapture(e.pointerId);el.classList.add('is-dragging');}if(g.horizontal){if(e.cancelable)e.preventDefault();if(!onSwipe)(ref?.current||e.currentTarget).scrollLeft=g.left-dx;}},
  onPointerUp:e=>finish(e),onPointerCancel:e=>finish(e,true),
  onPointerLeave:e=>{if(gesture.current&&!gesture.current.horizontal)finish(e,true)},
  onClickCapture:e=>{if(dragged.current){e.preventDefault();e.stopPropagation();dragged.current=false;}}
 };
}
