# PHASE 4 – STEP 3 — Group IDs + Smart Language Switcher

> Shell: All commands in this step must be run in **Windows Command Prompt (CMD)**, not PowerShell.

## Purpose
- Store a stable `group_id` on every `TravelPage` so language variants share one identifier.
- Extend the frontend API client and UI so destination detail pages can link directly to sibling locales.
- Replace the placeholder header control with a working language switcher that also doubles as a contextual translation panel on detail pages.

## Files Updated / Created
- `core/models.py`, `core/migrations/0002_travelpage_group_id.py`, `core/admin.py`, `core/serializers.py`, `core/views.py` *(backend work completed earlier in this step)*
- `frontend/lib/locales.ts`
- `frontend/lib/api.ts`
- `frontend/components/Header.tsx`
- `frontend/components/LanguageSwitcher.tsx`
- `frontend/app/[locale]/destinations/[slug]/page.tsx`
- `scripts/frontend_lint.cmd`
- `docs/PHASE4_STEP3_SMART_LANG_SWITCHER.md`

## Design Decisions
- **Locale metadata helpers:** Added `LOCALE_LABELS` plus `getLocaleLabel` to keep every UI reference consistent and future-proof for more locales.
- **API query helpers:** Centralized query-string building/normalization in `lib/api.ts`, added `group_id` awareness to the `TravelPage` type, and exposed a `fetchTravelPagesByGroupId` helper so components only ask for the translations they need.
- **Reusable switcher:** Built `LanguageSwitcher` with two variants—`compact` for the header (dropdown powered by `<details>`) and `panel` for destination detail pages with availability badges and progress copy.
- **Contextual linking:** Destination detail pages now fetch their translation group, build locale-specific URLs, and surface them beneath the itinerary body so readers can hop between languages without losing the page context.
- **Safety nets:** Translation fetching is wrapped in `try/catch` so an API hiccup degrades gracefully to the current locale instead of erroring out.

## Commands Run
1. `cmd /c start "" "C:\projects\travelacrosseu\scripts\runserver_8000.cmd"`
2. `cmd /c C:\projects\travelacrosseu\scripts\curl_pages_language_en.cmd`
3. `cmd /c C:\projects\travelacrosseu\scripts\frontend_lint.cmd`

## Verification Checklist
- [x] `/api/pages?language=en` returns `group_id` for every record and filters work as expected.
- [x] Header language control now opens a dropdown with all five locales and routes to the correct root path per locale.
- [x] Destination detail pages display a translation panel that links directly to available locales and marks unpublished locales as "coming soon".
- [x] Switching locales on a destination keeps you within the same travel guide group when translations exist (verified with EN demo data).
- [x] `npm run lint` (via `scripts/frontend_lint.cmd`) passes without ESLint errors.
