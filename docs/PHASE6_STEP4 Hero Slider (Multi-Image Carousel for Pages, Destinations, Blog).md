# PHASE 6 – STEP 4 — Hero Slider (Multi-Image Carousel for Pages, Destinations, Blog)

## Goal

Implement support for **multi-image hero sliders** for all CMS-driven content types (Pages, Destinations, Blog posts). Allow editors to upload multiple hero images with captions and ordering, displayed as an interactive carousel on the frontend with automatic slideshow functionality and fallback to single images or legacy hero_image fields.

## Prerequisites

- ✅ CMS system implemented (Phase 5 complete)
- ✅ Page, Destination, and BlogPost models with translation system
- ✅ Admin interfaces for managing translations  
- ✅ API endpoints serving page content with serializers
- ✅ Frontend TypeScript types and API clients
- ✅ SectionRenderer component for CMS sections
- ✅ Next.js App Router with dynamic routing

## Files to Edit / Create

### Backend Changes

#### Models (`cms/models.py`)
- **Added**: `PageHeroSlide` model linked to `PageTranslation`
- **Added**: `DestinationHeroSlide` model linked to `DestinationTranslation`  
- **Added**: `BlogPostHeroSlide` model linked to `BlogPostTranslation`

#### Admin Interface (`cms/admin.py`)
- **Added**: `PageHeroSlideInline` tabular inline for PageTranslationAdmin
- **Added**: `DestinationHeroSlideInline` tabular inline for DestinationTranslationAdmin
- **Added**: `BlogPostHeroSlideInline` tabular inline for BlogPostTranslationAdmin
- **Updated**: Translation admin classes to include hero slide inlines

#### API Serializers (`cms/serializers.py`)
- **Added**: `PageHeroSlideSerializer` with absolute URL generation
- **Added**: `DestinationHeroSlideSerializer` with absolute URL generation
- **Added**: `BlogPostHeroSlideSerializer` with absolute URL generation
- **Updated**: All translation serializers to include `hero_slides` field
- **Updated**: Main serializers (PageDetailSerializer, DestinationSerializer, BlogPostSerializer) to expose hero_slides

### Frontend Changes

#### TypeScript Types
- **Updated**: `frontend/lib/api/pages.ts` - Added `CmsHeroSlide` type and `hero_slides` to `CmsPagePayload`
- **Updated**: `frontend/lib/api/destinations.ts` - Added `DestinationHeroSlide` type and updated interfaces
- **Updated**: `frontend/lib/api/blog.ts` - Added `BlogPostHeroSlide` type and updated interfaces

#### React Components
- **Created**: `frontend/components/cms/HeroSlider.tsx` - Responsive carousel component
- **Updated**: `frontend/app/[locale]/[pageSlug]/page.tsx` - Generic CMS page to use HeroSlider
- **Updated**: `frontend/app/HomePage.tsx` - Homepage to use HeroSlider for CMS content

#### Helper Scripts
- **Created**: `scripts/phase6_step4_migrate_hero_slides.cmd` - Database migration script

## Step Instructions

### 1. Database Models

**Added three new models to `cms/models.py`:**

Each hero slide model contains:
- `translation` - ForeignKey to respective translation model
- `image` - ImageField with upload path (recommended: 1920x800px)
- `caption` - Optional text overlay (CharField, max 255 chars)
- `order` - PositiveIntegerField for slide ordering

Models are automatically ordered by the `order` field, ensuring consistent display.

### 2. Admin Interface Enhancement

**Enhanced translation admin interfaces:**

- Hero slides appear as tabular inlines above sections
- Editors can upload multiple images, add captions, and set display order
- Simple drag-and-drop ordering via order field
- Integrated seamlessly into existing translation workflow

**Admin workflow:**
1. Edit any Page/Destination/BlogPost translation
2. Add hero slides via inline forms
3. Upload images, add optional captions
4. Set order numbers (0, 10, 20, etc.)
5. Save - slides appear immediately on frontend

### 3. API Enhancement

**Enhanced all CMS serializers:**

- Added `hero_slides` array to all translation serializers
- Includes full absolute URLs for images using `request.build_absolute_uri()`
- Maintains backward compatibility with existing `hero_image` field
- Proper ordering by slide order field

**API Response Structure:**
```json
{
  "hero_slides": [
    {
      "image": "http://127.0.0.1:8000/media/page_hero_slides/slide1.jpg",
      "caption": "Beautiful mountain landscape",
      "order": 0
    }
  ],
  "hero_image": "http://127.0.0.1:8000/media/fallback.jpg"
}
```

### 4. Frontend TypeScript Types

**Added consistent hero slide types:**

- `CmsHeroSlide` for pages
- `DestinationHeroSlide` for destinations  
- `BlogPostHeroSlide` for blog posts

All interfaces updated to include `hero_slides: SlideType[]` arrays while maintaining backward compatibility with existing `hero_image` fields.

### 5. HeroSlider React Component

**Created responsive carousel component with:**

**Features:**
- Automatic slideshow (5-second interval)
- Manual navigation with arrow buttons
- Dot indicators for slide selection
- Slide counter display
- Responsive design (height adjustable via props)
- Caption overlay support
- Smooth transitions and hover effects

