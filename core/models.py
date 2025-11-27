import uuid

from django.db import models


class Country(models.Model):
    code = models.CharField(max_length=2, unique=True)
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.code})"


class City(models.Model):
    country = models.ForeignKey(
        Country,
        related_name="cities",
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=120)
    slug = models.SlugField()

    class Meta:
        unique_together = ("country", "slug")
        ordering = ["name"]

    def __str__(self):
        return f"{self.name}, {self.country.code}"


class Category(models.Model):
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=100)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class TravelPage(models.Model):
    LANGUAGE_CHOICES = [
        ("en", "English"),
        ("fr", "French"),
        ("nl", "Dutch"),
        ("es", "Spanish"),
        ("pt", "Portuguese"),
    ]

    group_id = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        db_index=True,
        help_text="Identifier shared by all language variants of the same logical destination.",
    )
    country = models.ForeignKey(
        Country,
        related_name="pages",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    city = models.ForeignKey(
        City,
        related_name="pages",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    category = models.ForeignKey(
        Category,
        related_name="pages",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    language = models.CharField(
        max_length=5,
        choices=LANGUAGE_CHOICES,
        default="en",
    )
    slug = models.SlugField()
    title = models.CharField(max_length=200)
    summary = models.TextField(blank=True)
    body = models.TextField(blank=True)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("language", "slug")
        ordering = ["-created_at"]

    def __str__(self):
        return f"[{self.language}] {self.title}"
