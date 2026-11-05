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

Production export: 144 static routes. Data checks cover all menu image paths, original prices, offers, removal of sauce products, delivery, pickup and tracking. Two signature burgers, fries and a regular cola total Rs 2,744 after existing offers. Browser checks cover the hero, pinned cards, responsive menu widths, meal builder, cart quantities and remove/undo.

Managed preview serves the built export; rebuild after source changes. The original restaurant baseline remains on `backup/before-bucks-redesign-20261103`.
