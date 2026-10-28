export default function Hero() {
  return (
<><section className="hero" id="home">
    <div className="wrap">
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="hero-badge">
            <span className="dot">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4L19 6" /></svg>
            </span>
            Mexican × Thai × Fast food · 124 dishes
          </div>
          <h1>
            <span className="mask-line"><span>Big flavour.</span></span>
            <span className="mask-line"><span>No <em>shortcuts.</em></span></span>
            <span className="mask-line"><span>Served hot.</span></span>
          </h1>
          <p className="lede">Char-grilled burgers, birria tacos and wok-fired Thai — one kitchen, one delivery, tracked live from our grill to your door.</p>
          <div className="hero-actions">
            <a href="#menu" className="btn btn--red" data-magnetic>
              <span>Explore the menu</span>
              <svg className="arrow" width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
            </a>
            <a href="#track" className="btn btn--ghost" data-magnetic>
              <span>Track my rider</span>
            </a>
          </div>
          <div className="hero-meta">
            <div><strong>11:00 – 02:00</strong><span>Open daily</span></div>
            <div><strong>25 min</strong><span>Avg. delivery</span></div>
            <div><strong>4.9 / 5</strong><span>1.2k reviews</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-sticker" aria-hidden="true">
            <svg className="ring" viewBox="0 0 100 100">
              <defs><path id="circlePath" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" /></defs>
              <text><textPath href="#circlePath">Fast · Fresh · Fuego · Fast · Fresh · Fuego ·</textPath></text>
            </svg>
            <div className="core">AMIGO'S</div>
          </div>
          <div className="hero-photo">
            <img src="/assets/hero.jpg" alt="Amigo's signature stacked burger with street tacos" />
            <div className="tag">
              <div>
                <div className="name">The Big Amigo</div>
                <div style={{fontSize: '.76rem', opacity: '.75'}}>Triple patty · bacon jam · crispy jalapeños</div>
              </div>
              <div className="price" id="heroPrice">Rs 1,690</div>
            </div>
          </div>
          <div className="hero-chip hero-chip--eta">
            <span className="ico">
              <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 18H3V9h11v9h-2" /><circle cx={8} cy={18} r={2} /><circle cx={17} cy={18} r={2} /><path d="M14 9h4l4 4v5h-3" /></svg>
            </span>
            <div><strong>25 min average</strong><small>Live rider tracking on every order</small></div>
          </div>
          <div className="hero-chip hero-chip--rate">
            <span className="ico">
              <svg width={17} height={17} viewBox="0 0 24 24" fill="currentColor"><path d="m12 17.3-6.2 3.7 1.6-7L2 9.2l7.1-.6L12 2l2.9 6.6 7.1.6-5.4 4.8 1.6 7z" /></svg>
            </span>
            <div><strong>4.9 rated</strong><small>1,240 happy amig@s</small></div>
          </div>
        </div>
      </div>
    </div>
    {/* marquee ribbon */}
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track" id="marqueeTrack" />
    </div>
  </section></>
  );
}
