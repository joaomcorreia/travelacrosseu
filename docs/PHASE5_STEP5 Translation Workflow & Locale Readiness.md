# PHASE 5 – STEP 5 — Translation Workflow & Locale Readiness

## Goal

Make the translation system consistent and ready for real multi-language content. Ensure controlled locale choices, improve API behavior with clear fallback handling, and enhance Django admin visibility for translation coverage across all supported locales.

This step establishes a robust foundation for managing translations with a fixed set of locales (`en`, `fr`, `nl`, `es`, `pt`), consistent API responses including `translation_missing` flags, and admin tools that show editors exactly which pages need translations.

## Prerequisites

- **PHASE 5 – STEP 1** completed (CMS base models and structure)
- **PHASE 5 – STEP 2** completed (homepage CMS sync) 
- **PHASE 5 – STEP 3** completed (secondary pages CMS connection)
- **PHASE 5 – STEP 4** completed (admin usability and preview links)
- Django backend running on `http://127.0.0.1:8000`
- Next.js frontend configured with matching locale support
- CMS app with `Page` and `PageTranslation` models established

## Files to Edit / Create

### Backend Files
- **`cms/models.py`** — Add `SUPPORTED_LOCALES` constant and locale choices to `PageTranslation`
- **`cms/serializers.py`** — Add `requested_locale` field to API response
- **`cms/admin.py`** — Add translation coverage display in `PageAdmin`
- **`cms/views.py`** — Clean up redundant locale handling

### No Frontend Changes
- Frontend components remain unchanged in this step
- API contract improvements are backward-compatible
- Translation display enhancements come in future phases

## Step Instructions

### 1. Define Controlled Locale Choices

Add a constants definition for supported locales in the CMS models:

**In `cms/models.py`**, add after the imports:

```python
# Supported locales for the project
SUPPORTED_LOCALES = [
    ("en", "English"),
    ("fr", "Français"),
    ("nl", "Nederlands"),
    ("es", "Español"),
    ("pt", "Português"),
]
```

Update the `PageTranslation` model to use these choices:

```python
class PageTranslation(models.Model):
    page = models.ForeignKey(Page, related_name="translations", on_delete=models.CASCADE)
    locale = models.CharField(max_length=5, choices=SUPPORTED_LOCALES)
    title = models.CharField(max_length=255)
    # ... rest of fields unchanged
```

Update the validation method to use the constant:

```python
def clean(self) -> None:
    supported_locales = {code for code, _ in SUPPORTED_LOCALES}
    if self.locale not in supported_locales:
        raise ValidationError({"locale": "Locale must match supported site languages."})
```

### 2. Enhance API Response with Requested Locale

**In `cms/serializers.py`**, add `requested_locale` to the serializer fields and add the corresponding method:

```python
class PageDetailSerializer(serializers.ModelSerializer):
    # ... existing fields
    requested_locale = serializers.SerializerMethodField()

    class Meta:
        model = Page
        fields = (
            "slug",
            "page_type", 
            "is_published",
            "locale",
            "requested_locale",  # Add this
            "title",
            "subtitle", 
            "body",
            "meta_description",
            "translation_missing",
            "translation",
        )

    def get_requested_locale(self, obj: Page) -> Optional[str]:
        return self._get_requested_locale()
```

### 3. Add Translation Coverage Display in Admin

**In `cms/admin.py`**, replace the `translation_count` method with a comprehensive coverage display:

```python
@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ("slug", "page_type", "is_published", "translation_coverage", "updated_at")
    # ... other settings unchanged

    def translation_coverage(self, obj):
        from cms.models import SUPPORTED_LOCALES
        
        existing_locales = set(obj.translations.values_list("locale", flat=True))
        available_locales = [code for code, _ in SUPPORTED_LOCALES]
        
        coverage_parts = []
        for locale in available_locales:
            if locale in existing_locales:
                coverage_parts.append(f"<span style='color: green;'>{locale} ✓</span>")
            else:
                coverage_parts.append(f"<span style='color: #999;'>{locale} ✗</span>")
        
        coverage_html = " | ".join(coverage_parts)
        total_count = len(existing_locales)
        max_count = len(available_locales)
        
        return format_html(f"{coverage_html} <small>({total_count}/{max_count})</small>")
    
    translation_coverage.short_description = "Translation Coverage"
    translation_coverage.allow_tags = True
```

