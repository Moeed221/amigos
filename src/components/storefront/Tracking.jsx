export default function Tracking() {
  return (
<><section className="section track-section" id="track">
    <div className="wrap">
      <div className="section-head">
        <div>
          <span className="eyebrow" data-reveal>Live from the road</span>
          <h2 className="h-section" data-reveal style={{'--d': 1}}>Your rider,<br />on the map.</h2>
        </div>
        <div className="right">
          <p className="lede" data-reveal style={{'--d': 2}}>Every order gets a tracking code and a real rider. Watch the kitchen hand-off, follow the route and get an honest ETA — not a “15 minutes” that means an hour.</p>
        </div>
      </div>
      <div className="track-grid">
        <div className="track-panel" data-reveal="left">
          <div style={{display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap'}}>
            <div className="live-pill"><span className="pulse" /><span id="liveState">Awaiting order</span></div>
            <span className="live-pill" id="demoChip" hidden style={{color: 'var(--gold)'}} />
          </div>
          <div className="track-eta">
            <div className="big" id="etaNumber"><span className="eta-idle">--</span><small>min</small></div>
            <div className="meta">
              <strong id="etaTitle">Enter your order code</strong>
              <span id="etaSub">Live ETA updates every few seconds.</span>
            </div>
          </div>
          <div className="track-search">
            <input id="trackInput" placeholder="e.g. AMG-8K2Q" aria-label="Order code" autoComplete="off" />
            <button className="btn btn--gold btn--sm" id="trackBtn"><span>Track</span></button>
          </div>
          <div className="timeline timeline--idle" id="timeline">
            {/* populated by app.js; this idle set is replaced on tracking */}
            <div className="tl-step"><div className="tl-dot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4L19 6" /></svg></div><div className="tl-copy"><strong>Order received</strong><span>We have your order — the kitchen fires up the grill.</span></div></div>
            <div className="tl-step"><div className="tl-dot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4L19 6" /></svg></div><div className="tl-copy"><strong>In the kitchen</strong><span>Your food is being cooked fresh right now.</span></div></div>
            <div className="tl-step"><div className="tl-dot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4L19 6" /></svg></div><div className="tl-copy"><strong>Rider on the way</strong><span>Picked up and heading to your address.</span></div></div>
            <div className="tl-step"><div className="tl-dot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4L19 6" /></svg></div><div className="tl-copy"><strong>Rider arriving</strong><span>Around the corner — please be ready.</span></div></div>
            <div className="tl-step"><div className="tl-dot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4L19 6" /></svg></div><div className="tl-copy"><strong>Delivered</strong><span>Enjoy your meal, amigo!</span></div></div>
          </div>
          <div className="rider-card" id="riderCard">
            <div className="rider-avatar" id="riderInitials">AM</div>
            <div className="info">
              <strong id="riderName">No rider assigned yet</strong>
              <span id="riderMeta">Place an order to meet your rider</span>
            </div>
            <a className="call" id="riderCall" href="#" aria-label="Call rider">
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" /></svg>
            </a>
          </div>
        </div>
        <div className="map-shell" data-reveal="right">
          <svg viewBox="0 0 600 460" preserveAspectRatio="xMidYMid slice" aria-label="Stylised map of the delivery route">
            <defs>
              <pattern id="grid" width={40} height={40} patternUnits="userSpaceOnUse">
                <path d="M40 0H0v40" fill="none" stroke="rgba(255,253,249,0.05)" strokeWidth={1} />
              </pattern>
              <linearGradient id="routeGrad" x1={0} y1={0} x2={1} y2={1}>
                <stop offset="0%" stopColor="#ffc531" />
                <stop offset="100%" stopColor="#e11d2e" />
              </linearGradient>
            </defs>
            <rect width={600} height={460} fill="#1b1410" />
            <rect width={600} height={460} fill="url(#grid)" />
            {/* city blocks */}
            <g fill="#241a15" stroke="rgba(255,253,249,0.05)">
              <rect x={30} y={40} width={120} height={90} rx={12} />
              <rect x={190} y={30} width={150} height={70} rx={12} />
              <rect x={380} y={50} width={90} height={110} rx={12} />
              <rect x={500} y={30} width={80} height={80} rx={12} />
              <rect x={40} y={170} width={90} height={100} rx={12} />
              <rect x={160} y={150} width={130} height={80} rx={12} />
              <rect x={330} y={200} width={120} height={90} rx={12} />
              <rect x={490} y={180} width={90} height={120} rx={12} />
              <rect x={60} y={320} width={140} height={100} rx={12} />
              <rect x={240} y={330} width={110} height={90} rx={12} />
              <rect x={400} y={340} width={150} height={80} rx={12} />
            </g>
            {/* park */}
            <g opacity="0.5">
              <rect x={330} y={200} width={120} height={90} rx={12} fill="#1c7a52" opacity="0.14" />
              <text x={390} y={250} textAnchor="middle" fill="rgba(253,247,238,0.28)" fontSize={9} letterSpacing={2} fontFamily="Manrope, sans-serif" fontWeight={700}>PARK</text>
            </g>
            {/* route */}
            <path id="routeBase" className="route-base" d="M 88 352 C 150 352 160 262 232 250 S 330 292 392 240 S 470 150 520 128" />
            <path id="routeLine" className="route-line" d="M 88 352 C 150 352 160 262 232 250 S 330 292 392 240 S 470 150 520 128" />
            <path id="routeProgress" className="route-progress" d="M 88 352 C 150 352 160 262 232 250 S 330 292 392 240 S 470 150 520 128" />
            {/* kitchen pin */}
            <g transform="translate(88,352)">
              <circle r={16} fill="rgba(225,29,46,0.16)" />
              <circle r={7} fill="#e11d2e" />
            </g>
            {/* destination pin */}
            <g transform="translate(520,128)">
              <circle r={18} fill="rgba(28,122,82,0.16)" />
              <circle r={8} fill="#1c7a52" />
            </g>
            {/* rider */}
            <g id="riderMarker" className="rider-marker" transform="translate(88,352)">
              <circle className="halo" r={12} fill="rgba(255,197,49,0.28)" />
              <circle r={13} fill="#ffc531" stroke="#150f0c" strokeWidth="2.5" />
              <g transform="translate(-7,-7)">
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#150f0c" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="5.5" cy="17.5" r="3.5" /><circle cx="18.5" cy="17.5" r="3.5" /><path d="M15 6h3l2 6" /><path d="M5 17.5 8 8h7l3 4" />
                </svg>
              </g>
            </g>
          </svg>
          <div className="map-pill map-pill--kitchen"><span className="map-dot" /> Amigos kitchen</div>
          <div className="map-pill map-pill--home"><span className="map-dot map-dot--green" /> Your address</div>
          <div className="map-hud" id="mapHud">
            <div>Route status</div>
            <b id="hudStatus">Idle</b>
            <div><span id="hudDistance">0.0 km</span> · <span id="hudPct">0%</span></div>
          </div>
          <div className="map-empty" id="mapEmpty">
            <div>
              <strong>No live order yet</strong>
              <p>Place an order or paste a tracking code to watch the route fill in.</p>
              <button className="sample" id="demoTrack">Try a demo delivery</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section></>
  );
}
