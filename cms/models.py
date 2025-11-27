import os
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.text import slugify


# Supported locales for the project
SUPPORTED_LOCALES = [
    ("en", "English"),
    ("fr", "Français"),
    ("nl", "Nederlands"),
    ("es", "Español"),
    ("pt", "Português"),
]


class Page(models.Model):
    class PageType(models.TextChoices):
        HOME = "home", "Home"
        DESTINATIONS = "destinations", "Destinations"
        ABOUT = "about", "About"
        CONTACT = "contact", "Contact"
        BLOG = "blog", "Blog"
        CUSTOM = "custom", "Custom"

    slug = models.SlugField(max_length=150, unique=True)
    page_type = models.CharField(
        max_length=32,
        choices=PageType.choices,
        default=PageType.CUSTOM,
    )
    is_published = models.BooleanField(default=False)
    hero_image = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["slug"]

    def __str__(self) -> str:
        return f"{self.slug} ({self.get_page_type_display()})"


class PageTranslation(models.Model):
    page = models.ForeignKey(Page, related_name="translations", on_delete=models.CASCADE)
    locale = models.CharField(max_length=5, choices=SUPPORTED_LOCALES)
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True)
    body = models.TextField(blank=True)
    hero_image = models.ImageField(upload_to="page_hero_images/", blank=True, null=True, help_text="Hero image for this page (recommended: 1200x600px)")
    
    # SEO Fields
    meta_title = models.CharField(max_length=60, blank=True, help_text="SEO meta title (recommended: 50-60 chars)")
    meta_description = models.CharField(max_length=320, blank=True, help_text="SEO meta description (recommended: 150-160 chars)")
    og_title = models.CharField(max_length=60, blank=True, null=True, help_text="Open Graph title (optional, falls back to meta_title)")
    og_description = models.CharField(max_length=200, blank=True, null=True, help_text="Open Graph description (optional, falls back to meta_description)")
    og_image = models.URLField(blank=True, null=True, help_text="Open Graph image URL")
    canonical_url = models.URLField(blank=True, null=True, help_text="Canonical URL (optional)")
    seo_enabled = models.BooleanField(default=True, help_text="Enable SEO optimizations for this page")
    jsonld_type = models.CharField(max_length=100, blank=True, help_text="JSON-LD schema type (e.g., 'WebPage', 'Article')")
    jsonld_override = models.TextField(blank=True, help_text="Custom JSON-LD data (optional JSON override)")
    
    last_synced_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("page", "locale")
        ordering = ["page__slug", "locale"]

    def __str__(self) -> str:
        return f"{self.page.slug} [{self.locale}]"

    def clean(self) -> None:
        supported_locales = {code for code, _ in SUPPORTED_LOCALES}
        if self.locale not in supported_locales:
            raise ValidationError({"locale": "Locale must match supported site languages."})


class PageSection(models.Model):
    SECTION_TYPES = [
        ("text", "Text Block"),
        ("image", "Image Block"), 
        ("text_image", "Text + Image Block"),
        ("cta", "Call to Action"),
    ]

    translation = models.ForeignKey(PageTranslation, related_name="sections", on_delete=models.CASCADE)
    section_type = models.CharField(max_length=20, choices=SECTION_TYPES)
    order = models.PositiveIntegerField(default=0)

    title = models.CharField(max_length=255, blank=True, help_text="Section title (optional)")
    body = models.TextField(blank=True, help_text="Section content text")
    image = models.ImageField(upload_to="page_section_images/", blank=True, null=True, help_text="Section image (optional)")
    cta_label = models.CharField(max_length=255, blank=True, help_text="Call-to-action button text")
    cta_url = models.CharField(max_length=500, blank=True, help_text="Call-to-action URL or path")

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return f"{self.translation.page.slug} [{self.translation.locale}] - {self.get_section_type_display()} #{self.order}"


