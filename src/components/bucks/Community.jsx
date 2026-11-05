'use client';
import Link from 'next/link';
import {useState} from 'react';
import {menuCategories} from '../../data/restaurant-menu';
import Icon from '../Icons';
export default function Community(){const [paused,setPaused]=useState(false);return <section className="community restaurant-community"><h2 data-reveal>Bring your <span className="outline-type">appetite.</span></h2><p>One table. Every craving.</p><div className={'community-track '+(paused?'paused':'')}>{[...menuCategories,...menuCategories].map((c,i)=><figure key={i} aria-hidden={i>=menuCategories.length}><Link href={'/shop?category='+c.slug} tabIndex={i>=menuCategories.length?-1:undefined}><img src={c.image} alt={c.name} loading="lazy"/><figcaption>{c.name}<Icon name="arrow" size={22}/></figcaption></Link></figure>)}</div><button className="marquee-toggle" onClick={()=>setPaused(p=>!p)} aria-pressed={paused}>{paused?'Resume motion':'Pause motion'}</button></section>}
