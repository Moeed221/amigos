import { store } from './demo-storage';
const DEMO_SPEED = 6;
const RIDERS = [
  { name: 'Danish Ali', phone: '+92 300 4412 908', vehicle: 'Honda CD-70', plate: 'LEB-4471' },
  { name: 'Waqas Hussain', phone: '+92 321 8890 122', vehicle: 'Suzuki GD-110', plate: 'LEC-9022' },
  { name: 'Rehan Malik', phone: '+92 333 2201 776', vehicle: 'Honda CB-150', plate: 'LED-1183' },
  { name: 'Faraz Cheema', phone: '+92 345 5567 330', vehicle: 'Yamaha YBR', plate: 'LEA-7634' },
];

const STAGES = ['placed', 'preparing', 'on_the_way', 'arriving', 'delivered'];
const STAGE_LABELS = {
  placed: 'Order received',
  accepted: 'Order accepted',
  ready: 'Ready for handover',
  collected: 'Collected',
  preparing: 'In the kitchen',
  on_the_way: 'Rider on the way',
  arriving: 'Rider arriving',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};
const STAGE_COPY = {
  placed: 'Your order is confirmed and will be prepared shortly.',
  accepted: 'The kitchen has accepted your order.',
  ready: 'Your meal is packed and ready for handover.',
  collected: 'Thanks for collecting. Enjoy your meal!',
  preparing: 'Your meal is being prepared in the Amigos kitchen.',
  on_the_way: 'Your rider has collected your order from Amigos.',
  arriving: 'Your rider is around the corner — please be ready.',
  delivered: 'Enjoy the flavour, amigo!',
  cancelled: 'This order was cancelled.',
};
// simulated seconds per stage (divide by DEMO_SPEED for real seconds)
const STAGE_SECONDS = { accepted: 60, ready: 60, collected: 0, placed: 60, preparing: 240, on_the_way: 420, arriving: 120, delivered: 0, cancelled: 0 };

const money = (n) => Math.round(Number(n) * 100) / 100;

function pickOffer(item, offers) {
  const best = offers
    .filter((o) => o.active !== false)
    .filter((o) => o.scope === 'all' || (o.scope === 'category' && o.category === item.category) || (o.scope === 'item' && Number(o.category) === Number(item.id)))
    .sort((a, b) => b.percent - a.percent)[0];
  return best || null;
}

function decorate(item, offers) {
  const offer = pickOffer(item, offers);
  const finalPrice = offer ? money(item.price * (1 - offer.percent / 100)) : item.price;
  return { ...item, offer: offer ? { id: offer.id, title: offer.title, percent: offer.percent, badge: offer.badge } : null, finalPrice };
}

function orderCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 4; i += 1) s += chars[Math.floor(Math.random() * chars.length)];
  return `AMG-${s}`;
}

/** Advance the demo order through its stages and return tracking data. */
async function simulateAndTrack(order) {
  if (!order) return null;
  const manual = !!order.manual;
  const stages = manual ? (order.type === 'pickup' ? ['placed','accepted','preparing','ready','collected'] : ['placed','accepted','preparing','ready','on_the_way','arriving','delivered']) : STAGES;
  const complete = ['delivered','collected'].includes(order.status);
  let changed = false;

  if (!manual && !complete && order.status !== 'cancelled') {
    let guard = 0;
    while (guard < 8) {
      guard += 1;
      const startedAt = new Date(order.statusChangedAt || order.createdAt).getTime();
      const simulatedElapsed = ((Date.now() - startedAt) / 1000) * DEMO_SPEED;
      const duration = STAGE_SECONDS[order.status] || 0;
      if (simulatedElapsed >= duration) {
        const next = STAGES[Math.min(STAGES.indexOf(order.status) + 1, STAGES.length - 1)];
        if (next === order.status) break;
        order.status = next;
        order.statusChangedAt = new Date(startedAt + (duration / DEMO_SPEED) * 1000).toISOString();
        changed = true;
        continue;
      }
      break;
    }
  }
  if (changed) await store.updateOrder(order.id, { status: order.status, statusChangedAt: order.statusChangedAt });

  const stageIndex = stages.indexOf(order.status);
  const isComplete = ['delivered','collected'].includes(order.status);
  const startedAt = new Date(order.statusChangedAt || order.createdAt).getTime();
  const simulatedInStage = manual ? 0 : ((Date.now() - startedAt) / 1000) * DEMO_SPEED;
  const stageDuration = STAGE_SECONDS[order.status] || 0;
  const withinStage = stageDuration ? Math.min(1, simulatedInStage / stageDuration) : 1;

  // remaining simulated seconds, then converted to display minutes
  let remaining = 0;
  if (!isComplete && order.status !== 'cancelled') {
    remaining += Math.max(0, stageDuration - simulatedInStage);
    for (let i = stageIndex + 1; i < stages.length; i += 1) remaining += STAGE_SECONDS[stages[i]] || 0;
  }
  // ETA is expressed in restaurant minutes (the same numbers a real kitchen quotes).
  // In demo mode the delivery simply plays out faster than the clock on screen.
  const etaMinutes = Math.max(0, Math.ceil(remaining / 60));
  const etaAt = new Date(Date.now() + etaMinutes * 60000).toISOString();

  // progress 0–100 across the whole journey
  const progress = order.status === 'cancelled' ? 0 : isComplete ? 100 : Math.min(100, Math.round(((stageIndex + withinStage) / (stages.length - 1)) * 100));

  const timeline = stages.map((stage, i) => ({
    key: stage,
    label: STAGE_LABELS[stage],
    detail: STAGE_COPY[stage],
    done: i < stageIndex || isComplete,
    active: i === stageIndex && !isComplete,
  }));

  return {
    code: order.code,
    status: order.status,
    statusLabel: STAGE_LABELS[order.status] || order.status,
    statusCopy: STAGE_COPY[order.status] || '',
    statusIndex: stageIndex,
    progress,
    etaMinutes,
    etaAt,
    etaClock: new Date(etaAt).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' }),
    rider: order.rider,
    type: order.type,
    customer: { name: order.customer?.name, address: order.customer?.address },
    totals: { subtotal: order.subtotal, discount: order.discount, total: order.total },
    items: order.items,
    timeline,
    demo: { speed: DEMO_SPEED, manual: !!order.manual },
    createdAt: order.createdAt,
  };
}


export { decorate, simulateAndTrack, STAGES, RIDERS, money, orderCode };
