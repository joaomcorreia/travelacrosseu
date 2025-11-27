from django.contrib import admin
from django.urls import path
from django.shortcuts import render, redirect
from django.contrib import messages
from django.db import transaction
from django.utils.html import format_html
from django.utils.safestring import mark_safe
import json

from cms.models import (
    Page, PageTranslation, PageSection, PageHeroSlide,
    Country, City, Destination, DestinationTranslation, DestinationSection, DestinationHeroSlide,
    BlogCategory, BlogPost, BlogPostTranslation, BlogPostSection, BlogPostHeroSlide,
    MediaFile, NavigationMenuItem, FooterBlock, FooterLink,
    HomepageCategory, HomepageCategoryTranslation
)
from cms.utils import get_frontend_url
from cms.admin_forms import JSONImportForm


class JsonImportAdminMixin:
    """
    Generic admin mixin that adds an 'Import from JSON' view for a model.
    Subclasses must implement `import_json_item(self, item_dict, request)` to handle each row.
    """
    
    def get_urls(self):
        """Add custom URL for JSON import"""
        urls = super().get_urls()
        custom_urls = [
            path(
                'import-json/',
                self.admin_site.admin_view(self.import_json_view),
                name=f'{self.opts.app_label}_{self.opts.model_name}_import_json'
            ),
        ]
        return custom_urls + urls
    
    def import_json_view(self, request):
        """Handle JSON file upload and import"""
        if request.method == 'POST':
            form = JSONImportForm(request.POST, request.FILES)
            if form.is_valid():
                return self._process_json_import(request, form)
        else:
            form = JSONImportForm()
        
        context = {
            'title': f'Import {self.opts.verbose_name_plural} from JSON',
            'form': form,
            'opts': self.opts,
            'has_view_permission': self.has_view_permission(request),
            'model_name': self.opts.model_name,
            'app_label': self.opts.app_label,
        }
        return render(request, 'admin/cms/json_import.html', context)
    
    def _process_json_import(self, request, form):
        """Process the uploaded JSON file and import data"""
        data = form.get_parsed_data()
        
        created_count = 0
        updated_count = 0
        skipped_count = 0
        errors = []
        
        try:
            with transaction.atomic():
                for i, item in enumerate(data, 1):
                    try:
                        result = self.import_json_item(item, request)
                        if result == 'created':
                            created_count += 1
                        elif result == 'updated':
                            updated_count += 1
                        elif result == 'skipped':
                            skipped_count += 1
                            
                    except Exception as e:
                        errors.append(f"Item {i}: {str(e)}")
                        skipped_count += 1
                        continue
                
                # Show results
                total_processed = created_count + updated_count + skipped_count
                
                if len(errors) == 0:
                    messages.success(
                        request,
                        f"✅ Import successful! Processed {total_processed} items. "
                        f"Created: {created_count}, Updated: {updated_count}, Skipped: {skipped_count}"
                    )
                else:
                    if created_count + updated_count > 0:
                        messages.warning(
                            request,
                            f"⚠️ Partial import completed. Processed {total_processed} items. "
                            f"Created: {created_count}, Updated: {updated_count}, Errors: {len(errors)}"
                        )
                    else:
                        messages.error(
                            request,
                            f"❌ Import failed. {len(errors)} errors occurred."
                        )
                    
                    # Show first few errors
                    for error in errors[:5]:
                        messages.error(request, error)
                    
                    if len(errors) > 5:
                        messages.error(request, f"... and {len(errors) - 5} more errors")
        
        except Exception as e:
            messages.error(request, f"❌ Import failed with database error: {str(e)}")
        
        # Redirect back to changelist
        return redirect(f'admin:{self.opts.app_label}_{self.opts.model_name}_changelist')
    
    def import_json_item(self, item, request):
        """Override this method in subclasses to handle model-specific import logic.
        Should return 'created', 'updated', or 'skipped'.
        """
        raise NotImplementedError("Subclasses must implement import_json_item method")


class PageSectionInline(admin.StackedInline):
    model = PageSection
    extra = 0
    fields = ("section_type", "order", "title", "body", "image", "cta_label", "cta_url")
    ordering = ("order",)


class PageHeroSlideInline(admin.TabularInline):
    model = PageHeroSlide
    extra = 0
    fields = ("image", "caption", "order")
    ordering = ("order",)


