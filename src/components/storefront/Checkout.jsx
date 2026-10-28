export default function Checkout() {
  return (
<>
  <div className="modal" id="checkoutModal" role="dialog" aria-modal="true" aria-labelledby="checkoutTitle">
    <div className="modal-card">
      <div className="modal-head">
        <div>
          <h3 id="checkoutTitle">Checkout</h3>
          <p>Hot food, honest ETA, live tracking.</p>
        </div>
        <button className="icon-btn" data-close-modal="checkoutModal" aria-label="Close">
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
        </button>
      </div>
      <form id="checkoutForm" className="form-grid">
        <div className="seg" id="typeSeg">
          <button type="button" data-type="delivery" className="active">Delivery</button>
          <button type="button" data-type="pickup">Pickup</button>
        </div>
        <div className="row">
          <div className="field"><label htmlFor="cName">Name</label><input id="cName" name="name" required placeholder="Your name" /></div>
          <div className="field"><label htmlFor="cPhone">Phone</label><input id="cPhone" name="phone" required placeholder="03xx xxxxxxx" inputMode="tel" /></div>
        </div>
        <div className="field" id="addressField"><label htmlFor="cAddress">Delivery address</label><input id="cAddress" name="address" placeholder="House, street, area, landmark" /></div>
        <div className="row">
          <div className="field"><label htmlFor="cPayment">Payment</label>
            <select id="cPayment" name="payment"><option defaultValue="cod">Cash on delivery</option><option defaultValue="card">Card at the door</option></select>
          </div>
          <div className="field"><label htmlFor="cNotes">Notes</label><input id="cNotes" name="notes" placeholder="Extra spicy, no onion…" /></div>
        </div>
        <div className="summary" id="checkoutSummary" />
        <button className="btn btn--red btn--block" type="submit" id="placeOrderBtn"><span>Place order</span></button>
        <p style={{fontSize: '.72rem', color: 'var(--muted)', textAlign: 'center'}}>Local demo only — no order is sent and no payment is taken.</p>
      </form>
    </div>
  </div>
</>
  );
}
