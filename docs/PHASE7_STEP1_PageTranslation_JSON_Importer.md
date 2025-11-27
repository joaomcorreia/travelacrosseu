# PHASE 7 – STEP 1 — PageTranslation JSON Importer

## Goal

Implement a JSON file uploader in the Django admin for `PageTranslation` to enable bulk creation and updates of page translations instead of manually filling form fields one by one.

This feature allows content managers to:
- Upload structured JSON files containing page translation data
- Bulk create multiple page translations across different locales
- Update existing translations with new content
- Maintain consistency across multilingual content

## JSON Format

The uploader expects a JSON file containing an array of page translation objects. Each object represents one page translation and can include the following fields:

### Required Fields
- `page_slug` (string): The slug identifier for the page (e.g., "home", "about", "contact")
- `locale` (string): The language code (must be one of: "en", "fr", "nl", "es", "pt")

### Optional Fields
- `title` (string): The page title for this locale
- `subtitle` (string): The page subtitle/tagline for this locale  
- `body` (string): The main content body for this locale
- `meta_title` (string): SEO meta title (recommended: 50-60 characters)
- `meta_description` (string): SEO meta description (recommended: 150-160 characters)

### Example JSON File

```json
[
  {
    "page_slug": "home",
    "locale": "en",
    "title": "Welcome to TravelAcross EU",
    "subtitle": "Your AI-powered travel companion for Europe",
    "body": "Discover the beauty and culture of Europe with our intelligent travel guides. From bustling cities to serene countryside, we help you plan the perfect European adventure.",
    "meta_title": "TravelAcross EU - AI Travel Guides for Europe",
    "meta_description": "Explore Europe with AI-powered travel guides, personalized recommendations, and comprehensive destination information across 5 languages."
  },
  {
    "page_slug": "home", 
    "locale": "fr",
    "title": "Bienvenue sur TravelAcross EU",
    "subtitle": "Votre compagnon de voyage IA pour l'Europe",
    "body": "Découvrez la beauté et la culture de l'Europe avec nos guides de voyage intelligents. Des villes animées à la campagne sereine, nous vous aidons à planifier l'aventure européenne parfaite.",
    "meta_title": "TravelAcross EU - Guides de Voyage IA pour l'Europe",
    "meta_description": "Explorez l'Europe avec des guides de voyage alimentés par l'IA, des recommandations personnalisées et des informations complètes sur les destinations en 5 langues."
  },
  {
    "page_slug": "about",
    "locale": "en", 
    "title": "About TravelAcross EU",
    "subtitle": "Revolutionizing European travel with AI",
    "body": "TravelAcross EU combines cutting-edge artificial intelligence with deep local knowledge to create personalized travel experiences across Europe.",
    "meta_title": "About TravelAcross EU - AI Travel Platform",
    "meta_description": "Learn about TravelAcross EU's mission to revolutionize European travel through AI-powered guides and personalized recommendations."
  }
]
```

## How to Use in Admin

### Step 1: Access the Import Feature
1. Navigate to the Django admin interface: `http://127.0.0.1:8000/admin/`
2. Go to **CMS** → **Page translations** 
3. On the Page translations changelist page, look for the **"Import from JSON"** button in the top-right toolbar
4. Click the **"Import from JSON"** button

### Step 2: Upload Your JSON File
1. On the import page, you'll see:
   - Format documentation and examples
   - A file upload field
   - Submit and Cancel buttons
2. Click **"Choose File"** and select your `.json` file
3. The system will validate:
   - File extension is `.json`
   - File size is under 5MB
   - JSON structure is valid
   - Required fields are present
   - Locale codes are supported

### Step 3: Review Import Results
After clicking **"Import JSON"**, the system will:
1. Process each item in the JSON array
2. Create or update `Page` records as needed
3. Create or update `PageTranslation` records
4. Display a summary with:
   - Total items processed
   - Number of translations created
   - Number of translations updated  
   - Any errors encountered

### Step 4: Verify Results
1. Return to the Page translations changelist
2. Use filters to view translations by locale
3. Check that your content was imported correctly
4. Use the **Preview** links to view pages on the frontend

## Import Behavior

### Page Creation
- If a page with the specified `page_slug` doesn't exist, it will be created automatically
- New pages are set to `is_published = True` by default
- Page type defaults to "custom"

### Translation Updates
- If a `PageTranslation` already exists for the `(page, locale)` combination, it will be updated
- Only fields provided in the JSON will be updated (partial updates supported)
- Missing optional fields are ignored (existing values preserved)
- The `last_synced_at` timestamp is automatically updated

### Transaction Safety
- The entire import runs within a database transaction
- If any critical error occurs, all changes are rolled back
- Individual item errors are logged but don't stop the import process

## Error Handling Notes

### Common Validation Errors
- **Invalid file format**: Only `.json` files are accepted
- **File too large**: Maximum 5MB file size limit
- **Invalid JSON syntax**: File must contain valid JSON
- **Wrong structure**: JSON must be an array of objects
- **Missing required fields**: Each item needs `page_slug` and `locale`
- **Unsupported locale**: Only en, fr, nl, es, pt are supported

### Import Process Errors
- **Database errors**: Connection issues, constraint violations
- **Permission errors**: Insufficient user permissions
- **Field validation errors**: Data doesn't meet model requirements

### Error Recovery
- Partial imports are supported - some items can succeed while others fail
- Error messages show which specific items failed and why
- Failed items can be fixed in the JSON and re-imported
- Successful items won't be duplicated on re-import

### Best Practices
1. **Test with small files first** to validate your JSON structure
2. **Use consistent naming** for page slugs across locales  
3. **Validate content length** - respect meta field character limits
4. **Keep backups** of your JSON files for future updates
5. **Review imports** in the admin interface after upload

## Technical Implementation

### Files Modified
- `cms/admin_forms.py` - JSONImportForm with validation
- `cms/admin.py` - PageTranslationAdmin with import functionality
- `templates/admin/cms/pagetranslation/change_list.html` - Import button
- `templates/admin/cms/pagetranslation/import_json.html` - Import form interface

### URL Pattern
- `/admin/cms/pagetranslation/import-json/` - JSON import interface

### Database Operations
- Atomic transactions ensure data consistency
- `get_or_create()` operations prevent duplicates
- Selective field updates preserve existing data

This feature streamlines multilingual content management and enables efficient bulk operations for maintaining consistent translations across the TravelAcross EU platform.