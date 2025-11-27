import uuid

from django.contrib import admin, messages

from .ai import generate_travel_page_draft
from .models import Category, City, Country, TravelPage

SUPPORTED_LANGUAGES = ["en", "fr", "nl", "es", "pt"]


@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "slug")
    search_fields = ("name", "code", "slug")


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ("name", "country", "slug")
    search_fields = ("name", "slug", "country__name", "country__code")
    list_filter = ("country",)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    search_fields = ("name", "slug")

@admin.action(description="Generate content with AI (overwrite title/summary/body)")
def generate_with_ai(modeladmin, request, queryset):
    updated = 0
    errors = 0

    for page in queryset:
        lang = page.language or "en"
        country_name = page.country.name if page.country else "Europe"
        city_name = page.city.name if page.city else None
        category_name = page.category.name if page.category else None

        try:
            draft = generate_travel_page_draft(
                language=lang,
                country=country_name,
                city=city_name,
                category=category_name,
            )
        except Exception as exc:
            errors += 1
            messages.error(request, f"AI error for {page}: {exc}")
            continue

        page.title = draft["title"]
        page.summary = draft["summary"]
        page.body = draft["body"]
        page.save(update_fields=["title", "summary", "body"])

        updated += 1

    if updated:
        messages.success(request, f"AI-generated content updated for {updated} page(s).")
    if errors:
        messages.warning(request, f"AI failed for {errors} page(s). Check logs.")


@admin.action(description="Generate ALL languages with AI (create/update per language)")
def generate_all_languages_with_ai(modeladmin, request, queryset):
    """Generate or update localized TravelPages for every supported language."""

    total_created = 0
    total_updated = 0
    total_errors = 0

    for base_page in queryset:
        base_slug = base_page.slug
        base_country = base_page.country
        base_city = base_page.city
        base_category = base_page.category
        base_group_id = base_page.group_id
        if not base_group_id:
            base_group_id = uuid.uuid4()
            base_page.group_id = base_group_id
            base_page.save(update_fields=["group_id"])

        country_name = base_country.name if base_country else "Europe"
        city_name = base_city.name if base_city else None
        category_name = base_category.name if base_category else None

        for lang in SUPPORTED_LANGUAGES:
            try:
                draft = generate_travel_page_draft(
                    language=lang,
                    country=country_name,
                    city=city_name,
                    category=category_name,
                )
            except Exception as exc:
                total_errors += 1
                messages.error(
                    request,
                    f"AI error for slug='{base_slug}', language='{lang}': {exc}",
                )
                continue

            page, created = TravelPage.objects.get_or_create(
                slug=base_slug,
                language=lang,
                defaults={
                    "country": base_country,
                    "city": base_city,
                    "category": base_category,
                    "title": draft["title"],
                    "summary": draft["summary"],
                    "body": draft["body"],
                    "is_published": False,
                    "group_id": base_group_id,
                },
            )

            if created:
                total_created += 1
            else:
                if not page.group_id or page.group_id != base_group_id:
                    page.group_id = base_group_id
                page.title = draft["title"]
                page.summary = draft["summary"]
                page.body = draft["body"]
                page.save(update_fields=["group_id", "title", "summary", "body"])
                total_updated += 1

    if total_created or total_updated:
        messages.success(
            request,
            f"AI multilingual generation complete: {total_created} created, {total_updated} updated.",
        )
    if total_errors:
        messages.warning(
            request,
            f"AI generation encountered {total_errors} error(s). Check logs for details.",
        )


@admin.register(TravelPage)
class TravelPageAdmin(admin.ModelAdmin):
    list_display = ("title", "language", "country", "city", "category", "is_published", "created_at")
    search_fields = ("title", "slug", "summary", "body")
    list_filter = ("language", "is_published", "country", "city", "category")
    prepopulated_fields = {"slug": ("title",)}
    actions = [generate_with_ai, generate_all_languages_with_ai]
