# PHASE 4 · STEP 6 — Booking.com Hotels Widget Slot

## Purpose
Reserve a clean, CJ-friendly iframe slot on `/[locale]/hotels` so the Booking.com widget can drop in later without changing page layout. Until the affiliate embed arrives, we load a static HTML placeholder that explains the upcoming module and keeps the section visually balanced.

## Assets Introduced
- `frontend/public/booking-hotels-widget.html`
  - Static sandbox that mimics the iframe Booking.com will supply.
  - Minimum height of 320px so editors can visualize the footprint.
  - Copy reminds stakeholders that pricing/availability will come from the affiliate network.
- `frontend/components/BookingWidget.tsx`
  - Client component that wraps the iframe, shows a loading badge, and prints the affiliate disclaimer.
  - Source URL stays rooted (`/booking-hotels-widget.html`) so every locale shares the same sandbox.
- `frontend/app/[locale]/hotels/page.tsx`
  - Adds an "Affiliate-ready slot" section that hosts the widget and contextual messaging.
  - Keeps the rest of the hotels page untouched to avoid regressions across locales.

## How To Swap In The CJ Embed Later
1. Replace the placeholder markup inside `frontend/public/booking-hotels-widget.html` with the official Booking.com snippet from CJ.
2. If the partner script requires external JS, include it inside the HTML file so React never needs to touch `document` APIs directly.
3. Keep the iframe height at `320px`+ to avoid CLS. If the partner recommends a taller view, update the Tailwind height class in `BookingWidget.tsx` (`className="h-[320px] w-full"`).

## Verification Checklist
1. **Start the dev server**
   ```cmd
   cd /d C:\projects\travelacrosseu\frontend
   npm run dev
   ```
2. **Hit the hotels page (English locale)**
   ```cmd
   cd /d C:\projects\travelacrosseu
   scripts\curl_frontend_page.cmd /en/hotels
   ```
3. Confirm the response contains:
   - `Plan with Booking.com soon.` heading.
   - `<iframe src="/booking-hotels-widget.html" ...>` block.
   - Disclaimer text mentioning that TravelAcross EU does not handle payments.
4. Repeat for any other locale routes if copy or layout QA is needed.

## Rollout Notes
- The iframe is marked `loading="lazy"` to preserve performance until the partner script is live.
- Because the widget lives in `/public`, Next.js serves it statically in every environment (dev, preview, prod) without extra routing work.
- No backend changes were required; this step only touches the Next.js frontend.
