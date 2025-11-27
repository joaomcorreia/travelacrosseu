# PHASE 6 – STEP 8: Global SEO Controls — Metadata, Canonicals, OG Tags & Hreflang

## Goal

Implement comprehensive SEO controls across the entire Next.js frontend, driven by CMS metadata. The system generates proper Open Graph tags, canonical URLs, hreflang alternates, Twitter Cards, and structured metadata for all page types while maintaining locale-aware routing and translation detection.

## Prerequisites

- Phase 5: CMS structure with SEO fields (`meta_title`, `meta_description`, `hero_image`)
- Phase 6 Step 7: Language switcher with translation resolution API
- Next.js 14+ with app router and metadata API
- Working Django backend with CMS content available

## Files to Edit / Create

### New Files Created

- **`frontend/lib/seo.ts`** - Core SEO helper utility with metadata generation functions

### Modified Files

- **`frontend/app/[locale]/page.tsx`** - Home page with SEO metadata
- **`frontend/app/[locale]/about/page.tsx`** - About page with static SEO  
- **`frontend/app/[locale]/contact/page.tsx`** - Contact page with static SEO
- **`frontend/app/[locale]/blog/page.tsx`** - Blog index with category SEO
- **`frontend/app/[locale]/blog/[slug]/page.tsx`** - Individual blog posts
- **`frontend/app/[locale]/blog/category/[slug]/page.tsx`** - Blog categories
- **`frontend/app/[locale]/destinations/page.tsx`** - Destinations index
- **`frontend/app/[locale]/[pageSlug]/page.tsx`** - Dynamic CMS pages

## Step Instructions

### 1. Create SEO Helper Utility

The core SEO system provides:

```typescript
// Main SEO metadata builder
buildSeoMetadata(params: SeoParams): Metadata

// Specialized helper functions  
buildHomeMetadata(locale: Locale, cmsData?: CmsData): Metadata
buildStaticPageMetadata(locale: Locale, slug: string, cmsData?: CmsData): Metadata
buildBlogPostMetadata(locale: Locale, slug: string, cmsData?: CmsData): Metadata
buildBlogCategoryMetadata(locale: Locale, slug: string, cmsData?: CmsData): Metadata
buildDestinationMetadata(locale: Locale, countrySlug: string, citySlug?: string, attractionSlug?: string, cmsData?: CmsData): Metadata
```

**Key Features:**
- **CMS Integration**: Uses `meta_title`, `meta_description`, `hero_image` from CMS
- **Smart Fallbacks**: Falls back to `title`, extracted body content, then site defaults
- **Locale-Aware Branding**: Different site names per language
- **Complete Metadata**: Open Graph, Twitter Cards, canonical URLs, hreflang alternates
- **Type Safety**: Handles nullable CMS fields (`string | null`) properly

### 2. Home Page SEO Integration

```typescript
export async function generateMetadata({ params }: { params: LocalePageProps["params"] }): Promise<Metadata> {
  const { locale } = await resolveParams(params);
  const safeLocale = isSupportedLocale(locale) ? locale : "en";

  // Fetch CMS content for home page
  let cmsPage: CmsPagePayload | null = null;
  try {
    cmsPage = await fetchPage("home", safeLocale);
  } catch (error) {
    console.warn("Failed to fetch CMS page for SEO metadata:", error);
  }

  return buildHomeMetadata(safeLocale, cmsPage || undefined);
}
```

### 3. Static Pages SEO (About, Contact)

```typescript
export async function generateMetadata({ params }: { params: AboutPageProps["params"] }) {
  const { locale } = await resolveParams(params);
  const safeLocale = isSupportedLocale(locale) ? locale : "en";

  let cmsPage: CmsPagePayload | null = null;
  try {
    cmsPage = await fetchPage("about", safeLocale);
  } catch (error) {
    console.warn("Failed to fetch CMS about page for SEO metadata:", error);
  }

  return buildStaticPageMetadata(safeLocale, "about", cmsPage || undefined);
}
```

### 4. Blog SEO Implementation

**Blog Index:**
```typescript
const cmsData = {
  title: "Travel Blog - Stories, Tips & Guides",
  meta_title: "Travel Blog - Stories, Tips & Guides | TravelAcrossEU", 
  meta_description: "Discover inspiring travel stories, expert tips, and comprehensive guides for your European adventures. From hidden gems to cultural insights.",
  body: "Explore our collection of travel stories, practical tips, and destination guides for European adventures."
};

return buildSeoMetadata({
  locale: safeLocale,
  slug: 'blog',
  cmsData,
  contentType: 'static',
  pagePath: `/${safeLocale}/blog`
});
```

**Blog Posts:**
```typescript
let post: BlogPost | null = null;
try {
  post = await fetchBlogPost(slug, safeLocale);
} catch (error) {
  console.warn("Failed to fetch blog post for SEO metadata:", error);
}

return buildBlogPostMetadata(safeLocale, slug, post || undefined);
```