class Country(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=150, unique=True)
    short_description = models.TextField(blank=True, help_text="Brief description for listing pages")
    hero_image = models.ImageField(upload_to="country_hero_images/", blank=True, null=True)
    
    # SEO Fields
    meta_title = models.CharField(max_length=60, blank=True, null=True, help_text="SEO meta title (recommended: 50-60 chars)")
    meta_description = models.CharField(max_length=320, blank=True, null=True, help_text="SEO meta description (recommended: 150-160 chars)")
    og_title = models.CharField(max_length=60, blank=True, null=True, help_text="Open Graph title (optional, falls back to meta_title)")
    og_description = models.CharField(max_length=200, blank=True, null=True, help_text="Open Graph description (optional, falls back to meta_description)")
    og_image = models.URLField(blank=True, null=True, help_text="Open Graph image URL")
    canonical_url = models.URLField(blank=True, null=True, help_text="Canonical URL (optional)")
    seo_enabled = models.BooleanField(default=True, help_text="Enable SEO optimizations for this country")
    jsonld_type = models.CharField(max_length=100, blank=True, help_text="JSON-LD schema type (e.g., 'Country', 'Place')")
    jsonld_override = models.TextField(blank=True, help_text="Custom JSON-LD data (optional JSON override)")
    
    is_published = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "name"]
        verbose_name_plural = "Countries"

    def __str__(self) -> str:
        return self.name


class City(models.Model):
    country = models.ForeignKey(Country, related_name="cities", on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=150)
    short_description = models.TextField(blank=True, help_text="Brief description for listing pages")
    hero_image = models.ImageField(upload_to="city_hero_images/", blank=True, null=True)
    
    # SEO Fields
    meta_title = models.CharField(max_length=60, blank=True, null=True, help_text="SEO meta title (recommended: 50-60 chars)")
    meta_description = models.CharField(max_length=320, blank=True, null=True, help_text="SEO meta description (recommended: 150-160 chars)")
    og_title = models.CharField(max_length=60, blank=True, null=True, help_text="Open Graph title (optional, falls back to meta_title)")
    og_description = models.CharField(max_length=200, blank=True, null=True, help_text="Open Graph description (optional, falls back to meta_description)")
    og_image = models.URLField(blank=True, null=True, help_text="Open Graph image URL")
    canonical_url = models.URLField(blank=True, null=True, help_text="Canonical URL (optional)")
    seo_enabled = models.BooleanField(default=True, help_text="Enable SEO optimizations for this city")
    jsonld_type = models.CharField(max_length=100, blank=True, help_text="JSON-LD schema type (e.g., 'City', 'Place')")
    jsonld_override = models.TextField(blank=True, help_text="Custom JSON-LD data (optional JSON override)")
    
    is_published = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "name"]
        unique_together = ("country", "slug")
        verbose_name_plural = "Cities"

    def __str__(self) -> str:
        return f"{self.name}, {self.country.name}"


