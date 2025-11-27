# PHASE 7: Content & JSON Importers

## Overview

Phase 7 introduces comprehensive JSON import functionality across all major CMS models, enabling AI-driven bulk content creation and efficient content management. This phase builds upon the existing PageTranslation JSON importer by creating a reusable infrastructure that supports mass content seeding for the entire travel website.

**Goal:** Enable AI-driven bulk content via JSON importers for all main CMS entities, replacing manual content entry with efficient batch processing.

**Context:** This phase connects to Phase 6's destination listing system (countries → cities → destinations pages) by providing the tools to populate that structure with real content efficiently.

**Phase 8 Enhancement:** All importers now support comprehensive SEO fields (meta_title, meta_description, Open Graph, JSON-LD) for complete search engine optimization. See [PHASE8_SEO_AND_CONTENT_PIPELINE.md](PHASE8_SEO_AND_CONTENT_PIPELINE.md) for details.

## Affected Models

The following models now support JSON import functionality through Django admin:

1. **Country** - Base geographical entities
2. **City** - Cities within countries  
3. **Destination** - Travel destinations within cities
4. **HomepageCategory** - Homepage category tiles with translations
5. **BlogPost** - Blog posts with translations
6. **PageTranslation** - CMS page translations (enhanced from existing)

## Implementation Architecture

### JsonImportAdminMixin

A reusable Django admin mixin that provides generic JSON import functionality:

**Location:** `cms/admin.py`

**Key Features:**
- Generic URL routing (`/import-json/`)
- File validation (JSON format, 5MB limit)
- Batch processing with error handling
- Transaction safety with rollback on failures
- Detailed success/error reporting via Django messages
- Extensible design requiring only `import_json_item()` implementation

**Usage Pattern:**
```python
class ModelAdmin(JsonImportAdminMixin, admin.ModelAdmin):
    def import_json_item(self, item, request):
        # Model-specific import logic
        return 'created'|'updated'|'skipped'
```

## Model-Specific Import Schemas

**Note:** As of Phase 8, all importers support additional SEO fields (meta_title, meta_description, og_title, og_description, og_image, canonical_url, seo_enabled, jsonld_type, jsonld_override). These fields are optional and gracefully ignored if missing from JSON imports.

### 1. Country Importer

**Admin URL:** `/admin/cms/country/import-json/`

**Expected JSON Schema:**
```json
[
  {
    "slug": "portugal",
    "name": "Portugal",
    "short_description": "Sun-soaked beaches, historic cities, and affordable food.",
    "hero_image": "https://example.com/images/portugal-hero.jpg",
    "is_published": true,
    "order": 10
  }
]
```

**Required Fields:** `slug`  
**Optional Fields:** `name`, `short_description`, `hero_image`, `is_published`, `order`  
**Lookup Key:** `slug` (unique identifier for update-or-create)

### 2. City Importer

**Admin URL:** `/admin/cms/city/import-json/`

**Expected JSON Schema:**
```json
[
  {
    "country_slug": "portugal",
    "slug": "lisbon",
    "name": "Lisbon",
    "short_description": "Hilly streets, yellow trams, pastel houses, and Tagus River views.",
    "hero_image": "https://example.com/images/lisbon.jpg",
    "is_published": true,
    "order": 10
  }
]
```

**Required Fields:** `slug`, `country_slug`  
**Optional Fields:** `name`, `short_description`, `hero_image`, `is_published`, `order`  
**Foreign Key Lookup:** Country via `country_slug`  
**Lookup Key:** `slug` (unique identifier for update-or-create)

### 3. Destination Importer

**Admin URL:** `/admin/cms/destination/import-json/`

**Expected JSON Schema:**
```json
[
  {
    "country_slug": "portugal",
    "city_slug": "lisbon",
    "slug": "louvre-museum",
    "tags": ["Museum", "Art", "Architecture"],
    "is_featured": true,
    "is_published": true,
    "hero_image": "https://example.com/images/louvre.jpg"
  }
]
```

**Required Fields:** `slug`, `city_slug`  
**Optional Fields:** `country_slug`, `tags`, `is_featured`, `is_published`, `hero_image`  
**Foreign Key Lookup:** City via `city_slug` (with optional `country_slug` validation)  
**Special Handling:** `tags` field accepts both arrays and comma-separated strings  
**Lookup Key:** `slug` (unique identifier for update-or-create)

### 4. HomepageCategory Importer

**Admin URL:** `/admin/cms/homepagecategory/import-json/`

**Expected JSON Schema:**
```json
[
  {
    "slug": "city-breaks",
    "locale": "en",
    "title": "City Breaks",
    "description": "Short trips, big experiences.",
    "image": "https://example.com/images/city-breaks.jpg",
    "is_published": true,
    "order": 10
  }
]
```

**Required Fields:** `slug`  
**Optional Fields:** `locale`, `title`, `description`, `image`, `is_published`, `order`  
**Special Handling:** If `locale` is provided, creates/updates corresponding translation  
**Lookup Key:** `slug` (unique identifier for update-or-create)

### 5. BlogPost Importer

**Admin URL:** `/admin/cms/blogpost/import-json/`

**Expected JSON Schema:**
```json
[
  {
    "slug": "weekend-in-lisbon-for-couples",
    "locale": "en",
    "title": "A Perfect Weekend in Lisbon for Couples",
    "subtitle": "Plan a romantic 48 hours in Lisbon",
    "body": "<p>Full HTML body content...</p>",
    "meta_title": "Weekend in Lisbon for Couples – TravelAcross EU",
    "meta_description": "Discover how to spend a romantic weekend in Lisbon.",
    "category_slug": "city-breaks",
    "hero_image": "https://example.com/images/lisbon-couples.jpg",
    "is_published": true,
    "published_at": "2025-01-01T00:00:00Z"
  }
]
```

