export default function Navigation() {
  return (
<>
  {/* ============================ PRELOADER ============================ */}
  <div id="preloader" aria-hidden="true">
    <div className="pl-inner">
      <img src="/assets/logo.png" alt="" />
      <div className="pl-bar"><span /></div>
      <div className="pl-word">Bienvenidos · Fresh off the grill</div>
    </div>
  </div>
  <div id="scrollbar" aria-hidden="true" />
  {/* ============================ NAVIGATION =========================== */}
  <header className="nav" id="nav">
    <div className="nav-inner">
      <a href="#top" className="nav-brand" aria-label="Amigo's Mexican Grill — home">
        <img src="/assets/logo-sm.png" alt="Amigo's Mexican Grill" />
      </a>
      <nav className="nav-links" aria-label="Primary">
        <a href="#menu" data-nav>Menu</a>
        <a href="#offers" data-nav>Deals</a>
        <a href="#track" data-nav>Track order</a>
        <a href="#about" data-nav>About</a>
        <a href="#reviews" data-nav>Reviews</a>
      </nav>
      <div className="nav-actions">
        <button className="cart-btn" id="cartBtn" aria-label="Open cart">
          <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
          <span className="label">Cart</span>
          <span className="count" id="cartCount">0</span>
        </button>
        <button className="burger" id="burger" aria-label="Open menu" aria-expanded="false">
          <span /><span /><span />
        </button>
      </div>
    </div>
  </header>
  {/* mobile menu */}
  <div className="mobile-menu" id="mobileMenu" aria-hidden="true">
    <a href="#menu" style={{'--i': 0}}><small>01</small> Menu</a>
    <a href="#offers" style={{'--i': 1}}><small>02</small> Deals</a>
    <a href="#track" style={{'--i': 2}}><small>03</small> Track order</a>
    <a href="#about" style={{'--i': 3}}><small>04</small> About</a>
    <a href="#reviews" style={{'--i': 4}}><small>05</small> Reviews</a>
    <div className="mm-foot">
      <span>Open daily · 11:00 – 02:00</span>
      <span>·</span>
      <a href="tel:+923001234567" style={{fontFamily: 'var(--font-body)', fontSize: '0.8rem'}}>+92 300 123 4567</a>
    </div>
  </div>
</>
  );
}
