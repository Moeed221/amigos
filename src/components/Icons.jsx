export default function Icon({name,size=22,...props}) {
 const paths={
 cart:<><path d="M5 8h14l2 13H3zM8 8V6a4 4 0 0 1 8 0v2"/><path d="m8 13 4 3 4-3"/></>,menu:<><path d="M4 6h16M4 12h16M4 18h16"/></>,close:<path d="m6 6 12 12M6 18 18 6"/>,plus:<path d="M12 5v14M5 12h14"/>,minus:<path d="M5 12h14"/>,check:<path d="m5 12 4 4L19 6"/>,arrow:<path d="M4 12h16m-6-6 6 6-6 6"/>,back:<path d="M20 12H4m6-6-6 6 6 6"/>,chevron:<path d="m6 9 6 6 6-6"/>,
 truck:<><path d="M3 6h11v11H3zM14 10h4l3 4v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></>,store:<><path d="m3 9 2-5h14l2 5M4 12v9h16v-9M9 21v-7h6v7"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/></>,pin:<><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,user:<><circle cx="12" cy="8" r="4"/><path d="M4 22v-2a8 8 0 0 1 16 0v2"/></>,
 sun:<><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></>,moon:<path d="M21 13a9 9 0 0 1-10-10 9 9 0 1 0 10 10Z"/>,trash:<><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/></>,edit:<><path d="m15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-4-4L5 15z"/></>,search:<><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,info:<><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></>,mail:<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/></>,file:<><path d="M14 2H5v20h14V7zM14 2v5h5M8 12h8M8 16h6"/></>,shield:<><path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6z"/><path d="m8 12 3 3 5-6"/></>,food:<><path d="M4 3v6a3 3 0 0 0 6 0V3M7 3v19M18 3v19M18 3c-5 3-5 10 0 10"/></>
 };
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>{paths[name]||paths.info}</svg>;
}
export function TacoCart({count=0}){
 return <span className="taco-cart" aria-hidden="true">
  <svg className="nachos-cart-art" width="50" height="48" viewBox="0 0 58 54">
   <path d="M7 20Q8 6 29 4q21 2 22 16L46 23H12Z" fill="#1c7a52" stroke="#15110f" strokeWidth="2"/>
   <path d="m10 20 7-15 7 17Zm12 0 8-17 7 20Zm15 0 8-14 6 17Z" fill="#ffc531" stroke="#d78416" strokeWidth="1.6" strokeLinejoin="round"/>
   <path d="m16 15 3-7 3 8Zm13-1 2-7 4 8Zm12 2 3-6 2 7Z" fill="#ffe7a1"/>
   <path d="M7 21q22 6 44 0l-5 25q-17 8-34 0Z" fill="#ed002b" stroke="#15110f" strokeWidth="2" strokeLinejoin="round"/>
   <path d="M10 24q19 5 38 0" fill="none" stroke="#fff" strokeWidth="2" opacity=".85"/>
  </svg>
  <span className="cart-count">{count>99?'99+':count}</span>
 </span>;
}