**Required Fields:** `slug`  
**Optional Fields:** `locale`, `title`, `subtitle`, `body`, `meta_title`, `meta_description`, `category_slug`, `hero_image`, `is_published`, `published_at`  
**Foreign Key Lookup:** BlogCategory via `category_slug` (falls back to first available category)  
**Special Handling:** If `locale` is provided, creates/updates corresponding translation  
**Lookup Key:** `slug` (unique identifier for update-or-create)

### 6. PageTranslation Importer (Enhanced)

**Admin URL:** `/admin/cms/pagetranslation/import-json/`

**Expected JSON Schema:**
```json
[
  {
    "page_slug": "home",
    "locale": "en",
    "title": "Welcome to TravelAcross EU",
    "subtitle": "Your AI-powered travel companion",
    "body": "Discover Europe with our intelligent travel guides...",
    "meta_title": "TravelAcross EU - AI Travel Guides",
    "meta_description": "Explore Europe with AI-powered travel guides."
  }
]
```

**Required Fields:** `page_slug`, `locale`  
**Optional Fields:** `title`, `subtitle`, `body`, `meta_title`, `meta_description`  
**Lookup Key:** `(page, locale)` combination (unique constraint)

## Testing Procedures

### File Upload Testing

1. **Access Import Interface:**
   - Navigate to any model's changelist in Django admin
   - Look for "Import from JSON" link or button
   - Alternative: Direct URL access via `/admin/cms/{model}/import-json/`

2. **File Validation Testing:**
   - Test with non-JSON files (should reject)
   - Test with files larger than 5MB (should reject)
   - Test with invalid JSON syntax (should show error)
   - Test with non-array JSON (should reject)

3. **Data Import Testing:**
   - Create minimal test JSON with 1-3 items using expected schema
   - Upload via admin interface
   - Verify objects created/updated in admin changelist
   - Test with intentionally broken items (missing required fields)
   - Verify error handling and partial import behavior

### Frontend Verification

After successful imports, verify results are visible on frontend:

**Countries/Cities:** Visit `/en/destinations/` to see country listings  
**Destinations:** Navigate to specific city pages for destination listings  
**Homepage Categories:** Check homepage for category tiles  
**Blog Posts:** Visit `/en/blog/` for blog listings  
**Page Translations:** Navigate to respective page URLs

## AI Usage Workflow

### Intended Workflow
1. **AI Generation:** Use AI tools to generate JSON files with content batches
2. **Admin Upload:** Operators upload JSON files via Django admin import interfaces
3. **Content Deployment:** Content immediately appears on frontend via existing API endpoints

### Advantages
- **Scale:** Process hundreds of destinations, cities, or blog posts in minutes
- **Consistency:** Ensure uniform data structure and quality
- **Multilingual:** Generate content in multiple locales simultaneously
- **Efficiency:** Eliminate manual typing and form submission overhead

### Best Practices
- **Start Small:** Test with 5-10 items before large batches
- **Validate Dependencies:** Ensure countries exist before importing cities
- **Backup First:** Always backup database before large imports
- **Monitor Errors:** Check Django messages for import warnings/errors
- **Verify Frontend:** Confirm imported content displays correctly

## Safety Features

### Transaction Safety
- All imports wrapped in database transactions
- Rollback on critical errors to maintain data integrity
- Partial imports allowed with error reporting

### Error Handling  
- Individual item failures don't crash entire import
- Detailed error messages with item numbers and reasons
- Maximum 5 errors shown in admin messages (prevents message overflow)

### Data Validation
- Required field validation per model
- Foreign key existence validation (countries, cities, categories)
- Locale support validation against SUPPORTED_LOCALES
- File size and format validation

### Idempotent Operations
- Re-importing same JSON updates existing records rather than creating duplicates
- Safe to re-run imports during development and testing
- Uses `update_or_create()` pattern with model-appropriate lookup keys

## Technical Notes

### Dependencies
- Existing `JSONImportForm` in `cms/admin_forms.py`
- Generic template at `templates/admin/cms/json_import.html`
- Django's transaction and messaging frameworks

### File Structure
```
cms/
├── admin.py              # JsonImportAdminMixin + all admin classes
├── admin_forms.py        # JSONImportForm (generic)
└── models.py            # All CMS models (unchanged)

templates/admin/cms/
├── json_import.html      # Generic import template
└── pagetranslation/
    └── import_json.html  # Legacy template (can be removed)
```

### URLs Generated
Each model admin automatically gets import URL:
- `/admin/cms/country/import-json/`
- `/admin/cms/city/import-json/`  
- `/admin/cms/destination/import-json/`
- `/admin/cms/homepagecategory/import-json/`
- `/admin/cms/blogpost/import-json/`
- `/admin/cms/pagetranslation/import-json/`

## Future Enhancements

### Possible Extensions
1. **Export Functionality:** Generate JSON from existing data for backup/migration
2. **Validation Previews:** Show import preview before committing changes
3. **Bulk Delete:** Remove multiple items via JSON file
4. **Media Import:** Handle image uploads alongside JSON data
5. **Scheduling:** Queue large imports for background processing

### API Integration
Consider exposing import functionality via REST API endpoints for:
- Automated CI/CD content deployment
- External tool integration
- Programmatic bulk operations

## Conclusion

Phase 7 transforms TravelAcross EU's content management from manual entry to AI-powered bulk operations. The reusable JSON import infrastructure supports the entire content pipeline, enabling rapid site population and efficient content updates while maintaining data integrity and user-friendly error handling.

This foundation enables future AI-assisted content workflows and positions the platform for scalable content operations across multiple languages and regions.