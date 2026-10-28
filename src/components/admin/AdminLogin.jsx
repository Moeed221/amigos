export default function AdminLogin() {
  return (
<>
  <div className="login" id="login">
    <form className="login-card" id="loginForm">
      <img src="/assets/logo.png" alt="Amigo's Mexican Grill" />
      <h1>Staff sign in</h1>
      <p>Manage orders, the menu, discounts and reviews.</p>
      <div className="field">
        <label htmlFor="password">Demo access</label>
        <input type="text" id="password" name="demoName" placeholder="Optional demo name" autoComplete="off" />
      </div>
      <button className="btn btn--red" type="submit" id="loginBtn">Sign in</button>
      <div className="login-err" id="loginErr" />
      <div className="login-hint">Local demo — no password required. Changes stay in this browser.</div>
      <a href="/" style={{textAlign: 'center', fontSize: '.78rem', fontWeight: 700, color: 'var(--muted)'}}>← Back to the website</a>
    </form>
  </div>
</>
  );
}