### 5. Dynamic CMS Pages SEO

```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, pageSlug } = await resolveParams(params);

  // Skip reserved slugs - let dedicated routes handle them
  if (RESERVED_SLUGS.includes(pageSlug)) {
    return {};
  }

  try {
    const page = await fetchPage(pageSlug, locale);
    
    if (!page) {
      return {};
    }

    return buildSeoMetadata({
      locale,
      slug: pageSlug,
      cmsData: page,
      contentType: 'page',
      pagePath: `/${locale}/${pageSlug}`
    });
  } catch (error) {
    console.error(`Failed to generate metadata for page ${pageSlug}:`, error);
    return {};
  }
}
```

## Commands

No terminal commands required - this is purely frontend metadata generation.

## What to Test

### Home Pages
- http://localhost:3000/en
- http://localhost:3000/fr  
- http://localhost:3000/nl
- http://localhost:3000/es
- http://localhost:3000/pt

### Static Pages
- http://localhost:3000/en/about
- http://localhost:3000/en/contact

### Blog Pages  
- http://localhost:3000/en/blog
- http://localhost:3000/en/blog/ultimate-packing-guide-europe
- http://localhost:3000/en/blog/category/travel-tips

### Destinations
- http://localhost:3000/en/destinations

### Generic CMS Pages
- http://localhost:3000/en/privacy
- http://localhost:3000/en/terms

### SEO Validation
View page source and verify presence of:

**Meta Tags:**
```html
<title>Page Title | TravelAcrossEU — Explore Europe</title>
<meta name="description" content="Page description extracted from CMS or fallback">
```

**Open Graph Tags:**
```html
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Page description">
<meta property="og:url" content="https://www.travelacrosseu.com/en/page-slug">
<meta property="og:image" content="https://www.travelacrosseu.com/hero-image.jpg">
<meta property="og:type" content="website">
<meta property="og:site_name" content="TravelAcrossEU">
```