**Fallback Logic:**
1. **Multiple slides** → Full carousel with navigation
2. **Single slide** → Static image display
3. **No slides but hero_image** → Use legacy hero_image
4. **No media** → Component returns null

**Props:**
- `slides` - Array of slide objects
- `fallbackImage` - Legacy hero_image for backward compatibility
- `height` - Tailwind height class (default: "h-96")
- `autoplay` - Enable/disable autoplay (default: true)
- `autoplayInterval` - Milliseconds between slides (default: 5000)

### 6. Page Integration

**Updated all page components to use HeroSlider:**

- **Generic CMS pages** - Use HeroSlider with fallback to hero_image
- **Homepage** - Integrated with CMS homepage content
- **Future-proof** - All existing pages automatically support multi-image heroes

**Integration pattern:**
```tsx
const hasHeroMedia = page.hero_slides.length > 0 || page.hero_image;

{hasHeroMedia && (
  <HeroSlider 
    slides={page.hero_slides} 
    fallbackImage={page.hero_image}
    height="h-96"
  />
)}
```

## Commands

Reference commands for setup and testing:

### Database Migration
```cmd
cd C:\projects\travelacrosseu
scripts\phase6_step4_migrate_hero_slides.cmd
```

### Backend Development
```cmd
cd C:\projects\travelacrosseu
.venv\Scripts\python.exe manage.py runserver
```

### Frontend Development  
```cmd
cd C:\projects\travelacrosseu\frontend
npm run dev
```

## What to Test

### Admin Interface
- `http://127.0.0.1:8000/admin/cms/pagetranslation/1/change/` - Page translation with hero slides
- `http://127.0.0.1:8000/admin/cms/destinationtranslation/1/change/` - Destination translation with hero slides  
- `http://127.0.0.1:8000/admin/cms/blogposttranslation/1/change/` - Blog post translation with hero slides

### API Endpoints
- `http://127.0.0.1:8000/api/cms/pages/home/?locale=en` - Homepage API with hero_slides array
- `http://127.0.0.1:8000/api/cms/destinations/lisbon/?locale=en` - Destination API with hero_slides
- `http://127.0.0.1:8000/api/cms/blog/ultimate-packing-guide/?locale=en` - Blog post API with hero_slides

### Frontend Pages
- `http://localhost:3000/en` - Homepage with hero carousel
- `http://localhost:3000/en/about` - About page with hero carousel
- `http://localhost:3000/en/destinations/lisbon` - Destination page with carousel
- `http://localhost:3000/en/blog/ultimate-packing-guide` - Blog post with carousel
- `http://localhost:3000/en/privacy` - Generic CMS page with carousel
- `http://localhost:3000/fr/privacy` - French translation with carousel

## Notes / Pitfalls

### Image Requirements
- **Recommended size**: 1920x800px for optimal display across devices
- **Aspect ratio**: 16:9 or 21:9 works best for hero sections
- **File formats**: JPG, PNG, WebP supported
- **File size**: Keep under 2MB per image for performance

### Performance Considerations
- Hero slides are loaded on demand with Next.js Image optimization
- Only first slide loads with `priority` flag
- Subsequent slides load as needed during carousel interaction
- Consider implementing lazy loading for pages with many slides

### Content Guidelines
- **Caption length**: Keep under 100 characters for best mobile display
- **Slide count**: 3-5 slides optimal for user engagement
- **Content relevance**: Ensure all slides relate to page content
- **Alt text**: Automatically generated from caption or page title

### Fallback Behavior
- **Legacy compatibility**: Existing `hero_image` fields continue to work
- **Graceful degradation**: If no slides or hero_image, layout adapts
- **Translation support**: Each translation can have different slide sets
- **Missing translations**: Falls back to default locale slides

### Admin Best Practices
- **Ordering**: Use increments of 10 (0, 10, 20) for easy reordering
- **Consistency**: Maintain similar caption style across slides
- **Quality**: Use high-resolution images for professional appearance
- **Testing**: Preview changes on frontend after adding slides

### Development Notes
- **TypeScript safety**: All interfaces strictly typed for slide data
- **Error handling**: Component gracefully handles missing images
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **SEO**: First slide image used for meta tags and social sharing

### Production Deployment
- **Media URL**: Update `remotePatterns` in `next.config.ts` for production domain
- **CDN**: Consider using CDN for hero slide images in production
- **Caching**: Next.js automatically optimizes and caches slide images
- **Monitoring**: Monitor carousel interaction metrics for optimization

## Summary

This implementation provides a complete multi-image hero slider system that:

✅ **Enhances Content Management** - Editors can create rich, engaging hero sections with multiple images and captions

✅ **Maintains Backward Compatibility** - All existing single hero_image fields continue to work seamlessly  

✅ **Delivers Superior UX** - Responsive, accessible carousel with smooth transitions and intuitive navigation

✅ **Scales Across Content Types** - Consistent implementation for Pages, Destinations, and Blog posts

✅ **Optimizes Performance** - Leverages Next.js Image optimization and lazy loading for fast page loads

✅ **Supports Internationalization** - Each translation can have unique slide sets for localized content

The hero slider system significantly enhances the visual appeal and engagement potential of all CMS-driven pages while maintaining the flexibility and ease of use that editors expect from a modern content management system.