export default function Footer() {
  return (
<>
  {/* ============================== FOOTER ============================ */}
  <footer className="footer">
    <div className="wrap">
      <div className="footer-top">
        <div className="footer-brand">
          <img src="/assets/logo.png" alt="Amigo's Mexican Grill" />
          <p>Mexican grill, Thai kitchen and fast-food counter under one roof. Cooked to order, delivered hot.</p>
          <div className="socials">
            <a href="#" aria-label="Instagram"><svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x={2} y={2} width={20} height={20} rx={6} /><circle cx={12} cy={12} r="4.2" /><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" /></svg></a>
            <a href="#" aria-label="Facebook"><svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1Z" /></svg></a>
            <a href="#" aria-label="WhatsApp"><svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.5-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.1-.2 0-.4.1-.5l.7-.9c.1-.2.1-.4 0-.6l-.7-1.6c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.4-.3.3-.8.9-.8 2 0 1.2.8 2.4 1 2.5.1.2 1.6 2.6 4 3.5 1.7.7 2.3.6 2.7.5.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1Z" /></svg></a>
            <a href="#" aria-label="TikTok"><svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor"><path d="M16 2h-3v13.2a2.8 2.8 0 1 1-2.2-2.7V9.3A5.9 5.9 0 1 0 16 15V8.6c1 .7 2.2 1.1 3.5 1.1V6.6A3.6 3.6 0 0 1 16 3V2Z" /></svg></a>
          </div>
        </div>
        <div>
          <h5>Explore</h5>
          <ul>
            <li><a href="#menu">Full menu</a></li>
            <li><a href="#offers">Today’s deals</a></li>
            <li><a href="#track">Track an order</a></li>
            <li><a href="#reviews">Reviews</a></li>
            <li><a href="/admin">Admin panel</a></li>
          </ul>
        </div>
        <div>
          <h5>Kitchen</h5>
          <ul>
            <li><a href="#about">Our story</a></li>
            <li><a href="#menu">Burgers</a></li>
            <li><a href="#menu">Mexican</a></li>
            <li><a href="#menu">Thai kitchen</a></li>
            <li><a href="#menu">Desserts</a></li>
          </ul>
        </div>
        <div>
          <h5>Stay in the loop</h5>
          <ul style={{gap: 14}}>
            <li style={{fontSize: '.86rem', color: 'rgba(253,247,238,.7)'}}>New dishes and deal drops. No spam, only food.</li>
            <li><a href="tel:+923001234567">+92 300 123 4567</a></li>
            <li><a href="mailto:hello@amigosgrill.pk">hello@amigosgrill.pk</a></li>
          </ul>
          <form className="newsletter" id="newsletterForm">
            <input type="email" placeholder="your@email.com" aria-label="Email address" required />
            <button type="submit" aria-label="Subscribe">
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
            </button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© <span id="year">2026</span> Amigo’s Mexican Grill. All rights reserved.</span>
        <span>Built with <span style={{color: 'var(--red)'}}>fuego</span> · <a href="/admin">Staff login</a></span>
      </div>
    </div>
  </footer>
</>
  );
}