**Twitter Cards:**
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Page Title">
<meta name="twitter:description" content="Page description">
<meta name="twitter:image" content="https://www.travelacrosseu.com/hero-image.jpg">
```

**Canonical & Hreflang:**
```html
<link rel="canonical" href="https://www.travelacrosseu.com/en/page-slug">
<link rel="alternate" hreflang="en" href="https://www.travelacrosseu.com/en/page-slug">
<link rel="alternate" hreflang="fr" href="https://www.travelacrosseu.com/fr/page-slug">
<link rel="alternate" hreflang="nl" href="https://www.travelacrosseu.com/nl/page-slug">
<link rel="alternate" hreflang="es" href="https://www.travelacrosseu.com/es/page-slug">
<link rel="alternate" hreflang="pt" href="https://www.travelacrosseu.com/pt/page-slug">
```

## SEO Metadata Examples

### Home Page (English)
```typescript
{
  title: "TravelAcrossEU — Explore Europe",
  description: "Travel guides, destinations, itineraries and tips across Europe.",
  openGraph: {
    title: "TravelAcrossEU — Explore Europe", 
    description: "Travel guides, destinations, itineraries and tips across Europe.",
    url: "https://www.travelacrosseu.com/en",
    siteName: "TravelAcrossEU",
    images: [{
      url: "https://www.travelacrosseu.com/hero-europe.jpg",
      width: 1200,
      height: 630,
      alt: "TravelAcrossEU — Explore Europe"
    }],
    locale: "en",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "TravelAcrossEU — Explore Europe",
    description: "Travel guides, destinations, itineraries and tips across Europe.",
    images: ["https://www.travelacrosseu.com/hero-europe.jpg"]
  },
  alternates: {
    canonical: "https://www.travelacrosseu.com/en",
    languages: {
      "en": "https://www.travelacrosseu.com/en",
      "fr": "https://www.travelacrosseu.com/fr",
      "nl": "https://www.travelacrosseu.com/nl",
      "es": "https://www.travelacrosseu.com/es",
      "pt": "https://www.travelacrosseu.com/pt"
    }
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
}
```

### Blog Post Example
```typescript
{
  title: "Ultimate Packing Guide for Europe | TravelAcrossEU — Explore Europe",
  description: "Learn essential packing tips for European travel. From weather considerations to cultural dress codes...",
  openGraph: {
    title: "Ultimate Packing Guide for Europe",
    description: "Learn essential packing tips for European travel. From weather considerations to cultural dress codes...",
    url: "https://www.travelacrosseu.com/en/blog/ultimate-packing-guide-europe",
    siteName: "TravelAcrossEU",
    images: [{
      url: "https://www.travelacrosseu.com/blog/packing-guide-hero.jpg",
      width: 1200,
      height: 630,
      alt: "Ultimate Packing Guide for Europe"
    }],
    locale: "en",
    type: "website"
  },
  alternates: {
    canonical: "https://www.travelacrosseu.com/en/blog/ultimate-packing-guide-europe",
    languages: {
      "en": "https://www.travelacrosseu.com/en/blog/ultimate-packing-guide-europe",
      "fr": "https://www.travelacrosseu.com/fr/blog/ultimate-packing-guide-europe",
      "nl": "https://www.travelacrosseu.com/nl/blog/ultimate-packing-guide-europe",
      "es": "https://www.travelacrosseu.com/es/blog/ultimate-packing-guide-europe",
      "pt": "https://www.travelacrosseu.com/pt/blog/ultimate-packing-guide-europe"
    }
  }
}
```

### Destination Page Example  
```typescript
{
  title: "Lisbon Travel Guide | TravelAcrossEU — Explore Europe",
  description: "Discover Lisbon's historic neighborhoods, famous trams, and vibrant food scene. Complete travel guide with tips...",
  openGraph: {
    title: "Lisbon Travel Guide",
    description: "Discover Lisbon's historic neighborhoods, famous trams, and vibrant food scene. Complete travel guide with tips...",
    url: "https://www.travelacrosseu.com/en/destinations/portugal/lisbon",
    siteName: "TravelAcrossEU", 
    images: [{
      url: "https://www.travelacrosseu.com/destinations/lisbon-hero.jpg",
      width: 1200,
      height: 630,
      alt: "Lisbon Travel Guide"
    }],
    locale: "en",
    type: "website"
  },
  alternates: {
    canonical: "https://www.travelacrosseu.com/en/destinations/portugal/lisbon",
    languages: {
      "en": "https://www.travelacrosseu.com/en/destinations/portugal/lisbon",
      "fr": "https://www.travelacrosseu.com/fr/destinations/portugal/lisbon", 
      "nl": "https://www.travelacrosseu.com/nl/destinations/portugal/lisbon",
      "es": "https://www.travelacrosseu.com/es/destinations/portugal/lisbon",
      "pt": "https://www.travelacrosseu.com/pt/destinations/portugal/lisbon"
    }
  }
}
```

## Notes / Pitfalls

### 🎯 **CMS Integration Best Practices**

**Always prioritize CMS metadata fields:**
1. `meta_title` → `title` → site default
2. `meta_description` → extracted body → site default  
3. `hero_slides[0].image` → `hero_image` → default OG image

**Handle null values properly:**
- CMS fields can be `null`, not just `undefined`
- Use null-safe checks: `field && field.trim()`
- Provide meaningful fallbacks for all content types

### 🔗 **Canonical URL Strategy**

**Always use absolute URLs:**
```typescript
canonical: "https://www.travelacrosseu.com/en/page-slug"
```

**Include locale in all canonical URLs:**
- Home: `https://www.travelacrosseu.com/en`
- Pages: `https://www.travelacrosseu.com/en/about`
- Blog: `https://www.travelacrosseu.com/en/blog/post-slug`
- Destinations: `https://www.travelacrosseu.com/en/destinations/country/city`

### 🌍 **Hreflang Implementation**

**Generate for all supported locales:**
- Include current locale in hreflang map
- Point to equivalent translated pages when available
- Fallback to homepage when translation missing

**URL structure consistency:**
```typescript
"en": "/en/about",
"fr": "/fr/about", 
"es": "/es/acerca",  // Use translated slug if available
"pt": "/pt/sobre"    // Use translated slug if available
```

### 🖼️ **Open Graph Images**

**Image URL handling:**
- Check if image URL is absolute (starts with `http`)
- Prepend site URL if relative: `${baseUrl}${imageUrl}`
- Always provide fallback: `/default-og.jpg`
- Validate image dimensions: 1200x630 recommended

### 📱 **Twitter Cards**

**Use `summary_large_image` for all pages:**
- Better engagement than standard summary
- Displays hero images prominently
- Consistent with Open Graph image strategy

### ⚡ **Performance Considerations**

**Metadata generation is synchronous:**
- Keep CMS API calls fast with proper caching
- Use `next: { revalidate: 60 }` for fetch requests
- Handle API failures gracefully with fallbacks
- Don't block page rendering on metadata generation

### 🔍 **SEO Testing Tools**

**Validate with browser dev tools:**
- Right-click → View Page Source
- Check `<head>` section for all meta tags
- Verify canonical and hreflang links are present

**Social media validation:**
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### 🏗️ **Development Workflow**

**Test metadata during development:**
1. Start Django backend: `python manage.py runserver`
2. Start Next.js frontend: `npm run dev`
3. Visit pages and view source to verify tags
4. Test with social media validators
5. Check Google Search Console for any issues

**Common debugging steps:**
- Verify CMS data is loading correctly
- Check for TypeScript errors in metadata generation
- Ensure all imports are correct
- Test fallback behavior when CMS data is missing

---

**Status**: ✅ **Complete and Production Ready**  
**Integration**: Works with all existing Phase 5 & 6 components  
**Next Steps**: Monitor search console and social sharing performance