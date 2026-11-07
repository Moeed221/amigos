# Amigos — animated restaurant website

Next.js static restaurant demo using the supplied Bucks reference for its dark cream palette, display typography, outline headings, hero transitions, introductory animation, pinned cards, ingredient parallax, circular reasons carousel and moving category strip. Amigos remains a fast-food restaurant.

## Run

Node 20.9+. Run `npm ci`, then `npm run dev`. `npm run build` exports to `out/`; `npm start` serves it on port 3000. No SQL, Docker, env file, API or payment service is required.

## Restaurant flow

- Original 124 dishes across 8 categories, with original prices and offers in PKR.
- `/shop`: searchable menu, category filters, deals and dish customisation.
- `/product?id=…` and `/shop/[slug]`: quantity, instructions, optional sides and drinks.
- Homepage meal builder adds a main, side and drink as individually editable cart lines.
- `/cart`: separate cart page, quantities, remove/undo and food recommendations.
- `/checkout`, `/confirmation`, `/track`: delivery/pickup, guest checkout and simulated kitchen tracking.
- Header navigation, address selection, nachos cart count, menu overlay and light/dark preference.

Orders and guest details remain browser-local. No real order or payment is submitted. Contact/newsletter forms disclose their preview status. The obsolete sauce catalog and reference customer videos are removed from the interface.

## Source

Restaurant data: `src/data/menu.seed.json`, `categories.json`, `offers.seed.json`. Presentation: `src/components/bucks/`, `public/css/restaurant.css` over the retained `bucks.css`. Ordering: `ShopProvider.jsx`, `ShopPages.jsx`, `TrackingPage.jsx` and `src/lib/`.

The retained `public/bucks/` directory includes visual reference fonts, ingredient illustrations and face-animation data. Restaurant product photography and the Amigos logo come from the existing `public/assets/` collection. Unused historical reference artwork is not presented as Amigos products or endorsements.

## Verification

Production export: 158 static routes. Data checks cover all menu image paths, original prices, offers, removal of sauce products, delivery, pickup and tracking. Two signature burgers, fries and a regular cola total Rs 2,744 after existing offers. Browser checks cover the hero, pinned cards, responsive menu widths, meal builder, cart quantities and remove/undo.

Managed preview serves the built export; rebuild after source changes. The original restaurant baseline remains on `backup/before-bucks-redesign-20261103`.

## Amigos Control

Open `/admin/` for the responsive superadmin demo. The workspace uses the storefront’s espresso, cream and gold theme, with a separate light/dark preference.

- Overview, order queue, full-page order details and a kitchen board. Delivery and pickup have separate completion paths; cancellations require a reason. Payment recording does not process money.
- Searchable menu with availability switches, full-page dish editing, duplication and drafts. Changes feed the browser-local storefront menu.
- Automatic deals with category/dish scope and start/end times; display codes are labels, not checkout coupons.
- Customer order history and support notes, completed-sales reports and CSV exports.
- Homepage announcement and featured dishes, saved drafts, restaurant settings, ordering pause, delivery/pickup availability and preparation targets.
- Team profile drafts, five role previews and a recent activity log. No invitation email is sent.

This is a static demo, **not an authenticated administration system**. Role previews only simulate UI permissions. Sample orders are fictional and labelled; real checkout demos from the same browser are listed separately. Data lives in localStorage and does not sync between devices or visitors. A production release needs server-side authentication, authorization, durable storage and payment/order integrations.

The shared restaurant collections use `amigos_static_demo_v1_*`. Workspace samples, team records and logs use `amigos_control_v1`; storefront settings use `amigos_control_site_v1`. Clearing these browser keys resets the corresponding demo data. Existing menu seeds are preserved in Git.

Run `node scripts/check-control.mjs` for fulfilment transitions, role capabilities, reporting totals, date boundaries, form validation, CSV escaping and tracking checks, followed by `npm run build`.
