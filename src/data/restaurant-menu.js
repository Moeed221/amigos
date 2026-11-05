import seed from './menu.seed.json';
import categories from './categories.json';
import offers from './offers.seed.json';
export const categoryColors={burgers:'#f3bc45',sandwiches:'#eaa67d',mexican:'#ef8a43',thai:'#b5c68c',fastfood:'#ea6248',sides:'#f3c85f',drinks:'#b8cf9b',desserts:'#e5a3a3'};
export const menuCategories=categories;
export const menuSeed=seed.items;
export const featuredIds=[1,41,81,22];
export function dishSlug(item){return item.id+'-'+item.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
export function initialMenu(){
 return seed.items.filter(i=>i.available!==false).map(item=>{
  const best=offers.filter(o=>o.active&&(o.scope==='all'||o.scope==='category'&&o.category===item.category||o.scope==='item'&&Number(o.category)===item.id)).sort((a,b)=>b.percent-a.percent)[0];
  return {...item,finalPrice:best?Math.round(item.price*(1-best.percent/100)*100)/100:item.price,offer:best||null};
 });
}
