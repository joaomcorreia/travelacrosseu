"""Management command for seeding demo travel content."""

from django.core.management.base import BaseCommand

from core.models import Category, City, Country, TravelPage


class Command(BaseCommand):
    """Seed demo countries, cities, categories, and travel pages."""

    help = (
        "Seed demo countries, cities, categories, and travel pages for TravelAcross EU"
    )

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("Seeding demo travel data..."))

        countries_by_code = {}
        for country in [
            {"code": "PT", "name": "Portugal", "slug": "portugal"},
            {"code": "FR", "name": "France", "slug": "france"},
            {"code": "NL", "name": "Netherlands", "slug": "netherlands"},
        ]:
            obj, _ = Country.objects.get_or_create(
                code=country["code"],
                defaults={"name": country["name"], "slug": country["slug"]},
            )
            countries_by_code[obj.code] = obj

        cities_by_slug = {}
        for city in [
            {"slug": "lisbon", "name": "Lisbon", "country": "PT"},
            {"slug": "paris", "name": "Paris", "country": "FR"},
            {"slug": "amsterdam", "name": "Amsterdam", "country": "NL"},
        ]:
            obj, _ = City.objects.get_or_create(
                country=countries_by_code[city["country"]],
                slug=city["slug"],
                defaults={"name": city["name"]},
            )
            cities_by_slug[obj.slug] = obj

        categories_by_slug = {}
        for category in [
            {"slug": "city-breaks", "name": "City Breaks"},
            {"slug": "coastal", "name": "Coastal & Seaside"},
        ]:
            obj, _ = Category.objects.get_or_create(
                slug=category["slug"],
                defaults={"name": category["name"]},
            )
            categories_by_slug[obj.slug] = obj

        pages_data = [
            {
                "slug": "lisbon-portugal-city-break",
                "title": "Lisbon City Break, Portugal",
                "summary": "Sunny viewpoints, trams, pastel de nata, and Atlantic sunsets.",
                "body": (
                    "Lisbon is a perfect long-weekend destination with historic neighborhoods "
                    "like Alfama and Bairro Alto, river views, and easy access to beaches."
                ),
                "country": countries_by_code["PT"],
                "city": cities_by_slug["lisbon"],
                "category": categories_by_slug["coastal"],
            },
            {
                "slug": "paris-france-city-break",
                "title": "Paris Getaway, France",
                "summary": "Cafés, museums, and landmarks like the Eiffel Tower and Louvre.",
                "body": (
                    "Paris combines world-class culture with everyday street life, from morning "
                    "croissants to evening walks along the Seine."
                ),
                "country": countries_by_code["FR"],
                "city": cities_by_slug["paris"],
                "category": categories_by_slug["city-breaks"],
            },
            {
                "slug": "amsterdam-netherlands-city-break",
                "title": "Amsterdam Weekend, Netherlands",
                "summary": "Canals, bikes, and cozy streets with a relaxed city pace.",
                "body": (
                    "Amsterdam is ideal for slow exploration by bike or boat, with charming "
                    "canals, museums, and neighborhoods to discover."
                ),
                "country": countries_by_code["NL"],
                "city": cities_by_slug["amsterdam"],
                "category": categories_by_slug["city-breaks"],
            },
        ]

        created_count = 0
        for data in pages_data:
            _, created = TravelPage.objects.get_or_create(
                language="en",
                slug=data["slug"],
                defaults={
                    "title": data["title"],
                    "summary": data["summary"],
                    "body": data["body"],
                    "is_published": True,
                    "country": data["country"],
                    "city": data["city"],
                    "category": data["category"],
                },
            )
            if created:
                created_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Demo travel data seeded. New pages created: {created_count}"
            )
        )
