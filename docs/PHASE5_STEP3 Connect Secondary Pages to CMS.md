# PHASE 5 – STEP 3 — Connect Secondary Pages to CMS

## Goal
- Power About, Contact, Destinations, and Blog hero sections from the same CMS endpoint used on the homepage.
- Keep dictionaries responsible for UI chrome (breadcrumbs, chips, buttons) while CMS handles long-form copy.
- Ensure every secondary page gracefully falls back to demo text when CMS data or translations are missing.

## Prerequisites
- PHASE 5 – STEP 1 (CMS models + admin) and STEP 2 (homepage CMS wiring) completed.
- Django admin accessible at `http://127.0.0.1:8000/admin/` with a staff user who can manage Page + PageTranslation records.
- Next.js App Router localization already active under `frontend/app/[locale]/` with dictionaries in `frontend/locales/<lang>/common.json`.

## Files to Edit / Create
- `frontend/app/[locale]/about/page.tsx` — fetch CMS slug `about`, merge with dictionary breadcrumbs, and render paragraphs with fallbacks.
- `frontend/app/[locale]/contact/page.tsx` — load CMS slug `contact`, keep dictionary labels for the header, and display placeholder contact info if CMS is empty.
- `frontend/app/[locale]/destinations/page.tsx` — reuse `fetchPage("destinations")` for the hero while retaining the Travel Page grid fed by `fetchTravelPages`.
- `frontend/app/[locale]/blog/page.tsx` — hydrate the blog intro with CMS data and keep the static card grid for now.
- `docs/PHASE5_STEP3 Connect Secondary Pages to CMS.md` — this implementation guide.

## Step Instructions
1. **Create CMS entries via admin**
   - Add Page records for `about`, `contact`, `destinations`, and `blog` with `is_published=True`.
   - For each page, add translations covering the locales you plan to demo. Populate title, subtitle, and body fields so the hero renders meaningful copy.

   | Page Name    | Slug         | Notes                                           |
   |--------------|--------------|-------------------------------------------------|
   | About        | about        | Describe the mission + roadmap per language.    |
   | Contact      | contact      | Share contact instructions per locale.          |
   | Destinations | destinations | Introductory text for the destinations index.   |
   | Blog         | blog         | Journal hero with title + description copy.     |

2. **Leverage the existing CMS endpoint**
   - No backend code changes are required; `/api/cms/pages/<slug>/?locale=` already supports any slug created in admin.
   - Confirm each new page responds at `http://127.0.0.1:8000/api/cms/pages/<slug>/?locale=en` once the admin data exists.

3. **Update About & Contact pages**
   - Wrap `params` in a `resolveParams` helper (like the homepage) before reading `locale`.
   - Fetch the relevant CMS slug with `fetchPage(slug, locale)` and load the dictionary for header labels.
   - Render CMS title/subtitle/body, log errors if the request fails, and display descriptive fallback copy plus a translation warning when `translation_missing` is true.

4. **Update Destinations page hero**
   - Keep `fetchTravelPages(locale)` for the card grid but fetch `fetchPage("destinations", locale)` for the hero.
   - Pipe dictionary text into breadcrumbs, hydrate hero title/subtitle/body from the CMS, and surface a small badge if the CMS fell back to another locale.

5. **Update Blog page hero**
   - Reuse the existing blog cards, but fetch `fetchPage("blog", locale)` for the intro heading/body.
   - Keep dictionary-driven chips and add a notice when translations are pending so editors know to localize the CMS entry.

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
- http://127.0.0.1:8000/api/cms/pages/about/?locale=en
- http://127.0.0.1:8000/api/cms/pages/contact/?locale=en
- http://127.0.0.1:8000/api/cms/pages/destinations/?locale=en
- http://127.0.0.1:8000/api/cms/pages/blog/?locale=en
- http://localhost:3000/en/about
- http://localhost:3000/en/contact
- http://localhost:3000/en/destinations
- http://localhost:3000/en/blog

## Notes / Pitfalls
- Missing translations trigger `translation_missing=true`; the frontend shows a small notice while falling back to English, so keep admins aware when locales lag.
- Until CMS entries exist, the frontend still renders placeholder copy—add real text via Django admin before sharing builds.
- Future SEO metadata will also pull from the CMS; keep title/subtitle/body production-ready so we can reuse them in `generateMetadata` during a later phase.