class PageTranslationInline(admin.TabularInline):
    model = PageTranslation
    extra = 1
    min_num = 1
    fields = ("locale", "title", "subtitle", "body", "hero_image", "meta_title", "meta_description")
    show_change_link = True


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ("slug", "page_type", "is_published", "translation_coverage", "updated_at", "dashboard_link")
    
    def dashboard_link(self, obj):
        """Link back to dashboard"""
        return format_html('<a href="/admin/dashboard/">← Dashboard</a>')
    dashboard_link.short_description = "Dashboard"
    list_filter = ("page_type", "is_published", "updated_at")
    search_fields = ("slug", "translations__title")
    prepopulated_fields = {"slug": ("page_type",)}
    inlines = [PageTranslationInline]
    ordering = ("slug",)
    readonly_fields = ("created_at", "updated_at")

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

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related("translations")


@admin.register(PageTranslation)
class PageTranslationAdmin(JsonImportAdminMixin, admin.ModelAdmin):
    list_display = ("page_display", "locale", "title", "sections_count", "hero_image_preview", "is_page_published", "preview_link", "last_synced_at")
    list_filter = ("locale", "page__is_published", "page__page_type")
    search_fields = ("page__slug", "title", "subtitle")
    autocomplete_fields = ("page",)
    ordering = ("page__slug", "locale")
    readonly_fields = ("last_synced_at", "preview_link", "hero_image_preview")
    inlines = [PageHeroSlideInline, PageSectionInline]
    change_list_template = "admin/cms/pagetranslation/change_list.html"

    def page_display(self, obj):
        return f"{obj.page.slug} ({obj.page.get_page_type_display()})"
    page_display.short_description = "Page"
    page_display.admin_order_field = "page__slug"

    def is_page_published(self, obj):
        return obj.page.is_published
    is_page_published.boolean = True
    is_page_published.short_description = "Published"
    is_page_published.admin_order_field = "page__is_published"

    def sections_count(self, obj):
        count = obj.sections.count()
        return f"{count} section{'s' if count != 1 else ''}"
    sections_count.short_description = "Sections"

    def hero_image_preview(self, obj):
        if obj.hero_image:
            return mark_safe(
                f'<img src="{obj.hero_image.url}" style="max-width: 100px; max-height: 60px; object-fit: cover; border-radius: 4px;" />'
            )
        return "—"
    hero_image_preview.short_description = "Hero Image"

    def preview_link(self, obj):
        if obj.page.is_published:
            url = get_frontend_url(obj.page.slug, obj.locale)
            return format_html(
                '<a href="{}" target="_blank" rel="noopener noreferrer">Preview</a>',
                url
            )
        return "—"
    preview_link.short_description = "Frontend Preview"

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("page").prefetch_related("sections")
    
    def import_json_item(self, item, request):
        """Import a single PageTranslation item from JSON"""
        page_slug = item.get('page_slug')
        locale = item.get('locale')
        
        if not page_slug or not locale:
            raise ValueError("Missing page_slug or locale")
        
        # Get or create Page
        page, page_created = Page.objects.get_or_create(
            slug=page_slug,
            defaults={'is_published': True}
        )
        
        # Get or create PageTranslation
        translation, translation_created = PageTranslation.objects.get_or_create(
            page=page,
            locale=locale,
            defaults={
                'title': item.get('title', page_slug.title()),
                'subtitle': item.get('subtitle', ''),
                'body': item.get('body', ''),
                'meta_title': item.get('meta_title', ''),
                'meta_description': item.get('meta_description', ''),
                'og_title': item.get('og_title'),
                'og_description': item.get('og_description'),
                'og_image': item.get('og_image'),
                'canonical_url': item.get('canonical_url'),
                'seo_enabled': item.get('seo_enabled', True),
                'jsonld_type': item.get('jsonld_type', ''),
                'jsonld_override': item.get('jsonld_override', ''),
            }
        )
        
        # Update fields if translation already existed
        if not translation_created:
            update_fields = []
            seo_fields = ['title', 'subtitle', 'body', 'meta_title', 'meta_description', 
                         'og_title', 'og_description', 'og_image', 'canonical_url', 
                         'seo_enabled', 'jsonld_type', 'jsonld_override']
            for field in seo_fields:
                if field in item:
                    setattr(translation, field, item[field])
                    update_fields.append(field)
            
            if update_fields:
                translation.save(update_fields=update_fields + ['last_synced_at'])
        
        return 'created' if translation_created else 'updated'


# Destination Admin Classes

class CityInline(admin.TabularInline):
    model = City
    extra = 0
    fields = ("name", "slug", "is_published", "order")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Country)
