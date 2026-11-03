# Amigos — Next.js reference redesign

The current design recreates the supplied https://buckssauce.com/ reference with the existing Amigos logo. It uses the reference's dark brown/cream palette, condensed display font, outline headings, bottle and ingredient art, animated fruit faces, expanding intro, product slider, compact scroll header, pinned ingredient cards, product hover actions, custom 3-pack builder and moving video cards.

## Run

Node 20.9 or newer. Run `npm ci`, then `npm run dev`, and open http://localhost:3000. `npm run build` produces the static export in `out/`; `npm start` serves it locally. No SQL, Docker, environment file, API server, payment integration or credentials are required.

## Routes and behavior

- `/`: animated reference-style landing page and three-pack builder.
- `/shop`: four reference sauces, priced at $12 each. Any three make a $32 pack.
- `/shop/[slug]`: separate product pages, quantity controls and product details.
- `/cart`: quantity changes, editing, remove/undo, recommendations and order totals.
- `/checkout`, `/confirmation`, `/track`: guest demo order and browser-local simulated tracking.
- `/about`, `/wholesale`, `/contact`, `/faq`, `/find-us`, `/stores`: matching informational routes. Contact/wholesale/newsletter forms clearly disclose that they do not send messages.
- Existing `/product`, `/location`, `/login`, `/terms`, `/privacy` routes remain available. `/admin` remains the original local restaurant-data demo and is not a live backend for the new sauce catalog.

All orders and customer input stay in the current browser. The reference catalog uses a separate cart storage key, leaving the former restaurant cart intact. Existing restaurant seed data is retained. The previous design is also preserved on GitHub branch `backup/before-bucks-redesign-20261103`.

## Source map

New interface: `src/components/bucks/`. Catalog: `src/data/sauce-products.js`. Design tokens and responsive styling: `public/css/bucks.css`. Shared cart and demo ordering: `ShopProvider.jsx`, `ShopPages.jsx`, `TrackingPage.jsx`, and `src/lib/`.

The files in `public/bucks/` are visual reference assets from the supplied Bucks Sauce site, including its fonts, photographs, illustrations and original face animation data. Product packaging still bears Bucks branding. Video clips in `src/data/reference-clips.json` are reference media served by its CDN and retain creator handles. They are not Amigos customer endorsements. Product/ingredient claims are sample design content, not verified Amigos product specifications. Confirm replacement media, product facts and usage rights before a public commercial launch. The private preview is intended for visual review.

## Validation

Production static export compiles all 24 routes. Browser checks cover desktop, 390px mobile and 768px tablet layouts, slider changes, product additions, three-pack limits and total, cart persistence on navigation/reload, quantity changes, removal/undo, guest checkout, confirmation and tracking. A $12 bottle plus a $32 pack totals $44; increasing the bottle quantity to two totals $56 through checkout and tracking. Native dialogs support keyboard focus and Escape; reduced-motion styles stop decorative animation, and moving video cards provide a pause control. Original laptop files could not be updated while Desktop Commander was offline.

The managed preview wrapper serves the already-built `out/` when passed `--strictPort`; ordinary `npm run dev` still starts Next.js. Rebuild after source changes when using the managed static preview.
