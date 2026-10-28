import * as demo from './demo-data';
import { createScope } from './lifecycle';
import { escapeHtml as esc } from './escape-html';
/* =========================================================================
   Amigo's Mexican Grill — front-of-house app
   Sections: utils · boot · nav · reveals · motion · menu · cart · checkout
             · rider tracking · reviews · misc
   ========================================================================= */
export function initStorefront() {
  const scope = createScope();
  const {
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    requestAnimationFrame,
    IntersectionObserver
  } = scope;

  /* ------------------------------- UTILS -------------------------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const money = n => `Rs ${Math.round(Number(n) || 0).toLocaleString('en-PK')}`;
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const state = {
    categories: [],
    items: [],
    offers: [],
    cart: [],
    filter: 'all',
    query: '',
    shown: 24,
    order: null,
    trackCode: null,
    trackTimer: null,
    etaTarget: null,
    reviews: [],
    reviewIndex: 0,
    etaSpeed: 1
  };
  function toast(message, icon = 'check') {
    const icons = {
      check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4L19 6"/></svg>',
      info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
      fire: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2c.5 3-1.5 4.5-3 6S7 11.5 7 14a5 5 0 0 0 10 0c0-2-1-3.5-2-5-.5 1-1 1.5-2 1.5 1-2.5 1-6 0-8.5Z"/></svg>'
    };
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `<span class="ico">${icons[icon] || icons.check}</span><span>${esc(message)}</span>`;
    $('#toasts').appendChild(el);
    setTimeout(() => {
      el.classList.add('out');
      setTimeout(() => el.remove(), 400);
    }, 3200);
  }

  /* ------------------------------- BOOT --------------------------------- */
  let closeCart = () => {};
  setTimeout(() => document.body.classList.add('loaded'), reduceMotion ? 0 : 1150);
  setTimeout(init, 0);
  async function init() {
    buildMarquee();
    initNav();
    initScrollProgress();
    initReveals();
    initMagnetic();
    initCounters();
    initCartUI();
    initCheckout();
    initTrackUI();
    initRail();
    initReviewsUI();
    initMisc();
    try {
      await loadMenu();
    } catch (err) {
      console.error(err);
      $('#menuGrid').innerHTML = `<div class="menu-empty"><strong>Menu could not load</strong><p>${esc(err.message)}</p></div>`;
    }
    loadReviews();
    restoreCart();
    initDeepLink();

    // keep the route line hidden until an order is tracked
    const route = $('#routeProgress');
    if (route) {
      const len = route.getTotalLength();
      route.style.strokeDasharray = `${len}`;
      route.style.strokeDashoffset = `${len}`;
    }
  }

  /* ------------------------------- NAV ---------------------------------- */
  function initNav() {
    const nav = $('#nav');
    const burger = $('#burger');
    const links = $$('.nav-links a');
    const onScroll = () => {
      nav.classList.toggle('is-stuck', window.scrollY > 24);
      const y = window.scrollY + 140;
      let current = '';
      ['menu', 'offers', 'track', 'about', 'reviews'].forEach(id => {
        const section = document.getElementById(id);
        if (section && section.offsetTop <= y) current = id;
      });
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current}`));
    };
    onScroll();
    scope.listen(window, 'scroll', onScroll, {
      passive: true
    });
    const closeMenu = () => {
      document.body.classList.remove('menu-open');
      burger.setAttribute('aria-expanded', 'false');
      $('#mobileMenu').setAttribute('aria-hidden', 'true');
    };
    scope.listen(burger, 'click', () => {
      const open = !document.body.classList.contains('menu-open');
      document.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', String(open));
      $('#mobileMenu').setAttribute('aria-hidden', String(!open));
    });
    $$('#mobileMenu a').forEach(a => scope.listen(a, 'click', closeMenu));
    scope.listen(document, 'keydown', e => {
      if (e.key === 'Escape') {
        closeMenu();
        closeCart();
        $$('.modal.open').forEach(m => m.classList.remove('open'));
        document.body.classList.remove('is-locked');
      }
    });
  }
  function initScrollProgress() {
    const bar = $('#scrollbar');
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = `${h > 0 ? window.scrollY / h * 100 : 0}%`;
    };
    update();
    scope.listen(window, 'scroll', update, {
      passive: true
    });
    scope.listen(window, 'resize', update);
  }

  /* ------------------------------ REVEALS ------------------------------- */
  let revealObserver;
  function initReveals() {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    });
    observeReveals(document);
  }
  function observeReveals(root) {
    $$('[data-reveal], .img-reveal, .split-line', root).forEach(el => {
      if (!el.classList.contains('is-in')) revealObserver.observe(el);
    });
  }
  function initCounters() {
    const counters = $$('[data-count]');
    if (!counters.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.count);
        const dur = 1600;
        const start = performance.now();
        const tick = now => {
          const p = clamp((now - start) / dur, 0, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toString();
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, {
      threshold: 0.5
    });
    counters.forEach(c => io.observe(c));
  }

  /* ------------------------------ MAGNETIC ------------------------------ */
  function initMagnetic() {
    if (!isFinePointer || reduceMotion) return;
    $$('[data-magnetic]').forEach(btn => {
      scope.listen(btn, 'pointermove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.16;
        const y = (e.clientY - r.top - r.height / 2) * 0.22;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      scope.listen(btn, 'pointerleave', () => {
        btn.style.transform = '';
      });
    });
  }
  function tilt(card) {
    if (!isFinePointer || reduceMotion) return;
    scope.listen(card, 'pointermove', e => {
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
      const ry = ((e.clientX - r.left) / r.width - 0.5) * 8;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    });
    scope.listen(card, 'pointerleave', () => {
      card.style.transform = '';
    });
  }
  function buildMarquee() {
    const words = ['Burgers', 'Birria tacos', 'Pad thai', 'Wok fired', 'Loaded fries', 'Milkshakes', 'Churros', 'Green curry'];
    const chunk = words.map(w => `${w} <span class="star">✦</span>`).join(' ');
    const track = $('#marqueeTrack');
    track.innerHTML = `<span>${chunk}</span><span>${chunk}</span>`;
  }

  /* -------------------------------- MENU -------------------------------- */
  async function loadMenu() {
    const data = await demo.getMenu();
    state.categories = data.categories || [];
    state.offers = data.offers || [];
    state.items = data.items || [];
    renderCategories();
    renderOffers();
    renderChips();
    renderMenu(true);

    // hero price reflects the live deal on The Big Amigo
    const hero = state.items.find(i => i.name === 'The Big Amigo (Triple)');
    if (hero && hero.offer) {
      $('#heroPrice').innerHTML = `${money(hero.finalPrice)} <s style="opacity:.6;font-weight:600;font-size:.8em">${money(hero.price)}</s>`;
    }
    renderCart();
  }
  function renderCategories() {
    const rail = $('#catRail');
    const countFor = slug => state.items.filter(i => i.category === slug).length;
    rail.innerHTML = state.categories.map((c, i) => `
        <button class="cat-card" data-cat="${esc(c.slug)}" data-reveal="scale" style="--d:${i}" aria-label="Show ${esc(c.name)}">
          <img src="${esc(c.image)}" alt="${esc(c.name)}" loading="lazy" />
          <div class="cat-body">
            <div class="count">${countFor(c.slug)} dishes</div>
            <h3>${esc(c.name)}</h3>
            <p>${esc(c.tagline)}</p>
            <span class="go">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>
            </span>
          </div>
        </button>`).join('');
    $$('.cat-card', rail).forEach(card => {
      tilt(card);
      scope.listen(card, 'click', () => {
        setFilter(card.dataset.cat);
        document.getElementById('menu').scrollIntoView({
          behavior: reduceMotion ? 'auto' : 'smooth',
          block: 'start'
        });
        toast(`${card.querySelector('h3').textContent} — ${countFor(card.dataset.cat)} dishes`, 'fire');
      });
    });
    observeReveals(rail);
  }
  function renderOffers() {
    const grid = $('#offersGrid');
    const active = state.offers.filter(o => o.active !== false);
    if (!active.length) {
      grid.innerHTML = '';
      return;
    }
    const accents = ['', 'offer-card--gold', 'offer-card--green'];
    grid.innerHTML = active.slice(0, 3).map((o, i) => `
        <article class="offer-card ${accents[i % accents.length]}">
          <div>
            <div class="badge-pct">${o.percent}<small>% off</small></div>
            ${o.code ? `<div class="code">${esc(o.code)}</div>` : ''}
          </div>
          <div>
            <h3>${esc(o.title)}</h3>
            <p>${o.subtitle || 'Limited-time discount across selected dishes.'}</p>
            <div class="offer-foot">
              <span class="claim">Order the deal
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>
              </span>
              <span style="font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;opacity:.55">
                ${o.scope === 'all' ? 'Site-wide' : o.scope === 'category' ? (state.categories.find(c => c.slug === o.category) || {}).name || 'Selected' : 'Selected items'}
              </span>
            </div>
          </div>
        </article>`).join('');
    $$('.offer-card', grid).forEach((card, i) => {
      tilt(card);
      scope.listen(card, 'click', () => {
        const offer = active[i];
        if (offer.scope === 'category' && offer.category) setFilter(offer.category);
        document.getElementById('menu').scrollIntoView({
          behavior: reduceMotion ? 'auto' : 'smooth'
        });
      });
    });
  }
  function renderChips() {
    const chips = $('#menuChips');
    const all = [{
      slug: 'all',
      name: 'All dishes'
    }, ...state.categories];
    chips.innerHTML = all.map(c => `<button class="chip ${c.slug === state.filter ? 'active' : ''}" data-chip="${esc(c.slug)}" role="tab" aria-selected="${c.slug === state.filter}">${esc(c.name)}</button>`).join('');
    scope.listen(chips, 'click', e => {
      const btn = e.target.closest('[data-chip]');
      if (btn) setFilter(btn.dataset.chip);
    });
  }
  function setFilter(slug) {
    state.filter = slug;
    state.shown = 24;
    $$('#menuChips .chip').forEach(c => {
      const on = c.dataset.chip === slug;
      c.classList.toggle('active', on);
      c.setAttribute('aria-selected', String(on));
      if (on) c.scrollIntoView({
        inline: 'center',
        block: 'nearest',
        behavior: 'smooth'
      });
    });
    renderMenu(true);
  }
  function filteredItems() {
    const q = state.query.trim().toLowerCase();
    return state.items.filter(item => {
      if (state.filter !== 'all' && item.category !== state.filter) return false;
      if (!q) return true;
      return `${esc(item.name)} ${esc(item.description)} ${esc(item.category)}`.toLowerCase().includes(q);
    });
  }
  function dishCard(item, index) {
    const cat = state.categories.find(c => c.slug === item.category);
    const flags = [];
    if (item.tags.includes('popular')) flags.push('<span class="flag flag--popular">Popular</span>');
    if (item.tags.includes('spicy')) flags.push('<span class="flag flag--spicy">Spicy</span>');
    if (item.tags.includes('veg')) flags.push('<span class="flag flag--veg">Veg</span>');
    const sale = item.offer ? `<span class="sale">−${item.offer.percent}%</span>` : '';
    return `
      <article class="dish" data-reveal style="--d:${index % 8}">
        <div class="dish-media">
          <img src="${esc(item.image)}" alt="${esc(item.name)}" loading="lazy" />
          <div class="flags">${flags.join('')}</div>
          ${sale}
        </div>
        <div class="dish-body">
          <div class="dish-cat">${cat ? cat.name : item.category}</div>
          <h3>${esc(item.name)}</h3>
          <p>${esc(item.description)}</p>
          <div class="dish-foot">
            <div class="price">
              <strong>${money(item.finalPrice)}</strong>
              ${item.offer ? `<s>${money(item.price)}</s>` : ''}
            </div>
            <button class="add-btn" data-add="${item.id}" aria-label="Add ${esc(item.name)} to cart">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
        </div>
      </article>`;
  }
  function renderMenu(reset) {
    const grid = $('#menuGrid');
    const list = filteredItems();
    const visible = list.slice(0, state.shown);
    if (!list.length) {
      grid.innerHTML = `<div class="menu-empty"><strong>Nothing matches “${esc(state.query)}”</strong><p>Try another dish, or clear the filters.</p></div>`;
    } else {
      grid.innerHTML = visible.map(dishCard).join('');
    }
    $('#menuCount').textContent = `${list.length} dish${list.length === 1 ? '' : 'es'}`;
    $('#loadMore').style.display = list.length > state.shown ? '' : 'none';
    observeReveals(grid);
  }

  /* -------------------------------- CART -------------------------------- */
  const CART_KEY = 'amigos_cart_v1';
  function saveCart() {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(state.cart.map(l => ({
        id: l.id,
        qty: l.qty
      }))));
    } catch {/* Cart still works in memory when storage is blocked. */}
  }
  function restoreCart() {
    try {
      const raw = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
      state.cart = (Array.isArray(raw) ? raw : []).map(line => {
        const item = state.items.find(i => Number(i.id) === Number(line.id));
        return item ? {
          id: item.id,
          qty: clamp(Number(line.qty) || 1, 1, 20)
        } : null;
      }).filter(Boolean);
    } catch {
      state.cart = [];
    }
    renderCart();
  }
  function addToCart(id, originEl) {
    const item = state.items.find(i => Number(i.id) === Number(id));
    if (!item) return;
    const line = state.cart.find(l => Number(l.id) === Number(id));
    if (line) line.qty = clamp(line.qty + 1, 1, 20);else state.cart.push({
      id: item.id,
      qty: 1
    });
    saveCart();
    renderCart();
    bumpCart();
    flyToCart(originEl, item.image);
    toast(`${esc(item.name)} added`, 'check');
  }
  function bumpCart() {
    const btn = $('#cartBtn');
    btn.classList.remove('bump');
    void btn.offsetWidth;
    btn.classList.add('bump');
  }
  function flyToCart(originEl, image) {
    if (!originEl || reduceMotion) return;
    const from = originEl.getBoundingClientRect();
    const to = $('#cartBtn').getBoundingClientRect();
    const dot = document.createElement('div');
    dot.style.cssText = `position:fixed;left:${from.left + from.width / 2}px;top:${from.top + from.height / 2}px;width:26px;height:26px;border-radius:50%;background:url(${image}) center/cover;z-index:190;pointer-events:none;box-shadow:0 6px 18px rgba(0,0,0,.3)`;
    document.body.appendChild(dot);
    dot.animate([{
      transform: 'translate(-50%,-50%) scale(1)',
      opacity: 1
    }, {
      transform: `translate(${to.left + to.width / 2 - from.left - from.width / 2 - 13}px, ${to.top + to.height / 2 - from.top - from.height / 2 - 13}px) scale(.35)`,
      opacity: 0.2
    }], {
      duration: 720,
      easing: 'cubic-bezier(.16,1,.3,1)'
    }).onfinish = () => dot.remove();
  }
  function cartTotals() {
    let subtotal = 0;
    let total = 0;
    state.cart.forEach(line => {
      const item = state.items.find(i => Number(i.id) === Number(line.id));
      if (!item) return;
      subtotal += item.price * line.qty;
      total += item.finalPrice * line.qty;
    });
    return {
      subtotal,
      total,
      savings: subtotal - total,
      count: state.cart.reduce((s, l) => s + l.qty, 0)
    };
  }
  function renderCart() {
    const body = $('#cartBody');
    const totals = cartTotals();
    $('#cartCount').textContent = totals.count;
    $('#cartSubtotal').textContent = money(totals.subtotal);
    $('#cartTotal').textContent = money(totals.total);
    $('#cartSaveRow').hidden = totals.savings <= 0;
    $('#cartSave').textContent = `− ${money(totals.savings)}`;
    $('#checkoutBtn').disabled = !state.cart.length;
    if (!state.cart.length) {
      body.innerHTML = `
        <div class="cart-empty">
          <div class="ico">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </div>
          <strong>Your bag is empty</strong>
          <p>Add something from the grill — 124 dishes are waiting.</p>
          <button class="btn btn--sm btn--ghost" style="margin-top:14px" data-browse-menu><span>Browse the menu</span></button>
        </div>`;
      return;
    }
    body.innerHTML = state.cart.map(line => {
      const item = state.items.find(i => Number(i.id) === Number(line.id));
      if (!item) return '';
      return `
        <div class="cart-line">
          <img src="${esc(item.image)}" alt="" />
          <div>
            <div class="nm">${esc(item.name)}</div>
            <div class="pr">${money(item.finalPrice)}${item.offer ? ` <s style="opacity:.6">${money(item.price)}</s>` : ''}</div>
            <div class="qty">
              <button data-qty="${item.id}" data-delta="-1" aria-label="Decrease">−</button>
              <span>${line.qty}</span>
              <button data-qty="${item.id}" data-delta="1" aria-label="Increase">+</button>
            </div>
          </div>
          <div style="text-align:right">
            <div class="line-total">${money(item.finalPrice * line.qty)}</div>
            <button class="rm" data-remove="${item.id}">remove</button>
          </div>
        </div>`;
    }).join('');
  }
  function initCartUI() {
    const drawer = $('#cartDrawer');
    const scrim = $('#scrim');
    const open = () => {
      drawer.classList.add('open');
      scrim.classList.add('show');
      drawer.setAttribute('aria-hidden', 'false');
    };
    closeCart = () => {
      drawer.classList.remove('open');
      scrim.classList.remove('show');
      drawer.setAttribute('aria-hidden', 'true');
    };
    scope.listen($('#cartBtn'), 'click', open);
    scope.listen($('#cartClose'), 'click', closeCart);
    scope.listen(scrim, 'click', closeCart);
    scope.listen(document, 'click', e => {
      if (e.target.closest('[data-browse-menu]')) {
        closeCart();
        $('#menu').scrollIntoView({
          behavior: reduceMotion ? 'auto' : 'smooth'
        });
        return;
      }
      const add = e.target.closest('[data-add]');
      if (add) {
        addToCart(add.dataset.add, add);
        add.classList.add('added');
        setTimeout(() => add.classList.remove('added'), 900);
        return;
      }
      const qtyBtn = e.target.closest('[data-qty]');
      if (qtyBtn) {
        const id = Number(qtyBtn.dataset.qty);
        const delta = Number(qtyBtn.dataset.delta);
        const line = state.cart.find(l => Number(l.id) === id);
        if (!line) return;
        line.qty = clamp(line.qty + delta, 0, 20);
        if (line.qty <= 0) state.cart = state.cart.filter(l => Number(l.id) !== id);
        saveCart();
        renderCart();
        return;
      }
      const rm = e.target.closest('[data-remove]');
      if (rm) {
        state.cart = state.cart.filter(l => Number(l.id) !== Number(rm.dataset.remove));
        saveCart();
        renderCart();
      }
    });
    scope.listen($('#loadMore'), 'click', () => {
      state.shown += 24;
      renderMenu();
      observeReveals($('#menuGrid'));
    });
    const search = $('#menuSearch');
    let t;
    scope.listen(search, 'input', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        state.query = search.value;
        state.shown = 24;
        renderMenu(true);
      }, 160);
    });
  }

  /* ------------------------------ CHECKOUT ------------------------------ */
  function initCheckout() {
    let orderType = 'delivery';
    const openCheckout = () => {
      if (!state.cart.length) return toast('Add something delicious first', 'info');
      closeCart();
      renderCheckoutSummary();
      $('#checkoutModal').classList.add('open');
      document.body.classList.add('is-locked');
      setTimeout(() => $('#cName').focus(), 350);
    };
    scope.listen($('#checkoutBtn'), 'click', openCheckout);
    $$('[data-close-modal]').forEach(btn => scope.listen(btn, 'click', () => {
      document.getElementById(btn.dataset.closeModal).classList.remove('open');
      document.body.classList.remove('is-locked');
    }));
    scope.listen($('#checkoutModal'), 'click', e => {
      if (e.target.id === 'checkoutModal') {
        e.currentTarget.classList.remove('open');
        document.body.classList.remove('is-locked');
      }
    });
    $$('#typeSeg button').forEach(btn => scope.listen(btn, 'click', () => {
      orderType = btn.dataset.type;
      $$('#typeSeg button').forEach(b => b.classList.toggle('active', b === btn));
      $('#addressField').style.display = orderType === 'delivery' ? '' : 'none';
      renderCheckoutSummary();
    }));
    function renderCheckoutSummary() {
      const totals = cartTotals();
      $('#checkoutSummary').innerHTML = `
        <div class="row"><span>${totals.count} item${totals.count === 1 ? '' : 's'}</span><span>${money(totals.subtotal)}</span></div>
        ${totals.savings > 0 ? `<div class="row" style="color:var(--green);font-weight:800"><span>Deal savings</span><span>− ${money(totals.savings)}</span></div>` : ''}
        <div class="row"><span>${orderType === 'delivery' ? 'Delivery' : 'Pickup'}</span><span>${orderType === 'delivery' ? 'Free' : '—'}</span></div>
        <div class="row total"><span>Total</span><span>${money(totals.total)}</span></div>`;
    }
    scope.listen($('#checkoutForm'), 'submit', async e => {
      e.preventDefault();
      const btn = $('#placeOrderBtn');
      const form = new FormData(e.target);
      const payload = {
        customer: {
          name: String(form.get('name') || '').trim(),
          phone: String(form.get('phone') || '').trim(),
          address: String(form.get('address') || '').trim()
        },
        type: orderType,
        payment: form.get('payment'),
        notes: String(form.get('notes') || '').trim(),
        items: state.cart.map(l => ({
          id: l.id,
          qty: l.qty
        }))
      };
      if (orderType === 'delivery' && !payload.customer.address) {
        $('#cAddress').focus();
        return toast('Please add a delivery address', 'info');
      }
      btn.disabled = true;
      btn.innerHTML = '<span>Placing your order…</span>';
      try {
        const res = await demo.placeOrder(payload);
        state.cart = [];
        saveCart();
        renderCart();
        $('#checkoutModal').classList.remove('open');
        $('#successCode').textContent = res.order.code;
        $('#successEta').textContent = `Estimated arrival in ${res.order.etaMinutes} minutes · rider ${res.order.rider ? res.order.rider.name : 'assigned'}`;
        $('#successModal').classList.add('open');
        document.body.classList.add('is-locked');
        $('#goTrack').onclick = () => {
          $('#successModal').classList.remove('open');
          document.body.classList.remove('is-locked');
          startTracking(res.order.code);
          document.getElementById('track').scrollIntoView({
            behavior: 'smooth'
          });
        };
      } catch (err) {
        toast(err.message, 'info');
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<span>Place order</span>';
      }
    });
  }

  /* --------------------------- RIDER TRACKING --------------------------- */
  function initTrackUI() {
    scope.listen($('#trackBtn'), 'click', () => {
      const code = $('#trackInput').value.trim().toUpperCase();
      if (!code) return toast('Enter an order code to track', 'info');
      startTracking(code);
    });
    scope.listen($('#trackInput'), 'keydown', e => {
      if (e.key === 'Enter') $('#trackBtn').click();
    });
    scope.listen($('#demoTrack'), 'click', async () => {
      const btn = $('#demoTrack');
      btn.textContent = 'Starting demo…';
      try {
        const sample = [{
          id: 1,
          qty: 1
        }, {
          id: 23,
          qty: 2
        }];
        const res = await demo.placeOrder({
          customer: {
            name: 'Demo guest',
            phone: '0300 0000000',
            address: 'Demo street, Lahore'
          },
          type: 'delivery',
          items: sample,
          notes: 'Demo delivery generated from the tracking section'
        });
        $('#demoTrack').textContent = 'Try a demo delivery';
        startTracking(res.order.code);
        toast(`Demo order ${res.order.code} is on its way`, 'fire');
      } catch (err) {
        btn.textContent = 'Try a demo delivery';
        toast(err.message, 'info');
      }
    });

    // live countdown between polls (scaled by the demo speed so the number
    // counts down in step with the rider, not in wall-clock minutes)
    setInterval(() => {
      if (!state.etaTarget) return;
      const speed = state.etaSpeed || 1;
      const mins = Math.max(0, Math.ceil((state.etaTarget - Date.now()) / 1000 * speed / 60));
      const num = $('#etaNumber');
      if (num.firstChild) num.firstChild.nodeValue = `${mins}`;
      if (mins === 0 && state.order && state.order.status !== 'delivered') {
        $('#etaTitle').textContent = 'Arriving any minute';
      }
    }, 1000);
  }
  async function startTracking(code) {
    state.trackCode = code;
    $('#trackInput').value = code;
    $('#liveState').textContent = 'Connecting…';
    clearInterval(state.trackTimer);
    state.trackTimer = setInterval(pollTracking, 4000);
    await pollTracking();
  }
  async function pollTracking() {
    if (!state.trackCode) return;
    try {
      const data = await demo.getTracking(state.trackCode);
      state.order = data;
      renderTracking(data);
    } catch (err) {
      clearInterval(state.trackTimer);
      $('#liveState').textContent = 'Code not found';
      $('#etaTitle').textContent = 'Order not found';
      $('#etaSub').textContent = 'Check the code on your receipt and try again.';
      toast(err.message, 'info');
    }
  }
  function renderTracking(data) {
    $('#mapEmpty').style.display = 'none';
    $('#liveState').textContent = data.status === 'cancelled' ? 'Cancelled' : data.status === 'delivered' ? 'Delivered' : 'Live tracking';
    const mins = data.etaMinutes;
    state.etaSpeed = data.demo && data.demo.speed || 1;
    $('#etaNumber').innerHTML = `${mins}<small>min</small>`;
    state.etaTarget = Date.now() + mins * 60000 / state.etaSpeed;
    const demoChip = $('#demoChip');
    if (demoChip) {
      demoChip.hidden = state.etaSpeed <= 1;
      demoChip.textContent = `Demo ×${state.etaSpeed}`;
    }
    $('#etaTitle').textContent = data.status === 'delivered' ? 'Delivered — enjoy!' : data.statusLabel;
    $('#etaSub').textContent = data.status === 'delivered' ? `Order ${data.code} completed` : `${data.statusCopy} ETA ${data.etaClock}.`;

    // timeline
    $('#timeline').classList.remove('timeline--idle');
    $('#timeline').innerHTML = data.timeline.map(step => `
        <div class="tl-step ${step.done ? 'done' : ''} ${step.active ? 'active' : ''}">
          <div class="tl-dot">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4L19 6"/></svg>
          </div>
          <div class="tl-copy"><strong>${step.label}</strong><span>${step.detail}</span></div>
        </div>`).join('');

    // rider card
    if (data.rider) {
      const initials = data.rider.name.split(' ').map(n => n[0]).join('').slice(0, 2);
      $('#riderInitials').textContent = initials;
      $('#riderName').textContent = data.rider.name;
      $('#riderMeta').textContent = `${data.rider.vehicle} · ${data.rider.plate}`;
      $('#riderCall').href = `tel:${data.rider.phone.replace(/\s/g, '')}`;
    } else {
      $('#riderInitials').textContent = 'PK';
      $('#riderName').textContent = 'Pickup order';
      $('#riderMeta').textContent = 'Collect from the Amigos counter';
      $('#riderCall').href = 'tel:+923001234567';
    }

    // map
    const path = $('#routeProgress');
    const base = $('#routeLine');
    const length = path.getTotalLength();
    const pct = clamp(data.progress, 0, 100);
    [path, base].forEach(p => {
      p.style.strokeDasharray = `${length}`;
    });
    path.style.strokeDashoffset = `${length * (1 - pct / 100)}`;
    base.style.strokeDasharray = '8 8';
    const point = path.getPointAtLength(pct / 100 * length);
    $('#riderMarker').setAttribute('transform', `translate(${point.x.toFixed(1)},${point.y.toFixed(1)})`);
    $('#hudStatus').textContent = data.statusLabel;
    $('#hudPct').textContent = `${pct}%`;
    $('#hudDistance').textContent = `${(3.2 * (1 - pct / 100)).toFixed(1)} km`;
    if (['delivered', 'cancelled'].includes(data.status)) {
      state.etaTarget = null;
      clearInterval(state.trackTimer);
      $('#liveState').textContent = data.statusLabel;
      if (data.status === 'cancelled') return;
      setTimeout(() => toast('Order delivered. Buen provecho!', 'fire'), 300);
    }
  }
  function initDeepLink() {
    const code = new URLSearchParams(window.location.search).get('code');
    const match = code ? [null, code] : window.location.pathname.match(/^\/track\/([A-Za-z0-9-]+)/);
    if (match) {
      startTracking(match[1].toUpperCase());
      setTimeout(() => document.getElementById('track').scrollIntoView({
        behavior: 'smooth'
      }), 800);
    }
  }

  /* ------------------------------ CATEGORY RAIL ------------------------- */
  function initRail() {
    const rail = $('#catRail');
    const prev = $('#railPrev');
    const next = $('#railNext');
    if (!rail) return;
    const step = () => (rail.querySelector('.cat-card')?.offsetWidth || 260) + 18;
    const update = () => {
      prev.disabled = rail.scrollLeft < 8;
      next.disabled = rail.scrollLeft > rail.scrollWidth - rail.clientWidth - 8;
    };
    scope.listen(prev, 'click', () => rail.scrollBy({
      left: -step() * 1.6,
      behavior: 'smooth'
    }));
    scope.listen(next, 'click', () => rail.scrollBy({
      left: step() * 1.6,
      behavior: 'smooth'
    }));
    scope.listen(rail, 'scroll', update, {
      passive: true
    });
    setTimeout(update, 400);

    // drag to scroll
    let down = false;
    let startX = 0;
    let startLeft = 0;
    scope.listen(rail, 'pointerdown', e => {
      if (e.pointerType === 'touch') return;
      down = true;
      startX = e.clientX;
      startLeft = rail.scrollLeft;
      rail.classList.add('dragging');
    });
    scope.listen(rail, 'pointermove', e => {
      if (!down) return;
      rail.scrollLeft = startLeft - (e.clientX - startX);
    });
    const stop = () => {
      down = false;
      rail.classList.remove('dragging');
    };
    scope.listen(window, 'pointerup', stop);
    scope.listen(rail, 'pointerleave', stop);
  }

  /* -------------------------------- REVIEWS ----------------------------- */
  async function loadReviews() {
    try {
      state.reviews = await demo.getReviews();
      renderReviews();
    } catch {/* silent */}
  }
  function renderReviews() {
    const track = $('#reviewsTrack');
    if (!state.reviews.length) {
      track.innerHTML = '<p class="muted" style="padding:24px">No reviews yet — be the first.</p>';
      return;
    }
    track.innerHTML = state.reviews.map(r => {
      const initials = r.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
      return `
        <article class="review">
          <div class="stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
          <blockquote>“${esc(r.text)}”</blockquote>
          <div class="who">
            <div class="av">${esc(initials)}</div>
            <div><strong>${esc(r.name)}</strong><span>${esc(r.role)}</span></div>
          </div>
        </article>`;
    }).join('');
    updateReviewPosition();
  }
  function perView() {
    return window.innerWidth <= 760 ? 1 : window.innerWidth <= 1120 ? 2 : 3;
  }
  function updateReviewPosition() {
    const track = $('#reviewsTrack');
    const card = track.querySelector('.review');
    if (!card) return;
    const gap = 18;
    const step = card.offsetWidth + gap;
    const max = Math.max(0, state.reviews.length - perView());
    state.reviewIndex = clamp(state.reviewIndex, 0, max);
    track.style.transform = `translateX(${-state.reviewIndex * step}px)`;
    $('#revDots').innerHTML = Array.from({
      length: max + 1
    }).map((_, i) => `<button data-dot="${i}" class="${i === state.reviewIndex ? 'active' : ''}" aria-label="Reviews page ${i + 1}"></button>`).join('');
  }
  function initReviewsUI() {
    scope.listen($('#revPrev'), 'click', () => {
      state.reviewIndex = Math.max(0, state.reviewIndex - 1);
      updateReviewPosition();
    });
    scope.listen($('#revNext'), 'click', () => {
      state.reviewIndex = Math.min(state.reviews.length - perView(), state.reviewIndex + 1);
      updateReviewPosition();
    });
    scope.listen($('#revDots'), 'click', e => {
      const dot = e.target.closest('[data-dot]');
      if (dot) {
        state.reviewIndex = Number(dot.dataset.dot);
        updateReviewPosition();
      }
    });
    scope.listen(window, 'resize', updateReviewPosition);
    let auto = setInterval(() => {
      if (!state.reviews.length) return;
      const max = Math.max(0, state.reviews.length - perView());
      state.reviewIndex = state.reviewIndex >= max ? 0 : state.reviewIndex + 1;
      updateReviewPosition();
    }, 6500);
    scope.listen($('#reviews'), 'pointerenter', () => clearInterval(auto));
    scope.listen($('#reviews'), 'pointerleave', () => {
      clearInterval(auto);
      auto = setInterval(() => {
        const max = Math.max(0, state.reviews.length - perView());
        state.reviewIndex = state.reviewIndex >= max ? 0 : state.reviewIndex + 1;
        updateReviewPosition();
      }, 6500);
    });
    scope.listen($('#reviewForm'), 'submit', async e => {
      e.preventDefault();
      const form = new FormData(e.target);
      try {
        const res = await demo.submitReview({
          name: form.get('name'),
          text: form.get('text'),
          rating: form.get('rating')
        });
        e.target.reset();
        toast(res.message || 'Thanks for the review!', 'check');
      } catch (err) {
        toast(err.message, 'info');
      }
    });
  }

  /* --------------------------------- MISC ------------------------------- */
  function initMisc() {
    $('#year').textContent = new Date().getFullYear();
    scope.listen($('#newsletterForm'), 'submit', e => {
      e.preventDefault();
      e.target.reset();
      toast('Demo preview — no subscription was sent.', 'fire');
    });

    // sticky toolbar shadow
    const toolbar = $('#menuToolbar');
    if (toolbar) {
      scope.listen(window, 'scroll', () => {
        toolbar.classList.toggle('stuck', toolbar.getBoundingClientRect().top <= 80);
      }, {
        passive: true
      });
    }

    // kitchen open state (11:00 – 02:00)
    const hour = Number(new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Karachi',
      hour: '2-digit',
      hourCycle: 'h23'
    }).format(new Date()));
    const open = hour >= 11 || hour < 2;
    const el = $('#kitchenStatus');
    if (el) {
      el.textContent = open ? 'Open now' : 'Closed — opens 11:00';
      el.style.color = open ? 'var(--green)' : 'var(--red)';
    }
  }
  return () => scope.dispose();
}