class CountryAdmin(JsonImportAdminMixin, admin.ModelAdmin):
    list_display = ("name", "slug", "cities_count", "is_published", "order", "updated_at")
    list_filter = ("is_published",)
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("order", "name")
    inlines = [CityInline]
    
    def changelist_view(self, request, extra_context=None):
        """Override changelist to add JSON import context"""
        extra_context = extra_context or {}
        extra_context.update({
            'has_json_import': True,
            'json_import_url': 'import-json/'
        })
        return super().changelist_view(request, extra_context)

    def cities_count(self, obj):
        count = obj.cities.count()
        return f"{count} cit{'ies' if count != 1 else 'y'}"
    cities_count.short_description = "Cities"
    
    def import_json_item(self, item, request):
        """Import a single Country item from JSON"""
        slug = item.get('slug')
        if not slug:
            raise ValueError("Missing required field 'slug'")
        
        country, created = Country.objects.update_or_create(
            slug=slug,
            defaults={
                'name': item.get('name', slug.title()),
                'short_description': item.get('short_description', ''),
                'hero_image': item.get('hero_image', ''),
                'meta_title': item.get('meta_title'),
                'meta_description': item.get('meta_description'),
                'og_title': item.get('og_title'),
                'og_description': item.get('og_description'),
                'og_image': item.get('og_image'),
                'canonical_url': item.get('canonical_url'),
                'seo_enabled': item.get('seo_enabled', True),
                'jsonld_type': item.get('jsonld_type', 'Country'),
                'jsonld_override': item.get('jsonld_override', ''),
                'is_published': item.get('is_published', True),
                'order': item.get('order', 0),
            }
        )
        
        return 'created' if created else 'updated'


class DestinationInline(admin.TabularInline):
    model = Destination
    extra = 0
    fields = ("slug", "is_published")
    prepopulated_fields = {"slug": ("slug",)}
    show_change_link = True


@admin.register(City)
class CityAdmin(JsonImportAdminMixin, admin.ModelAdmin):
    list_display = ("name", "country", "slug", "destinations_count", "is_published", "order", "updated_at")
    list_filter = ("country", "is_published")
    search_fields = ("name", "slug", "country__name")
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("country__name", "order", "name")
    inlines = [DestinationInline]

    def destinations_count(self, obj):
        count = obj.destinations.count()
        return f"{count} destination{'s' if count != 1 else ''}"
    destinations_count.short_description = "Destinations"
    
    def import_json_item(self, item, request):
        """Import a single City item from JSON"""
        slug = item.get('slug')
        country_slug = item.get('country_slug')
        
        if not slug or not country_slug:
            raise ValueError("Missing required fields 'slug' or 'country_slug'")
        
        try:
            country = Country.objects.get(slug=country_slug)
        except Country.DoesNotExist:
            raise ValueError(f"Country with slug '{country_slug}' does not exist")
        
        city, created = City.objects.update_or_create(
            slug=slug,
            defaults={
                'country': country,
                'name': item.get('name', slug.title()),
                'short_description': item.get('short_description', ''),
                'hero_image': item.get('hero_image', ''),
                'meta_title': item.get('meta_title'),
                'meta_description': item.get('meta_description'),
                'og_title': item.get('og_title'),
                'og_description': item.get('og_description'),
                'og_image': item.get('og_image'),
                'canonical_url': item.get('canonical_url'),
                'seo_enabled': item.get('seo_enabled', True),
                'jsonld_type': item.get('jsonld_type', 'City'),
                'jsonld_override': item.get('jsonld_override', ''),
                'is_published': item.get('is_published', True),
                'order': item.get('order', 0),
            }
        )
        
        return 'created' if created else 'updated'


class DestinationSectionInline(admin.StackedInline):
    model = DestinationSection
    extra = 0
    fields = ("section_type", "order", "title", "body", "image", "cta_label", "cta_url")
    ordering = ("order",)


class DestinationHeroSlideInline(admin.TabularInline):
    model = DestinationHeroSlide
    extra = 0
    fields = ("image", "caption", "order")
    ordering = ("order",)


class DestinationTranslationInline(admin.StackedInline):
    model = DestinationTranslation
    extra = 1
    min_num = 1
    fields = ("locale", "title", "subtitle", "body", "meta_title", "meta_description")
    show_change_link = True