class Destination(models.Model):
    CATEGORY_CHOICES = [
        ('museum', 'Museum'),
        ('viewpoint', 'Viewpoint'),
        ('neighborhood', 'Neighborhood'),
        ('landmark', 'Landmark'),
        ('park', 'Park'),
        ('beach', 'Beach'),
        ('shopping', 'Shopping'),
        ('restaurant', 'Restaurant'),
        ('nightlife', 'Nightlife'),
        ('cultural', 'Cultural Site'),
        ('historical', 'Historical Site'),
        ('other', 'Other'),
    ]
    
    city = models.ForeignKey(City, related_name="destinations", on_delete=models.CASCADE)
    slug = models.SlugField(max_length=150)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other', help_text="Type of destination")
    tags = models.CharField(max_length=500, blank=True, help_text="Comma-separated tags for filtering (e.g., historical, museum, beach)")
    
    # SEO Fields
    meta_title = models.CharField(max_length=60, blank=True, null=True, help_text="SEO meta title (recommended: 50-60 chars)")
    meta_description = models.CharField(max_length=320, blank=True, null=True, help_text="SEO meta description (recommended: 150-160 chars)")
    og_title = models.CharField(max_length=60, blank=True, null=True, help_text="Open Graph title (optional, falls back to meta_title)")
    og_description = models.CharField(max_length=200, blank=True, null=True, help_text="Open Graph description (optional, falls back to meta_description)")
    og_image = models.URLField(blank=True, null=True, help_text="Open Graph image URL")
    canonical_url = models.URLField(blank=True, null=True, help_text="Canonical URL (optional)")
    seo_enabled = models.BooleanField(default=True, help_text="Enable SEO optimizations for this destination")
    jsonld_type = models.CharField(max_length=100, blank=True, help_text="JSON-LD schema type (e.g., 'TouristAttraction', 'Place')")
    jsonld_override = models.TextField(blank=True, help_text="Custom JSON-LD data (optional JSON override)")
    
    is_featured = models.BooleanField(default=False, help_text="Show in featured destinations")
    is_published = models.BooleanField(default=False)
    hero_image = models.ImageField(upload_to="destination_hero_images/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["slug"]
        unique_together = ("city", "slug")

    def __str__(self) -> str:
        return f"{self.slug} in {self.city.name}, {self.city.country.name}"


class DestinationTranslation(models.Model):
    destination = models.ForeignKey(Destination, related_name="translations", on_delete=models.CASCADE)
    locale = models.CharField(max_length=5, choices=SUPPORTED_LOCALES)
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True)
    short_description = models.CharField(max_length=200, blank=True, help_text="Brief description for listing pages")
    body = models.TextField(blank=True)
    meta_title = models.CharField(max_length=60, blank=True, help_text="SEO meta title (recommended: 50-60 chars)")
    meta_description = models.CharField(max_length=320, blank=True, help_text="SEO meta description (recommended: 150-160 chars)")
    last_synced_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("destination", "locale")
        ordering = ["destination__slug", "locale"]

    def __str__(self) -> str:
        return f"{self.destination.slug} [{self.locale}]"

    def clean(self) -> None:
        supported_locales = {code for code, _ in SUPPORTED_LOCALES}
        if self.locale not in supported_locales:
            raise ValidationError({"locale": "Locale must match supported site languages."})


class DestinationSection(models.Model):
    SECTION_TYPES = [
        ("text", "Text Block"),
        ("image", "Image Block"),
        ("text_image", "Text + Image Block"),
        ("cta", "Call to Action"),
    ]

    translation = models.ForeignKey(DestinationTranslation, related_name="sections", on_delete=models.CASCADE)
    section_type = models.CharField(max_length=20, choices=SECTION_TYPES)
    order = models.PositiveIntegerField(default=0)

    title = models.CharField(max_length=255, blank=True, help_text="Section title (optional)")
    body = models.TextField(blank=True, help_text="Section content text")
    image = models.ImageField(upload_to="destination_section_images/", blank=True, null=True, help_text="Section image (optional)")
    cta_label = models.CharField(max_length=255, blank=True, help_text="Call-to-action button text")
    cta_url = models.CharField(max_length=500, blank=True, help_text="Call-to-action URL or path")

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return f"{self.translation.destination.slug} [{self.translation.locale}] - {self.get_section_type_display()} #{self.order}"


class BlogCategory(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=150, unique=True)
    is_published = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "name"]
        verbose_name_plural = "Blog Categories"

    def __str__(self) -> str:
        return self.name


class BlogPost(models.Model):
    category = models.ForeignKey(BlogCategory, related_name="posts", on_delete=models.CASCADE)
    slug = models.SlugField(max_length=150, unique=True)
    hero_image = models.ImageField(upload_to="blog_hero_images/", blank=True, null=True)
    
    # SEO Fields
    meta_title = models.CharField(max_length=60, blank=True, null=True, help_text="SEO meta title (recommended: 50-60 chars)")
    meta_description = models.CharField(max_length=320, blank=True, null=True, help_text="SEO meta description (recommended: 150-160 chars)")
    og_title = models.CharField(max_length=60, blank=True, null=True, help_text="Open Graph title (optional, falls back to meta_title)")
    og_description = models.CharField(max_length=200, blank=True, null=True, help_text="Open Graph description (optional, falls back to meta_description)")
    og_image = models.URLField(blank=True, null=True, help_text="Open Graph image URL")
    canonical_url = models.URLField(blank=True, null=True, help_text="Canonical URL (optional)")
    seo_enabled = models.BooleanField(default=True, help_text="Enable SEO optimizations for this blog post")
    jsonld_type = models.CharField(max_length=100, blank=True, help_text="JSON-LD schema type (e.g., 'Article', 'BlogPosting')")
    jsonld_override = models.TextField(blank=True, help_text="Custom JSON-LD data (optional JSON override)")
    
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.slug} ({self.category.name})"


