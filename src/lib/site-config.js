export const CONFIG_KEY='amigos_control_site_v1';
export const weekDays=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
export const defaultDelivery={fee:0,minimum:0,freeAbove:0,etaMin:30,etaMax:45,areaNote:'',scheduleEnabled:false,hours:weekDays.map(()=>({closed:false,open:'12:00',close:'23:00'}))};
export const defaultConfig={logo:'/assets/logo-white-text.webp',socials:{facebook:'',instagram:'',youtube:''},sections:{},deliverySettings:defaultDelivery,content:{},cardColors:['#ead8b8','#ead8b8','#ead8b8','#ead8b8'],carousel:{auto:true,seconds:5},meats:{'1':{Chicken:1300,Beef:1450}},announcement:'Burgers. Tacos. Good company. Explore the Amigos menu.',featuredIds:[1,41,81,22],accepting:true,delivery:true,pickup:true,prepMinutes:20,restaurantName:'Amigos Mexican Grill',supportEmail:'',address:'Amigos Kitchen · Lahore',currency:'PKR'};
export function getSiteConfig(){try{const saved=JSON.parse(localStorage.getItem(CONFIG_KEY)||'{}');return {...defaultConfig,...saved,socials:{...defaultConfig.socials,...saved.socials},sections:saved.sections||{},carousel:{...defaultConfig.carousel,...saved.carousel},meats:saved.meats||defaultConfig.meats,content:saved.content||{},deliverySettings:{...defaultDelivery,...saved.deliverySettings,hours:saved.deliverySettings?.hours||defaultDelivery.hours}}}catch{return {...defaultConfig}}}
export function saveSiteConfig(config){validateSiteConfig(config);localStorage.setItem(CONFIG_KEY,JSON.stringify(config));window.dispatchEvent(new Event('amigos-config'));}

export const sectionNames={deals:'Deals',hero:'Featured dishes',story:'Our food',cravings:'Choose your craving',meal:'Build your meal',why:'Why Amigos',community:'Category carousel',announcement:'Announcement',discounts:'Discount announcement',footer:'Footer'};
export function safeImage(value){return typeof value==='string'&&(/^\/(?!\/)[a-z0-9_./-]+$/i.test(value)||/^https:\/\//i.test(value)||/^data:image\/(png|jpeg|webp);base64,/i.test(value))}
export function validateSiteConfig(c){
 const d={...defaultDelivery,...c.deliverySettings};
 for(const k of ['fee','minimum','freeAbove'])if(!Number.isFinite(Number(d[k]))||Number(d[k])<0)throw Error('Delivery amounts must be zero or greater.');
 if(!Number.isFinite(Number(c.prepMinutes))||c.prepMinutes<5||c.prepMinutes>120)throw Error('Kitchen target must be 5–120 minutes.');
 if(!Number.isFinite(Number(d.etaMin))||!Number.isFinite(Number(d.etaMax))||d.etaMin<5||d.etaMax<d.etaMin||d.etaMax>240)throw Error('Delivery estimate must be 5–240 minutes, with the maximum after the minimum.');
 if(!Array.isArray(d.hours)||d.hours.length!==7||d.hours.some(h=>!h||!/^([01]\d|2[0-3]):[0-5]\d$/.test(h.open)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(h.close)||!h.closed&&h.open===h.close))throw Error('Set valid opening and closing times for all seven days.');
 if(c.content?.aboutImage&&!safeImage(c.content.aboutImage))throw Error('Use a valid image for the About page.');
 if(!safeImage(c.logo))throw Error('Use a local image path, HTTPS image, or uploaded PNG/JPEG/WebP.');
 if(c.cardColors?.some(x=>!/^#[0-9a-f]{6}$/i.test(x)))throw Error('Choose a valid six-digit card colour.');
 for(const url of Object.values(c.socials||{})){if(url&&!/^https:\/\//i.test(url))throw Error('Social links must start with https://.');}
 for(const variants of Object.values(c.meats||{})){if(!variants)continue;for(const price of Object.values(variants))if(!Number.isFinite(Number(price))||Number(price)<0)throw Error('Meat prices must be zero or greater.');}
 if(c.carousel&&(c.carousel.seconds<3||c.carousel.seconds>30))throw Error('Carousel interval must be 3–30 seconds.');
 for(const s of Object.values(c.sections||{})){if(s.image&&!safeImage(s.image))throw Error('Section image must be a local path or HTTPS image.');for(const item of Object.values(s.items||{}))if(item.image&&!safeImage(item.image))throw Error('Category image must use a local path or HTTPS.');}
}
export function withMeat(item,meat,config){const choices=config.meats?.[item.id];if(!choices)return item;if(!Object.hasOwn(choices,meat))throw Error('Choose Chicken or Beef for '+item.name+'.');const price=Number(choices[meat]);return {...item,meat,name:item.name+' · '+meat,price,finalPrice:Math.round(price*(1-(item.offer?.percent||0)/100)*100)/100};}

export function readableInk(hex){const rgb=hex.replace("#","").match(/../g).map(n=>parseInt(n,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722>.179?"#000000":"#ffffff";}

export function deliveryQuote(config,type,foodTotal){
 const d={...defaultDelivery,...config.deliverySettings};
 const fee=type==='delivery'&&foodTotal>0&&!(d.freeAbove>0&&foodTotal>=d.freeAbove)?Number(d.fee):0;
 return {fee,minimum:type==='delivery'?Number(d.minimum):0,total:Math.round((foodTotal+fee)*100)/100};
}
export function deliveryIsOpen(config,now=new Date()){
 const d={...defaultDelivery,...config.deliverySettings};if(!d.scheduleEnabled)return true;
 const parts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Karachi',weekday:'long',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now).map(p=>[p.type,p.value]));
 const day=weekDays.indexOf(parts.weekday),minute=Number(parts.hour)*60+Number(parts.minute);
 const minutes=v=>Number(v.slice(0,2))*60+Number(v.slice(3));
 const today=d.hours[day],yesterday=d.hours[(day+6)%7];
 if(!today.closed){const start=minutes(today.open),end=minutes(today.close);if(start<end?minute>=start&&minute<end:minute>=start)return true;}
 return !yesterday.closed&&minutes(yesterday.open)>minutes(yesterday.close)&&minute<minutes(yesterday.close);
}
export function checkoutIssue(config,type,foodTotal,now=new Date()){
 if(!config.accepting)return 'Ordering is currently paused. Please check back later.';
 if(!config[type])return 'Choose an available fulfilment method.';
 if(type==='delivery'&&!deliveryIsOpen(config,now))return 'Delivery is closed right now. Check the delivery hours or choose pickup.';
 const {minimum}=deliveryQuote(config,type,foodTotal);
 if(foodTotal<minimum)return 'Delivery requires Rs '+minimum.toLocaleString('en-PK')+' of food after discounts.';
 return '';
}
