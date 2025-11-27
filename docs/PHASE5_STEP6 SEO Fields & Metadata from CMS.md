# PHASE 5 – STEP 6 — SEO Fields & Metadata from CMS

## Goal

Make SEO metadata (meta title + meta description) fully editable per page and locale in Django admin, expose these fields through the existing CMS API, and integrate them into Next.js `generateMetadata()` functions for optimal search engine optimization. This enables content editors to control how pages appear in search results and social media shares.

The implementation provides dedicated SEO fields separate from content titles, ensuring that page titles for users and SEO titles for search engines can be optimized independently while maintaining sensible fallbacks when SEO fields are empty.

## Prerequisites

- **PHASE 5 – STEP 1** completed (CMS base models and structure)
- **PHASE 5 – STEP 2** completed (homepage CMS sync)
- **PHASE 5 – STEP 3** completed (secondary pages CMS connection)
- **PHASE 5 – STEP 4** completed (admin usability and preview links)
- **PHASE 5 – STEP 5** completed (translation workflow and locale readiness)
- Django backend running with CMS API endpoints functional
- Next.js frontend with existing `generateMetadata()` implementations
- Content editors familiar with Django admin interface

## Files to Edit / Create

### Backend Files
- **`cms/models.py`** — Add `meta_title` field to `PageTranslation` model with character limits
- **`cms/admin.py`** — Update inline form to include new SEO fields for easy editing
- **`cms/serializers.py`** — Expose `meta_title` and enhanced `meta_description` in API responses

### Frontend Files
- **`frontend/lib/api/pages.ts`** — Update TypeScript types to include `meta_title` field
- **`frontend/app/[locale]/page.tsx`** — Enhanced homepage metadata with CMS SEO fields
- **`frontend/app/[locale]/about/page.tsx`** — Add `generateMetadata()` using CMS SEO data
- **`frontend/app/[locale]/contact/page.tsx`** — Add `generateMetadata()` using CMS SEO data
- **`frontend/app/[locale]/destinations/page.tsx`** — Add `generateMetadata()` using CMS SEO data
- **`frontend/app/[locale]/blog/page.tsx`** — Add `generateMetadata()` using CMS SEO data

## Step Instructions

### 1. Add SEO Fields to PageTranslation Model

**In `cms/models.py`**, add the `meta_title` field with appropriate character limits and help text:

```python
class PageTranslation(models.Model):
    page = models.ForeignKey(Page, related_name="translations", on_delete=models.CASCADE)
    locale = models.CharField(max_length=5, choices=SUPPORTED_LOCALES)
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True)
    body = models.TextField(blank=True)
    meta_title = models.CharField(max_length=60, blank=True, help_text="SEO meta title (recommended: 50-60 chars)")
    meta_description = models.CharField(max_length=320, blank=True, help_text="SEO meta description (recommended: 150-160 chars)")
    last_synced_at = models.DateTimeField(auto_now=True)
```

The character limits follow SEO best practices:
- `meta_title`: 60 characters (Google typically displays 50-60 chars)
- `meta_description`: 320 characters (Google displays ~150-160 chars but allows longer)

### 2. Update Admin Interface for SEO Fields

**In `cms/admin.py`**, add the new `meta_title` field to the inline form:

```python
class PageTranslationInline(admin.TabularInline):
    model = PageTranslation
    extra = 1
    min_num = 1
    fields = ("locale", "title", "subtitle", "body", "meta_title", "meta_description")
    show_change_link = True
```

This allows editors to manage both content and SEO fields in the same interface with clear visual separation.

### 3. Expose SEO Fields in API Serializers

**In `cms/serializers.py`**, update both serializers to include the `meta_title` field:

```python
class PageTranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageTranslation
        fields = ("locale", "title", "subtitle", "body", "meta_title", "meta_description", "last_synced_at")

class PageDetailSerializer(serializers.ModelSerializer):
    meta_title = serializers.SerializerMethodField()
    # ... other fields

    class Meta:
        model = Page
        fields = (
            "slug", "page_type", "is_published", "locale", "requested_locale",
            "title", "subtitle", "body", "meta_title", "meta_description",
            "translation_missing", "translation"
        )

    def get_meta_title(self, obj: Page) -> str:
        translation = self._get_translation()
        return translation.meta_title if translation else ""
```

### 4. Update Frontend TypeScript Types

**In `frontend/lib/api/pages.ts`**, add `meta_title` to the type definitions:

```typescript
export type CmsPagePayload = {
  slug: string;
  page_type: string;
  is_published: boolean;
  locale: string | null;
  requested_locale?: string | null;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  meta_title: string | null;        // Add this field
  meta_description: string | null;
  translation_missing: boolean;
  translation?: {
    locale: string;
    title: string;
    subtitle: string; 
    body: string;
    meta_title: string;             // Add this field
    meta_description: string;
    last_synced_at: string;
  } | null;
};
```

### 5. Implement CMS-Driven generateMetadata Functions

For each main static page, implement `generateMetadata()` that fetches CMS content and uses SEO fields with proper fallbacks:

