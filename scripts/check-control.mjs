import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const load = async p => import('data:text/javascript;base64,'+Buffer.from(await readFile(new URL(p,import.meta.url),'utf8')).toString('base64'));
const m=await load('../src/lib/control-model.js');
let order={id:1,status:'placed',type:'delivery',total:1500,history:[]};
assert.equal(m.allowedNext('support',order),false);
assert.equal(m.allowedNext('kitchen',order),false);
assert.equal(m.allowedNext('owner',order),true);
assert.throws(()=>m.transition(order,'delivered'),/no longer/);
assert.throws(()=>m.transition(order,'cancelled','  '),/reason/);
for(const status of ['accepted','preparing','ready','on_the_way','delivered'])order=m.transition(order,status);
assert.equal(order.history.length,5);
assert.equal(order.manual,true);
assert.equal(m.active(order),false);
assert.throws(()=>m.transition(order,'cancelled','test'),/active/);
const pickup=m.transition({status:'ready',type:'pickup',total:500},'collected');
assert.equal(m.finished(pickup),true);
assert.equal(m.allowedNext('kitchen',{status:'accepted'}),true);
assert.equal(m.allowedNext('kitchen',{status:'ready'}),false);
assert.equal(m.stats([order,pickup,{status:'cancelled',total:9999},{status:'placed',total:9999}]).sales,2000);
assert.equal(m.dayKey('2026-11-06T20:00:00Z'),'2026-11-07');
assert.equal(m.inRange([{createdAt:'2026-11-06T20:00:00Z'},{createdAt:'2026-11-06T18:00:00Z'}],1,new Date('2026-11-07T01:00:00Z').getTime()).length,1);
assert.throws(()=>m.validateDish({name:'Test',price:-1,category:'taco',description:'Test'}),/greater/);
assert.throws(()=>m.validateDeal({title:'Test',percent:101,scope:'all'}),/100/);
assert.throws(()=>m.validateDeal({title:'Test',percent:20,scope:'all',startsAt:'2026-12-02',endsAt:'2026-12-01'}),/End time/);
assert.equal(m.csv([['=1+1','He said "hi"']]),'"\'=1+1","He said ""hi"""');
// The tracking adapter must understand manual fulfilment without advancing it.
const domainSource=(await readFile(new URL('../src/lib/demo-domain.js',import.meta.url),'utf8')).replace("import { store } from './demo-storage';",'const store={updateOrder:async()=>{throw Error("Manual orders must not auto-advance")}};');
const d=await import('data:text/javascript;base64,'+Buffer.from(domainSource).toString('base64'));
for(const type of ['delivery','pickup'])for(const status of ['accepted','preparing','ready',type==='pickup'?'collected':'delivered']){
 const tracked=await d.simulateAndTrack({status,type,manual:true,createdAt:'2026-11-01',items:[]});
 assert.equal(tracked.status,status);assert.ok(tracked.statusIndex>=0);assert.ok(tracked.progress>=0&&tracked.progress<=100);
 if(['collected','delivered'].includes(status)){assert.equal(tracked.etaMinutes,0);assert.equal(tracked.progress,100);assert.ok(tracked.timeline.every(x=>x.done));}
}
console.log('Control checks passed: fulfilment, role capabilities, revenue, dates, validation, CSV and customer tracking.');
const {default:createStore}=await load('../src/lib/demo-store.js');
const fixture={offers:[{id:1,active:true,percent:20,scope:'all'},{id:2,active:true,percent:90,scope:'all',startsAt:new Date(Date.now()+86400000).toISOString()},{id:3,active:true,endsAt:'2020-01-01'},{id:4,active:false}],menu:[{id:1,name:'Dish',available:true,price:100}],orders:[]};
const store=createStore({readKey:k=>structuredClone(fixture[k]),writeKey:(k,v)=>fixture[k]=structuredClone(v),client:'test'});
assert.deepEqual((await store.getOffers({activeOnly:true})).map(o=>o.id),[1]);
await store.updateItem(1,{available:false});
assert.equal((await store.getItems()).length,0);
console.log('Store integration checks passed: scheduled/expired deals and sold-out dishes.');
