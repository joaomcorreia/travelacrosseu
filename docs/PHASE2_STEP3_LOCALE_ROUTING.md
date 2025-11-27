# PHASE 2 – STEP 3 — Locale-Based Routing

> Shell: All commands in this step must be run in **Windows Command Prompt (CMD)**, not PowerShell.

**Project:** TravelAcross EU  
**Status:** ✅ Completed

---

## Purpose

- Introduce locale-aware routing in the App Router so `/en`, `/fr`, `/nl`, `/es`, and `/pt` map to the TravelAcross homepage.
- Centralize locale metadata in a helper module for future use in middleware, metadata, and content negotiation.
- Reuse the existing hero/sections UI by extracting it into a shared `HomePage` component.

---

## Files Created / Updated

- `frontend/lib/locales.ts` — declares `SUPPORTED_LOCALES`, `Locale`, and `isSupportedLocale` helper.
- `frontend/app/HomePage.tsx` — new component that renders the homepage layout and accepts a `locale` prop.
- `frontend/app/page.tsx` — now simply imports `HomePage` and renders it with `locale="en"` for the default route.
- `frontend/app/[locale]/page.tsx` — dynamic route that validates `params.locale` and renders `HomePage` or `notFound()` for unsupported locales.

---

## Commands Executed

```cmd
C:\projects\travelacrosseu\scripts\phase2_step1_dev_window.cmd
curl http://localhost:3000/
curl http://localhost:3000/en
curl -I http://localhost:3000/fr
curl -I http://localhost:3000/nl
curl -I http://localhost:3000/es
curl -I http://localhost:3000/pt
curl -I http://localhost:3000/it
taskkill /IM node.exe /F
```

---

## Verification Checklist

- [x] `/` shows the TravelAcross EU homepage layout without runtime errors.
- [x] `/en`, `/fr`, `/nl`, `/es`, `/pt` all load the shared homepage UI via the `[locale]` route.
- [x] Unsupported locales such as `/it` now respond with a 404 (via `notFound()`).
- [x] Dev server (`npm run dev`) and verification curls ran without unhandled TypeScript or runtime exceptions.

---

## Notes

- Before this step, locale-prefixed URLs (e.g., `/en`) returned the default Next.js 404 because only `/` was defined; `[locale]` routing now handles all supported locales.
- `LocalePage` awaits `params` because Next.js 16 passes them as a `Promise`, preventing the earlier `params.locale` access error.
