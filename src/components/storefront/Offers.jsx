export default function Offers() {
  return (
<><section className="section dark" id="offers">
    <div className="wrap">
      <div className="section-head">
        <div>
          <span className="eyebrow" data-reveal>Today’s deals</span>
          <h2 className="h-section" data-reveal style={{'--d': 1}}>Offers that<br />actually fill you up.</h2>
        </div>
        <div className="right">
          <p className="lede" data-reveal style={{'--d': 2}}>Live discounts straight from the Amigos kitchen — applied automatically at checkout, no code-hunting required. Every deal below is managed by our team from the admin panel.</p>
          <a href="#menu" className="btn btn--gold" data-reveal style={{'--d': 3}}><span>Order a deal</span></a>
        </div>
      </div>
      <div className="offers-grid" id="offersGrid" data-reveal>
        {/* offer cards injected */}
      </div>
    </div>
  </section></>
  );
}
