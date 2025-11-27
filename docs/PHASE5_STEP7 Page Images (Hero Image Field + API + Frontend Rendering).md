# PHASE 5 – STEP 7 — Page Images (Hero Image Field + API + Frontend Rendering)

## Goal

Enable each CMS page to have a hero image that editors can upload via Django admin, expose these images through the CMS API, and render them on Next.js pages. This adds visual richness to travel content and establishes the foundation for future blog posts and destination pages with compelling imagery.

The implementation provides a complete image workflow from Django admin upload to frontend display, with proper responsive rendering and fallback handling when images are not available.

## Prerequisites

- **PHASE 5 – STEP 1** completed (CMS base models and structure)
- **PHASE 5 – STEP 2** completed (homepage CMS sync)
- **PHASE 5 – STEP 3** completed (secondary pages CMS connection)
- **PHASE 5 – STEP 4** completed (admin usability and preview links)
- **PHASE 5 – STEP 5** completed (translation workflow and locale readiness)
- **PHASE 5 – STEP 6** completed (SEO fields and metadata from CMS)
- Django backend with media file handling configured
- Next.js frontend with Image component support
- Content editors ready to upload and manage page images

## Files to Edit / Create

### Backend Files
- **`backend/settings.py`** — Add `MEDIA_URL` and `MEDIA_ROOT` configuration for file uploads
- **`backend/urls.py`** — Add media file serving for development environment
- **`cms/models.py`** — Add `hero_image` ImageField to `PageTranslation` model
- **`cms/admin.py`** — Update admin interface with image preview and upload functionality
- **`cms/serializers.py`** — Expose hero images with absolute URLs in API responses
- **`cms/views.py`** — Pass request context for absolute URL generation

### Frontend Files
- **`frontend/lib/api/pages.ts`** — Update TypeScript types to include `hero_image` field
- **`frontend/app/HomePage.tsx`** — Add hero image rendering with Next.js Image component
- **`frontend/app/[locale]/page.tsx`** — Import Image component for homepage integration
- **`frontend/app/[locale]/about/page.tsx`** — Add hero image section with responsive layout
- **`frontend/app/[locale]/contact/page.tsx`** — Add hero image section with gradient overlay
- **`frontend/app/[locale]/destinations/page.tsx`** — Add hero image section for destination listing
- **`frontend/app/[locale]/blog/page.tsx`** — Add hero image section with blog-appropriate styling

## Step Instructions

### 1. Configure Django Media File Handling

**In `backend/settings.py`**, add media file configuration:

```python
# Media files configuration
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

**In `backend/urls.py`**, add media file serving for development:

```python
from django.conf import settings
from django.conf.urls.static import static

# Add to existing urlpatterns
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### 2. Add Hero Image Field to PageTranslation Model

**In `cms/models.py`**, add the `hero_image` field with proper upload path and help text:

```python
class PageTranslation(models.Model):
    page = models.ForeignKey(Page, related_name="translations", on_delete=models.CASCADE)
    locale = models.CharField(max_length=5, choices=SUPPORTED_LOCALES)
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True)
    body = models.TextField(blank=True)
    hero_image = models.ImageField(
        upload_to="page_hero_images/", 
        blank=True, 
        null=True, 
        help_text="Hero image for this page (recommended: 1200x600px)"
    )
    meta_title = models.CharField(max_length=60, blank=True, help_text="SEO meta title (recommended: 50-60 chars)")
    # ... rest of fields unchanged
```

### 3. Enhance Admin Interface with Image Preview

**In `cms/admin.py`**, add image preview functionality and update inline fields:

```python
from django.utils.safestring import mark_safe

class PageTranslationInline(admin.TabularInline):
    model = PageTranslation
    extra = 1
    min_num = 1
    fields = ("locale", "title", "subtitle", "body", "hero_image", "meta_title", "meta_description")
    show_change_link = True

@admin.register(PageTranslation)
class PageTranslationAdmin(admin.ModelAdmin):
    list_display = ("page_display", "locale", "title", "hero_image_preview", "is_page_published", "preview_link", "last_synced_at")
    readonly_fields = ("last_synced_at", "preview_link", "hero_image_preview")

    def hero_image_preview(self, obj):
        if obj.hero_image:
            return mark_safe(
                f'<img src="{obj.hero_image.url}" style="max-width: 100px; max-height: 60px; object-fit: cover; border-radius: 4px;" />'
            )
        return "—"
    hero_image_preview.short_description = "Hero Image"
```

### 4. Update API Serializers for Image URLs

**In `cms/serializers.py`**, add hero image serialization with absolute URLs:

```python
class PageTranslationSerializer(serializers.ModelSerializer):
    hero_image = serializers.SerializerMethodField()

    class Meta:
        model = PageTranslation
        fields = ("locale", "title", "subtitle", "body", "hero_image", "meta_title", "meta_description", "last_synced_at")

    def get_hero_image(self, obj):
        if obj.hero_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.hero_image.url)
            return obj.hero_image.url
        return None

class PageDetailSerializer(serializers.ModelSerializer):
    hero_image = serializers.SerializerMethodField()
    
    def get_hero_image(self, obj: Page) -> Optional[str]:
        translation = self._get_translation()
        if translation and translation.hero_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(translation.hero_image.url)
            return translation.hero_image.url
        return None
```

**In `cms/views.py`**, ensure request context is passed to serializers:

```python
serializer = PageDetailSerializer(
    page,
    context={
        "translation": translation,
        "requested_locale": locale,
        "request": request,  # Add this line
    },
)
```

