# PHASE 6 – STEP 11 — Homepage Categories CMS (Hero Category Cards)

**Transform static category cards into fully CMS-managed content with translations and images**

## Goal

Replace the static homepage category cards (City Breaks, Beaches, Nature, Food & Wine, etc.) with a fully CMS-managed system that allows editors to:

- Create and manage category cards from Django admin
- Add category images, titles, and descriptions
- Provide translations for all supported locales
- Control the display order and visibility of categories
- Link categories to destination pages with proper URL generation

This step builds upon the existing CMS infrastructure from Phase 5 and maintains consistency with the translation patterns used for pages, destinations, and blog content.

## Prerequisites

- Phase 5 CMS infrastructure completed
- Phase 6 Step 9 homepage enhancements implemented
- Django admin access configured
- Frontend development server running
- Understanding of the existing CMS translation model pattern

## Files to Edit / Create

### Backend Changes

**New Files:**
- `cms/migrations/0007_add_homepage_categories.py` (auto-generated)
- `create_sample_homepage_categories.py` (sample data script)

**Modified Files:**
- `cms/models.py` - Add HomepageCategory and HomepageCategoryTranslation models
- `cms/admin.py` - Add admin interfaces for category management
- `cms/serializers.py` - Add HomepageCategorySerializer for API responses
- `cms/views.py` - Add homepage_categories API endpoint
- `cms/urls.py` - Add URL pattern for homepage categories API

### Frontend Changes

**New Files:**
- `lib/api/homepage.ts` - Homepage categories API client and types

**Modified Files:**
- `components/home/CategoriesSection.tsx` - Accept categories as props instead of static data
- `app/HomePage.tsx` - Update props interface and pass categories to CategoriesSection
- `app/[locale]/page.tsx` - Fetch homepage categories and pass to HomePage component

## Step Instructions

### 1. Create Homepage Category Models

Add the following models to `cms/models.py`:

```python
class HomepageCategory(models.Model):
    slug = models.SlugField(max_length=150, unique=True, help_text="Unique identifier for this category")
    order = models.PositiveIntegerField(default=0, help_text="Display order on homepage")
    is_active = models.BooleanField(default=True, help_text="Whether this category is currently active")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "slug"]
        verbose_name = "Homepage Category"
        verbose_name_plural = "Homepage Categories"

    def __str__(self) -> str:
        return f"{self.slug} (order: {self.order})"


class HomepageCategoryTranslation(models.Model):
    category = models.ForeignKey(HomepageCategory, related_name="translations", on_delete=models.CASCADE)
    locale = models.CharField(max_length=5, choices=SUPPORTED_LOCALES)
    title = models.CharField(max_length=255, help_text="Display title for this category")
    description = models.TextField(blank=True, help_text="Brief description for the category card")
    image = models.ImageField(upload_to="homepage_categories/", help_text="Category card image (recommended: 800x600px)")
    is_published = models.BooleanField(default=True, help_text="Whether this translation is published")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("category", "locale")
        ordering = ["category__order", "locale"]
```

### 2. Setup Admin Interface

Add admin classes to `cms/admin.py`:

```python
# Import the new models
from cms.models import HomepageCategory, HomepageCategoryTranslation

# Add inline for translations
class HomepageCategoryTranslationInline(admin.StackedInline):
    model = HomepageCategoryTranslation
    extra = 0
    min_num = 1
    fields = ("locale", "title", "description", "image", "is_published")
    ordering = ("locale",)

# Main category admin
@admin.register(HomepageCategory)
class HomepageCategoryAdmin(admin.ModelAdmin):
    list_display = ("slug", "order", "is_active", "translation_coverage", "updated_at")
    list_filter = ("is_active", "updated_at")
    search_fields = ("slug", "translations__title")
    inlines = [HomepageCategoryTranslationInline]
    ordering = ("order", "slug")
```

### 3. Create API Endpoint

Add serializer to `cms/serializers.py`:

```python
class HomepageCategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = HomepageCategoryTranslation
        fields = ("slug", "title", "description", "image", "order")
        
    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
```

Add view to `cms/views.py`:

```python
@api_view(['GET'])
def homepage_categories(request: Request) -> Response:
    locale = request.GET.get('locale', FALLBACK_LOCALE)
    
    categories = HomepageCategoryTranslation.objects.filter(
        locale=locale,
        is_published=True,
        category__is_active=True
    ).select_related('category').order_by('category__order', 'category__slug')
    
    serializer = HomepageCategorySerializer(categories, many=True, context={'request': request})
    return Response(serializer.data)
```

Add URL to `cms/urls.py`:

```python
path("homepage-categories/", views.homepage_categories, name="cms-homepage-categories"),
```

### 4. Create Frontend Types and API Client

Create `lib/api/homepage.ts`:

```typescript
import type { Locale } from "@/lib/locales";

export type HomepageCategory = {
  slug: string;
  title: string;
  description: string;
  image: string;
  order: number;
};

export async function fetchHomepageCategories(locale: Locale): Promise<HomepageCategory[]> {
  const url = new URL(`${API_BASE}/api/cms/homepage-categories/`);
  url.searchParams.set("locale", locale);

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch homepage categories: ${response.statusText}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}
```

