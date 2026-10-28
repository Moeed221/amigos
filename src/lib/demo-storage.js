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
  memory[key] = clone(value);
  try { localStorage.setItem(prefix + key, JSON.stringify(value)); } catch { /* Keep demo usable in memory. */ }
  return clone(value);
}

export const store = createStore({ readKey, writeKey, client: 'local-demo' });