@admin.register(Destination)
class DestinationAdmin(JsonImportAdminMixin, admin.ModelAdmin):
    list_display = ("slug", "city_display", "translations_count", "sections_count", "is_published", "updated_at")
    list_filter = ("city__country", "city", "is_published")
    search_fields = ("slug", "translations__title", "city__name", "city__country__name")
    ordering = ("city__country__name", "city__name", "slug")
    inlines = [DestinationTranslationInline]

    def city_display(self, obj):
        return f"{obj.city.name}, {obj.city.country.name}"
    city_display.short_description = "City, Country"
    city_display.admin_order_field = "city__name"

    def translations_count(self, obj):
        count = obj.translations.count()
        return f"{count} translation{'s' if count != 1 else ''}"
    translations_count.short_description = "Translations"

    def sections_count(self, obj):
        # Count sections across all translations
        total = sum(t.sections.count() for t in obj.translations.all())
        return f"{total} section{'s' if total != 1 else ''}"
    sections_count.short_description = "Sections"

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            "city__country"
        ).prefetch_related("translations__sections")
    
    def import_json_item(self, item, request):
        """Import a single Destination item from JSON"""
        slug = item.get('slug')
        city_slug = item.get('city_slug')
        
        if not slug or not city_slug:
            raise ValueError("Missing required fields 'slug' or 'city_slug'")
        
        # Optionally validate country_slug for extra safety
        country_slug = item.get('country_slug')
        if country_slug:
            try:
                city = City.objects.get(slug=city_slug, country__slug=country_slug)
            except City.DoesNotExist:
                raise ValueError(f"City '{city_slug}' in country '{country_slug}' does not exist")
        else:
            try:
                city = City.objects.get(slug=city_slug)
            except City.DoesNotExist:
                raise ValueError(f"City with slug '{city_slug}' does not exist")
        
        # Handle tags field
        tags = item.get('tags', [])
        if isinstance(tags, str):
            # If it's a string, treat it as comma-separated
            tags_str = tags
        elif isinstance(tags, list):
            # If it's a list, join with commas
            tags_str = ', '.join(tags)
        else:
            tags_str = ''
        
        destination, created = Destination.objects.update_or_create(
            slug=slug,
            defaults={
                'city': city,
                'tags': tags_str,
                'meta_title': item.get('meta_title'),
                'meta_description': item.get('meta_description'),
                'og_title': item.get('og_title'),
                'og_description': item.get('og_description'),
                'og_image': item.get('og_image'),
                'canonical_url': item.get('canonical_url'),
                'seo_enabled': item.get('seo_enabled', True),
                'jsonld_type': item.get('jsonld_type', 'TouristAttraction'),
                'jsonld_override': item.get('jsonld_override', ''),
                'is_featured': item.get('is_featured', False),
                'is_published': item.get('is_published', True),
                'hero_image': item.get('hero_image', ''),
            }
        )
        
        return 'created' if created else 'updated'


@admin.register(DestinationTranslation)
class DestinationTranslationAdmin(admin.ModelAdmin):
    list_display = ("destination_display", "locale", "title", "sections_count", "last_synced_at")
    list_filter = ("locale", "destination__city__country", "destination__is_published")
    search_fields = ("destination__slug", "title", "subtitle")
    ordering = ("destination__slug", "locale")
    inlines = [DestinationHeroSlideInline, DestinationSectionInline]

    def destination_display(self, obj):
        return f"{obj.destination.slug} ({obj.destination.city.name})"
    destination_display.short_description = "Destination"
    destination_display.admin_order_field = "destination__slug"

    def sections_count(self, obj):
        count = obj.sections.count()
        return f"{count} section{'s' if count != 1 else ''}"
    sections_count.short_description = "Sections"

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            "destination__city__country"
        ).prefetch_related("sections")


@admin.register(PageSection)
class PageSectionAdmin(admin.ModelAdmin):
    list_display = ("translation", "section_type", "order", "page_title", "page_locale")
    list_filter = ("section_type", "translation__locale", "translation__page__is_published")
    search_fields = ("translation__page__slug", "translation__title", "body")
    ordering = ("translation__page__slug", "translation__locale", "order")

    def page_title(self, obj):
        return obj.translation.title
    page_title.short_description = "Page Title"
    page_title.admin_order_field = "translation__title"

    def page_locale(self, obj):
        return obj.translation.locale.upper()
    page_locale.short_description = "Locale"
    page_locale.admin_order_field = "translation__locale"

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            "translation__page"
        )


@admin.register(DestinationSection)
class DestinationSectionAdmin(admin.ModelAdmin):
    list_display = ("translation", "section_type", "order", "destination_title", "destination_locale")
    list_filter = ("section_type", "translation__locale", "translation__destination__is_published")
    search_fields = ("translation__destination__slug", "translation__title", "body")
    ordering = ("translation__destination__slug", "translation__locale", "order")

    def destination_title(self, obj):
        return obj.translation.title
    destination_title.short_description = "Destination Title"
    destination_title.admin_order_field = "translation__title"

    def destination_locale(self, obj):
        return obj.translation.locale.upper()
    destination_locale.short_description = "Locale"
    destination_locale.admin_order_field = "translation__locale"

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            "translation__destination__city__country"
        )


# Blog Admin Classes

class BlogPostSectionInline(admin.StackedInline):
    model = BlogPostSection
    extra = 1
    fields = ("section_type", "order", "title", "body", "image", "cta_label", "cta_url")
    ordering = ("order",)