class BlogPostTranslation(models.Model):
    post = models.ForeignKey(BlogPost, related_name="translations", on_delete=models.CASCADE)
    locale = models.CharField(max_length=10, choices=SUPPORTED_LOCALES)
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=500, blank=True)
    body = models.TextField(blank=True)
    hero_image = models.ImageField(upload_to="blog_translation_images/", blank=True, null=True, help_text="Override post hero image for this locale")
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["locale"]
        unique_together = ("post", "locale")

    def __str__(self) -> str:
        return f"{self.post.slug} [{self.locale}] - {self.title}"

    def clean(self) -> None:
        supported_locales = {code for code, _ in SUPPORTED_LOCALES}
        if self.locale not in supported_locales:
            raise ValidationError({"locale": "Locale must match supported site languages."})


class BlogPostSection(models.Model):
    SECTION_TYPES = [
        ("text", "Text Block"),
        ("image", "Image Block"),
        ("text_image", "Text + Image Block"),
        ("cta", "Call to Action"),
    ]

    translation = models.ForeignKey(BlogPostTranslation, related_name="sections", on_delete=models.CASCADE)
    section_type = models.CharField(max_length=20, choices=SECTION_TYPES)
    order = models.PositiveIntegerField(default=0)

    title = models.CharField(max_length=255, blank=True, help_text="Section title (optional)")
    body = models.TextField(blank=True, help_text="Section content text")
    image = models.ImageField(upload_to="blog_section_images/", blank=True, null=True, help_text="Section image (optional)")
    cta_label = models.CharField(max_length=255, blank=True, help_text="Call-to-action button text")
    cta_url = models.CharField(max_length=500, blank=True, help_text="Call-to-action URL or path")

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return f"{self.translation.post.slug} [{self.translation.locale}] - {self.get_section_type_display()} #{self.order}"


# Hero Slide Models for Multi-Image Carousels

class PageHeroSlide(models.Model):
    translation = models.ForeignKey(PageTranslation, related_name="hero_slides", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="page_hero_slides/", help_text="Hero slide image (recommended: 1920x800px)")
    caption = models.CharField(max_length=255, blank=True, help_text="Optional caption text overlay")
    order = models.PositiveIntegerField(default=0, help_text="Display order (lower numbers first)")

    class Meta:
        ordering = ["order"]
        verbose_name = "Page Hero Slide"
        verbose_name_plural = "Page Hero Slides"

    def __str__(self) -> str:
        return f"{self.translation.page.slug} [{self.translation.locale}] - Slide #{self.order}"


class DestinationHeroSlide(models.Model):
    translation = models.ForeignKey(DestinationTranslation, related_name="hero_slides", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="destination_hero_slides/", help_text="Hero slide image (recommended: 1920x800px)")
    caption = models.CharField(max_length=255, blank=True, help_text="Optional caption text overlay")
    order = models.PositiveIntegerField(default=0, help_text="Display order (lower numbers first)")

    class Meta:
        ordering = ["order"]
        verbose_name = "Destination Hero Slide"
        verbose_name_plural = "Destination Hero Slides"

    def __str__(self) -> str:
        return f"{self.translation.destination.slug} [{self.translation.locale}] - Slide #{self.order}"


class BlogPostHeroSlide(models.Model):
    translation = models.ForeignKey(BlogPostTranslation, related_name="hero_slides", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="blog_hero_slides/", help_text="Hero slide image (recommended: 1920x800px)")
    caption = models.CharField(max_length=255, blank=True, help_text="Optional caption text overlay")
    order = models.PositiveIntegerField(default=0, help_text="Display order (lower numbers first)")

    class Meta:
        ordering = ["order"]
        verbose_name = "Blog Post Hero Slide"
        verbose_name_plural = "Blog Post Hero Slides"

    def __str__(self) -> str:
        return f"{self.translation.post.slug} [{self.translation.locale}] - Slide #{self.order}"