**Homepage (`frontend/app/[locale]/page.tsx`)**:
```typescript
export async function generateMetadata({ params }: { params: LocalePageProps["params"] }) {
  const { locale } = await resolveParams(params);
  const safeLocale = isSupportedLocale(locale) ? locale : "en";
  
  let cmsPage: CmsPagePayload | null = null;
  try {
    cmsPage = await fetchPage("home", safeLocale);
  } catch (error) {
    console.warn("Failed to fetch CMS page for SEO metadata:", error);
  }

  const title = cmsPage?.meta_title || cmsPage?.title || FALLBACK_SEO.title;
  const description = cmsPage?.meta_description || 
                     (cmsPage?.body ? cmsPage.body.substring(0, 160).trim() + "..." : "") ||
                     FALLBACK_SEO.description;

  return { title, description, openGraph: { title, description, type: "website" } };
}
```

**Secondary Pages** (about, contact, destinations, blog):
Apply the same pattern to each page, fetching the appropriate slug ("about", "contact", "destinations", "blog") and using page-specific fallback constants.

### 6. Create and Apply Database Migration

Generate a migration for the new `meta_title` field:

```bash
cd /d C:\projects\travelacrosseu
.venv\Scripts\python.exe manage.py makemigrations cms
```

Apply the migration:

```bash
.venv\Scripts\python.exe manage.py migrate
```

### 7. Populate SEO Fields in Admin

After migration, editors can:
1. Log into Django admin at `/admin/cms/page/`
2. Edit any page's translations
3. Fill in `meta_title` and `meta_description` fields
4. Preview how changes appear in search results

## Commands

### Backend Development
```bash
cd /d C:\projects\travelacrosseu
.venv\Scripts\activate
```

### Create and Apply Migrations
```bash
cd /d C:\projects\travelacrosseu
.venv\Scripts\python.exe manage.py makemigrations cms
.venv\Scripts\python.exe manage.py migrate
```

### Start Django Development Server
```bash
cd /d C:\projects\travelacrosseu
.venv\Scripts\python.exe manage.py runserver
```

### Start Next.js Development Server
```bash
cd /d C:\projects\travelacrosseu\frontend
npm run dev
```

### Check Django Configuration
```bash
cd /d C:\projects\travelacrosseu
.venv\Scripts\python.exe manage.py check
```

## What to Test

### Django Admin SEO Management
- `http://127.0.0.1:8000/admin/cms/page/` — Edit pages and add SEO metadata
- `http://127.0.0.1:8000/admin/cms/pagetranslation/` — Manage translations with SEO fields

### API Endpoints with SEO Data
- `http://127.0.0.1:8000/api/cms/pages/home/?locale=en` — Check meta_title in response
- `http://127.0.0.1:8000/api/cms/pages/about/?locale=fr` — Verify SEO fields per locale
- `http://127.0.0.1:8000/api/cms/pages/contact/?locale=es` — Test fallback behavior
- `http://127.0.0.1:8000/api/cms/pages/destinations/?locale=nl` — Check translation missing flag

### Frontend SEO Implementation
- `http://localhost:3000/en` — View page source, check meta title and description tags
- `http://localhost:3000/fr/about` — Verify locale-specific SEO metadata
- `http://localhost:3000/es/contact` — Test fallback logic in meta tags
- `http://localhost:3000/nl/destinations` — Check CMS-driven metadata
- `http://localhost:3000/pt/blog` — Verify blog page SEO integration

### Social Media Preview Testing
- Test URLs in Facebook Sharing Debugger
- Validate Twitter Card previews
- Check LinkedIn post previews for business sharing

## Notes / Pitfalls

### SEO Best Practices for Editors
- Keep `meta_title` concise and compelling (50-60 characters optimal)
- Write `meta_description` that encourages clicks (150-160 characters recommended) 
- Include target keywords naturally without keyword stuffing
- Make each page's SEO metadata unique across the site
- Use action-oriented language in descriptions when appropriate

### Fallback Strategy Implementation
- **Primary**: Use CMS `meta_title` and `meta_description` when available
- **Secondary**: Fall back to CMS `title` and truncated `body` for basic SEO
- **Tertiary**: Use hardcoded fallbacks for emergency cases
- **Never**: Leave meta tags completely empty, as this hurts SEO performance

### Content Strategy Considerations
- SEO titles can differ from page titles for optimization purposes
- Meta descriptions should summarize page value, not just repeat the title
- Different locales may need different SEO approaches due to cultural context
- Track which pages are missing SEO data using the admin translation coverage display

### Technical Implementation Details
- `generateMetadata()` functions run at build time for static pages
- CMS API calls in metadata functions are cached appropriately by Next.js
- Failed CMS requests gracefully fall back without breaking page renders
- The `requested_locale` field helps debug translation fallback behavior

### Future SEO Enhancements
- Consider adding Open Graph image fields for social media
- Schema.org JSON-LD can be populated from the same CMS fields
- Advanced SEO fields like canonical URLs and robots directives can extend this pattern
- A/B testing different meta descriptions becomes possible with CMS-driven content

### Performance Monitoring
- Monitor Core Web Vitals to ensure CMS integration doesn't impact page speed
- Track search engine indexing to verify proper meta tag implementation
- Use Google Search Console to monitor click-through rates from search results
- Consider implementing preview functionality for SEO metadata in the admin interface