import categories from '../data/categories.json';
import menu from '../data/menu.seed.json';
import offers from '../data/offers.seed.json';
import reviews from '../data/reviews.seed.json';
import createStore from './demo-store';

const prefix = 'amigos_static_demo_v1_';
const seeds = { categories: categories.categories ?? categories, menu: menu.items ?? menu, offers: offers.offers ?? offers, reviews: reviews.reviews ?? reviews, orders: [] };
const memory = {};
const clone = value => JSON.parse(JSON.stringify(value));

function readKey(key) {
  if (!(key in seeds)) throw new Error('Unknown demo collection.');
  try {
    const saved = localStorage.getItem(prefix + key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch { /* Private browsers can disable local storage. */ }
  return clone(memory[key] ?? seeds[key]);
}

function writeKey(key, value) {
  if(typeof localStorage!=='undefined'){try { localStorage.setItem(prefix + key, JSON.stringify(value)); } catch { throw new Error('Browser storage is full or unavailable. Remove unused uploaded images or use hosted image URLs, then try again.'); }}
  memory[key] = clone(value);
  if(typeof window!=='undefined')window.dispatchEvent(new Event('amigos-menu'));
  return clone(value);
}

export const store = createStore({ readKey, writeKey, client: 'local-demo' });
