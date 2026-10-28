import * as demo from './demo-data';
import { createScope } from './lifecycle';
/* =========================================================================
   Amigo's Mexican Grill — admin panel
   ========================================================================= */
export function initAdmin() {
  const scope = createScope();
  const {
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    requestAnimationFrame,
    IntersectionObserver
  } = scope;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const money = n => `Rs ${Math.round(Number(n) || 0).toLocaleString('en-PK')}`;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[c]);
  const token = () => sessionStorage.getItem('amigos_demo_access') || '';
  const state = {
    categories: [],
    items: [],
    offers: [],
    orders: [],
    reviews: [],
    view: 'dashboard',
    orderFilter: '',
    orderQuery: '',
    menuFilter: '',
    menuQuery: ''
  };
  function toast(message, isError) {
    const el = document.createElement('div');
    el.className = `toast${isError ? ' err' : ''}`;
    el.textContent = message;
    $('#toasts').appendChild(el);
    setTimeout(() => el.remove(), 3400);
  }

  /* ------------------------------- LOGIN -------------------------------- */
  scope.listen($('#loginForm'), 'submit', async e => {
    e.preventDefault();
    const btn = $('#loginBtn');
    btn.disabled = true;
    $('#loginErr').textContent = '';
    try {
      sessionStorage.setItem('amigos_demo_access', 'open');
      $('#storePill').textContent = 'Local demo';
      enterApp();
    } catch (err) {
      $('#loginErr').textContent = err.message;
    } finally {
      btn.disabled = false;
    }
  });
  function logout() {
    sessionStorage.removeItem('amigos_demo_access');
    clearInterval(state.poll);
    $('#shell').style.display = 'none';
    $('#login').classList.remove('gone');
  }
  scope.listen($('#logoutBtn'), 'click', logout);
  function enterApp() {
    $('#login').classList.add('gone');
    $('#shell').style.display = 'grid';
    $('#storePill').textContent = 'Local demo';
    loadAll();
    clearInterval(state.poll);
    state.poll = setInterval(() => {
      if (state.view === 'orders' || state.view === 'dashboard') loadOrders();
    }, 6000);
  }

  /* ------------------------------- SHELL -------------------------------- */
  scope.listen($('#sideNav'), 'click', e => {
    const btn = e.target.closest('[data-view]');
    if (btn) switchView(btn.dataset.view);
  });
  scope.listen(document, 'click', e => {
    const go = e.target.closest('[data-goto]');
    if (go) switchView(go.dataset.goto);
  });
  const VIEW_META = {
    dashboard: ['Dashboard', 'Live snapshot of the restaurant.'],
    orders: ['Orders', 'Move a rider through the delivery stages.'],
    menu: ['Menu', 'Add, edit, hide or delete dishes.'],
    offers: ['Deals', 'Launch, pause and edit discounts.'],
    reviews: ['Reviews', 'Approve reviews before they go live.']
  };
  function switchView(view) {
    state.view = view;
    $$('.view').forEach(v => v.classList.toggle('active', v.id === `view-${view}`));
    $$('#sideNav button').forEach(b => b.classList.toggle('active', b.dataset.view === view));
    $('#viewTitle').textContent = VIEW_META[view][0];
    $('#viewSub').textContent = VIEW_META[view][1];
    if (view === 'dashboard' || view === 'orders') loadOrders();
    if (view === 'menu') renderMenu();
    if (view === 'offers') renderOffers();
    if (view === 'reviews') renderReviews();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  scope.listen($('#refreshBtn'), 'click', () => {
    loadAll();
    toast('Refreshed');
  });
  async function loadAll() {
    try {
      await loadMenu();
      await Promise.all([loadOrders(), loadOffers(), loadReviews()]);
      await loadSummary();
    } catch (err) {
      toast(err.message, true);
    }
  }

  /* ----------------------------- DASHBOARD ------------------------------ */
  async function loadSummary() {
    const s = await demo.getSummary();
    $('#statCards').innerHTML = `
      <div class="stat-card hot"><span>Revenue today</span><strong>${money(s.revenueToday)}</strong><small>${s.ordersToday} orders today</small></div>
      <div class="stat-card"><span>Live orders</span><strong>${s.live}</strong><small>in progress right now</small></div>
      <div class="stat-card"><span>Total revenue</span><strong>${money(s.revenue)}</strong><small>${s.orders} orders all time</small></div>
      <div class="stat-card"><span>Menu</span><strong>${s.items}</strong><small>${s.unavailable} hidden / out of stock</small></div>
      <div class="stat-card"><span>Deals</span><strong>${s.activeOffers}<small style="font-size:.6em"> / ${s.offers}</small></strong><small>active offers</small></div>
      <div class="stat-card"><span>Reviews</span><strong>${s.pendingReviews}</strong><small>waiting for approval</small></div>`;
    const badge = $('#reviewsBadge');
    badge.style.display = s.pendingReviews ? '' : 'none';
    badge.textContent = s.pendingReviews;
    const live = state.orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).slice(0, 6);
    $('#liveOrders').innerHTML = ordersTableHTML(live, true);
    const active = state.offers.filter(o => o.active);
    $('#dashOffers').innerHTML = active.length ? active.map(offerCardHTML).join('') : '<div class="empty"><strong>No active deals</strong>Launch one to show it on the site.</div>';
  }
  async function loadOrders() {
    state.orders = await demo.getOrders();
    renderOrders();
    const live = state.orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
    const badge = $('#ordersBadge');
    badge.style.display = live.length ? '' : 'none';
    badge.textContent = live.length;
    if (state.view === 'dashboard') {
      $('#liveOrders').innerHTML = ordersTableHTML(live.slice(0, 6), true);
    }
  }
  function statusOptions(current) {
    const list = ['placed', 'preparing', 'on_the_way', 'arriving', 'delivered', 'cancelled'];
    return list.map(s => `<option value="${s}" ${s === current ? 'selected' : ''}>${s.replace(/_/g, ' ')}</option>`).join('');
  }
  function ordersTableHTML(orders, compact) {
    if (!orders.length) {
      return '<div class="empty"><strong>No orders yet</strong>New orders appear here automatically.</div>';
    }
    const rows = orders.map(o => {
      const itemCount = (o.items || []).reduce((s, i) => s + i.qty, 0);
      return `
        <tr>
          <td>
            <div class="code">${esc(o.code)}</div>
            <div class="sub">${new Date(o.createdAt).toLocaleString('en-PK', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      })}</div>
          </td>
          <td>
            <div style="font-weight:700">${esc(o.customer?.name || '—')}</div>
            <div class="sub">${esc(o.customer?.phone || '')}</div>
          </td>
          ${compact ? '' : `<td><div class="sub" style="max-width:220px">${esc(o.customer?.address || 'Pickup')}</div></td>`}
          <td><span class="sub">${itemCount} item${itemCount === 1 ? '' : 's'}</span></td>
          <td class="mono" style="font-weight:800">${money(o.total)}</td>
          <td><span class="tag tag--${o.status}">${o.status.replace(/_/g, ' ')}</span></td>
          <td>
            <select class="mini" data-order-status="${o.id}">${statusOptions(o.status)}</select>
          </td>
        </tr>`;
    }).join('');
    return `<table>
      <thead><tr>
        <th>Order</th><th>Customer</th>${compact ? '' : '<th>Address</th>'}<th>Items</th><th>Total</th><th>Status</th><th>Update</th>
      </tr></thead>
      <tbody>${rows}</tbody></table>`;
  }
  function renderOrders() {
    const q = state.orderQuery.toLowerCase();
    const list = state.orders.filter(o => {
      if (state.orderFilter && o.status !== state.orderFilter) return false;
      if (!q) return true;
      return `${o.code} ${o.customer?.name} ${o.customer?.phone}`.toLowerCase().includes(q);
    });
    $('#ordersTable').innerHTML = ordersTableHTML(list, false);
  }
  scope.listen($('#orderSearch'), 'input', e => {
    state.orderQuery = e.target.value;
    renderOrders();
  });
  scope.listen($('#orderStatusFilter'), 'change', e => {
    state.orderFilter = e.target.value;
    renderOrders();
  });
  scope.listen(document, 'change', async e => {
    const sel = e.target.closest('[data-order-status]');
    if (!sel) return;
    try {
      await demo.updateOrder(sel.dataset.orderStatus, {
        status: sel.value
      });
      toast(`Order status → ${sel.value.replace(/_/g, ' ')}`);
      loadOrders();
      loadSummary();
    } catch (err) {
      toast(err.message, true);
    }
  });

  /* -------------------------------- MENU -------------------------------- */
  async function loadMenu() {
    const data = await demo.getAdminMenu();
    state.items = data.items;
    state.categories = data.categories;
    $('#menuCategoryFilter').innerHTML = '<option value="">All categories</option>' + state.categories.map(c => `<option value="${c.slug}">${esc(c.name)}</option>`).join('');
    $('#itemCategory').innerHTML = state.categories.map(c => `<option value="${c.slug}">${esc(c.name)}</option>`).join('');
    $('#offerCategory').innerHTML = state.categories.map(c => `<option value="${c.slug}">${esc(c.name)}</option>`).join('');
    renderMenu();
  }
  function renderMenu() {
    const q = state.menuQuery.toLowerCase();
    const list = state.items.filter(i => {
      if (state.menuFilter && i.category !== state.menuFilter) return false;
      if (!q) return true;
      return `${i.name} ${i.description}`.toLowerCase().includes(q);
    });
    $('#menuTotal').textContent = `· ${state.items.length} total`;
    if (!list.length) {
      $('#menuTable').innerHTML = '<div class="empty"><strong>No dishes found</strong>Try another search.</div>';
      return;
    }
    const rows = list.map(i => {
      const cat = state.categories.find(c => c.slug === i.category);
      const tags = (i.tags || []).map(t => `<span class="tag tag--${t}">${t}</span>`).join(' ');
      return `
        <tr>
          <td>
            <div style="display:flex;align-items:center;gap:10px">
              <img src="${esc(i.image)}" alt="" style="width:38px;height:38px;border-radius:9px;object-fit:cover" />
              <div>
                <div style="font-weight:700">${esc(i.name)}</div>
                <div class="sub">${esc(cat ? cat.name : i.category)}</div>
              </div>
            </div>
          </td>
          <td class="sub" style="max-width:280px">${esc(i.description)}</td>
          <td class="mono" style="font-weight:800">${money(i.price)}</td>
          <td>${tags || '<span class="sub">—</span>'}</td>
          <td>
            <label class="switch">
              <input type="checkbox" data-item-available="${i.id}" ${i.available ? 'checked' : ''} />
              <span class="track"></span>
            </label>
          </td>
          <td>
            <div class="row-actions">
              <button class="icon-btn" data-edit-item="${i.id}" aria-label="Edit">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              </button>
              <button class="icon-btn danger" data-del-item="${i.id}" aria-label="Delete">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>
              </button>
            </div>
          </td>
        </tr>`;
    }).join('');
    $('#menuTable').innerHTML = `<table>
      <thead><tr><th>Dish</th><th>Description</th><th>Price</th><th>Tags</th><th>Available</th><th></th></tr></thead>
      <tbody>${rows}</tbody></table>`;
  }
  scope.listen($('#menuAdminSearch'), 'input', e => {
    state.menuQuery = e.target.value;
    renderMenu();
  });
  scope.listen($('#menuCategoryFilter'), 'change', e => {
    state.menuFilter = e.target.value;
    renderMenu();
  });
  scope.listen(document, 'change', async e => {
    const toggle = e.target.closest('[data-item-available]');
    if (!toggle) return;
    try {
      await demo.updateItem(toggle.dataset.itemAvailable, {
        available: toggle.checked
      });
      const item = state.items.find(i => Number(i.id) === Number(toggle.dataset.itemAvailable));
      if (item) item.available = toggle.checked;
      toast(toggle.checked ? 'Item is live' : 'Item hidden from the menu');
    } catch (err) {
      toast(err.message, true);
      toggle.checked = !toggle.checked;
    }
  });
  scope.listen(document, 'click', async e => {
    const edit = e.target.closest('[data-edit-item]');
    if (edit) {
      const item = state.items.find(i => Number(i.id) === Number(edit.dataset.editItem));
      if (item) openItemModal(item);
      return;
    }
    const del = e.target.closest('[data-del-item]');
    if (del) {
      const item = state.items.find(i => Number(i.id) === Number(del.dataset.delItem));
      if (!item) return;
      if (!confirm(`Delete “${item.name}” from the menu?`)) return;
      try {
        await demo.deleteItem(item.id);
        toast('Item deleted');
        await loadMenu();
      } catch (err) {
        toast(err.message, true);
      }
    }
  });
  scope.listen($('#newItemBtn'), 'click', () => openItemModal(null));
  function openItemModal(item) {
    const form = $('#itemForm');
    form.reset();
    $('#itemModalTitle').textContent = item ? 'Edit item' : 'New menu item';
    form.elements.id.value = item ? item.id : '';
    if (item) {
      form.elements.name.value = item.name;
      form.elements.description.value = item.description;
      form.elements.price.value = item.price;
      form.elements.category.value = item.category;
      form.elements.image.value = item.image;
      form.elements.tags.value = (item.tags || []).join(', ');
      form.elements.available.checked = item.available !== false;
    } else {
      form.elements.available.checked = true;
      form.elements.image.value = '/assets/cat-burgers.jpg';
    }
    $('#itemModal').classList.add('open');
  }
  scope.listen($('#itemForm'), 'submit', async e => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      name: form.elements.name.value.trim(),
      description: form.elements.description.value.trim(),
      price: Number(form.elements.price.value),
      category: form.elements.category.value,
      image: form.elements.image.value.trim() || '/assets/cat-mexican.jpg',
      tags: form.elements.tags.value.split(',').map(t => t.trim()).filter(Boolean),
      available: form.elements.available.checked
    };
    const id = form.elements.id.value;
    try {
      if (id) await demo.updateItem(id, payload);else await demo.createItem(payload);
      toast(id ? 'Item updated' : 'Item added');
      $('#itemModal').classList.remove('open');
      await loadMenu();
      loadSummary();
    } catch (err) {
      toast(err.message, true);
    }
  });

  /* -------------------------------- DEALS ------------------------------- */
  async function loadOffers() {
    state.offers = await demo.getOffers();
    renderOffers();
  }
  function offerCardHTML(o) {
    const cat = (state.categories.find(c => c.slug === o.category) || {}).name;
    return `
      <article class="offer-card ${o.active ? '' : 'inactive'}">
        <div class="pct">${o.percent}% <span style="font-size:.34em;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)">off</span></div>
        <div>
          <h3>${esc(o.title)}</h3>
          <p>${esc(o.subtitle || 'No subtitle')}</p>
        </div>
        <div class="meta">
          ${o.code ? `<span class="tag tag--popular">${esc(o.code)}</span>` : ''}
          <span class="tag tag--placed">${o.scope === 'all' ? 'All menu' : o.scope === 'category' ? esc(cat || 'Category') : 'Selected items'}</span>
          ${o.endsAt ? `<span class="tag tag--spicy">ends ${esc(String(o.endsAt).slice(0, 10))}</span>` : ''}
        </div>
        <div class="foot">
          <label class="switch">
            <input type="checkbox" data-offer-toggle="${o.id}" ${o.active ? 'checked' : ''} />
            <span class="track"></span>
            ${o.active ? 'Live' : 'Paused'}
          </label>
          <div class="row-actions">
            <button class="icon-btn" data-edit-offer="${o.id}" aria-label="Edit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </button>
            <button class="icon-btn danger" data-del-offer="${o.id}" aria-label="Delete">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>
            </button>
          </div>
        </div>
      </article>`;
  }
  function renderOffers() {
    $('#offersAdmin').innerHTML = state.offers.length ? state.offers.map(offerCardHTML).join('') : '<div class="empty"><strong>No offers yet</strong>Launch your first discount.</div>';
    const active = state.offers.filter(o => o.active);
    $('#dashOffers').innerHTML = active.length ? active.map(offerCardHTML).join('') : '<div class="empty"><strong>No active deals</strong>Launch one to show it on the site.</div>';
  }
  scope.listen(document, 'change', async e => {
    const toggle = e.target.closest('[data-offer-toggle]');
    if (!toggle) return;
    try {
      await demo.updateOffer(toggle.dataset.offerToggle, {
        active: toggle.checked
      });
      toast(toggle.checked ? 'Deal launched — live on the site' : 'Deal paused');
      await loadOffers();
      loadSummary();
    } catch (err) {
      toast(err.message, true);
      toggle.checked = !toggle.checked;
    }
  });
  scope.listen(document, 'click', async e => {
    const edit = e.target.closest('[data-edit-offer]');
    if (edit) {
      const offer = state.offers.find(o => Number(o.id) === Number(edit.dataset.editOffer));
      if (offer) openOfferModal(offer);
      return;
    }
    const del = e.target.closest('[data-del-offer]');
    if (del) {
      if (!confirm('Delete this offer?')) return;
      try {
        await demo.deleteOffer(del.dataset.delOffer);
        toast('Offer deleted');
        await loadOffers();
        loadSummary();
      } catch (err) {
        toast(err.message, true);
      }
    }
  });
  scope.listen($('#newOfferBtn'), 'click', () => openOfferModal(null));
  scope.listen($('#newOfferBtn2'), 'click', () => openOfferModal(null));
  function openOfferModal(offer) {
    const form = $('#offerForm');
    form.reset();
    $('#offerModalTitle').textContent = offer ? 'Edit offer' : 'Launch an offer';
    form.elements.id.value = offer ? offer.id : '';
    if (offer) {
      form.elements.title.value = offer.title;
      form.elements.subtitle.value = offer.subtitle;
      form.elements.percent.value = offer.percent;
      form.elements.code.value = offer.code || '';
      form.elements.scope.value = offer.scope || 'all';
      form.elements.category.value = offer.category || state.categories[0]?.slug || '';
      form.elements.accent.value = offer.accent || 'red';
      form.elements.endsAt.value = offer.endsAt ? String(offer.endsAt).slice(0, 10) : '';
      form.elements.active.checked = offer.active !== false;
    } else {
      form.elements.active.checked = true;
      form.elements.percent.value = 20;
      form.elements.scope.value = 'all';
    }
    $('#offerScope').dispatchEvent(new Event('change'));
    $('#offerModal').classList.add('open');
  }
  scope.listen($('#offerScope'), 'change', e => {
    const on = e.target.value === 'category';
    $('#offerCategory').disabled = !on;
    $('#offerCategory').closest('.field').style.opacity = on ? '1' : '0.45';
  });
  scope.listen($('#offerForm'), 'submit', async e => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      title: form.elements.title.value.trim(),
      subtitle: form.elements.subtitle.value.trim(),
      percent: Number(form.elements.percent.value),
      code: form.elements.code.value.trim().toUpperCase(),
      scope: form.elements.scope.value,
      category: form.elements.scope.value === 'category' ? form.elements.category.value : null,
      accent: form.elements.accent.value,
      endsAt: form.elements.endsAt.value || null,
      active: form.elements.active.checked
    };
    const id = form.elements.id.value;
    try {
      if (id) await demo.updateOffer(id, payload);else await demo.createOffer(payload);
      toast(id ? 'Offer updated' : 'Offer launched');
      $('#offerModal').classList.remove('open');
      await loadOffers();
      loadSummary();
    } catch (err) {
      toast(err.message, true);
    }
  });

  /* ------------------------------- REVIEWS ------------------------------ */
  async function loadReviews() {
    state.reviews = await demo.getAdminReviews();
    renderReviews();
  }
  function renderReviews() {
    if (!state.reviews.length) {
      $('#reviewsTable').innerHTML = '<div class="empty"><strong>No reviews yet</strong></div>';
      return;
    }
    const rows = state.reviews.map(r => `
        <tr>
          <td style="width:22%">
            <div style="font-weight:700">${esc(r.name)}</div>
            <div class="sub">${esc(r.role)}</div>
          </td>
          <td>
            <div style="color:#d99b00;letter-spacing:.1em">${'★'.repeat(r.rating)}<span style="opacity:.25">${'★'.repeat(5 - r.rating)}</span></div>
            <div class="sub" style="max-width:420px">${esc(r.text)}</div>
          </td>
          <td class="sub">${new Date(r.createdAt).toLocaleDateString('en-PK')}</td>
          <td><span class="tag ${r.approved ? 'tag--delivered' : 'tag--placed'}">${r.approved ? 'Published' : 'Pending'}</span></td>
          <td>
            <div class="row-actions">
              <button class="btn btn--sm ${r.approved ? 'btn--ghost' : 'btn--red'}" data-review="${r.id}" data-approve="${r.approved ? 'false' : 'true'}">
                ${r.approved ? 'Unpublish' : 'Approve'}
              </button>
            </div>
          </td>
        </tr>`).join('');
    $('#reviewsTable').innerHTML = `<table>
      <thead><tr><th>Customer</th><th>Review</th><th>Date</th><th>Status</th><th></th></tr></thead>
      <tbody>${rows}</tbody></table>`;
  }
  scope.listen(document, 'click', async e => {
    const btn = e.target.closest('[data-review]');
    if (!btn) return;
    try {
      await demo.updateReview(btn.dataset.review, {
        approved: btn.dataset.approve === 'true'
      });
      toast('Review updated');
      await loadReviews();
      loadSummary();
    } catch (err) {
      toast(err.message, true);
    }
  });

  /* -------------------------------- MODALS ------------------------------ */
  scope.listen(document, 'click', e => {
    const close = e.target.closest('[data-close]');
    if (close) document.getElementById(close.dataset.close).classList.remove('open');
    if (e.target.classList.contains('modal')) e.target.classList.remove('open');
  });
  scope.listen(document, 'keydown', e => {
    if (e.key === 'Escape') $$('.modal.open').forEach(m => m.classList.remove('open'));
  });

  /* --------------------------------- BOOT ------------------------------- */
  if (token()) {
    $('#storePill').textContent = 'Local demo';
    enterApp();
  }
  return () => scope.dispose();
}
