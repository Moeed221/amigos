# Amigos - Next.js ordering demo

Run `npm install`, then `npm run dev`. Open http://localhost:3000. `npm run build` creates the static export in `out`; `npm start` serves it. `npm run lint` checks the source. Build workers are limited to two for this PC's available memory.

The ordering experience follows the supplied reference layout while retaining Amigos branding, the cream/red/gold palette, local fonts and food photography. It includes a shared header, delivery/pickup controls, a Mexican takeaway cart SVG, accessible sidebar, persistent light/dark theme, visual categories, search, product cards, dismissible notifications and a complete footer. Icons use SVG, not emoji.

Customer routes:
- `/`: menu and deals; Add to cart adds directly without a shopping modal.
- `/cart`: item details, editing, quantity, remove/undo, recommendations, instructions and order summary. Checkout stays visible on mobile.
- `/product?id=1`: separate product and customization page; an optional `line` query identifies an existing cart line to edit.
- `/checkout`: guest details, delivery/pickup, payment preference and demo order submission.
- `/confirmation?code=AMG-XXXX`: order confirmation and tracking link.
- `/track?code=AMG-XXXX`: focused order lookup, progress, ETA and order details.
- `/location`: delivery address or demo pickup; `returnTo=/cart` or `/checkout` returns to that page. Cancel discards unsaved location form changes.
- `/login`: clearly labelled guest profile preview; real authentication is not connected.
- `/stores`, `/about`, `/contact`, `/terms`, `/privacy`: relevant Amigos information pages. No KFC-specific programs, merchandise or invented social/app-store links.

`src/app/(shop)` owns customer routes. `ShopShell.jsx`, `ShopProvider.jsx`, `ShopPages.jsx`, `TrackingPage.jsx` and `Icons.jsx` implement the shared UI, state and pages. `public/css/shop.css` extends the original theme. Seed data is in `src/data`; `src/lib/demo-data.js` supplies browser-only operations. Cart, preferences, theme and demo orders use localStorage; guest details use sessionStorage. Existing bag/preferences keys remain compatible. No API, SQL, Docker, credentials or environment setup is required. Orders, payment and tracking are demonstrations only. Admin at `/admin` is a local demo without authentication.

Validation: full source ESLint and production static build; menu-to-cart-to-checkout-to-tracking browser flows at 1440, 390 and 320 pixels; tablet cart at 768 pixels; both themes, saved theme/cart on reload, editing, remove/undo, empty/search states, direct routes, pickup, location cancellation, keyboard focus trapping and Escape. Inspected desktop/mobile screenshots. Automated axe A/AA scans on exercised pages and hover state found no violations. Browser checks found no page errors or horizontal overflow. Automated checks are not formal accessibility certification.

Backups next to this project: `amigos-before-nextjs-20261028`, `amigos-before-ordering-redesign`, `amigos-before-ux-fixes`, and `amigos-before-reference-flow`.