class BlogPostHeroSlideInline(admin.TabularInline):
    model = BlogPostHeroSlide
    extra = 0
    fields = ("image", "caption", "order")
    ordering = ("order",)


class BlogPostTranslationInline(admin.StackedInline):
    model = BlogPostTranslation
    extra = 0
    fields = ("locale", "title", "subtitle", "body", "hero_image", "meta_title", "meta_description")
    ordering = ("locale",)


@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_published", "order", "posts_count")
    list_filter = ("is_published",)
    search_fields = ("name", "slug")
    ordering = ("order", "name")
    prepopulated_fields = {"slug": ("name",)}

    def posts_count(self, obj):
        count = obj.posts.filter(is_published=True).count()
        return f"{count} post{'s' if count != 1 else ''}"
    posts_count.short_description = "Published Posts"


@admin.register(BlogPost)
class BlogPostAdmin(JsonImportAdminMixin, admin.ModelAdmin):
    list_display = ("slug", "category", "is_published", "translations_count", "created_at", "preview_link")
    list_filter = ("is_published", "category", "created_at")
    search_fields = ("slug", "category__name", "translations__title")
    ordering = ("-created_at",)
    prepopulated_fields = {"slug": ("category",)}
    inlines = [BlogPostTranslationInline]
    readonly_fields = ("created_at", "updated_at")

    def translations_count(self, obj):
        count = obj.translations.count()
        from cms.models import BlogPostTranslation
        supported_count = len(BlogPostTranslation._meta.get_field('locale').choices)
        return f"{count}/{supported_count} translations"
    translations_count.short_description = "Translations"

    def preview_link(self, obj):
        if obj.is_published and obj.translations.exists():
            # Use first available translation for preview
            translation = obj.translations.first()
            url = f"/en/blog/{obj.slug}"
            return format_html(
                '<a href="{}" target="_blank" rel="noopener noreferrer">Preview</a>',
                url
            )
        return "—"
    preview_link.short_description = "Frontend Preview"

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("category").prefetch_related("translations")
    
    def changelist_view(self, request, extra_context=None):
        """Override changelist to add JSON import context"""
        extra_context = extra_context or {}
        extra_context.update({
            'has_json_import': True,
            'json_import_url': 'import-json/'
        })
        return super().changelist_view(request, extra_context)
    
    def import_json_item(self, item, request):
        """Import a single BlogPost item from JSON"""
        slug = item.get('slug')
        category_slug = item.get('category_slug')
        
        if not slug:
            raise ValueError("Missing required field 'slug'")
        
        # Handle category lookup
        category = None
        if category_slug:
            try:
                category = BlogCategory.objects.get(slug=category_slug)
            except BlogCategory.DoesNotExist:
                raise ValueError(f"Blog category with slug '{category_slug}' does not exist")
        else:
            # Use the first available category as fallback
            category = BlogCategory.objects.first()
            if not category:
                raise ValueError("No blog categories available. Create at least one blog category first.")
        
        from django.utils import timezone
        import datetime
        
        # Handle published_at field
        published_at = item.get('published_at')
        if published_at:
            if isinstance(published_at, str):
                try:
                    from django.utils.dateparse import parse_datetime
                    published_at = parse_datetime(published_at)
                except:
                    published_at = timezone.now()
        else:
            published_at = timezone.now()
        
        blog_post, created = BlogPost.objects.update_or_create(
            slug=slug,
            defaults={
                'category': category,
                'hero_image': item.get('hero_image', ''),
                'meta_title': item.get('meta_title'),
                'meta_description': item.get('meta_description'),
                'og_title': item.get('og_title'),
                'og_description': item.get('og_description'),
                'og_image': item.get('og_image'),
                'canonical_url': item.get('canonical_url'),
                'seo_enabled': item.get('seo_enabled', True),
                'jsonld_type': item.get('jsonld_type', 'Article'),
                'jsonld_override': item.get('jsonld_override', ''),
                'is_published': item.get('is_published', True),
            }
        )
        
        # If locale is provided, also create/update the translation
        locale = item.get('locale')
        if locale:
            from cms.models import SUPPORTED_LOCALES
            supported_locales = [code for code, _ in SUPPORTED_LOCALES]
            if locale not in supported_locales:
                raise ValueError(f"Unsupported locale '{locale}'. Supported: {', '.join(supported_locales)}")
            
            BlogPostTranslation.objects.update_or_create(
                post=blog_post,
                locale=locale,
                defaults={
                    'title': item.get('title', slug.replace('-', ' ').title()),
                    'subtitle': item.get('subtitle', ''),
                    'body': item.get('body', ''),
                    'meta_title': item.get('meta_title', ''),
                    'meta_description': item.get('meta_description', ''),
                }
            )
        
        return 'created' if created else 'updated'


