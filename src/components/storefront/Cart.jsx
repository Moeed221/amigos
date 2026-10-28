export default function Cart() {
  return (
<>
  <div className="scrim" id="scrim" />
  <aside className="cart-drawer" id="cartDrawer" aria-label="Your cart" aria-hidden="true">
    <div className="cart-head">
      <div>
        <h3>Your bag</h3>
        <p style={{fontSize: '.74rem', color: 'var(--muted)'}} id="cartHint">Deals applied automatically</p>
      </div>
      <button className="icon-btn" id="cartClose" aria-label="Close cart">
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
      </button>
    </div>
    <div className="cart-body" id="cartBody" />
    <div className="cart-foot">
      <div className="cart-row"><span>Subtotal</span><span id="cartSubtotal">Rs 0</span></div>
      <div className="cart-row save" id="cartSaveRow" hidden><span>Deal savings</span><span id="cartSave">− Rs 0</span></div>
      <div className="cart-row total"><span>Total</span><b id="cartTotal">Rs 0</b></div>
      <button className="btn btn--red btn--block" id="checkoutBtn" disabled><span>Checkout</span></button>
      <p style={{fontSize: '.7rem', textAlign: 'center', color: 'var(--muted)'}}>Delivery fee calculated at checkout · Cash or card</p>
    </div>
  </aside>
</>
  );
}
