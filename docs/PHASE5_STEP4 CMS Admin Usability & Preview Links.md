# PHASE 5 – STEP 4 — CMS Admin Usability & Preview Links

## Goal
- Enhance the Django admin interface for Pages and PageTranslations with better list displays, filters, and search capabilities.
- Add preview functionality so editors can open the corresponding frontend URL directly from the admin interface.
- Improve the admin workflow for content editors managing multilingual pages across different locales.

## Prerequisites
- PHASE 5 – STEP 1 (CMS models + admin), STEP 2 (homepage wiring), and STEP 3 (secondary pages) completed.
- Django admin accessible at `http://127.0.0.1:8000/admin/` with staff users who can manage Page + PageTranslation records.
- Next.js frontend running on `http://localhost:3000` with localized routes under `/[locale]/` structure.

## Files to Edit / Create
- `cms/admin.py` — enhance PageAdmin and PageTranslationAdmin with improved list displays, filters, search fields, and preview links.
- `cms/utils.py` — NEW helper module containing `get_frontend_url()` function to build frontend URLs for pages and locales.
- `docs/PHASE5_STEP4 CMS Admin Usability & Preview Links.md` — this implementation guide.

## Step Instructions
1. **Create frontend URL helper**
   - Add `cms/utils.py` with `get_frontend_url(page_slug, locale)` function that builds frontend URLs.
   - Handle the special case where `home` slug maps to `/{locale}` root route, while other slugs use `/{locale}/{slug}` pattern.
   - Use configurable base URL (defaulting to `http://localhost:3000`) that can be overridden via Django settings.

2. **Enhance Page admin interface**
   - Update `PageAdmin` to show slug, page_type, is_published, translation count, and updated_at in list view.
   - Add list filters for page_type, is_published, and updated_at for easier browsing.
   - Include search across slug and translation titles to help editors find content quickly.
   - Add prefetch_related optimization to reduce database queries when loading the page list.

3. **Improve PageTranslation admin interface**
   - Update `PageTranslationAdmin` with enhanced list display showing page info, locale, title, publication status, and preview link.
   - Add comprehensive filters by locale, publication status, and page type for efficient content management.
   - Implement preview link column that generates clickable links to the frontend URL for published pages.
   - Use select_related optimization to avoid N+1 queries when displaying page relationships.

4. **Add preview functionality**
   - Create preview_link method that generates HTML links opening in new tabs with proper security attributes.
   - Show preview links only for published pages to prevent editors from accessing unpublished content URLs.
   - Ensure preview URLs follow the established Next.js routing pattern from previous phases.

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
- http://127.0.0.1:8000/admin/cms/page/
- http://127.0.0.1:8000/admin/cms/pagetranslation/
- http://localhost:3000/en
- http://localhost:3000/en/about
- http://localhost:3000/fr/contact
- http://localhost:3000/nl/destinations

## Notes / Pitfalls
- Preview URLs rely on the frontend base URL (`http://localhost:3000` by default); configure via `FRONTEND_BASE_URL` in Django settings for different environments.
- Preview links only appear for published pages to prevent editors from sharing URLs to unpublished content.
- The translation count and preview functionality require proper database relationships—ensure migrations are applied before testing admin improvements.
- Search functionality spans both page slugs and translation titles, so editors can find content by either the technical slug or the user-facing title.