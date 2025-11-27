# PHASE 4 - STEP 4 - Flights / Hotels / Experiences

> Shell: All commands in this step must be run in **Windows Command Prompt (CMD)**, not PowerShell.

## Purpose
- Keep the Step 4 hybrid layout pattern alive on the flights, hotels, and experiences routes so they feel related to the homepage hero + dark feature cadence.
- Prove the header navigation, locale guardrails, and CTA loops stay functional on every route before wiring in any real API integrations.
- Document the verification workflow so future contributors can rerun the same CMD helper scripts without missing a page.

## Files Updated / Created
- `frontend/app/[locale]/flights/page.tsx`
- `frontend/app/[locale]/hotels/page.tsx`
- `frontend/app/[locale]/experiences/page.tsx`
- `frontend/components/Header.tsx`
- `docs/PHASE4_STEP4_FLIGHTS_HOTELS_EXPERIENCES.md`

## Design Decisions
- **Hero + planning snapshot:** Each route keeps a light gradient hero with CTA back to `/[locale]/destinations`, followed by a planning snapshot card that previews future integrations (fare classes, stay zones, experience playbooks).
- **Dark feature section:** Mid-page blocks switch to a dark palette (slate/teal) to spotlight curated grids (air hubs, accommodation types, experience categories) and keep visual parity with the homepage.
- **Copy-first, widget-ready:** Content leans on descriptive copy, checklists, and badges now, but all blocks are structured so API-powered modules (Skyscanner, Booking, GetYourGuide) can drop in later without redesign.
- **Shared navigation + locale switcher:** The updated `Header` reuses the same nav list and compact language switcher, so every new route inherits locale links, consistent CTAs, and accessibility attributes.

## Commands Run
1. `cmd /c start "" "C:\projects\travelacrosseu\scripts\phase2_step1_dev.cmd"`
2. `cmd /c C:\projects\travelacrosseu\scripts\curl_frontend_page.cmd /en/flights`
3. `cmd /c C:\projects\travelacrosseu\scripts\curl_frontend_page.cmd /en/hotels`
4. `cmd /c C:\projects\travelacrosseu\scripts\curl_frontend_page.cmd /en/experiences`
5. `cmd /c "C:\Windows\System32\taskkill.exe" /IM node.exe /F`

## Verification Checklist
- [x] `/en/flights` renders the hero, planning snapshot, decision grid, and "Popular departure hubs" cards with working nav + locale switcher.
- [x] `/en/hotels` shows the stay zones grid, accommodation types matrix, and affiliate-ready CTA with the same hybrid light/dark styling.
- [x] `/en/experiences` delivers the tour hero, card grid, thematic dark blocks, and footer nav loops without console errors.
- [x] Header links (Home through Contact) and the compact language switcher keep locale URLs accurate on all three routes.
- [x] Dev server stops cleanly after the curl checks via `taskkill` so the port is free for the next contributor.