### 5. Update Homepage Components

Modify `components/home/CategoriesSection.tsx` to accept categories as props:

```typescript
interface CategoriesSectionProps {
  locale: Locale;
  categories: HomepageCategory[];
  className?: string;
}

export default function CategoriesSection({ locale, categories, className = "" }: CategoriesSectionProps) {
  if (!categories || categories.length === 0) {
    return null;
  }
  
  // Render categories from CMS instead of static data
  return (
    <section className={`py-16 bg-gradient-to-b from-slate-50 to-white ${className}`}>
      {/* ... existing JSX updated to use categories prop ... */}
    </section>
  );
}
```

Update `app/HomePage.tsx` to accept and pass categories:

```typescript
type HomePageProps = {
  locale: Locale;
  destinations: TravelPage[];
  messages: CommonDictionary["home"];
  cmsHomepage?: CmsPagePayload | null;
  categories?: HomepageCategory[];
};

export default function HomePage({ locale, destinations, messages, cmsHomepage, categories = [] }: HomePageProps) {
  return (
    <div>
      <CategoriesSection locale={preferredLocale} categories={categories} />
    </div>
  );
}
```

Update `app/[locale]/page.tsx` to fetch categories:

```typescript
import { fetchHomepageCategories, type HomepageCategory } from "@/lib/api/homepage";

export default async function LocalePage({ params }: LocalePageProps) {
  let homepageCategories: HomepageCategory[] = [];
  
  try {
    homepageCategories = await fetchHomepageCategories(locale);
  } catch (error) {
    console.error(`Failed to fetch homepage categories for /${locale}:`, error);
  }

  return (
    <HomePage
      locale={locale}
      destinations={destinations}
      messages={dictionary.home}
      cmsHomepage={homepageContent}
      categories={homepageCategories}
    />
  );
}
```

## Commands

```cmd
cd C:\projects\travelacrosseu

.\.venv\Scripts\python.exe manage.py makemigrations cms --name=add_homepage_categories

.\.venv\Scripts\python.exe manage.py migrate

.\.venv\Scripts\python.exe create_sample_homepage_categories.py
```

## What to Test

### Django Admin Interface
- http://127.0.0.1:8000/admin/cms/homepagecategory/
- http://127.0.0.1:8000/admin/cms/homepagecategorytranslation/

### API Endpoints
- http://127.0.0.1:8000/api/cms/homepage-categories/?locale=en
- http://127.0.0.1:8000/api/cms/homepage-categories/?locale=fr
- http://127.0.0.1:8000/api/cms/homepage-categories/?locale=es

### Homepage Integration
- http://localhost:3000/en
- http://localhost:3000/fr
- http://localhost:3000/es
- http://localhost:3000/it

### Admin Workflow Testing
1. Navigate to Django admin homepage categories section
2. Create a new category with slug "test-category"
3. Add translations for multiple locales with images
4. Set order and publish status
5. View API response to verify data structure
6. Check frontend homepage to see categories rendering

## Notes / Pitfalls

### Translation Management
- **Missing translations**: If a locale doesn't have a category translation, that category won't appear on the homepage for that locale. This is by design to prevent displaying untranslated content.
- **Image requirements**: Editors must upload images for each category translation. Consider providing default fallback images or validation to ensure all published translations have images.
- **Order consistency**: The `order` field is on the parent `HomepageCategory`, so all translations of a category will have the same display order across locales.

### Content Editor Guidelines
- **Image specifications**: Recommend 800x600px images for optimal display across devices
- **Description length**: Keep descriptions concise (under 100 characters) for consistent card layouts
- **Slug naming**: Use descriptive, URL-friendly slugs like "city-breaks", "beaches", "food-wine"

### URL Generation
- Categories currently link to `/destinations?category={slug}` for simplicity
- The destination listing page should be enhanced to handle category filtering
- Consider implementing dedicated category pages in future phases

### Performance Considerations
- **API caching**: Homepage categories are cached for 5 minutes via `next: { revalidate: 300 }`
- **Image optimization**: Next.js Image component handles responsive images and lazy loading
- **Fallback behavior**: Homepage gracefully handles empty categories array by hiding the section

### Development Workflow
- **Local media handling**: Uploaded images are stored in `media/homepage_categories/` directory
- **Static file serving**: Ensure Django is serving media files in development mode
- **Image URL generation**: API uses `request.build_absolute_uri()` for absolute image URLs

### Future Enhancements
- **Rich text descriptions**: Consider upgrading description field to rich text editor
- **Category landing pages**: Implement dedicated pages for each category
- **Advanced filtering**: Add support for multiple category tags per destination
- **Analytics integration**: Track category click-through rates for optimization

---

**Implementation Status:** ✅ Complete  
**Testing Status:** ⚠️ Requires Content  
**Documentation Status:** ✅ Complete  
**Integration Status:** ✅ CMS Ready

This implementation provides editors with full control over homepage category cards while maintaining the existing design and user experience. The CMS-driven approach enables content localization, A/B testing of categories, and seasonal content updates without code changes.