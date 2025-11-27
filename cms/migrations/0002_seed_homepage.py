from django.db import migrations


HOME_SLUG = "home"


def seed_homepage(apps, schema_editor):
    Page = apps.get_model("cms", "Page")
    PageTranslation = apps.get_model("cms", "PageTranslation")

    page, created = Page.objects.get_or_create(
        slug=HOME_SLUG,
        defaults={
            "page_type": "home",
            "is_published": True,
        },
    )

    updated_fields = []
    if page.page_type != "home":
        page.page_type = "home"
        updated_fields.append("page_type")
    if not page.is_published:
        page.is_published = True
        updated_fields.append("is_published")
    if updated_fields:
        page.save(update_fields=updated_fields)

    PageTranslation.objects.update_or_create(
        page=page,
        locale="en",
        defaults={
            "title": "TravelAcross EU",
            "subtitle": "AI travel guides for every EU locale.",
            "body": "Customize this homepage hero copy in Django admin to localize the experience.",
            "meta_description": "Discover city breaks, coastal escapes, and cultural trips around the EU.",
        },
    )


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("cms", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_homepage, noop),
    ]
