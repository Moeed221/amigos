'use client';
import {useEffect,useRef,useState} from 'react';
import {useSearchParams} from 'next/navigation';
import Icon from './Icons';
import {getTracking,getOrders} from '../lib/demo-data';

import {money} from './ShopProvider';
export default function TrackingPage(){
  const initialCode=useSearchParams().get('code')?.trim().toUpperCase()||'';
  const [input,setInput]=useState(initialCode),[code,setCode]=useState(initialCode),[order,setOrder]=useState(null);
  const [loading,setLoading]=useState(Boolean(initialCode)),[error,setError]=useState(''),[recent,setRecent]=useState('');
  const [updated,setUpdated]=useState(''),[attempt,setAttempt]=useState(0);
  const inputRef=useRef(null);
  useEffect(()=>{
    let active=true;
    getOrders().then(orders=>{if(active&&orders[0])setRecent(orders[0].code)}).catch(()=>{});
    return()=>{active=false};
  },[]);
  useEffect(()=>{
    if(!code)return;
    let active=true,timer;
    async function poll(){
      try{
        const next=await getTracking(code);
        if(!active)return;
        setOrder(next);setError('');setLoading(false);
        setUpdated(new Date().toLocaleTimeString('en-PK',{hour:'2-digit',minute:'2-digit',second:'2-digit'}));
        if(!['delivered','cancelled'].includes(next.status))timer=setTimeout(poll,4000);
      }catch{
        if(!active)return;
        setLoading(false);setError('No order found with this code. Check your confirmation and try again. Demo orders are available only in the browser where you placed them.');
      }
    }
    poll();return()=>{active=false;clearTimeout(timer)};
  },[code,attempt]);
  function track(value){
    const normalized=value.trim().toUpperCase();
    if(!/^AMG-[A-Z0-9]{4}$/.test(normalized)){setCode('');setOrder(null);setLoading(false);setError('Enter a valid order code, for example AMG-A2B3.');inputRef.current?.focus();return}
    setLoading(true);setOrder(null);setInput(normalized);setCode(normalized);setAttempt(n=>n+1);setError('');
    window.history.replaceState(null,'','/track?code='+encodeURIComponent(normalized));
  }
  const pickup=order?.type==='pickup';
  const cancelled=order?.status==='cancelled',complete=order?.status==='delivered';
  const ready=pickup&&['on_the_way','arriving'].includes(order?.status);
  const status=cancelled?'Order cancelled':pickup?(complete?'Collected':ready?'Ready for pickup':order?.statusLabel):order?.statusLabel;
  const pickupIndex=complete?3:ready?2:order?.status==='preparing'?1:0;
  const timeline=pickup?[
    ['Order received','Your order is confirmed.'],['Preparing your order','We’re packing your items.'],['Ready for pickup','Collect from the Amigos counter.'],['Collected','Enjoy the flavour, amigo!']
  ].map(([label,detail],i)=>({label,detail,done:i<pickupIndex||complete,active:i===pickupIndex&&!complete})):order?.timeline||[];
  return <><link rel="stylesheet" href="/css/tracking.css"/>
  <div className="track-page">
  <div id="tracking-main" className="track-main">
    <div className="track-intro"><span className="eyebrow">From Amigos to you</span><h1>Track your order<span>.</span></h1><p>Enter the code from your order confirmation.</p></div>
    <section className="track-card track-lookup" aria-label="Find your order"><form onSubmit={e=>{e.preventDefault();track(input)}}><label htmlFor="order-code">Order code</label><div><input ref={inputRef} id="order-code" value={input} onChange={e=>{setInput(e.target.value);if(error)setError('')}} placeholder="AMG-A2B3" autoComplete="off" autoCapitalize="characters" spellCheck={false} required maxLength={20} aria-describedby="tracking-help" aria-invalid={!!error}/><button className="btn btn--red" disabled={loading}>{loading?'Finding order…':'Track order'}<Icon name="arrow" size={17}/></button></div><small id="tracking-help">Local demo · updates simulate order progress in this browser.</small></form>{error&&<p className="track-error" role="alert">{error}</p>}{!code&&recent&&<button className="track-recent" onClick={()=>track(recent)}>Track your latest order <strong>{recent}</strong> <Icon name="arrow" size={16}/></button>}</section>
    {loading&&<p className="track-loading" role="status">Looking up your order…</p>}
    {order&&<div className="track-results"><section className="track-card track-status" aria-labelledby="status-title"><div className="track-order-meta"><strong>{order.code}</strong><span>{pickup?'Pickup':'Delivery'}</span></div><div className="track-status-title" aria-live="polite"><span className={'track-status-icon '+(cancelled?'cancelled':'')} aria-hidden="true"><Icon name={cancelled?'close':complete||ready?'check':'clock'} size={26}/></span><div><h2 id="status-title">{status}</h2><p>{cancelled?'This order will not be fulfilled.':complete?'Thanks for ordering with Amigos.':ready?'Your order is ready at the counter.':order.statusCopy}</p></div></div>
    {!cancelled&&!complete&&!ready&&<div className="track-eta"><div><small>{pickup?'Estimated preparation':'Estimated arrival'}</small><strong>{order.etaMinutes} <span>min</span></strong></div><span className="track-demo">Demo ×{order.demo?.speed||1}</span></div>}
    {!cancelled&&<ol className="track-timeline">{timeline.map((step,i)=><li key={step.label} className={step.done?'done':step.active?'active':''} aria-current={step.active?'step':undefined}><span aria-hidden="true">{step.done?<Icon name="check" size={17}/>:i+1}</span><div><strong>{step.label}</strong><p>{step.detail}</p></div></li>)}</ol>}
    <small className="track-updated">{complete||cancelled?'Final status':'Updates automatically'} · Updated {updated}</small></section>
    <section className="track-card track-summary" aria-labelledby="summary-title"><h2 id="summary-title">Order details</h2><dl><div><dt>{pickup?'Pickup from':'Delivering to'}</dt><dd>{pickup?'Amigos counter':order.customer?.address||'Your saved address'}</dd></div>{order.customer?.name&&<div><dt>Customer</dt><dd>{order.customer.name}</dd></div>}</dl><ul>{order.items.map((item,i)=><li key={i}><img src={item.image} alt=""/><div><strong>{item.qty} × {item.name}</strong><span>{money(item.price*item.qty)}</span></div></li>)}</ul><div className="track-total"><span>Total</span><strong>{money(order.totals.total)}</strong></div>{order.totals.discount>0&&<p className="ord-savings">Includes {money(order.totals.discount)} in savings</p>}<a className="btn btn--ghost" href="/shop/">Back to shop</a></section></div>}
    {!order&&!loading&&!error&&<p className="track-help">You’ll find your AMG code on the confirmation screen after checkout.</p>}
  </div></div></>;
}
