'use client';
import {useEffect,useState} from 'react';
export default function OrderControls(){
 const [type,setType]=useState('delivery'),[address,setAddress]=useState(''),[count,setCount]=useState('0');
 useEffect(()=>{const el=document.getElementById('cartCount'); if(!el)return; const sync=()=>setCount(el.textContent||'0');sync();const observer=new MutationObserver(sync);observer.observe(el,{childList:true,characterData:true,subtree:true});return()=>observer.disconnect()},[]);
 function select(value){setType(value);document.querySelector('#typeSeg [data-type="'+value+'"]')?.click()}
 function update(value){setAddress(value);const input=document.getElementById('cAddress');if(input)input.value=value}
 return <><section className="order-controls wrap" aria-label="Order preferences"><div><span className="eyebrow">Fresh from our kitchen</span><h2>What are you craving?</h2></div><div className="seg"><button type="button" className={type==='delivery'?'active':''} aria-pressed={type==='delivery'} onClick={()=>select('delivery')}>Delivery</button><button type="button" className={type==='pickup'?'active':''} aria-pressed={type==='pickup'} onClick={()=>select('pickup')}>Pickup</button></div>{type==='delivery'?<label className="field">Deliver to<input value={address} onChange={e=>update(e.target.value)} placeholder="Enter your delivery address" autoComplete="street-address"/></label>:<p>Collect from the Amigos counter</p>}<a href="#menu" className="btn btn--red">Start your order →</a></section>{Number(count)>0&&<button className="mobile-bag btn btn--red" onClick={()=>document.getElementById('cartBtn')?.click()}><span>{count} items</span><strong>View your bag →</strong></button>}</>
}
