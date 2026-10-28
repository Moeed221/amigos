export default function OrderSuccess() {
  return (
<>
  <div className="modal" id="successModal" role="dialog" aria-modal="true" aria-labelledby="successTitle">
    <div className="modal-card">
      <div className="success">
        <div className="tick">
          <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4L19 6" /></svg>
        </div>
        <h3 id="successTitle">Order confirmed</h3>
        <p>Your demo order is ready. Save the code below to preview rider tracking.</p>
        <div className="code-box" id="successCode">AMG-0000</div>
        <p id="successEta" style={{margin: 0}}>Estimated delivery in 25 minutes</p>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 6}}>
          <button className="btn btn--red" id="goTrack"><span>Track my rider</span></button>
          <button className="btn btn--ghost" data-close-modal="successModal"><span>Keep browsing</span></button>
        </div>
      </div>
    </div>
  </div>
  <div id="toasts" aria-live="polite" aria-atomic="true" />
</>
  );
}
