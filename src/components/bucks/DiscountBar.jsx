'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {useShop} from '../ShopProvider';
import useSiteConfig from '../control/useSiteConfig';
export default function DiscountBar(){const {data}=useShop(),c=useSiteConfig(),[index,setIndex]=useState(0);const offers=data.offers.filter(o=>o.active!==false&&(!o.startsAt||Date.parse(o.startsAt)<=Date.now())&&(!o.endsAt||Date.parse(o.endsAt)>Date.now()));useEffect(()=>{if(offers.length<2)return;const t=setInterval(()=>setIndex(i=>(i+1)%offers.length),6000);return()=>clearInterval(t)},[offers.length]);if(!offers.length||c.sections.discounts?.hidden)return null;const offer=offers[index%offers.length];return <section className="discount-announcement" aria-label="Current offers"><button aria-label="Previous offer" onClick={()=>{setIndex(i=>(i-1+offers.length)%offers.length)}}>←</button><Link href={c.sections.deals?.hidden?"/shop":"/deals"}>{offer.title} · {offer.percent}% off eligible food</Link><button aria-label="Next offer" onClick={()=>{setIndex(i=>(i+1)%offers.length)}}>→</button></section>}
