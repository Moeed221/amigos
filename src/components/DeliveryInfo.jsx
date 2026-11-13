'use client';
import useSiteConfig from './control/useSiteConfig';
import {weekDays,deliveryIsOpen} from '../lib/site-config';
import {money} from './ShopProvider';
export default function DeliveryInfo({type='delivery'}){const c=useSiteConfig(),d=c.deliverySettings;if(type==='pickup')return <p className="delivery-info">Ready for pickup in about {c.prepMinutes} minutes.</p>;return <div className="delivery-info"><p>Estimated delivery: <strong>{d.etaMin}–{d.etaMax} minutes</strong></p>{d.areaNote&&<p>{d.areaNote}</p>}{d.freeAbove>0&&<p>Free delivery on food totals from {money(d.freeAbove)} after discounts.</p>}{d.scheduleEnabled&&<details><summary>{deliveryIsOpen(c)?'Delivery is open':'Delivery is closed'} · View hours</summary><p>Pakistan time · closing before opening means the following day.</p><dl>{weekDays.map((day,i)=><div key={day}><dt>{day}</dt><dd>{d.hours[i].closed?'Closed':d.hours[i].open+' – '+d.hours[i].close}</dd></div>)}</dl></details>}</div>}
