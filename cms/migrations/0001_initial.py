from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

  initial = True

  dependencies = [
    migrations.swappable_dependency(settings.AUTH_USER_MODEL),
  ]

  operations = [
    migrations.CreateModel(
      name="Page",
      fields=[
        ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
        ("slug", models.SlugField(max_length=150, unique=True)),
        (
          "page_type",
          models.CharField(
            choices=[
              ("home", "Home"),
              ("destinations", "Destinations"),
              ("about", "About"),
              ("contact", "Contact"),
              ("blog", "Blog"),
              ("custom", "Custom"),
            ],
            default="custom",
            max_length=32,
          ),
        ),
        ("is_published", models.BooleanField(default=False)),
        ("hero_image", models.URLField(blank=True)),
        ("created_at", models.DateTimeField(auto_now_add=True)),
        ("updated_at", models.DateTimeField(auto_now=True)),
      ],
      options={"ordering": ["slug"]},
    ),
    migrations.CreateModel(
      name="PageTranslation",
      fields=[
        ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
        ("locale", models.CharField(max_length=5)),
        ("title", models.CharField(max_length=255)),
        ("subtitle", models.CharField(blank=True, max_length=255)),
        ("body", models.TextField(blank=True)),
        ("meta_description", models.CharField(blank=True, max_length=320)),
        ("last_synced_at", models.DateTimeField(auto_now=True)),
        (
          "page",
          models.ForeignKey(
            on_delete=django.db.models.deletion.CASCADE,
            related_name="translations",
            to="cms.page",
          ),
        ),
      ],
      options={"ordering": ["page__slug", "locale"]},
    ),
    migrations.AlterUniqueTogether(name="pagetranslation", unique_together={("page", "locale")}),
  ]
