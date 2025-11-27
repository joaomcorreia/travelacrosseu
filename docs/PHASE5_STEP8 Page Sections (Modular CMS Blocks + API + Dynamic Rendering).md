# PHASE 5 – STEP 8 — Page Sections (Modular CMS Blocks + API + Dynamic Rendering)

## Goal

Transform pages into modular, block-based content systems powered by `PageSection` entries in the CMS. Enable editors to create flexible page layouts by adding, reordering, and customizing different section types (text blocks, image blocks, combined blocks, and call-to-action sections) through Django admin. Implement dynamic frontend rendering that automatically displays these sections using a component mapping system.

This establishes a foundation for rich, customizable page content that can be managed entirely through the CMS without requiring code changes for new layouts or content structures.

## Prerequisites

- **PHASE 5 – STEP 1** completed (CMS base models and structure)
- **PHASE 5 – STEP 2** completed (homepage CMS sync)
- **PHASE 5 – STEP 3** completed (secondary pages CMS connection)
- **PHASE 5 – STEP 4** completed (admin usability and preview links)
- **PHASE 5 – STEP 5** completed (translation workflow and locale readiness)
- **PHASE 5 – STEP 6** completed (SEO fields and metadata from CMS)
- **PHASE 5 – STEP 7** completed (page images with hero image support)
- Django backend with ImageField support for section images
- Next.js frontend with component-based architecture
- Content editors familiar with Django admin inline management

## Files to Edit / Create

### Backend Files
- **`cms/models.py`** — Add `PageSection` model with section types and ordering
- **`cms/admin.py`** — Add `PageSectionInline` for managing sections within page translations
- **`cms/serializers.py`** — Add `PageSectionSerializer` and integrate sections into page API
- **`cms/views.py`** — Update query optimization to prefetch sections for performance

### Frontend Files
- **`frontend/lib/api/pages.ts`** — Add `CmsSection` TypeScript type and update `CmsPagePayload`
- **`frontend/components/cms/SectionRenderer.tsx`** — Create main section rendering component with type switching
- **`frontend/app/HomePage.tsx`** — Add `SectionRenderer` import and integration
- **`frontend/app/[locale]/page.tsx`** — Add `SectionRenderer` import for homepage
- **`frontend/app/[locale]/about/page.tsx`** — Integrate section rendering in about page
- **`frontend/app/[locale]/contact/page.tsx`** — Integrate section rendering in contact page
- **`frontend/app/[locale]/destinations/page.tsx`** — Integrate section rendering in destinations page
- **`frontend/app/[locale]/blog/page.tsx`** — Integrate section rendering in blog page

## Step Instructions

### 1. Create PageSection Model for Modular Content

**In `cms/models.py`**, add the `PageSection` model after the `PageTranslation` model:

```python
class PageSection(models.Model):
    SECTION_TYPES = [
        ("text", "Text Block"),
        ("image", "Image Block"), 
        ("text_image", "Text + Image Block"),
        ("cta", "Call to Action"),
    ]

    translation = models.ForeignKey(PageTranslation, related_name="sections", on_delete=models.CASCADE)
    section_type = models.CharField(max_length=20, choices=SECTION_TYPES)
    order = models.PositiveIntegerField(default=0)

    title = models.CharField(max_length=255, blank=True, help_text="Section title (optional)")
    body = models.TextField(blank=True, help_text="Section content text")
    image = models.ImageField(upload_to="page_section_images/", blank=True, null=True, help_text="Section image (optional)")
    cta_label = models.CharField(max_length=255, blank=True, help_text="Call-to-action button text")
    cta_url = models.CharField(max_length=500, blank=True, help_text="Call-to-action URL or path")

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return f"{self.translation.page.slug} [{self.translation.locale}] - {self.get_section_type_display()} #{self.order}"
```

### 2. Configure Admin Interface for Section Management

**In `cms/admin.py`**, add section management capabilities:

```python
from cms.models import Page, PageTranslation, PageSection

class PageSectionInline(admin.StackedInline):
    model = PageSection
    extra = 0
    fields = ("section_type", "order", "title", "body", "image", "cta_label", "cta_url")
    ordering = ("order",)

@admin.register(PageTranslation)
class PageTranslationAdmin(admin.ModelAdmin):
    list_display = ("page_display", "locale", "title", "sections_count", "hero_image_preview", "is_page_published", "preview_link", "last_synced_at")
    inlines = [PageSectionInline]
    
    def sections_count(self, obj):
        count = obj.sections.count()
        return f"{count} section{'s' if count != 1 else ''}"
    sections_count.short_description = "Sections"

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("page").prefetch_related("sections")
```

### 3. Enhance API Serializers for Section Data

**In `cms/serializers.py`**, create section serializer and integrate with existing serializers:

```python
from cms.models import Page, PageTranslation, PageSection

class PageSectionSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = PageSection
        fields = ("id", "section_type", "order", "title", "body", "image", "cta_label", "cta_url")

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

class PageTranslationSerializer(serializers.ModelSerializer):
    sections = serializers.SerializerMethodField()
    
    def get_sections(self, obj):
        sections = obj.sections.all().order_by('order')
        return PageSectionSerializer(sections, many=True, context=self.context).data

class PageDetailSerializer(serializers.ModelSerializer):
    sections = serializers.SerializerMethodField()
    
    def get_sections(self, obj: Page) -> list:
        translation = self._get_translation()
        if translation:
            sections = translation.sections.all().order_by('order')
            return PageSectionSerializer(sections, many=True, context=self.context).data
        return []
```

### 4. Optimize API Performance with Prefetching

**In `cms/views.py`**, update the page query to prefetch sections:

```python
page = (
    Page.objects.filter(is_published=True, slug=slug)
    .prefetch_related(
        Prefetch(
            "translations", 
            queryset=PageTranslation.objects.prefetch_related("sections").order_by("locale")
        )
    )
    .get()
)
```

### 5. Create Frontend TypeScript Types for Sections

**In `frontend/lib/api/pages.ts`**, add section types and update page payload:

```typescript
export type CmsSection = {
  id: number;
  section_type: "text" | "image" | "text_image" | "cta";
  order: number;
  title: string;
  body: string;
  image: string | null;
  cta_label: string;
  cta_url: string;
};

export type CmsPagePayload = {
  // ... existing fields
  sections: CmsSection[];
  translation?: {
    // ... existing fields
    sections: CmsSection[];
    // ... rest unchanged
  } | null;
};
```

### 6. Build Dynamic Section Renderer Component

**Create `frontend/components/cms/SectionRenderer.tsx`** with component switching logic:

```tsx
import Image from "next/image";
import type { CmsSection } from "@/lib/api/pages";

type SectionRendererProps = {
  sections: CmsSection[];
};

export default function SectionRenderer({ sections }: SectionRendererProps) {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-12">
      {sections.map((section) => {
        switch (section.section_type) {
          case "text":
            return <TextSection key={section.id} section={section} />;
          case "image":
            return <ImageSection key={section.id} section={section} />;
          case "text_image":
            return <TextImageSection key={section.id} section={section} />;
          case "cta":
            return <CtaSection key={section.id} section={section} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

// Component implementations for each section type...
```

### 7. Integrate SectionRenderer into Page Components

For each main page, add the `SectionRenderer` component after hero images and before existing content:

**Homepage Integration**:
```tsx
import SectionRenderer from "@/components/cms/SectionRenderer";

{/* After existing homepage content */}
{cmsHomepage?.sections && cmsHomepage.sections.length > 0 && (
  <section className="mx-auto max-w-6xl px-4 md:px-8 lg:px-12">
    <SectionRenderer sections={cmsHomepage.sections} />
  </section>
)}
```

**Secondary Pages Integration** (about, contact, destinations, blog):
```tsx
import SectionRenderer from "@/components/cms/SectionRenderer";

{/* After hero image and before existing content */}
{cmsPage?.sections && cmsPage.sections.length > 0 && (
  <SectionRenderer sections={cmsPage.sections} />
)}
```