@admin.register(BlogPostTranslation)
class BlogPostTranslationAdmin(JsonImportAdminMixin, admin.ModelAdmin):
    list_display = ("post_display", "locale", "title", "sections_count", "category_name")
    list_filter = ("locale", "post__category", "post__is_published")
    search_fields = ("post__slug", "title", "subtitle")
    ordering = ("post__slug", "locale")
    inlines = [BlogPostHeroSlideInline, BlogPostSectionInline]
    readonly_fields = ("created_at", "updated_at")

    def post_display(self, obj):
        return f"{obj.post.slug}"
    post_display.short_description = "Blog Post"
    post_display.admin_order_field = "post__slug"

    def sections_count(self, obj):
        count = obj.sections.count()
        return f"{count} section{'s' if count != 1 else ''}"
    sections_count.short_description = "Sections"

    def category_name(self, obj):
        return obj.post.category.name
    category_name.short_description = "Category"
    category_name.admin_order_field = "post__category__name"

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            "post__category"
        ).prefetch_related("sections")

    def import_json_item(self, item, request):
        """Import a single BlogPostTranslation item from JSON"""
        slug = item.get('slug')
        locale = item.get('locale')
        category_slug = item.get('category_slug')
        
        if not slug or not locale:
            raise ValueError("Missing required fields 'slug' and 'locale'")
        
        # Handle category lookup
        category = None
        if category_slug:
            try:
                category = BlogCategory.objects.get(slug=category_slug)
            except BlogCategory.DoesNotExist:
                raise ValueError(f"Blog category with slug '{category_slug}' does not exist")
        else:
            # Use the first available category as fallback
            category = BlogCategory.objects.first()
            if not category:
                raise ValueError("No blog categories available. Create at least one blog category first.")
        
        # Get or create BlogPost
        blog_post, post_created = BlogPost.objects.get_or_create(
            slug=slug,
            defaults={
                'category': category,
                'hero_image': item.get('hero_image', ''),
                'meta_title': item.get('meta_title'),
                'meta_description': item.get('meta_description'),
                'og_title': item.get('og_title'),
                'og_description': item.get('og_description'),
                'og_image': item.get('og_image'),
                'canonical_url': item.get('canonical_url'),
                'seo_enabled': item.get('seo_enabled', True),
                'jsonld_type': item.get('jsonld_type', 'Article'),
                'jsonld_override': item.get('jsonld_override', ''),
                'is_published': item.get('is_published', True),
            }
        )
        
        # Validate locale
        from cms.models import SUPPORTED_LOCALES
        supported_locales = [code for code, _ in SUPPORTED_LOCALES]
        if locale not in supported_locales:
            raise ValueError(f"Unsupported locale '{locale}'. Supported: {', '.join(supported_locales)}")
        
        # Get or create BlogPostTranslation
        translation, translation_created = BlogPostTranslation.objects.get_or_create(
            post=blog_post,
            locale=locale,
            defaults={
                'title': item.get('title', slug.replace('-', ' ').title()),
                'subtitle': item.get('subtitle', ''),
                'body': item.get('body', ''),
                'meta_title': item.get('meta_title', ''),
                'meta_description': item.get('meta_description', ''),
            }
        )
        
        # Update fields if translation already existed
        if not translation_created:
            update_fields = []
            translation_fields = ['title', 'subtitle', 'body', 'meta_title', 'meta_description']
            for field in translation_fields:
                if field in item:
                    setattr(translation, field, item[field])
                    update_fields.append(field)
            
            if update_fields:
                translation.save(update_fields=update_fields + ['updated_at'])
        
        return 'created' if translation_created else 'updated'


@admin.register(BlogPostSection)
class BlogPostSectionAdmin(admin.ModelAdmin):
    list_display = ("translation", "section_type", "order", "post_title", "post_locale")
    list_filter = ("section_type", "translation__locale", "translation__post__is_published")
    search_fields = ("translation__post__slug", "translation__title", "body")
    ordering = ("translation__post__slug", "translation__locale", "order")

    def post_title(self, obj):
        return obj.translation.title
    post_title.short_description = "Post Title"
    post_title.admin_order_field = "translation__title"

    def post_locale(self, obj):
        return obj.translation.locale.upper()
    post_locale.short_description = "Locale"
    post_locale.admin_order_field = "translation__locale"

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            "translation__post__category"
        )


