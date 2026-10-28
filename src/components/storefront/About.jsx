export default function About() {
  return (
<><section className="section" id="about">
    <div className="wrap">
      <div className="about-grid">
        <div className="about-media" data-reveal="left">
          <div className="main img-reveal">
            <img src="/assets/cat-mexican.jpg" alt="Street tacos at Amigo's" />
          </div>
          <div className="float">
            <strong>2 cuisines</strong>
            <span>one kitchen</span>
          </div>
        </div>
        <div className="about-copy" data-reveal="right">
          <span className="eyebrow">Our story</span>
          <h2 className="h-section">Mexican soul,<br />Thai fire, fast-food energy.</h2>
          <p className="lede">Amigo’s started with a stubborn idea: a neighbourhood grill should not have to choose between slow-cooked birria and wok-tossed pad thai. So we built one kitchen that does both — plus smash burgers, loaded fries and milkshakes — and we refuse to let anything sit under a heat lamp.</p>
          <p className="lede" style={{marginTop: 14}}>Everything is cooked to order, packed hot, and handed to a rider who is tracked from the moment they leave the pass until they knock on your door.</p>
          <div className="hours">
            <div><strong>Mon – Thu</strong><span>11:00 — 01:00</span></div>
            <div><strong>Fri – Sun</strong><span>11:00 — 02:00</span></div>
            <div><strong>Delivery radius</strong><span>Up to 8 km</span></div>
            <div><strong>Kitchen status</strong><span className="open" id="kitchenStatus">Open now</span></div>
          </div>
          <div className="values">
            <div className="value">
              <div className="ico"><svg width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="M2 12h20" /></svg></div>
              <h4>Made to order</h4>
              <p>Nothing pre-cooked. Your grill is fired when the ticket lands.</p>
            </div>
            <div className="value">
              <div className="ico"><svg width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 18H3V9h11v9h-2" /><circle cx={8} cy={18} r={2} /><circle cx={17} cy={18} r={2} /><path d="M14 9h4l4 4v5h-3" /></svg></div>
              <h4>Live rider tracking</h4>
              <p>Real ETA and real rider — follow them on the map.</p>
            </div>
            <div className="value">
              <div className="ico"><svg width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1 0-4h12v4" /><path d="M4 6v12a2 2 0 0 0 2 2h14v-4" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg></div>
              <h4>Honest pricing</h4>
              <p>Deals applied automatically. No surprise fees at checkout.</p>
            </div>
          </div>
          <a href="#menu" className="btn" style={{marginTop: 26}} data-magnetic><span>See what’s cooking</span></a>
        </div>
      </div>
      <div className="stats" data-reveal>
        <div className="stat"><strong><em data-count={124}>0</em></strong><span>Dishes on the menu</span></div>
        <div className="stat"><strong><em data-count={25}>0</em> <em style={{fontSize: '.5em'}}>min</em></strong><span>Average delivery</span></div>
        <div className="stat"><strong><em data-count={18}>0</em>k</strong><span>Orders delivered</span></div>
        <div className="stat"><strong>4.9<em style={{fontSize: '.5em'}}>/5</em></strong><span>Customer rating</span></div>
      </div>
    </div>
  </section></>
  );
}
