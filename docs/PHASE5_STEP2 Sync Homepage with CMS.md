# PHASE 5 – STEP 2 — Sync Homepage with CMS

## Goal
- Drive the homepage hero copy from Django CMS so editors control the hero title, subtitle, and intro text per locale.
- Keep UI labels (badges, buttons, cards) dictionary-driven while blending CMS content into the hero section.
- Provide a resilient `/api/cms/pages/<slug>/` endpoint that honors `?locale=` and falls back gracefully when a translation is missing.

## Prerequisites
- PHASE 5 – STEP 1 completed (CMS app, models, admin, base `/api/cms/pages/<slug>/` endpoint).
- Django admin reachable at `http://127.0.0.1:8000/admin/` with at least one staff user.
- Next.js App Router already localized at `frontend/app/[locale]/` with dictionaries under `frontend/locales/<lang>/common.json`.

## Files to Edit / Create
- `cms/serializers.py` — expose locale-aware fields (slug, locale, title, subtitle, body, meta) and flag when a translation fallback was used.
- `cms/views.py` — honor the requested locale, fall back to English (or the first translation), and bubble the `requested_locale` to the response payload.
- `frontend/lib/api/pages.ts` — NEW helper wrapping `GET /api/cms/pages/<slug>/?locale=` so RSCs can load CMS content.
- `frontend/app/[locale]/page.tsx` — fetch the CMS homepage in parallel with destination cards and pass it to the shared `HomePage` component.
- `frontend/app/HomePage.tsx` — accept the CMS payload and surface its title/subtitle/body inside the hero while keeping CTAs, badges, and cards on dictionary strings.
- `docs/PHASE5_STEP2 Sync Homepage with CMS.md` — this guide.

## Step Instructions
1. **Prep the CMS data**
   - A helper migration seeds a baseline `home` page plus an English translation; review/edit it in Django admin and add additional locales as needed.
   - In Django admin, confirm the `home` page is marked `is_published=True`, then create `PageTranslation` rows for each locale you plan to expose.
   - Populate at least `title`, `subtitle`, and `body` so the hero can render meaningful copy per language.
2. **Tighten the API response**
   - Update `cms/serializers.py` so `PageDetailSerializer` returns `slug`, `page_type`, `is_published`, `locale`, `title`, `subtitle`, `body`, `meta_description`, `translation_missing`, and the raw `translation` data.
   - Pass `requested_locale` via the serializer context and compute `translation_missing` when the fallback locale (currently `en`) is used.
3. **Guarantee fallback behavior**
   - In `cms/views.py`, introduce `FALLBACK_LOCALE = "en"`, build a locale → translation map, and choose translations in this order: requested locale → fallback locale → first available.
   - Append `requested_locale` to the JSON payload so clients can decide whether to show warnings if the fallback triggered.
4. **Add a frontend CMS client**
   - Create `frontend/lib/api/pages.ts` with `fetchPage(slug, locale)` that hits `${API_BASE}/api/cms/pages/${slug}/?locale=${locale}` and returns `null` on 404.
   - Keep the base URL pointing to `process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000"` for now so the helper works in development.
5. **Wire the homepage**
   - In `frontend/app/[locale]/page.tsx`, load the dictionary, travel destinations, and `fetchPage("home", locale)`; log (not throw) when either call fails to keep the route resilient.
   - Update `HomePage.tsx` to accept `cmsHomepage`, prefer its title/subtitle/body in the hero, and fall back to dictionary strings when the CMS record is missing or unpublished.
   - Continue using dictionary labels for CTAs, badges, section headings, and cards so i18n coverage stays centralized in `common.json`.

## Commands
### Backend (Django)
```cmd
cd /d C:\projects\travelacrosseu
.venv\Scripts\activate
python manage.py runserver
```

### Frontend (Next.js)
```cmd
cd /d C:\projects\travelacrosseu\frontend
npm run dev
```

### OPTIONAL — Frontend Lint
```cmd
cd /d C:\projects\travelacrosseu\frontend
npm run lint
```

## What to Test
- http://127.0.0.1:8000/admin/
- http://127.0.0.1:8000/api/cms/pages/home/?locale=en
- http://127.0.0.1:8000/api/cms/pages/home/?locale=fr
- http://localhost:3000/en
- http://localhost:3000/fr

## Notes / Pitfalls
- The CMS helper currently hardcodes `http://127.0.0.1:8000`; move this to an environment variable (e.g., `NEXT_PUBLIC_API_BASE_URL`) before deploying.
- When a locale translation is missing, the API falls back to English (or the first translation) and sets `translation_missing=true`; surface this if editors need visibility.
- Always seed the `home` page data via Django admin—avoid hard-coded fixtures so marketing can update copy without redeploys.
- Keep UI chrome strings (buttons, badges, card labels) inside the locale dictionaries to prevent regressions when new locales are added.
