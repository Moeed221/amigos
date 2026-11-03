import {sauces,pack} from '../data/sauce-products';
/** Local demo operations. No fetch, API server, authentication, payments or database. */
import { store } from './demo-storage';
import { decorate, simulateAndTrack, STAGES, RIDERS, money, orderCode } from './demo-domain';

const text = (value, limit) => String(value ?? '').trim().slice(0, limit);
const required = (value, message) => { if (!value) throw new Error(message); };
const exists = (value, message) => { required(value, message); return value; };

export async function getMenu() {
  const [items, offers, categories] = await Promise.all([
    store.getItems(), store.getOffers({ activeOnly: true }), store.getCategories()
  ]);
  return { categories, offers, items: [...items.map(item => decorate(item, offers)), ...sauces, pack] };
}
export const getReviews = () => store.getReviews({ approvedOnly: true });
export const getAdminReviews = () => store.getReviews({ approvedOnly: false });
export const getOffers = () => store.getOffers();
export async function getAdminMenu() {
  return { items: await store.getAllItems(), categories: await store.getCategories() };
}
export async function submitReview(payload) {
  const name = text(payload.name, 60), reviewText = text(payload.text, 600);
  required(name && reviewText, 'Name and review text are required.');
  const review = await store.createReview({ name, text: reviewText, rating: Math.min(5, Math.max(1, Math.round(Number(payload.rating) || 5))) });
  return { ok: true, review, message: 'Demo review saved in this browser for approval.' };
}
export async function updateReview(id, payload) {
  return exists(await store.updateReview(id, { approved: payload.approved === true }), 'Review not found.');
}

export async function placeOrder(payload) {
  const customer = { name: text(payload.customer?.name, 60), phone: text(payload.customer?.phone, 30), address: text(payload.customer?.address, 240) };
  const type = payload.type === 'pickup' ? 'pickup' : 'delivery';
  required(customer.name && customer.phone, 'Name and phone number are required.');
  required(type === 'pickup' || customer.address, 'A delivery address is required.');
  required(Array.isArray(payload.items) && payload.items.length, 'Your cart is empty.');
  const menu = (await getMenu()).items;
  const items = payload.items.map(line => {
    const item = exists(menu.find(item => Number(item.id) === Number(line.id)), 'An item is no longer available.');
    const qty = Math.min(20, Math.max(1, Math.floor(Number(line.qty) || 1)));
    return { id: item.id, name: item.name, category: item.category, price: item.finalPrice, originalPrice: item.price, qty, image: item.image };
  });
  const subtotal = money(items.reduce((sum, item) => sum + item.originalPrice * item.qty, 0));
  const total = money(items.reduce((sum, item) => sum + item.price * item.qty, 0));
  let code;
  do { code = orderCode(); } while (await store.getOrderByCode(code));
  const order = await store.createOrder({ code, customer, type, notes: text(payload.notes, 300), items, subtotal, total,
    discount: money(subtotal - total), payment: payload.payment === 'card' ? 'card' : 'cod', status: 'placed',
    statusChangedAt: new Date().toISOString(), rider: type === 'delivery' ? RIDERS[0] : null });
  return { ok: true, order: await simulateAndTrack(order) };
}
export async function getTracking(code) {
  return simulateAndTrack(exists(await store.getOrderByCode(code), 'No demo order found with that code in this browser.'));
}
export async function getOrders() {
  const orders = await store.getOrders();
  for (const order of orders) await simulateAndTrack(order);
  return orders;
}
export async function updateOrder(id, payload) {
  required(STAGES.includes(payload.status) || payload.status === 'cancelled', 'Unknown status.');
  const order = exists(await store.updateOrder(id, { status: payload.status, statusChangedAt: new Date().toISOString(), manual: true }), 'Order not found.');
  return simulateAndTrack(order);
}
async function itemPayload(payload, existing = {}) {
  const item = { ...existing, ...payload };
  item.name = text(item.name, 100);
  required(item.name, 'A dish name is required.');
  required((await store.getCategories()).some(category => category.slug === item.category), 'Choose a valid category.');
  item.price = Number(item.price);
  required(Number.isFinite(item.price) && item.price >= 0, 'Enter a valid non-negative price.');
  item.description = text(item.description, 400);
  item.image = /^\/assets\/[a-z0-9_./-]+$/i.test(item.image) ? item.image : '/assets/cat-mexican.jpg';
  item.tags = Array.isArray(item.tags) ? item.tags.map(tag => text(tag, 30)) : [];
  item.available = item.available !== false;
  return item;
}
export async function createItem(payload) { return store.createItem(await itemPayload(payload)); }
export async function updateItem(id, payload) {
  const existing = exists(await store.getItem(id), 'Item not found.');
  return store.updateItem(id, await itemPayload(payload, existing));
}
export const deleteItem = id => store.deleteItem(id);
function offerPayload(payload, existing = {}) {
  const offer = { ...existing, ...payload };
  offer.title = text(offer.title, 100);
  required(offer.title, 'An offer title is required.');
  offer.percent = Number(offer.percent);
  required(Number.isFinite(offer.percent) && offer.percent >= 0 && offer.percent <= 100, 'Discount must be between 0 and 100.');
  offer.subtitle = text(offer.subtitle, 300);
  offer.code = text(offer.code, 40).toUpperCase();
  required(['all', 'category', 'item'].includes(offer.scope), 'Choose a valid offer scope.');
  return offer;
}
export async function createOffer(payload) { return store.createOffer(offerPayload(payload)); }
export async function updateOffer(id, payload) {
  return store.updateOffer(id, offerPayload(payload, exists(await store.getOffer(id), 'Offer not found.')));
}
export const deleteOffer = id => store.deleteOffer(id);
export async function getSummary() {
  const [orders, items, offers, reviews] = await Promise.all([getOrders(), store.getAllItems(), store.getOffers(), getAdminReviews()]);
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Karachi' });
  const todays = orders.filter(order => new Date(order.createdAt).toLocaleDateString('en-CA', { timeZone: 'Asia/Karachi' }) === today);
  const revenue = list => money(list.filter(order => order.status !== 'cancelled').reduce((sum, order) => sum + order.total, 0));
  return { orders: orders.length, ordersToday: todays.length, revenue: revenue(orders), revenueToday: revenue(todays),
    live: orders.filter(order => !['delivered', 'cancelled'].includes(order.status)).length, items: items.length,
    unavailable: items.filter(item => item.available === false).length, offers: offers.length,
    activeOffers: offers.filter(offer => offer.active && !store.isExpired(offer)).length, pendingReviews: reviews.filter(review => !review.approved).length };
}