### 4. Clean Up API View

**In `cms/views.py`**, remove redundant `requested_locale` assignment since the serializer now handles it:

```python
# Remove these lines from page_detail view:
if translation is None:
    payload["translation"] = None
payload["requested_locale"] = locale

# Keep only:
return Response(payload)
```

### 5. Create Migration for Model Changes

Run the Django makemigrations command to create a migration for the locale choices:

```bash
cd /d C:\projects\travelacrosseu
.venv\Scripts\python.exe manage.py makemigrations cms
```

Apply the migration:

```bash
.venv\Scripts\python.exe manage.py migrate
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
cd /d C:\projects\travelacrosseu\frontend
npm run dev
```

### Check Django Configuration
```bash
cd /d C:\projects\travelacrosseu
.venv\Scripts\python.exe manage.py check
```

## What to Test

### Django Admin Interface
- `http://127.0.0.1:8000/admin/`
- `http://127.0.0.1:8000/admin/cms/page/` — Check translation coverage display
- `http://127.0.0.1:8000/admin/cms/pagetranslation/` — Verify locale choices dropdown

### API Endpoints with Locale Support
- `http://127.0.0.1:8000/api/cms/pages/home/?locale=en` — English version
- `http://127.0.0.1:8000/api/cms/pages/home/?locale=fr` — French fallback behavior
- `http://127.0.0.1:8000/api/cms/pages/about/?locale=nl` — Dutch translation test
- `http://127.0.0.1:8000/api/cms/pages/contact/?locale=es` — Spanish missing translation
- `http://127.0.0.1:8000/api/cms/pages/home/` — Default behavior without locale

### Frontend Pages (Should Work Unchanged)
- `http://localhost:3000/en` — English homepage
- `http://localhost:3000/fr` — French homepage  
- `http://localhost:3000/nl/about` — Dutch about page
- `http://localhost:3000/es/contact` — Spanish contact page
- `http://localhost:3000/pt` — Portuguese homepage

## Notes / Pitfalls

### Locale Synchronization
- The `SUPPORTED_LOCALES` constant in `cms/models.py` must stay in sync with Next.js `locales` configuration
- Both systems should support exactly the same locale codes: `en`, `fr`, `nl`, `es`, `pt`
- Any changes to supported locales require updates in both Django and Next.js

### Translation Coverage Expectations  
- Editors should aim to maintain translations for all 5 locales on main pages (home, about, contact)
- The admin coverage display helps identify gaps at a glance
- Missing translations for new or secondary content is normal during rollout

### Translation Missing Flag Behavior
- `translation_missing: true` indicates the requested locale wasn't available and fallback was used
- This is NOT an error condition — it's expected during content development
- Frontend can optionally show a subtle indicator when `translation_missing: true`
- The API will never return HTTP errors for missing translations — always provides fallback content

### Performance Considerations
- The translation coverage display uses `prefetch_related` to avoid N+1 queries
- Admin list pages remain performant even with coverage calculations
- API endpoints use efficient locale fallback logic without additional database hits

### Migration Safety
- Adding `choices` to the existing `locale` field is backward-compatible
- Existing data with valid locale codes will continue to work
- Invalid locale codes (if any) will be caught by model validation

### Frontend Integration
- No frontend changes needed in this step
- API response format is enhanced but backward-compatible
- Future steps can leverage `requested_locale` and `translation_missing` for better UX
- Consider showing translation status indicators in future design iterations