class MediaFile(models.Model):
    """Media file for reusable images across the CMS."""
    file = models.ImageField(upload_to="uploads/")
    name = models.CharField(max_length=255, blank=True, help_text="Display name for this media file")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    file_size = models.PositiveIntegerField(blank=True, null=True, help_text="File size in bytes")
    
    class Meta:
        ordering = ["-uploaded_at"]
        verbose_name = "Media File"
        verbose_name_plural = "Media Files"
    
    def save(self, *args, **kwargs):
        # Auto-fill name from filename if not provided
        if not self.name and self.file:
            filename = os.path.basename(self.file.name)
            name_without_ext = os.path.splitext(filename)[0]
            self.name = name_without_ext.replace('_', ' ').replace('-', ' ').title()
        
        # Store file size
        if self.file and hasattr(self.file, 'size'):
            self.file_size = self.file.size
            
        super().save(*args, **kwargs)
    
    def thumbnail(self):
        """Return the URL for thumbnail display."""
        return self.file.url if self.file else ""
    
    def get_file_size_display(self):
        """Return human-readable file size."""
        if not self.file_size:
            return "Unknown"
        
        size = self.file_size
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024:
                return f"{size:.1f} {unit}"
            size /= 1024
        return f"{size:.1f} TB"
    
    def __str__(self) -> str:
        return f"{self.name} ({self.get_file_size_display()})"


class NavigationMenuItem(models.Model):
    """Navigation menu item with locale-aware linking to CMS content or external URLs."""
    locale = models.CharField(max_length=5, choices=SUPPORTED_LOCALES)
    label = models.CharField(max_length=100, help_text="Display text for the menu item")
    
    # Linking options - only one should be set
    url = models.CharField(max_length=255, blank=True, help_text="External URL (e.g., https://example.com)")
    page = models.ForeignKey(Page, on_delete=models.CASCADE, blank=True, null=True, help_text="Link to a CMS page")
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, blank=True, null=True, help_text="Link to a destination")
    blog_category = models.ForeignKey(BlogCategory, on_delete=models.CASCADE, blank=True, null=True, help_text="Link to a blog category")
    
    order = models.PositiveIntegerField(default=0, help_text="Order in the navigation menu (lower numbers appear first)")
    is_active = models.BooleanField(default=True, help_text="Show this item in the navigation")
    
    class Meta:
        ordering = ["locale", "order", "label"]
        verbose_name = "Navigation Menu Item"
        verbose_name_plural = "Navigation Menu Items"
        
    def clean(self):
        """Validate that exactly one linking option is set."""
        link_fields = [self.url, self.page, self.destination, self.blog_category]
        set_fields = [field for field in link_fields if field]
        
        if len(set_fields) == 0:
            raise ValidationError("You must specify either a URL, page, destination, or blog category.")
        elif len(set_fields) > 1:
            raise ValidationError("You can only specify one linking option: URL, page, destination, or blog category.")
    
    def get_url(self):
        """Return the appropriate URL for this menu item."""
        if self.url:
            return self.url
        elif self.page:
            return f"/{self.locale}/{self.page.slug}/"
        elif self.destination:
            return f"/{self.locale}/destinations/{self.destination.slug}/"
        elif self.blog_category:
            return f"/{self.locale}/blog/category/{self.blog_category.slug}/"
        return "#"
    
    def get_link_type(self):
        """Return a human-readable description of the link type."""
        if self.url:
            return f"External: {self.url}"
        elif self.page:
            return f"Page: {self.page.slug}"
        elif self.destination:
            return f"Destination: {self.destination.slug}"
        elif self.blog_category:
            return f"Category: {self.blog_category.slug}"
        return "No link"
    
    def __str__(self) -> str:
        return f"{self.label} [{self.locale.upper()}] ({self.get_link_type()})"


