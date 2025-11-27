"""Management command to exercise the AI travel page helper."""

from django.core.management.base import BaseCommand

from core.ai import generate_travel_page_draft


class Command(BaseCommand):
    help = "Test the OpenAI-based travel page draft generator."

    def handle(self, *args, **options):
        draft = generate_travel_page_draft(
            language="en",
            country="Portugal",
            city="Lisbon",
            category="city break",
        )

        self.stdout.write(self.style.MIGRATE_HEADING("AI Travel Page Draft"))
        self.stdout.write(self.style.HTTP_INFO(f"Title: {draft['title']}"))
        self.stdout.write(self.style.HTTP_INFO(f"Summary: {draft['summary']}"))
        self.stdout.write("")
        self.stdout.write(draft["body"])