### 5. Update Frontend TypeScript Types

**In `frontend/lib/api/pages.ts`**, add `hero_image` to type definitions:

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
  hero_image: string | null;          // Add this field
  meta_title: string | null;
  meta_description: string | null;
  translation_missing: boolean;
  translation?: {
    locale: string;
    title: string;
    subtitle: string;
    body: string;
    hero_image: string | null;        // Add this field
    meta_title: string;
    meta_description: string;
    last_synced_at: string;
  } | null;
};
```

### 6. Implement Hero Image Rendering in Next.js Pages

For each main page, add hero image sections with responsive design and proper fallback handling.

**Homepage (`frontend/app/HomePage.tsx`)**:
```tsx
import Image from "next/image";

export default function HomePage({ locale, destinations, messages, cmsHomepage }: HomePageProps) {
  // ... existing code

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Image Section */}
      {cmsHomepage?.hero_image && (
        <section className="relative h-64 w-full overflow-hidden md:h-80">
          <Image
            src={cmsHomepage.hero_image}
            alt={cmsTitle || "Hero image"}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        </section>
      )}
      
      {/* Rest of homepage content */}
    </div>
  );
}
```

**Secondary Pages** (about, contact, destinations, blog):
Each page follows the same pattern with appropriate styling adjustments:

```tsx
import Image from "next/image";

{/* Hero Image Section */}
{cmsPage?.hero_image && (
  <section className="relative h-64 w-full overflow-hidden">
    <Image
      src={cmsPage.hero_image}
      alt={title}
      fill
      className="object-cover"
      priority
    />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
  </section>
)}
```

### 7. Create and Apply Database Migration

Generate migration for the new `hero_image` field:

```bash
cd /d C:\projects\travelacrosseu
.venv\Scripts\python.exe manage.py makemigrations cms
```

Apply the migration:

```bash
.venv\Scripts\python.exe manage.py migrate
```

### 8. Configure Media Directory Permissions

Ensure the media directory has proper write permissions for image uploads:

```bash
cd /d C:\projects\travelacrosseu
mkdir media
mkdir media\\page_hero_images
```

## Commands

### Backend Development
```bash
cd /d C:\projects\travelacrosseu
.venv\Scripts\activate
```

### Install Image Processing Dependencies (if needed)
```bash
cd /d C:\projects\travelacrosseu
.venv\Scripts\pip.exe install Pillow
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
cd /d C:\projects\travelacrosseu\\frontend
npm run dev
```

### Check Django Configuration
```bash
cd /d C:\projects\travelacrosseu
.venv\Scripts\python.exe manage.py check
```

## What to Test

### Django Admin Image Upload
- `http://127.0.0.1:8000/admin/cms/pagetranslation/` — Upload hero images for different pages
- `http://127.0.0.1:8000/admin/cms/page/` — View pages with image preview thumbnails

### API Endpoints with Image URLs
- `http://127.0.0.1:8000/api/cms/pages/home/?locale=en` — Check hero_image URL in JSON response
- `http://127.0.0.1:8000/api/cms/pages/about/?locale=fr` — Verify image URLs are absolute
- `http://127.0.0.1:8000/api/cms/pages/destinations/?locale=nl` — Test different locale images

### Media File Serving
- `http://127.0.0.1:8000/media/page_hero_images/` — Direct media file access (if uploaded)

### Frontend Hero Image Display
- `http://localhost:3000/en` — Homepage with hero image rendering
- `http://localhost:3000/fr/about` — About page hero image with French content
- `http://localhost:3000/es/contact` — Contact page hero image display
- `http://localhost:3000/nl/destinations` — Destinations page with hero image
- `http://localhost:3000/pt/blog` — Blog page hero image integration

### Responsive Design Testing
- Test hero images on mobile devices and different screen sizes
- Verify image loading performance and optimization
- Check fallback behavior when images are missing

## Notes / Pitfalls

### Image Upload Best Practices
- Recommend 1200x600px dimensions for hero images (2:1 aspect ratio)
- Suggest JPEG format for photographs, PNG for graphics with transparency
- Keep file sizes under 500KB for optimal loading performance
- Use descriptive filenames for better organization and SEO

### Technical Implementation Details
- Images are stored per translation, allowing different hero images for different locales
- Next.js Image component automatically handles optimization and responsive loading
- The `priority` prop ensures hero images load immediately for better user experience
- Gradient overlays improve text readability when overlaid on images

### Content Strategy Considerations
- Hero images should complement the page content and match the brand aesthetic
- Consider cultural appropriateness when selecting images for different locales  
- Maintain consistent visual quality and style across all page hero images
- Plan for alt text that describes the image content for accessibility

### Development Environment Setup
- `Pillow` library required for Django ImageField processing
- Media directory must have write permissions for image uploads
- Development server automatically serves media files with the URL pattern added
- Production deployment will require proper media file serving configuration

### Performance and Optimization
- Next.js Image component provides automatic optimization and lazy loading
- Hero images use `priority` loading to prevent layout shift
- Consider implementing image resizing at upload time for consistent dimensions
- Monitor loading performance with tools like Lighthouse

### Admin Interface Usability
- Image preview thumbnails help editors quickly identify uploaded images
- Clear help text guides editors on recommended image dimensions
- The admin interface gracefully handles missing images with placeholder text
- Consider adding image editing capabilities or upload validation in future iterations

### Security Considerations
- Validate uploaded file types to prevent malicious uploads
- Implement file size limits to prevent abuse of storage resources
- Consider scanning uploaded images for potential security issues
- Ensure proper CORS configuration if images are served from different domains