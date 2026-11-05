'use client';
import {createContext,useContext,useEffect,useState} from 'react';
import {getMenu,placeOrder} from '../lib/demo-data';
const Context=createContext(null);
const CART='amigos_restaurant_cart_v3',PREF='amigos_order_preferences_v2';
export const money=n=>'Rs '+(Number(n)||0).toLocaleString('en-PK',{maximumFractionDigits:2});
export function ShopProvider({children}){
 const [data,setData]=useState({items:[],categories:[],offers:[]}),[ready,setReady]=useState(false),[loadError,setLoadError]=useState('');
 const [cart,setCart]=useState([]),[preferences,setPreferences]=useState({type:'delivery',address:''}),[customer,setCustomer]=useState({name:'',phone:'',notes:'',payment:'cod'}),[notice,setNotice]=useState(null);
 useEffect(()=>{let active=true;getMenu().then(menu=>{if(!active)return;setData(menu);try{const saved=JSON.parse(localStorage.getItem(CART)||'[]');if(Array.isArray(saved))setCart(saved.filter(l=>l&&menu.items.some(i=>i.id===l.id)).map(l=>({id:l.id,note:String(l.note||''),key:l.id+':'+String(l.note||''),qty:Math.min(20,Math.max(1,Math.floor(Number(l.qty)||1)))})));const pref=JSON.parse(localStorage.getItem(PREF)||'{}');setPreferences({type:pref.type==='pickup'?'pickup':'delivery',address:typeof pref.address==='string'?pref.address:''});const profile=JSON.parse(sessionStorage.getItem('amigos_guest_profile')||'{}');setCustomer(c=>({...c,...profile}));}catch{}setReady(true)}).catch(()=>{if(active)setLoadError('We couldn’t load the menu. Please refresh to try again.')});return()=>{active=false}},[]);
 useEffect(()=>{if(!ready)return;try{localStorage.setItem(CART,JSON.stringify(cart));localStorage.setItem(PREF,JSON.stringify(preferences));sessionStorage.setItem('amigos_guest_profile',JSON.stringify(customer))}catch{}},[cart,preferences,customer,ready]);
 useEffect(()=>{if(!notice)return;const timer=setTimeout(()=>setNotice(null),8000);return()=>clearTimeout(timer)},[notice]);
 const lines=cart.map(l=>({...l,item:data.items.find(i=>i.id===l.id)})).filter(l=>l.item),count=lines.reduce((s,l)=>s+l.qty,0),total=lines.reduce((s,l)=>s+l.item.finalPrice*l.qty,0),subtotal=lines.reduce((s,l)=>s+l.item.price*l.qty,0);
 function addItem(item,qty=1,note='',extras=[]){
  const additions=[{id:item.id,qty,note:note.trim()},...extras.map(id=>({id,qty:1,note:''}))];
  const limited=additions.some(a=>(cart.find(l=>l.key===a.id+':'+a.note)?.qty||0)+a.qty>20);
  setCart(old=>{const next=old.map(l=>({...l}));for(const a of additions){const key=a.id+':'+a.note;const found=next.find(l=>l.key===key);if(found)found.qty=Math.min(20,found.qty+a.qty);else next.push({...a,key})}return next});
  setNotice({text:limited?'Cart updated. Maximum 20 of each item per order.':item.name+' added to cart',action:'cart'});
 }
 function editItem(oldKey,item,qty,note){const key=item.id+':'+note.trim();setCart(old=>{const next=old.filter(l=>l.key!==oldKey);const found=next.find(l=>l.key===key);if(found)found.qty=Math.min(20,found.qty+qty);else next.push({id:item.id,key,qty,note:note.trim()});return next});setNotice({text:'Your item has been updated',action:'cart'})}
 function changeQty(key,qty){setCart(old=>old.map(l=>l.key===key?{...l,qty:Math.min(20,Math.max(1,qty))}:l))}
 function removeItem(key){const removed=cart.find(l=>l.key===key);setCart(old=>old.filter(l=>l.key!==key));setNotice({text:(removed?data.items.find(i=>i.id===removed.id)?.name:'Item')+' removed',removed})}
 function undo(){if(notice?.removed){const removed=notice.removed;setCart(old=>old.some(l=>l.key===removed.key)?old:[...old,removed]);setNotice({text:'Item restored'})}}
 async function submitOrder(){const result=await placeOrder({customer:{name:customer.name,phone:customer.phone,address:preferences.address},type:preferences.type,payment:customer.payment,notes:[customer.notes,...lines.filter(l=>l.note).map(l=>l.item.name+': '+l.note)].filter(Boolean).join('; '),items:lines.map(l=>({id:l.id,qty:l.qty}))});setCart([]);setCustomer(c=>({...c,notes:''}));try{localStorage.setItem(CART,'[]');localStorage.setItem('amigos_last_order',result.order.code)}catch{}return result.order}
 return <Context.Provider value={{data,ready,loadError,lines,count,total,subtotal,savings:subtotal-total,preferences,setPreferences,customer,setCustomer,notice,setNotice,addItem,editItem,changeQty,removeItem,undo,submitOrder}}>{children}</Context.Provider>;
}
export const useShop=()=>useContext(Context);
