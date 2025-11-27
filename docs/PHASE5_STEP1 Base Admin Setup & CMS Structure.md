# PHASE 5 – STEP 1 — Base Admin Setup & CMS Structure

## Goal
- Introduce a dedicated `cms` Django app that can own every marketing/landing page TravelAcrossEU needs.
- Model pages plus their locale-specific translations so the admin becomes the source of truth for headings, summaries, and bodies.
- Expose a lightweight JSON endpoint (`/api/cms/pages/<slug>/`) that Next.js can call while we wire up richer CMS syncing later.

## Prerequisites
- Phase 4 steps completed so the frontend already consumes localized dictionaries and the backend API stack is stable.
- Virtual environment ready with Django + DRF dependencies installed (`pip install -r requirements.txt`).
- Admin superuser already created so you can sign in to Django admin.

## Files to Edit / Create
- `backend/settings.py` — register the new `cms` app in `INSTALLED_APPS`.
- `backend/urls.py` — include the CMS API routes under `/api/cms/`.
- `cms/apps.py`, `cms/__init__.py`, `cms/migrations/0001_initial.py` — scaffold the new Django app and initial migration.
- `cms/models.py` — define `Page` + `PageTranslation` with timestamps, statuses, and locale constraints.
- `cms/admin.py` — add list displays, filters, and inline translation editing for a smooth CMS workflow.
- `cms/serializers.py`, `cms/views.py`, `cms/urls.py` — implement the JSON endpoint that surfaces published pages plus a locale-specific translation payload.

## Step Instructions
1. **Create the `cms` app skeleton**
   - Add the folder at the repo root (`cms/`) with `apps.py`, `__init__.py`, and a `migrations` package.
   - Register `'cms'` in `INSTALLED_APPS` so Django can pick up the models and admin registrations.
2. **Model the CMS data**
   - In `cms/models.py`, add the `Page` model with `slug`, `page_type`, `is_published`, optional `hero_image`, and timestamps.
   - Add `PageTranslation` with `locale`, `title`, optional `subtitle`, `body`, and `meta_description`, attaching it to `Page` via `related_name="translations"`.
   - Enforce uniqueness on `(page, locale)` plus a `clean()` method that validates locales against `settings.LANGUAGES`.
   - Generate `cms/migrations/0001_initial.py` capturing both tables.
3. **Wire up the admin**
   - Create a `PageTranslationInline` so editors can add per-locale content right on the `Page` detail screen.
   - Configure `PageAdmin` with list filters (`page_type`, `is_published`), search (`slug`, `translations__title`), and pre-populated slugs.
   - Register `PageTranslationAdmin` separately for power users who prefer editing translations on their own.
4. **Expose the API skeleton**
   - Build `PageDetailSerializer` + `PageTranslationSerializer` to shape the JSON response.
   - Create `page_detail` view (DRF `@api_view`) that fetches a published page by slug, optionally filters translations by `?locale=xx`, and falls back to the first translation when a locale is missing.
   - Mount the routes via `cms/urls.py` (`pages/<slug:slug>/`) and include them from `backend/urls.py` under `/api/cms/`.
5. **Apply migrations & seed sample data**
   - Apply the new CMS migration so SQLite gains the `Page` and `PageTranslation` tables.
   - Use Django admin to create a `Page` (slug `home`) and a few `PageTranslation` rows so the JSON endpoint returns real copy for QA.

## Commands
### Backend (Django)
```cmd
cd /d C:\projects\travelacrosseu
.venv\Scripts\activate
python manage.py migrate cms
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
- http://127.0.0.1:8000/admin/
- http://127.0.0.1:8000/admin/cms/page/
- http://127.0.0.1:8000/api/cms/pages/home/?locale=en
- http://127.0.0.1:8000/api/cms/pages/home/?locale=fr

## Notes / Pitfalls
- Keep `slug` unique and short; the API uses it as the lookup key for both admin editors and the frontend.
- The `/api/cms/pages/<slug>/` endpoint only returns published pages, so remember to check the “is published” box while testing.
- Locale validation reads from `settings.LANGUAGES`; update that tuple first if you ever add another language.
- Upcoming steps in Phase 5 will expand this CMS with blocks/sections and a synchronization layer for Next.js—keep these models generic enough to grow (e.g., add JSON fields or related blocks later).