class FooterBlock(models.Model):
    """Footer content block with locale support."""
    locale = models.CharField(max_length=5, choices=SUPPORTED_LOCALES)
    title = models.CharField(max_length=100, help_text="Footer section title")
    body = models.TextField(blank=True, help_text="Footer section content (optional)")
    order = models.PositiveIntegerField(default=0, help_text="Order in the footer (lower numbers appear first)")
    
    class Meta:
        ordering = ["locale", "order", "title"]
        verbose_name = "Footer Block"
        verbose_name_plural = "Footer Blocks"
        
    def __str__(self) -> str:
        return f"{self.title} [{self.locale.upper()}]"


class FooterLink(models.Model):
    """Links within a footer block."""
    block = models.ForeignKey(FooterBlock, related_name="links", on_delete=models.CASCADE)
    label = models.CharField(max_length=100, help_text="Link text")
    url = models.CharField(max_length=255, help_text="URL (can be relative or absolute)")
    order = models.PositiveIntegerField(default=0, help_text="Order within the footer block")
    
    class Meta:
        ordering = ["order", "label"]
        verbose_name = "Footer Link"
        verbose_name_plural = "Footer Links"
        
    def __str__(self) -> str:
        return f"{self.label} -> {self.url}"


class HomepageCategory(models.Model):
    slug = models.SlugField(max_length=150, unique=True, help_text="Unique identifier for this category (e.g., 'city-breaks', 'beaches')")
    order = models.PositiveIntegerField(default=0, help_text="Display order on homepage (lower numbers appear first)")
    
    # SEO Fields
    meta_title = models.CharField(max_length=60, blank=True, null=True, help_text="SEO meta title (recommended: 50-60 chars)")
    meta_description = models.CharField(max_length=320, blank=True, null=True, help_text="SEO meta description (recommended: 150-160 chars)")
    og_title = models.CharField(max_length=60, blank=True, null=True, help_text="Open Graph title (optional, falls back to meta_title)")
    og_description = models.CharField(max_length=200, blank=True, null=True, help_text="Open Graph description (optional, falls back to meta_description)")
    og_image = models.URLField(blank=True, null=True, help_text="Open Graph image URL")
    canonical_url = models.URLField(blank=True, null=True, help_text="Canonical URL (optional)")
    seo_enabled = models.BooleanField(default=True, help_text="Enable SEO optimizations for this category")
    jsonld_type = models.CharField(max_length=100, blank=True, help_text="JSON-LD schema type (e.g., 'CategoryCode', 'Thing')")
    jsonld_override = models.TextField(blank=True, help_text="Custom JSON-LD data (optional JSON override)")
    
    is_active = models.BooleanField(default=True, help_text="Whether this category is currently active")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "slug"]
        verbose_name = "Homepage Category"
        verbose_name_plural = "Homepage Categories"

    def __str__(self) -> str:
        return f"{self.slug} (order: {self.order})"


class HomepageCategoryTranslation(models.Model):
    category = models.ForeignKey(HomepageCategory, related_name="translations", on_delete=models.CASCADE)
    locale = models.CharField(max_length=5, choices=SUPPORTED_LOCALES)
    title = models.CharField(max_length=255, help_text="Display title for this category")
    description = models.TextField(blank=True, help_text="Brief description for the category card")
    image = models.ImageField(
        upload_to="homepage_categories/", 
        blank=True,
        null=True,
        help_text="Category card image (recommended: 800x600px)"
    )
    is_published = models.BooleanField(default=True, help_text="Whether this translation is published")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("category", "locale")
        ordering = ["category__order", "locale"]
        verbose_name = "Homepage Category Translation"
        verbose_name_plural = "Homepage Category Translations"

    def __str__(self) -> str:
        return f"{self.category.slug} [{self.locale}] - {self.title}"

    def clean(self) -> None:
        supported_locales = {code for code, _ in SUPPORTED_LOCALES}
        if self.locale not in supported_locales:
            raise ValidationError({"locale": "Locale must match supported site languages."})
