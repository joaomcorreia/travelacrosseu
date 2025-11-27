# PHASE 2 - STEP 6 - Dynamic Destination Routes

> Shell: All commands in this step must be run in **Windows Command Prompt (CMD)**, not PowerShell.

**Project:** TravelAcross EU  
**Status:** Completed

---

## Purpose

- Expose a locale-aware Destinations index at `/[locale]/destinations` that pulls up to 12 published TravelPage cards per language from the Django API.
- Add slug-based detail pages at `/[locale]/destinations/[slug]` so every generated TravelPage can be read with city/country metadata, long-form body content, and basic travel tips.
- Provide a translation-aware language switcher and reusable CMD scripts/curls so QA can quickly validate each locale and sample slug without relying on manual navigation in the browser.

---

## Files Created / Updated

- `frontend/app/[locale]/destinations/page.tsx` - locale guard plus server-side fetch of `fetchTravelPages(locale)` with empty-state messaging and cards that link to each slug.
- `frontend/app/[locale]/destinations/[slug]/page.tsx` - resolves `params` promises, fetches the requested page plus all translations for its `group_id`, builds the LanguageSwitcher model, and renders hero/summary/body/aside content with fallbacks and trip tips.
- `frontend/app/destinations/page.tsx` - root-level redirector that keeps `/destinations` valid by pointing it to `/en/destinations`.
- `frontend/lib/api.ts` - expanded `TravelPage` typing and added `fetchTravelPageBySlug` + `fetchTravelPagesByGroupId` helpers with `next.revalidate = 60` to hydrate the new routes.
- `frontend/components/LanguageSwitcher.tsx` - new shared component (compact + panel variants) that powers the destination detail locale selector and tracks availability per language.
- `scripts/phase2_step5_verify_destinations.cmd` - curls `/`, `/en`, and every `/[locale]/destinations` index so smoke tests can be re-run with a single command.

---

## Commands Executed

```cmd
cd /d C:\projects\travelacrosseu
taskkill /IM node.exe /F
cd /d C:\projects\travelacrosseu
scripts\phase2_step1_dev_window.cmd
cd /d C:\projects\travelacrosseu
scripts\phase2_step5_verify_destinations.cmd
cd /d C:\projects\travelacrosseu
curl http://localhost:3000/en/destinations/lisbon-portugal-city-break
cd /d C:\projects\travelacrosseu
curl http://localhost:3000/en/destinations/paris-france-city-break
cd /d C:\projects\travelacrosseu
taskkill /IM node.exe /F
```

---

## Verification Checklist

- [x] `/en/destinations` returns a grid of up to 12 cards populated from the API, and `/fr`, `/nl`, `/es`, `/pt` render the same layout when demo content exists.
- [x] `/en/destinations/lisbon-portugal-city-break` (and the other seeded slugs) display hero metadata, summary, long-form body, and sidebar tips without crashing when a field is missing.
- [x] Unsupported slugs or locales trigger `notFound()` so `/en/destinations/unknown` and `/it/destinations/...` still return 404s instead of hanging.
- [x] The LanguageSwitcher shows available translations, disables locales that lack a sibling TravelPage, and links back to the corresponding `/[locale]/destinations` index when translation data is missing.
- [x] Root `/destinations` now 307-redirects to `/en/destinations`, keeping legacy bookmarks functional.

---

## Notes

- Next.js 16 passes `params` as a `Promise`, so both index and detail routes await the object before reading `locale`/`slug`.
- Translation lookups rely on `group_id`; when the API only returns the active locale, the switcher gracefully drops back to the index link without throwing.
- Keep `scripts/phase2_step5_verify_destinations.cmd` close by before future refactors so regressions in the list view are caught automatically.
