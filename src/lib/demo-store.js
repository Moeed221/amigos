export default function createStore({ readKey, writeKey, client }) {
const clone = (v) => JSON.parse(JSON.stringify(v));

/* ---------------------------- categories ---------------------------- */
async function getCategories() {
  return clone(await readKey('categories')).sort((a, b) => a.order - b.order);
}

/* ------------------------------ menu -------------------------------- */
async function getItems({ category, includeInactive = false } = {}) {
  let items = await readKey('menu');
  if (category && category !== 'all') items = items.filter((i) => i.category === category);
  if (!includeInactive) items = items.filter((i) => i.available !== false);
  return clone(items);
}

async function getAllItems() {
  return clone(await readKey('menu'));
}

async function getItem(id) {
  return clone((await readKey('menu')).find((i)=> Number(i.id) === Number(id)) || null);
}

async function createItem(payload) {
  const items = await readKey('menu');
  const item = {
    id: items.reduce((max, i) => Math.max(max, Number(i.id)), 0) + 1,
    category: payload.category,
    name: payload.name,
    description: payload.description || '',
    price: Number(payload.price) || 0,
    image: payload.image || '',
    tags: Array.isArray(payload.tags) ? payload.tags : [],
    available: payload.available !== false,
    createdAt: new Date().toISOString(),
  };
  items.push(item);
  await writeKey('menu', items);
  return clone(item);
}

async function updateItem(id, payload) {
  const items = await readKey('menu');
  const idx = items.findIndex((i) => Number(i.id) === Number(id));
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...payload, id: items[idx].id };
  await writeKey('menu', items);
  return clone(items[idx]);
}

async function deleteItem(id) {
  const items = await readKey('menu');
  const next = items.filter((i) => Number(i.id) !== Number(id));
  await writeKey('menu', next);
  return next.length !== items.length;
}

/* ----------------------------- offers ------------------------------- */
async function getOffers({ activeOnly = false } = {}) {
  let offers = await readKey('offers');
  if (activeOnly) offers = offers.filter((o) => o.active !== false && !isExpired(o) && (!o.startsAt || new Date(o.startsAt).getTime() <= Date.now()));
  return clone(offers).sort((a, b) => Number(b.id) - Number(a.id));
}

async function getOffer(id) {
  return clone((await readKey('offers')).find((o)=> Number(o.id) === Number(id)) || null);
}

async function createOffer(payload) {
  const offers = await readKey('offers');
  const offer = {
    id: offers.reduce((max, o) => Math.max(max, Number(o.id)), 0) + 1,
    title: payload.title || 'New offer',
    subtitle: payload.subtitle || '',
    percent: Math.min(100, Math.max(0, Number(payload.percent) || 0)),
    scope: payload.scope || 'all',
    category: payload.category || null,
    code: (payload.code || '').toUpperCase(),
    badge: `${Math.min(100, Math.max(0, Number(payload.percent) || 0))}%`,
    accent: payload.accent || 'red',
    active: payload.active !== false,
    endsAt: payload.endsAt || null,
    createdAt: new Date().toISOString(),
  };
  offers.push(offer);
  await writeKey('offers', offers);
  return clone(offer);
}

async function updateOffer(id, payload) {
  const offers = await readKey('offers');
  const idx = offers.findIndex((o) => Number(o.id) === Number(id));
  if (idx === -1) return null;
  offers[idx] = { ...offers[idx], ...payload, id: offers[idx].id };
  if (payload.percent != null) offers[idx].badge = `${offers[idx].percent}%`;
  await writeKey('offers', offers);
  return clone(offers[idx]);
}

async function deleteOffer(id) {
  const offers = await readKey('offers');
  const next = offers.filter((o) => Number(o.id) !== Number(id));
  await writeKey('offers', next);
  return next.length !== offers.length;
}

/* ----------------------------- orders ------------------------------- */
async function getOrders() {
  return clone(await readKey('orders')).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function getOrderByCode(code) {
  const needle = String(code || '').toUpperCase().trim();
  return clone((await readKey('orders')).find((o)=> o.code === needle) || null);
}

async function getOrderById(id) {
  return clone((await readKey('orders')).find((o)=> Number(o.id) === Number(id)) || null);
}

async function createOrder(order) {
  const orders = await readKey('orders');
  const record = {
    ...order,
    id: orders.reduce((max, o) => Math.max(max, Number(o.id)), 0) + 1,
    createdAt: new Date().toISOString(),
  };
  orders.push(record);
  await writeKey('orders', orders);
  return clone(record);
}

async function updateOrder(id, payload) {
  const orders = await readKey('orders');
  const idx = orders.findIndex((o) => Number(o.id) === Number(id));
  if (idx === -1) return null;
  orders[idx] = { ...orders[idx], ...payload, id: orders[idx].id };
  await writeKey('orders', orders);
  return clone(orders[idx]);
}

/* ----------------------------- reviews ------------------------------ */
async function getReviews({ approvedOnly = true } = {}) {
  let reviews = await readKey('reviews');
  if (approvedOnly) reviews = reviews.filter((r) => r.approved !== false);
  return clone(reviews).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function createReview(payload) {
  const reviews = await readKey('reviews');
  const review = {
    id: reviews.reduce((max, r) => Math.max(max, Number(r.id)), 0) + 1,
    name: payload.name,
    role: payload.role || 'Customer',
    rating: Math.min(5, Math.max(1, Number(payload.rating) || 5)),
    text: payload.text,
    approved: false, // an admin approves it in the Admin Panel
    createdAt: new Date().toISOString(),
  };
  reviews.push(review);
  await writeKey('reviews', reviews);
  return clone(review);
}

async function updateReview(id, payload) {
  const reviews = await readKey('reviews');
  const idx = reviews.findIndex((r) => Number(r.id) === Number(id));
  if (idx === -1) return null;
  reviews[idx] = { ...reviews[idx], ...payload, id: reviews[idx].id };
  await writeKey('reviews', reviews);
  return clone(reviews[idx]);
}

function isExpired(offer) {
  if (!offer.endsAt) return false;
  return new Date(offer.endsAt).getTime() < Date.now();
}

return {
  client,
  getCategories,
  getItems,
  getAllItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getOffers,
  getOffer,
  createOffer,
  updateOffer,
  deleteOffer,
  getOrders,
  getOrderByCode,
  getOrderById,
  createOrder,
  updateOrder,
  getReviews,
  createReview,
  updateReview,
  isExpired,
};
};
