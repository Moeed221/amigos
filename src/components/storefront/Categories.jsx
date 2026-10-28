export default function Categories() {
  return (
<><section className="section section--tight" id="categories">
    <div className="wrap">
      <div className="rail-head">
        <div>
          <span className="eyebrow" data-reveal>What are you craving?</span>
          <h2 className="h-section" data-reveal style={{'--d': 1}}>Eight kitchens.<br />One menu.</h2>
        </div>
        <div className="rail-nav" data-reveal>
          <button className="rail-btn" id="railPrev" aria-label="Scroll categories left">
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></svg>
          </button>
          <button className="rail-btn" id="railNext" aria-label="Scroll categories right">
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
          </button>
        </div>
      </div>
      <div className="rail" id="catRail" tabIndex={0} aria-label="Menu categories">
        {/* category cards injected here */}
      </div>
    </div>
  </section></>
  );
}