@admin.register(MediaFile)
class MediaFileAdmin(admin.ModelAdmin):
    """Admin interface for media file management."""
    list_display = ("thumbnail_preview", "name", "file_name", "get_file_size_display", "uploaded_at", "copy_url_action")
    list_filter = ("uploaded_at",)
    search_fields = ("name", "file")
    readonly_fields = ("uploaded_at", "file_size", "thumbnail_preview", "file_url")
    ordering = ("-uploaded_at",)
    
    fieldsets = (
        ("Media Information", {
            "fields": ("name", "file", "thumbnail_preview", "file_url")
        }),
        ("Metadata", {
            "fields": ("uploaded_at", "file_size"),
            "classes": ("collapse",)
        }),
    )
    
    def thumbnail_preview(self, obj):
        """Display thumbnail in admin list and form."""
        if obj.file:
            return format_html(
                '<img src="{}" style="max-width: 100px; max-height: 100px; border-radius: 4px;" />',
                obj.file.url
            )
        return "No image"
    thumbnail_preview.short_description = "Thumbnail"
    
    def file_name(self, obj):
        """Display original filename."""
        if obj.file:
            return obj.file.name.split('/')[-1]
        return "No file"
    file_name.short_description = "File Name"
    
    def file_url(self, obj):
        """Display full URL for copying."""
        if obj.file:
            return obj.file.url
        return "No URL"
    file_url.short_description = "File URL"
    
    def copy_url_action(self, obj):
        """Add copy URL button."""
        if obj.file:
            return format_html(
                '<button type="button" onclick="navigator.clipboard.writeText(\'{}\'); alert(\'URL copied!\')" '
                'style="background: #417690; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer;">'
                'Copy URL</button>',
                obj.file.url
            )
        return "No URL"
    copy_url_action.short_description = "Actions"
    
    def get_readonly_fields(self, request, obj=None):
        """Make thumbnail and URL readonly in edit form."""
        if obj:  # Editing existing object
            return self.readonly_fields + ("file",)
        return self.readonly_fields
    
    class Media:
        js = ("admin/js/media_file_admin.js",)
        css = {
            "all": ("admin/css/media_file_admin.css",)
        }


@admin.register(NavigationMenuItem)
class NavigationMenuItemAdmin(admin.ModelAdmin):
    """Admin interface for navigation menu items."""
    list_display = ("label", "locale", "link_type_display", "order", "is_active", "dashboard_link")
    list_filter = ("locale", "is_active")
    search_fields = ("label", "url")
    ordering = ("locale", "order", "label")
    
    fieldsets = (
        ("Menu Item Information", {
            "fields": ("locale", "label", "order", "is_active")
        }),
        ("Link Target", {
            "fields": ("url", "page", "destination", "blog_category"),
            "description": "Choose ONE linking option: external URL, CMS page, destination, or blog category."
        }),
    )
    
    def link_type_display(self, obj):
        """Display the link type in admin list."""
        return obj.get_link_type()
    link_type_display.short_description = "Links To"
    
    def dashboard_link(self, obj):
        """Link back to dashboard"""
        return format_html('<a href="/admin/dashboard/">← Dashboard</a>')
    dashboard_link.short_description = "Dashboard"
    
    def get_form(self, request, obj=None, **kwargs):
        """Add help text for linking rules."""
        form = super().get_form(request, obj, **kwargs)
        
        # Add help text for linking fields
        if 'url' in form.base_fields:
            form.base_fields['url'].help_text = "External URL (e.g., https://example.com) - leave blank if linking to CMS content"
        if 'page' in form.base_fields:
            form.base_fields['page'].help_text = "Link to a CMS page - leave blank if using external URL"
        if 'destination' in form.base_fields:
            form.base_fields['destination'].help_text = "Link to a destination - leave blank if using external URL"
        if 'blog_category' in form.base_fields:
            form.base_fields['blog_category'].help_text = "Link to a blog category - leave blank if using external URL"
            
        return form


class FooterLinkInline(admin.TabularInline):
    """Inline admin for footer links."""
    model = FooterLink
    extra = 1
    fields = ("label", "url", "order")
    ordering = ("order",)


@admin.register(FooterBlock)
class FooterBlockAdmin(admin.ModelAdmin):
    """Admin interface for footer blocks."""
    list_display = ("title", "locale", "link_count", "order", "dashboard_link")
    list_filter = ("locale",)
    search_fields = ("title", "body")
    ordering = ("locale", "order", "title")
    inlines = [FooterLinkInline]
    
    fieldsets = (
        ("Footer Block Information", {
            "fields": ("locale", "title", "body", "order")
        }),
    )
    
    def link_count(self, obj):
        """Display number of links in this footer block."""
        count = obj.links.count()
        return f"{count} link{'s' if count != 1 else ''}"
    link_count.short_description = "Links"
    
    def dashboard_link(self, obj):
        """Link back to dashboard"""
        return format_html('<a href="/admin/dashboard/">← Dashboard</a>')
    dashboard_link.short_description = "Dashboard"


