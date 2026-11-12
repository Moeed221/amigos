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
const config=await load('../src/lib/site-config.js');
const dish={id:1,name:'Burger',price:100,offer:{percent:20},finalPrice:80};
const cfg={...config.defaultConfig,meats:{1:{Chicken:1300,Beef:1450}}};
assert.throws(()=>config.withMeat(dish,'',cfg),/Choose Chicken or Beef/);
assert.equal(config.withMeat(dish,'Chicken',cfg).finalPrice,1040);
assert.equal(config.withMeat(dish,'Beef',cfg).finalPrice,1160);
assert.equal(config.withMeat(dish,'Beef',cfg).price,1450);
assert.equal(config.withMeat({...dish,id:2},'',cfg).finalPrice,80);
assert.throws(()=>config.validateSiteConfig({...cfg,socials:{facebook:'javascript:alert(1)'}}),/https/);
assert.throws(()=>config.validateSiteConfig({...cfg,carousel:{seconds:0}}),/3–30/);
assert.throws(()=>config.validateSiteConfig({...cfg,sections:{community:{items:{burger:{image:'javascript:alert(1)'}}}}}),/HTTPS/);
assert.equal(config.readableInk('#000000'),'#ffffff');
assert.equal(config.readableInk('#ffffff'),'#000000');
console.log('Content checks passed: required meat variants, distinct prices, single discount, image/link validation and readable card ink.');
// Exercise the real order adapter with an in-memory store; totals are recalculated at submission.
const configUrl='data:text/javascript;base64,'+Buffer.from(await readFile(new URL('../src/lib/site-config.js',import.meta.url),'utf8')).toString('base64');
const orderSource=(await readFile(new URL('../src/lib/demo-data.js',import.meta.url),'utf8'))
.replace("import { store } from './demo-storage';",`const store={getItems:async()=>[{id:1,name:'Burger',price:1450}],getOffers:async()=>[{percent:20}],getCategories:async()=>[],getOrderByCode:async()=>null,createOrder:async o=>o};`)
.replace("from './site-config'",`from '${configUrl}'`)
.replace("import { decorate, simulateAndTrack, STAGES, RIDERS, money, orderCode } from './demo-domain';",`const decorate=(p)=>({...p,offer:{percent:20},finalPrice:p.price*.8}),simulateAndTrack=async o=>o,STAGES=[],RIDERS=[{}],money=n=>Math.round(n*100)/100,orderCode=()=> 'QA-1';`);
const ordersApi=await import('data:text/javascript;base64,'+Buffer.from(orderSource).toString('base64'));
await assert.rejects(()=>ordersApi.placeOrder({customer:{name:'QA',phone:'03000000000',address:'Test'},items:[{id:1,qty:1}],type:'delivery'}),/Choose Chicken or Beef/);
const placed=await ordersApi.placeOrder({customer:{name:'QA',phone:'03000000000',address:'Test'},items:[{id:1,qty:2,meat:'Chicken'},{id:1,qty:1,meat:'Beef'}],type:'delivery'});
assert.equal(placed.order.subtotal,4050);assert.equal(placed.order.discount,810);assert.equal(placed.order.total,3240);assert.equal(placed.order.items[0].meat,'Chicken');assert.match(placed.order.items[1].name,/Beef/);
console.log('Order integration passed: variants survive submission, discounts apply once, delivery total unchanged.');
