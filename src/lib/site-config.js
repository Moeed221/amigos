export const CONFIG_KEY='amigos_control_site_v1';
export const defaultConfig={announcement:'Burgers. Tacos. Good company. Explore the Amigos menu.',featuredIds:[1,41,81,22],accepting:true,delivery:true,pickup:true,prepMinutes:20,restaurantName:'Amigos Mexican Grill',supportEmail:'',address:'Amigos Kitchen · Lahore',currency:'PKR'};
export function getSiteConfig(){try{return {...defaultConfig,...JSON.parse(localStorage.getItem(CONFIG_KEY)||'{}')}}catch{return {...defaultConfig}}}
export function saveSiteConfig(config){localStorage.setItem(CONFIG_KEY,JSON.stringify(config));window.dispatchEvent(new Event('amigos-config'));}
