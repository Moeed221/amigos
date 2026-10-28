export default function Menu() {
  return (
<><section className="section menu-section" id="menu">
    <div className="wrap">
      <div className="section-head">
        <div>
          <span className="eyebrow" data-reveal>The full menu</span>
          <h2 className="h-section" data-reveal style={{'--d': 1}}>124 dishes,<br />zero mercy on flavour.</h2>
        </div>
        <div className="right">
          <p className="lede" data-reveal style={{'--d': 2}}>Burgers, sandwiches, tacos, curries, fried chicken, sides, drinks and desserts. Filter it, search it, add it to the cart — prices update with any live deal automatically.</p>
        </div>
      </div>
      <div className="menu-toolbar" id="menuToolbar">
        <div className="chips" id="menuChips" role="tablist" aria-label="Filter by category" />
        <label className="search">
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx={11} cy={11} r={7} /><path d="m20 20-3.5-3.5" /></svg>
          <input type="search" id="menuSearch" placeholder="Search 124 dishes…" aria-label="Search the menu" />
        </label>
        <span className="menu-count" id="menuCount" />
      </div>
      <div className="menu-grid" id="menuGrid" aria-live="polite" />
      <div style={{display: 'flex', justifyContent: 'center', marginTop: 34}}>
        <button className="btn btn--ghost" id="loadMore"><span>Load more dishes</span></button>
      </div>
    </div>
  </section></>
  );
}
