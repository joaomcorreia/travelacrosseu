# PHASE 4 – STEP 10 — Soft-Prod Readiness & Public Shell Check

## Goal
- Provide a localized `/[locale]/not-found` experience that matches the dark shell and dictionary-driven copy.
- Ship baseline SEO metadata (title, description, OG/Twitter defaults) per locale so soft-prod previews reflect the right messaging.
- Confirm every locale can serve homepage + 404 without falling back to hard-coded English strings.

## Prerequisites
- Phase 4 Steps 7-9 completed so the homepage shell, layout routing, and locale dictionaries already exist.
- `getDictionary(locale)` returns `home`, `layout`, and shell sections for all supported languages.
- Frontend dev scripts (`npm run dev`, optional `npm run lint`) functioning from `frontend/`.

## Files to Edit / Create
- `frontend/locales/{en,fr,nl,es,pt}/common.json` — add `notFound` copy plus `seo.home.title` and `seo.home.description` per locale.
- `frontend/app/[locale]/page.tsx` — add a localized `generateMetadata` export and reuse the same param-resolution helper the page component uses.
- `frontend/app/[locale]/not-found.tsx` — create the localized 404 view that reuses dictionary copy and gradient styling.

## Step Instructions
1. Extend each locale JSON with:
   - `notFound.title`, `notFound.description`, `notFound.ctaPrimary`, `notFound.ctaSecondary` for localized 404 copy.
   - `seo.home.title` + `seo.home.description` so metadata reflects each locale’s messaging, with English fallbacks baked into the code.
2. In `app/[locale]/page.tsx`:
   - Accept either promised or synchronous params via a `resolveParams` helper (Next.js 16 passes a `Promise`).
   - Export `generateMetadata` that loads the locale dictionary (falling back to `en`) and feeds `seo.home.*` into `title`, `description`, `openGraph`, and `twitter` objects.
   - Keep the page component logic the same, still calling `notFound()` for unsupported locales before loading destinations.
3. Add `app/[locale]/not-found.tsx`:
   - Resolve the locale the same way, fetch the dictionary, and render the localized copy with CTA buttons back to `/${locale}` and `/${locale}/destinations`.
   - Keep the typography + buttons consistent with the dark gradient shell.
4. Smoke test each locale’s homepage plus a broken route to ensure the localized metadata and 404 screens render without missing keys.

## Commands
### Backend (Django)
```cmd
cd /d C:\projects\travelacrosseu\backend
venv\Scripts\activate
python manage.py runserver
```

### Frontend (Next.js)
```cmd
cd /d C:\projects\travelacrosseu\frontend
npm run dev
```

### OPTIONAL — Lint
```cmd
cd /d C:\projects\travelacrosseu\frontend
npm run lint
```

## What to Test
- `/en`, `/fr`, `/nl`, `/es`, `/pt` — confirm the homepage renders, no console warnings appear, and the browser `<title>`/OG preview strings match each locale’s `seo.home.*` copy.
- 404 routes: `/en/this-does-not-exist`, `/fr/cette-page-nexiste-pas`, `/nl/deze-bestaat-niet`, `/es/esto-no-existe`, `/pt/isto-nao-existe` — ensure you see the dark gradient 404 view, localized text, and both CTAs route correctly.
- Open DevTools → Network → document response headers to double-check metadata is populated when running `npm run dev` (Next.js injects the data server-side).
- Trigger the 404 view, then use the CTAs to hop back to `/[locale]` and `/[locale]/destinations` to confirm locale-prefixed navigation stays intact.

## Notes / Pitfalls
- `params` arrive as a `Promise` in the App Router; always `await` before reading `locale` to avoid hydration warnings.
- `generateMetadata` should never throw when locales are missing — keep the English fallback constants in sync with `app/layout.tsx` defaults.
- The 404 page must stay a server component (no `use client`) so it can load dictionaries without extra hooks.
- If a locale lacks `notFound` or `seo` keys, the fallback copy prevents runtime errors, but be sure to populate the JSON before shipping new languages.
