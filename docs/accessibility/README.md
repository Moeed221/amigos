# Amigos accessibility and content review — 12 November 2026

Status: accessibility improvements verified on sampled pages; **not WCAG 2.2 AA certified and not a full conformance claim**.

## Authorized scope

The owner chose a static MVP for this release. All content, menu variants, offers, orders and settings persist in this browser/device. There is no server authentication, password reset email, shared database or real payment. The existing demo role selector is not a security boundary. The authentication section of the admin PDF is explicitly deferred until backend work is authorized.

## Implemented PDF requests

- Preserve the corrected transparent logo with opaque white Mexican Grill lettering; remove the light-theme frame; remove four food images from the intro.
- Configurable Facebook, Instagram and YouTube links with SVG icons. No existing real profile URLs were found; empty fields hide links instead of inventing destinations.
- Independent visibility controls for homepage sections, announcement bars and footer, preserving hidden content. Logo upload/URL, section heading/copy/image, featured dishes and category carousel content are editable in Website content.
- Four independent beige craving-card backgrounds, with automatic black/white text selection for readability.
- Optional per-dish required Chicken/Beef variants with separate prices. Product customisation and meal builder retain selections through cart, checkout and stored order details.
- Discount announcement uses active, scheduled offers. The existing best eligible offer is applied once to food. Cart/checkout show original subtotal, savings, delivery and final total separately. Delivery remains unchanged.
- Category carousel supports native swipe/scroll, previous/next buttons, autoplay, pause, and reduced-motion preferences. It pauses during focus/hover interactions.
- Admin shell moved into the shared route layout; section changes no longer remount it. Loading fallback no longer renders a logo. Intended sidebar branding remains.

## Verification

- Production Next.js static build passes.
- `node scripts/check-control.mjs` passes fulfilment, role capabilities, reporting, date ranges, offer schedules, sold-out items, validation, CSV escaping and tracking checks.
- Added tests cover required meat selection, distinct variant prices, applying discounts once, valid image/social inputs, contrast ink selection and real order-adapter recalculation using a test store. Two Chicken + one Beef: subtotal 4050, discount 810, final total 3240.
- Browser flow: Chicken selection -> cart -> guest checkout -> demo confirmation, total 1040. Cart and checkout displayed Chicken, subtotal 1300, savings 260 and unchanged free delivery.
- Browser flow: edit/hide cravings section, publish, reload, observe hidden storefront; restore it and publish. Hidden content is retained. No real social/profile destinations were created during testing.
- Admin search dialog: labelled dialog, Escape closes, focus returns to opener; keyboard focus outline observed. Admin route navigation preserves the shell.
- axe-core scan tags: wcag2a, wcag2aa, wcag21aa, wcag22aa. Attached JSON contains actual results from 11 representative routes at 320px dark and 1440px light. Zero reported automated violations after fixes in these samples. The earlier mobile sample still records ARIA rules as incomplete; later desktop scan verifies corrected group roles.
- Reported contrast failures fixed: full-menu link, light-theme meal-builder labels/numbers, order filter counts. Sales-chart bars now expose valid image roles; search input and dialogs are labelled.
- No document horizontal overflow in these sampled viewport states. Mobile header/discount-bar spacing was visually checked at 390px and corrected for the in-flow sticky header.

## Remaining manual acceptance work

Automated scans cannot establish full WCAG conformance. Contrast on layered photos/outlined or animated text remains flagged for manual evaluation. Complete screen-reader testing (NVDA/VoiceOver), 200–400% zoom/text spacing, every dialog/error/hover state, all admin editor/detail routes, touch assistive technologies and all image alternatives still need an exhaustive review. Audits cover sampled screens, not every possible stored-content combination. New admin content or images can introduce new accessibility issues.

Relevant standard: https://www.w3.org/TR/WCAG22/ and conformance guidance: https://www.w3.org/WAI/WCAG22/Understanding/conformance .