@admin.register(FooterLink)
class FooterLinkAdmin(admin.ModelAdmin):
    """Admin interface for individual footer links."""
    list_display = ("label", "url", "block_title", "block_locale", "order")
    list_filter = ("block__locale",)
    search_fields = ("label", "url", "block__title")
    ordering = ("block__locale", "block__order", "order")
    
    def block_title(self, obj):
        """Display the parent footer block title."""
        return obj.block.title
    block_title.short_description = "Footer Block"
    
    def block_locale(self, obj):
        """Display the parent footer block locale."""
        return obj.block.locale.upper()
    block_locale.short_description = "Locale"


# Homepage Category Admin
class HomepageCategoryTranslationInline(admin.StackedInline):
    model = HomepageCategoryTranslation
    extra = 0
    min_num = 1
    fields = ("locale", "title", "description", "image", "is_published")
    ordering = ("locale",)


@admin.register(HomepageCategory)
class HomepageCategoryAdmin(JsonImportAdminMixin, admin.ModelAdmin):
    list_display = ("slug", "order", "is_active", "translation_coverage", "updated_at")
    list_filter = ("is_active", "updated_at")
    search_fields = ("slug", "translations__title")
    prepopulated_fields = {"slug": ()}
    inlines = [HomepageCategoryTranslationInline]
    ordering = ("order", "slug")
    readonly_fields = ("created_at", "updated_at")
    
    def translation_coverage(self, obj):
        """Show which locales have translations."""
        translations = obj.translations.filter(is_published=True)
        if not translations.exists():
            return format_html('<span style="color: red;">No translations</span>')
        
        locales = [t.locale.upper() for t in translations]
        return format_html('<span style="color: green;">{}</span>', " | ".join(locales))
    translation_coverage.short_description = "Published Translations"
    
    def save_model(self, request, obj, form, change):
        """Auto-generate slug if needed."""
        if not obj.slug and hasattr(form, 'cleaned_data'):
            # This will be handled by prepopulated_fields in practice
            pass
        super().save_model(request, obj, form, change)
    
    def import_json_item(self, item, request):
        """Import a single HomepageCategory item from JSON"""
        slug = item.get('slug')
        if not slug:
            raise ValueError("Missing required field 'slug'")
        
        category, created = HomepageCategory.objects.update_or_create(
            slug=slug,
            defaults={
                'order': item.get('order', 0),
                'meta_title': item.get('meta_title'),
                'meta_description': item.get('meta_description'),
                'og_title': item.get('og_title'),
                'og_description': item.get('og_description'),
                'og_image': item.get('og_image'),
                'canonical_url': item.get('canonical_url'),
                'seo_enabled': item.get('seo_enabled', True),
                'jsonld_type': item.get('jsonld_type', 'CategoryCode'),
                'jsonld_override': item.get('jsonld_override', ''),
                'is_active': item.get('is_active', True),
            }
        )
        
        # If locale is provided, also create/update the translation
        locale = item.get('locale')
        if locale:
            from cms.models import SUPPORTED_LOCALES
            supported_locales = [code for code, _ in SUPPORTED_LOCALES]
            if locale not in supported_locales:
                raise ValueError(f"Unsupported locale '{locale}'. Supported: {', '.join(supported_locales)}")
            
            HomepageCategoryTranslation.objects.update_or_create(
                category=category,
                locale=locale,
                defaults={
                    'title': item.get('title', slug.replace('-', ' ').title()),
                    'description': item.get('description', ''),
                    'image': item.get('image', ''),
                    'is_published': item.get('is_published', True),
                }
            )
        
        return 'created' if created else 'updated'


@admin.register(HomepageCategoryTranslation)
class HomepageCategoryTranslationAdmin(admin.ModelAdmin):
    list_display = ("category_slug", "locale", "title", "is_published", "image_preview", "updated_at")
    list_filter = ("locale", "is_published", "updated_at")
    search_fields = ("category__slug", "title")
    ordering = ("category__order", "locale")
    readonly_fields = ("created_at", "updated_at", "image_preview_large")
    
    def category_slug(self, obj):
        """Display the parent category slug."""
        return obj.category.slug
    category_slug.short_description = "Category"
    
    def image_preview(self, obj):
        """Show small image preview in list."""
        if obj.image:
            return format_html('<img src="{}" style="max-height: 40px; max-width: 60px; border-radius: 4px;" />', obj.image.url)
        return "No image"
    image_preview.short_description = "Image"
    
    def image_preview_large(self, obj):
        """Show larger image preview in detail view."""
        if obj.image:
            return format_html('<img src="{}" style="max-height: 200px; border-radius: 8px;" />', obj.image.url)
        return "No image uploaded"
    image_preview_large.short_description = "Image Preview"
