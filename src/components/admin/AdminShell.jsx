export default function AdminShell() {
  return (
<>
  <div className="shell" id="shell" style={{display: 'none'}}>
    <aside className="side">
      <div className="side-brand">
        <img src="/assets/logo-white-text.webp" alt="" />
        <span>Amigo's<br />Admin</span>
      </div>
      <nav className="side-nav" id="sideNav">
        <button data-view="dashboard" className="active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x={3} y={3} width={7} height={9} rx="1.5" /><rect x={14} y={3} width={7} height={5} rx="1.5" /><rect x={14} y={12} width={7} height={9} rx="1.5" /><rect x={3} y={16} width={7} height={5} rx="1.5" /></svg>
          Dashboard
        </button>
        <button data-view="orders">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 18H3V9h11v9h-2" /><circle cx={8} cy={18} r={2} /><circle cx={17} cy={18} r={2} /><path d="M14 9h4l4 4v5h-3" /></svg>
          Orders
          <span className="badge" id="ordersBadge" style={{display: 'none'}}>0</span>
        </button>
        <button data-view="menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h10" /></svg>
          Menu
        </button>
        <button data-view="offers">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 12a2 2 0 0 0 0-4V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2a2 2 0 0 0 0 4 2 2 0 0 0 0 4v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2a2 2 0 0 0 0-4Z" /><path d="M13 5v14" strokeDasharray="2 3" /></svg>
          Deals
        </button>
        <button data-view="reviews">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a8 8 0 0 1-8 8H7l-4 3V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8Z" /></svg>
          Reviews
          <span className="badge" id="reviewsBadge" style={{display: 'none'}}>0</span>
        </button>
      </nav>
      <div className="side-foot">
        <a href="/" target="_blank" rel="noopener">
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><path d="M15 3h6v6" /><path d="M10 14 21 3" /></svg>
          <span className="label">View website</span>
        </a>
        <button id="logoutBtn">
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></svg>
          <span className="label">Sign out</span>
        </button>
      </div>
    </aside>
    <main className="main">
      <div className="topbar">
        <div>
          <h1 id="viewTitle">Dashboard</h1>
          <p id="viewSub">Live snapshot of the restaurant.</p>
        </div>
        <div className="topbar-right">
          <span className="pill"><span className="dot" /><span id="storePill">Connected</span></span>
          <button className="btn btn--ghost btn--sm" id="refreshBtn">
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 3v6h-6" /></svg>
            Refresh
          </button>
          <button className="btn btn--red btn--sm" id="newOfferBtn">
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            Launch offer
          </button>
        </div>
      </div>
      {/* ---------------------------- DASHBOARD --------------------------- */}
      <section className="view active" id="view-dashboard">
        <div className="cards" id="statCards" />
        <div className="panel">
          <div className="panel-head">
            <h2>Live orders</h2>
            <div className="tools"><span className="pill">Auto-refreshes every 6s</span></div>
          </div>
          <div className="panel-body flush">
            <div className="table-wrap" id="liveOrders" />
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><h2>Active deals</h2><button className="btn btn--ghost btn--sm" data-goto="offers">Manage deals</button></div>
          <div className="panel-body"><div className="offer-grid" id="dashOffers" /></div>
        </div>
      </section>
      {/* ----------------------------- ORDERS ---------------------------- */}
      <section className="view" id="view-orders">
        <div className="panel">
          <div className="panel-head">
            <h2>All orders</h2>
            <div className="tools">
              <div className="search-mini">
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx={11} cy={11} r={7} /><path d="m20 20-3.5-3.5" /></svg>
                <input id="orderSearch" placeholder="Code, name or phone" />
              </div>
              <select className="mini" id="orderStatusFilter">
                <option value>All statuses</option>
                <option defaultValue="placed">Placed</option>
                <option defaultValue="preparing">Preparing</option>
                <option defaultValue="on_the_way">On the way</option>
                <option defaultValue="arriving">Arriving</option>
                <option defaultValue="delivered">Delivered</option>
                <option defaultValue="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="panel-body flush"><div className="table-wrap" id="ordersTable" /></div>
        </div>
      </section>
      {/* ------------------------------ MENU ----------------------------- */}
      <section className="view" id="view-menu">
        <div className="panel">
          <div className="panel-head">
            <h2>Menu items <span className="sub" id="menuTotal" /></h2>
            <div className="tools">
              <div className="search-mini">
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx={11} cy={11} r={7} /><path d="m20 20-3.5-3.5" /></svg>
                <input id="menuAdminSearch" placeholder="Search dishes…" />
              </div>
              <select className="mini" id="menuCategoryFilter"><option value>All categories</option></select>
              <button className="btn btn--red btn--sm" id="newItemBtn">
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                New item
              </button>
            </div>
          </div>
          <div className="panel-body flush"><div className="table-wrap" id="menuTable" /></div>
        </div>
      </section>
      {/* ------------------------------ DEALS ---------------------------- */}
      <section className="view" id="view-offers">
        <div className="panel">
          <div className="panel-head">
            <h2>Discounts &amp; offers</h2>
            <div className="tools">
              <span className="sub">Toggle a deal to launch or pause it instantly.</span>
              <button className="btn btn--red btn--sm" id="newOfferBtn2">Launch offer</button>
            </div>
          </div>
          <div className="panel-body"><div className="offer-grid" id="offersAdmin" /></div>
        </div>
      </section>
      {/* ----------------------------- REVIEWS --------------------------- */}
      <section className="view" id="view-reviews">
        <div className="panel">
          <div className="panel-head"><h2>Customer reviews</h2><span className="sub">Approve to publish on the website.</span></div>
          <div className="panel-body flush"><div className="table-wrap" id="reviewsTable" /></div>
        </div>
      </section>
    </main>
  </div>
</>
  );
}