### 8. Create Database Migration and Test Setup

Generate migration for the new `PageSection` model:

```bash
cd /d C:\projects\travelacrosseu
.venv\Scripts\python.exe manage.py makemigrations cms
```

Apply the migration:

```bash
.venv\Scripts\python.exe manage.py migrate
```

Create section image directory:

```bash
mkdir media\\page_section_images
```

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
cd /d C:\projects\travelacrosseu\\frontend
npm run dev
```

### Check System Status
```bash
cd /d C:\projects\travelacrosseu
.venv\Scripts\python.exe manage.py check
```

## What to Test

### Django Admin Section Management
- `http://127.0.0.1:8000/admin/cms/pagetranslation/` — Create and manage page sections
- `http://127.0.0.1:8000/admin/cms/pagetranslation/1/change/` — Edit specific page with sections

### API Endpoints with Section Data
- `http://127.0.0.1:8000/api/cms/pages/home/?locale=en` — Check sections array in JSON response
- `http://127.0.0.1:8000/api/cms/pages/about/?locale=fr` — Verify section ordering and content
- `http://127.0.0.1:8000/api/cms/pages/destinations/?locale=nl` — Test different section types

### Frontend Dynamic Section Rendering
- `http://localhost:3000/en` — Homepage with rendered CMS sections
- `http://localhost:3000/fr/about` — About page with French sections
- `http://localhost:3000/es/contact` — Contact page with section blocks
- `http://localhost:3000/nl/destinations` — Destinations page with modular content
- `http://localhost:3000/pt/blog` — Blog page with section integration

### Section Type Rendering Validation
- Create test pages with different section combinations
- Verify text blocks render with proper typography
- Test image blocks with responsive layouts
- Validate text+image blocks with proper grid alignment
- Check CTA blocks with functional buttons and links

## Notes / Pitfalls

### Section Ordering and Management
- The `order` field allows flexible section reordering in admin interface
- Editors can drag sections or manually set order values for precise control
- Missing order values default to 0, which may cause unexpected grouping
- Consider using incremental values (10, 20, 30) to allow easy insertion between sections

### Content Requirements by Section Type
- **Text sections**: Only require `body` field, `title` is optional for headings
- **Image sections**: Require `image` field, other fields optional for captions
- **Text+Image sections**: Work best with both `title` and `body` for content balance
- **CTA sections**: Require `cta_label` and `cta_url` for functional buttons

### Performance and Scalability
- API prefetches sections to avoid N+1 query problems with multiple sections per page
- Frontend renders sections client-side for better interactivity and loading performance
- Large numbers of sections (20+) may impact page load times
- Consider pagination or lazy loading for pages with extensive section content

### Section Image Handling
- Section images use same media upload system as hero images
- Recommend consistent aspect ratios within section types for visual harmony
- Image optimization handled automatically by Next.js Image component
- Missing images gracefully degrade without breaking section layout

### Extensibility and Future Development
- New section types can be added by expanding `SECTION_TYPES` choices
- Component mapping in `SectionRenderer` makes adding new renderers straightforward
- Additional fields can be added to `PageSection` model as needed
- Consider implementing section templates or presets for common layouts

### Admin Interface Usability
- StackedInline provides better editing experience for rich content than TabularInline
- Section count display helps editors track content density per page
- Preview functionality works with sections automatically through existing page preview
- Consider adding section preview or validation warnings for incomplete sections

### Content Strategy Considerations
- Sections enable content experimentation without developer involvement
- Different section arrangements can be A/B tested through CMS
- Editorial teams can create page templates by copying successful section arrangements
- Section-based content works well with translation workflows across locales

### Frontend Integration Patterns
- Each page controls where sections render in relation to existing content
- Sections integrate seamlessly with existing page layouts and styling
- SectionRenderer component is reusable across all page types
- Consider implementing section-specific styling themes for brand consistency