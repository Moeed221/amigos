export default function OfferModal() {
  return (
<>
  <div className="modal" id="offerModal">
    <div className="modal-card">
      <div className="modal-head">
        <div><h3 id="offerModalTitle">Launch an offer</h3><p>Applied automatically on the website and at checkout.</p></div>
        <button className="icon-btn" data-close="offerModal" aria-label="Close">✕</button>
      </div>
      <form className="form-grid" id="offerForm">
        <input type="hidden" name="id" />
        <div className="field"><label>Title</label><input name="title" required maxLength={140} placeholder="e.g. Taco Tuesday" /></div>
        <div className="field"><label>Subtitle</label><input name="subtitle" maxLength={220} placeholder="Short line shown on the deal card" /></div>
        <div className="row">
          <div className="field"><label>Discount %</label><input name="percent" type="number" min={1} max={100} required placeholder={20} /></div>
          <div className="field"><label>Code (optional)</label><input name="code" maxLength={20} placeholder="TACO20" /></div>
        </div>
        <div className="row">
          <div className="field"><label>Applies to</label>
            <select name="scope" id="offerScope"><option defaultValue="all">Whole menu</option><option defaultValue="category">One category</option></select>
          </div>
          <div className="field"><label>Category</label><select name="category" id="offerCategory" /></div>
        </div>
        <div className="row">
          <div className="field"><label>Card style</label><select name="accent"><option defaultValue="red">Fuego red</option><option defaultValue="gold">Gold</option><option defaultValue="green">Verde</option></select></div>
          <div className="field"><label>Ends on (optional)</label><input name="endsAt" type="date" /></div>
        </div>
        <label className="switch"><input type="checkbox" name="active" defaultChecked /><span className="track" /> Launch immediately</label>
        <div className="form-foot">
          <button type="button" className="btn btn--ghost" data-close="offerModal">Cancel</button>
          <button type="submit" className="btn btn--red">Save offer</button>
        </div>
      </form>
    </div>
  </div>
  <div id="toasts" />
</>
  );
}
