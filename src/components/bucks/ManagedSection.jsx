
'use client';
import useSiteConfig from '../control/useSiteConfig';
export default function ManagedSection({id,children}){const c=useSiteConfig(),s=c.sections[id]||{};if(s.hidden)return null;return <div className={'managed-section managed-'+id+(s.title?' has-custom-title':'')+(s.text?' has-custom-copy':'')} style={s.background?{background:s.background}:undefined}>{s.title&&(id==='hero'?<h1 className="managed-title">{s.title}</h1>:<h2 className="managed-title">{s.title}</h2>)}{s.text&&<p className="managed-copy">{s.text}</p>}{s.image&&<img className="managed-image" src={s.image} alt={s.imageAlt||s.title||''}/>}{children}</div>}
