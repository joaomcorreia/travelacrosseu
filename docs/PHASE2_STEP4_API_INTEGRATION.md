# PHASE 2 – STEP 4 — Connect Homepage to the Django API

> Shell: All commands in this step must be run in **Windows Command Prompt (CMD)**, not PowerShell.

**Project:** TravelAcross EU  
**Status:** ✅ Completed

---

## Purpose

- Fetch published TravelPage data from the Django API for each supported locale and surface it in the homepage UI.
- Keep the React tree resilient by logging network errors and rendering curated fallback cards while the API has no content.
- Provide a repeatable CMD script so future verifications can hit `/` plus every locale route in one step.

---

## Files Created / Updated

- `frontend/lib/api.ts` — new typed helper that hits `http://127.0.0.1:8000/api/pages/?language=<locale>` (overridable via `NEXT_PUBLIC_API_BASE_URL`) with `next.revalidate = 60`, normalizes array/paginated responses, and throws for non-2xx status codes.
- `frontend/app/HomePage.tsx` — now accepts a `destinations` prop, introduces three curated fallback cards, limits the rendered grid to six entries, and shows a yellow banner whenever we are still on demo data.
- `frontend/app/page.tsx` — server component that fetches English destinations, logs failures with context, and hands the result to `HomePage`.
- `frontend/app/[locale]/page.tsx` — resolves `params` (which arrive as a `Promise` in Next.js 16), validates the locale, fetches localized destinations, logs failures, and falls back to a 404 for unsupported locales.
- `scripts/phase2_step4_verify_locales.cmd` — helper script that changes into `frontend` and curls `/`, `/en`, `/fr`, `/nl`, `/es`, `/pt`, and `/it` so we can quickly prove the fallback UI and 404 behavior.

---

## Commands Executed

```cmd
taskkill /IM node.exe /F
C:\projects\travelacrosseu\scripts\phase2_step1_dev_window.cmd
curl http://localhost:3000/
curl http://localhost:3000/fr
C:\projects\travelacrosseu\scripts\phase2_step4_verify_locales.cmd
```

---

## Verification Checklist

- [x] `/` renders the Top Destinations grid with fallback cards while the API returns an empty list (200 + `[]`).
- [x] `/en`, `/fr`, `/nl`, `/es`, `/pt` render the same UI, and logs show each fetch hitting the correct `language=` query.
- [x] `/it` still returns a 404 via `notFound()`, confirming unsupported locales remain protected.
- [x] No runtime crashes: failed fetches only print console errors while the hero/sections stay interactive.

---

## Notes

- Set `NEXT_PUBLIC_API_BASE_URL` when pointing the frontend to a remote server; otherwise it targets `http://127.0.0.1:8000`.
- The fallback items keep the layout looking real until CMS content is published, but they are sliced out automatically once the API returns data.
- `scripts/phase2_step4_verify_locales.cmd` makes it trivial to re-run every curl in the exact order required by the phase brief.
