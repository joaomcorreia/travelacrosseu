1️⃣ PHASE6_STEP1 — doc to add

Create this file:

docs/PHASE6_STEP1 First Real Content Pass (Pages, Destinations, Blog).md

# PHASE 6 – STEP 1 — First Real Content Pass (Pages, Destinations, Blog)

## Goal

Start using the TravelAcrossEU CMS with real content.  
Editors fill out the main pages, at least one destination chain (Country → City → Destination), and at least one blog post so the site stops looking like a demo and behaves like a real travel website.

## Prerequisites

- All Phase 5 steps completed (CMS models, API, admin, destinations, blog, dashboard).
- Backend running at `http://127.0.0.1:8000` with Django admin accessible.
- Frontend running at `http://localhost:3000` with localized routes under `/[locale]/`.
- At least one staff user can log into Django admin.

## Files to Edit / Create

This step is content-only, no code changes:

- **Django Admin**
  - `Page` + `PageTranslation` entries for:
    - `home`
    - `about`
    - `contact`
    - `destinations`
    - `blog`
  - `Country`, `City`, `Destination` and their translation models.
  - `BlogCategory`, `BlogPost` and `BlogPostTranslation`.

## Step Instructions

1. **Fill main pages (Home, About, Contact, Destinations, Blog)**

   - In Django admin, open **CMS → Pages**.
   - For each slug (`home`, `about`, `contact`, `destinations`, `blog`):
     - Ensure there is at least one `PageTranslation` for `en`.
     - Fill:
       - `title`
       - `subtitle` (optional but recommended)
       - `body` (hero/intro text)
       - `meta_title`
       - `meta_description`
       - `hero_image` (where available)
     - Add a few `PageSection` entries (text, image, text_image, CTA) to structure content.

2. **Create at least one real destination chain**

   - In **CMS → Countries**, create a country (for example `Portugal` with slug `portugal`) and add a hero image.
   - In **CMS → Cities**, add a city (for example `Lisbon` with slug `lisbon`) linked to that country.
   - In **CMS → Destinations**, add a destination:
     - Link it to the city.
     - Set a slug (for example `lisbon-weekend`).
     - Mark it published.
     - Add translations (at least `en`) with title, subtitle, body, meta fields, hero image and destination sections.

3. **Create at least one real blog category and blog post**

   - In **CMS → Blog categories**, create a category (for example `Travel Tips` with slug `travel-tips`).
   - In **CMS → Blog posts**, create a post:
     - Set slug (for example `how-to-plan-a-weekend-in-lisbon`).
     - Assign the category.
     - Mark it published.
     - Add translations (at least `en`) with title, subtitle, body, meta fields, hero image and post sections.

4. **Repeat for a second locale (optional)**

   - For a second locale (for example `fr`), add translations for:
     - Main pages (`home`, `about`, `contact`, `destinations`, `blog`).
     - The sample destination.
     - The sample blog post.
   - This confirms that translation and fallback behavior work as expected.

## Commands

Reference only; do not run automatically.

### Backend (Django)

```cmd
cd /d C:\projects\travelacrosseu
.venv\Scripts\activate
python manage.py runserver

Frontend (Next.js)
cd /d C:\projects\travelacrosseu\frontend
npm run dev

OPTIONAL — Frontend Lint
cd /d C:\projects\travelacrosseu\frontend
npm run lint

What to Test

http://127.0.0.1:8000/admin/

http://127.0.0.1:8000/admin/cms/page/

http://127.0.0.1:8000/admin/cms/destination/

http://127.0.0.1:8000/admin/cms/blogpost/

http://localhost:3000/en

http://localhost:3000/en/about

http://localhost:3000/en/contact

http://localhost:3000/en/destinations

http://localhost:3000/en/blog

http://localhost:3000/en/destinations/
<country>

http://localhost:3000/en/destinations/
<country>/<city>

http://localhost:3000/en/destinations/
<country>/<city>/<destination-slug>

http://localhost:3000/en/blog/category/
<category-slug>

http://localhost:3000/en/blog/
<post-slug>

Notes / Pitfalls

Until translations exist for a locale, the API may fall back to en and flag translation_missing; this is expected for early content.

The goal of this step is not perfect wording but to confirm the end-to-end CMS pipeline is live with non-demo content.

Editors should avoid deleting the core page slugs (home, about, contact, destinations, blog) since frontend routes expect them.