# PHASE 6 – STEP 3 — Generic CMS Page Route (Any Slug)

## Goal

Allow editors to create any new `Page` + translations in Django admin with any slug (e.g., `privacy`, `terms`, `black-friday`), and immediately access that page at `/[locale]/<slug>` on the frontend, rendered via CMS (hero, sections, SEO), without writing new TSX files.

## Prerequisites

- ✅ CMS system implemented (PHASE 5 STEP 2–3)
- ✅ Page API endpoint available at `/api/cms/pages/<slug>/`
- ✅ `fetchPage()` helper function exists in `frontend/lib/api/pages.ts`
- ✅ `SectionRenderer` component available for rendering CMS sections
- ✅ SEO fields implemented (PHASE 5 STEP 6)
- ✅ Hero image support (PHASE 5 STEP 7)
- ✅ Page sections support (PHASE 5 STEP 8)

## Files to Edit / Create

### Created
- `frontend/app/[locale]/[pageSlug]/page.tsx` - Generic CMS page route handler

### No Backend Changes Required
- All necessary API endpoints and serializers already exist from Phase 5

## Step Instructions

### 1. Confirm Existing CMS Page API

The existing Django API endpoint serves page content by slug and locale:
- **Endpoint**: `/api/cms/pages/<slug>/`
- **Method**: GET
- **Query Parameters**: `locale` (language)
- **Returns**: Complete page data with all fields:
  - `slug`, `locale`, `requested_locale`, `translation_missing`
  - `title`, `subtitle`, `body`
  - `meta_title`, `meta_description` (SEO)
  - `hero_image`
  - `sections[]` (with `section_type`, `title`, `body`, `image`, `cta_label`, `cta_url`, `order`)

✅ **Verified**: All required fields are already available in the API response.

### 2. Add Generic CMS Route in Next.js

**Created**: `frontend/app/[locale]/[pageSlug]/page.tsx`

This route handles any page slug that doesn't conflict with existing dedicated routes:
- Uses `locale` param from the parent segment
- Uses `pageSlug` param from the URL to identify the CMS `Page.slug`
- Calls the existing `fetchPage(slug, locale)` helper
- Fetches data in both `generateMetadata` (SEO) and the page component (content rendering)

### 3. Avoid Conflicts with Existing Routes

**Reserved slugs** (handled by dedicated TSX files):
- `about`, `contact`, `destinations`, `blog`
- `experiences`, `flights`, `hotels`

The generic route includes a guard:
- If `pageSlug` matches a reserved slug, returns `notFound()`
- This ensures existing dedicated routes continue to work without conflicts

### 4. Implement SEO Metadata Generation

**In `generateMetadata`**:
- Calls `fetchPage(pageSlug, locale)` 
- Uses CMS SEO data:
  - **title**: `meta_title` if present, otherwise CMS `title`
  - **description**: `meta_description` if present, otherwise trimmed `body` (first 160 chars)
- Returns `Metadata` object for Next.js with OpenGraph support

### 5. Render Hero + Sections

**In the page component**:
- Fetches CMS page data using `fetchPage(pageSlug, locale)`
- Returns `notFound()` if page is missing or `is_published` is false
- **Hero image**: Renders with `<Image>` using existing `remotePatterns` config for `127.0.0.1:8000/media/`
- **Main content**: Renders title, subtitle, and body with proper styling
- **CMS sections**: Uses `<SectionRenderer sections={cmsPage.sections} />` below the hero area
- **Translation warning**: Shows badge if `translation_missing` is true

## Commands

Reference commands for development:

### Backend
```cmd
cd C:\projects\travelacrosseu
.venv\Scripts\python.exe manage.py runserver
```

### Frontend
```cmd
cd C:\projects\travelacrosseu\frontend
npm run dev
```

## What to Test

### Admin Interface
- `http://127.0.0.1:8000/admin/cms/page/` - Create new pages

### API Endpoints
- `http://127.0.0.1:8000/api/cms/pages/privacy/?locale=en` - Test custom page API
- `http://127.0.0.1:8000/api/cms/pages/terms/?locale=fr` - Test with different locale

### Frontend Pages
- `http://localhost:3000/en/privacy` - Generic page (English)
- `http://localhost:3000/fr/privacy` - Generic page (French)  
- `http://localhost:3000/en/terms` - Another generic page
- `http://localhost:3000/fr/terms` - Terms in French
- `http://localhost:3000/en/black-friday` - Any custom slug
- `http://localhost:3000/en/about` - Should use dedicated route (not generic)
- `http://localhost:3000/en/nonexistent` - Should return 404

## Notes / Pitfalls

### Route Priority
- Reserved slugs (`about`, `contact`, `destinations`, `blog`, `experiences`, `flights`, `hotels`) must not be used for generic pages since dedicated TSX routes already exist
- The generic route only handles slugs that don't have dedicated files
- Next.js routing will prioritize specific folders over dynamic routes

### Editor Guidelines
- Editors should avoid creating pages with slugs that collide with existing routes
- Use clear, SEO-friendly slugs like `privacy-policy`, `terms-of-service`, `black-friday-deals`
- Always set `is_published=True` for pages to appear on frontend

### Production Considerations
- In production, update `remotePatterns` in `next.config.ts` to match the final backend host
- Consider adding `generateStaticParams` for better performance with known pages
- Monitor for slug conflicts when adding new dedicated routes

### SEO Best Practices
- Always fill `meta_title` and `meta_description` for better SEO
- Use hero images with proper alt text
- Keep page titles under 60 characters
- Keep meta descriptions under 160 characters

### Development Workflow
1. **Create page in Django admin**:
   - Go to `/admin/cms/page/add/`
   - Set slug (e.g., `privacy`)
   - Set `is_published=True`
   - Add translations for desired locales
   - Add SEO fields and sections as needed

2. **Test immediately**:
   - Page becomes available at `/[locale]/<slug>` instantly
   - No frontend code changes required
   - SEO metadata automatically generated

3. **Content updates**:
   - All changes in Django admin reflect immediately (with Next.js revalidation)
   - No deployment required for content changes

## Summary

This implementation provides a powerful, flexible CMS system where:
- **Editors** can create any page through Django admin and see it live immediately
- **Developers** don't need to create new TSX files for every page
- **SEO** is automatically handled with proper metadata
- **Performance** is maintained with Next.js App Router and revalidation
- **Conflicts** are prevented with reserved slug protection

The generic route seamlessly integrates with the existing CMS infrastructure, providing a complete content management solution without breaking any existing functionality.