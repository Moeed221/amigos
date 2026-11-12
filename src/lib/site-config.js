export const CONFIG_KEY='amigos_control_site_v1';
export const defaultConfig={logo:'/assets/logo-white-text.webp',socials:{facebook:'',instagram:'',youtube:''},sections:{},cardColors:['#ead8b8','#ead8b8','#ead8b8','#ead8b8'],carousel:{auto:true,seconds:5},meats:{'1':{Chicken:1300,Beef:1450}},announcement:'Burgers. Tacos. Good company. Explore the Amigos menu.',featuredIds:[1,41,81,22],accepting:true,delivery:true,pickup:true,prepMinutes:20,restaurantName:'Amigos Mexican Grill',supportEmail:'',address:'Amigos Kitchen · Lahore',currency:'PKR'};
export function getSiteConfig(){try{const saved=JSON.parse(localStorage.getItem(CONFIG_KEY)||'{}');return {...defaultConfig,...saved,socials:{...defaultConfig.socials,...saved.socials},sections:saved.sections||{},carousel:{...defaultConfig.carousel,...saved.carousel},meats:saved.meats||defaultConfig.meats}}catch{return {...defaultConfig}}}
export function saveSiteConfig(config){validateSiteConfig(config);localStorage.setItem(CONFIG_KEY,JSON.stringify(config));window.dispatchEvent(new Event('amigos-config'));}

export const sectionNames={hero:'Featured dishes',story:'Our food',cravings:'Choose your craving',meal:'Build your meal',why:'Why Amigos',community:'Category carousel',announcement:'Announcement',discounts:'Discount announcement',footer:'Footer'};
export function safeImage(value){return typeof value==='string'&&(/^\/(?!\/)[a-z0-9_./-]+$/i.test(value)||/^https:\/\//i.test(value)||/^data:image\/(png|jpeg|webp);base64,/i.test(value))}
export function validateSiteConfig(c){
 if(!safeImage(c.logo))throw Error('Use a local image path, HTTPS image, or uploaded PNG/JPEG/WebP.');
 if(c.cardColors?.some(x=>!/^#[0-9a-f]{6}$/i.test(x)))throw Error('Choose a valid six-digit card colour.');
 for(const url of Object.values(c.socials||{})){if(url&&!/^https:\/\//i.test(url))throw Error('Social links must start with https://.');}
 for(const variants of Object.values(c.meats||{})){if(!variants)continue;for(const price of Object.values(variants))if(!Number.isFinite(Number(price))||Number(price)<0)throw Error('Meat prices must be zero or greater.');}
 if(c.carousel&&(c.carousel.seconds<3||c.carousel.seconds>30))throw Error('Carousel interval must be 3–30 seconds.');
 for(const s of Object.values(c.sections||{})){if(s.image&&!safeImage(s.image))throw Error('Section image must be a local path or HTTPS image.');for(const item of Object.values(s.items||{}))if(item.image&&!safeImage(item.image))throw Error('Category image must use a local path or HTTPS.');}
}
export function withMeat(item,meat,config){const choices=config.meats?.[item.id];if(!choices)return item;if(!Object.hasOwn(choices,meat))throw Error('Choose Chicken or Beef for '+item.name+'.');const price=Number(choices[meat]);return {...item,meat,name:item.name+' · '+meat,price,finalPrice:Math.round(price*(1-(item.offer?.percent||0)/100)*100)/100};}

export function readableInk(hex){const rgb=hex.replace("#","").match(/../g).map(n=>parseInt(n,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722>.179?"#000000":"#ffffff";}
