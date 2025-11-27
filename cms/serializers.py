from typing import Optional

from rest_framework import serializers

from cms.models import (
    Page, PageTranslation, PageSection, PageHeroSlide,
    Country, City, Destination, DestinationTranslation, DestinationSection, DestinationHeroSlide,
    BlogCategory, BlogPost, BlogPostTranslation, BlogPostSection, BlogPostHeroSlide,
    MediaFile, NavigationMenuItem, FooterBlock, FooterLink,
    HomepageCategory, HomepageCategoryTranslation
)


class PageSectionSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = PageSection
        fields = ("id", "section_type", "order", "title", "body", "image", "cta_label", "cta_url")

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class PageHeroSlideSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = PageHeroSlide
        fields = ("image", "caption", "order")

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class PageTranslationSerializer(serializers.ModelSerializer):
    hero_image = serializers.SerializerMethodField()
    hero_slides = serializers.SerializerMethodField()
    sections = serializers.SerializerMethodField()

    class Meta:
        model = PageTranslation
        fields = (
            "locale", "title", "subtitle", "body", "hero_image", "hero_slides", 
            "meta_title", "meta_description", "og_title", "og_description", "og_image", 
            "canonical_url", "seo_enabled", "jsonld_type", "jsonld_override", 
            "sections", "last_synced_at"
        )

    def get_sections(self, obj):
        sections = obj.sections.all().order_by('order')
        return PageSectionSerializer(sections, many=True, context=self.context).data

    def get_hero_slides(self, obj):
        slides = obj.hero_slides.all().order_by('order')
        return PageHeroSlideSerializer(slides, many=True, context=self.context).data

    def get_hero_image(self, obj):
        if obj.hero_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.hero_image.url)
            return obj.hero_image.url
        return None


class PageDetailSerializer(serializers.ModelSerializer):
    translation = serializers.SerializerMethodField()
    locale = serializers.SerializerMethodField()
    requested_locale = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()
    subtitle = serializers.SerializerMethodField()
    body = serializers.SerializerMethodField()
    hero_image = serializers.SerializerMethodField()
    hero_slides = serializers.SerializerMethodField()
    meta_title = serializers.SerializerMethodField()
    meta_description = serializers.SerializerMethodField()
    og_title = serializers.SerializerMethodField()
    og_description = serializers.SerializerMethodField()
    og_image = serializers.SerializerMethodField()
    canonical_url = serializers.SerializerMethodField()
    seo_enabled = serializers.SerializerMethodField()
    jsonld_type = serializers.SerializerMethodField()
    jsonld_override = serializers.SerializerMethodField()
    sections = serializers.SerializerMethodField()
    translation_missing = serializers.SerializerMethodField()

    class Meta:
        model = Page
        fields = (
            "slug",
            "page_type",
            "is_published",
            "locale",
            "requested_locale",
            "title",
            "subtitle",
            "body",
            "hero_image",
            "hero_slides",
            "meta_title",
            "meta_description",
            "og_title",
            "og_description", 
            "og_image",
            "canonical_url",
            "seo_enabled",
            "jsonld_type",
            "jsonld_override",
            "sections",
            "translation_missing",
            "translation",
        )

    def _get_translation(self) -> Optional[PageTranslation]:
        return self.context.get("translation")

    def _get_requested_locale(self) -> Optional[str]:
        return self.context.get("requested_locale")

    def get_translation(self, obj: Page):
        translation = self._get_translation()
        if translation is None:
            return None
        return PageTranslationSerializer(translation).data

    def get_locale(self, obj: Page) -> Optional[str]:
        translation = self._get_translation()
        return translation.locale if translation else None

    def get_requested_locale(self, obj: Page) -> Optional[str]:
        return self._get_requested_locale()

    def get_title(self, obj: Page) -> str:
        translation = self._get_translation()
        return translation.title if translation else ""

    def get_subtitle(self, obj: Page) -> str:
        translation = self._get_translation()
        return translation.subtitle if translation else ""

    def get_body(self, obj: Page) -> str:
        translation = self._get_translation()
        return translation.body if translation else ""

    def get_hero_image(self, obj: Page) -> Optional[str]:
        translation = self._get_translation()
        if translation and translation.hero_image:
            # hero_image is an ImageField, so it has a .url attribute
            if hasattr(translation.hero_image, 'url'):
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(translation.hero_image.url)
                return translation.hero_image.url
            else:
                # Fallback in case it's stored as a string
                return str(translation.hero_image)
        return None

    def get_meta_title(self, obj: Page) -> str:
        translation = self._get_translation()
        return translation.meta_title if translation else ""

    def get_hero_slides(self, obj: Page) -> list:
        translation = self._get_translation()
        if translation:
            slides = translation.hero_slides.all().order_by('order')
            return PageHeroSlideSerializer(slides, many=True, context=self.context).data
        return []

    def get_sections(self, obj: Page) -> list:
        translation = self._get_translation()
        if translation:
            sections = translation.sections.all().order_by('order')
            return PageSectionSerializer(sections, many=True, context=self.context).data
        return []

    def get_meta_description(self, obj: Page) -> str:
        translation = self._get_translation()
        return translation.meta_description if translation else ""

    def get_og_title(self, obj: Page) -> str:
        translation = self._get_translation()
        return translation.og_title if translation else ""

    def get_og_description(self, obj: Page) -> str:
        translation = self._get_translation()
        return translation.og_description if translation else ""

    def get_og_image(self, obj: Page) -> Optional[str]:
        translation = self._get_translation()
        if translation and translation.og_image:
            # og_image is a URLField, so it's already a string
            return str(translation.og_image)
        return None

    def get_canonical_url(self, obj: Page) -> str:
        translation = self._get_translation()
        return translation.canonical_url if translation else ""

    def get_seo_enabled(self, obj: Page) -> bool:
        translation = self._get_translation()
        return translation.seo_enabled if translation else False

    def get_jsonld_type(self, obj: Page) -> str:
        translation = self._get_translation()
        return translation.jsonld_type if translation else ""

    def get_jsonld_override(self, obj: Page) -> str:
        translation = self._get_translation()
        return translation.jsonld_override if translation else ""

    def get_translation_missing(self, obj: Page) -> bool:
        requested = self._get_requested_locale()
        translation = self._get_translation()
        if not requested:
            return translation is None
        return translation is None or translation.locale != requested


# Destination serializers
class DestinationSectionSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = DestinationSection
        fields = ("id", "section_type", "order", "title", "body", "image", "cta_label", "cta_url")

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class DestinationHeroSlideSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = DestinationHeroSlide
        fields = ("image", "caption", "order")

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class CountrySerializer(serializers.ModelSerializer):
    hero_image = serializers.SerializerMethodField()
    cities_count = serializers.SerializerMethodField()
    destinations_count = serializers.IntegerField(read_only=True)
    stories_count = serializers.IntegerField(read_only=True)
    has_content = serializers.SerializerMethodField()

    class Meta:
        model = Country
        fields = (
            "id", "name", "slug", "short_description", "hero_image", "is_published", "order", "cities_count",
            "destinations_count", "stories_count", "has_content",
            "meta_title", "meta_description", "og_title", "og_description", "og_image", 
            "canonical_url", "seo_enabled", "jsonld_type", "jsonld_override"
        )

    def get_hero_image(self, obj):
        if obj.hero_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.hero_image.url)
            return obj.hero_image.url
        return None

    def get_cities_count(self, obj):
        return obj.cities.filter(is_published=True).count()
    
    def get_has_content(self, obj):
        destinations_count = getattr(obj, 'destinations_count', 0) or 0
        stories_count = getattr(obj, 'stories_count', 0) or 0
        return destinations_count > 0 or stories_count > 0


class CitySerializer(serializers.ModelSerializer):
    hero_image = serializers.SerializerMethodField()
    country = CountrySerializer(read_only=True)
    destinations_count = serializers.SerializerMethodField()

    class Meta:
        model = City
        fields = (
            "id", "name", "slug", "short_description", "hero_image", "is_published", "order", "country", "destinations_count",
            "meta_title", "meta_description", "og_title", "og_description", "og_image", 
            "canonical_url", "seo_enabled", "jsonld_type", "jsonld_override"
        )

    def get_hero_image(self, obj):
        if obj.hero_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.hero_image.url)
            return obj.hero_image.url
        return None

    def get_destinations_count(self, obj):
        return obj.destinations.filter(is_published=True).count()


class DestinationTranslationSerializer(serializers.ModelSerializer):
    hero_image = serializers.SerializerMethodField()
    hero_slides = serializers.SerializerMethodField()
    sections = serializers.SerializerMethodField()

    class Meta:
        model = DestinationTranslation
        fields = (
            "locale", "title", "subtitle", "body", "hero_image", "hero_slides", 
            "meta_title", "meta_description", "sections", "last_synced_at"
        )

    def get_sections(self, obj):
        sections = obj.sections.all().order_by('order')
        return DestinationSectionSerializer(sections, many=True, context=self.context).data

    def get_hero_slides(self, obj):
        slides = obj.hero_slides.all().order_by('order')
        return DestinationHeroSlideSerializer(slides, many=True, context=self.context).data

    def get_hero_image(self, obj):
        if obj.destination and obj.destination.hero_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.destination.hero_image.url)
            return obj.destination.hero_image.url
        return None


class DestinationSerializer(serializers.ModelSerializer):
    hero_image = serializers.SerializerMethodField()
    hero_slides = serializers.SerializerMethodField()
    city = CitySerializer(read_only=True)
    country = serializers.SerializerMethodField()
    translations = serializers.SerializerMethodField()
    locale = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()
    subtitle = serializers.SerializerMethodField()
    short_description = serializers.SerializerMethodField()
    body = serializers.SerializerMethodField()
    meta_title = serializers.SerializerMethodField()
    meta_description = serializers.SerializerMethodField()
    sections = serializers.SerializerMethodField()
    translation_missing = serializers.SerializerMethodField()

    class Meta:
        model = Destination
        fields = (
            "id", "slug", "category", "tags", "is_featured", "hero_image", "hero_slides", "is_published", 
            "city", "country", "translations", "locale", "title", "subtitle", "short_description", "body", "meta_title", "meta_description", 
            "sections", "translation_missing", "og_title", "og_description", "og_image", 
            "canonical_url", "seo_enabled", "jsonld_type", "jsonld_override"
        )

    def _get_requested_locale(self) -> Optional[str]:
        request = self.context.get('request')
        return getattr(request, 'LANGUAGE_CODE', None) if request else None

    def _get_translation(self, obj):
        if not obj:
            return None
        locale = self._get_requested_locale()
        if not locale:
            return obj.translations.first()
        return obj.translations.filter(locale=locale).first() or obj.translations.first()

    def get_hero_image(self, obj):
        if obj.hero_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.hero_image.url)
            return obj.hero_image.url
        return None

    def get_translations(self, obj):
        return DestinationTranslationSerializer(obj.translations.all(), many=True, context=self.context).data

    def get_locale(self, obj: Destination) -> str:
        translation = self._get_translation(obj)
        return translation.locale if translation else ""

    def get_title(self, obj: Destination) -> str:
        translation = self._get_translation(obj)
        return translation.title if translation else ""

    def get_subtitle(self, obj: Destination) -> str:
        translation = self._get_translation(obj)
        return translation.subtitle if translation else ""

    def get_short_description(self, obj: Destination) -> str:
        translation = self._get_translation(obj)
        return translation.short_description if translation else ""

    def get_country(self, obj: Destination) -> dict:
        if obj.city and obj.city.country:
            return {
                "name": obj.city.country.name,
                "slug": obj.city.country.slug
            }
        return None

    def get_body(self, obj: Destination) -> str:
        translation = self._get_translation(obj)
        return translation.body if translation else ""

    def get_meta_title(self, obj: Destination) -> str:
        translation = self._get_translation(obj)
        return translation.meta_title if translation else ""

    def get_meta_description(self, obj: Destination) -> str:
        translation = self._get_translation(obj)
        return translation.meta_description if translation else ""

    def get_hero_slides(self, obj: Destination) -> list:
        translation = self._get_translation(obj)
        if not translation:
            return []
        slides = translation.hero_slides.all().order_by('order')
        return DestinationHeroSlideSerializer(slides, many=True, context=self.context).data

    def get_sections(self, obj: Destination):
        translation = self._get_translation(obj)
        if not translation:
            return []
        sections = translation.sections.all().order_by('order')
        return DestinationSectionSerializer(sections, many=True, context=self.context).data

    def get_translation_missing(self, obj: Destination) -> bool:
        requested = self._get_requested_locale()
        translation = self._get_translation(obj)
        if not requested:
            return translation is None
        return translation is None or translation.locale != requested


# Blog serializers
class BlogPostSectionSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = BlogPostSection
        fields = ("id", "section_type", "order", "title", "body", "image", "cta_label", "cta_url")

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class BlogPostHeroSlideSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = BlogPostHeroSlide
        fields = ("image", "caption", "order")

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class BlogCategorySerializer(serializers.ModelSerializer):
    posts_count = serializers.SerializerMethodField()

    class Meta:
        model = BlogCategory
        fields = ("id", "name", "slug", "is_published", "order", "posts_count")

    def get_posts_count(self, obj):
        return obj.posts.filter(is_published=True).count()


class BlogPostTranslationSerializer(serializers.ModelSerializer):
    hero_image = serializers.SerializerMethodField()
    hero_slides = serializers.SerializerMethodField()
    sections = serializers.SerializerMethodField()

    class Meta:
        model = BlogPostTranslation
        fields = ("locale", "title", "subtitle", "body", "hero_image", "hero_slides", "meta_title", "meta_description", "sections", "created_at", "updated_at")

    def get_sections(self, obj):
        sections = obj.sections.all().order_by('order')
        return BlogPostSectionSerializer(sections, many=True, context=self.context).data

    def get_hero_slides(self, obj):
        slides = obj.hero_slides.all().order_by('order')
        return BlogPostHeroSlideSerializer(slides, many=True, context=self.context).data

    def get_hero_image(self, obj):
        # Use translation-specific hero image if available, otherwise fallback to post hero image
        image = obj.hero_image or obj.post.hero_image
        if image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(image.url)
            return image.url
        return None


class BlogPostSerializer(serializers.ModelSerializer):
    hero_image = serializers.SerializerMethodField()
    hero_slides = serializers.SerializerMethodField()
    category = BlogCategorySerializer(read_only=True)
    translations = serializers.SerializerMethodField()
    locale = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()
    subtitle = serializers.SerializerMethodField()
    body = serializers.SerializerMethodField()
    meta_title = serializers.SerializerMethodField()
    meta_description = serializers.SerializerMethodField()
    sections = serializers.SerializerMethodField()
    translation_missing = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = (
            "id", "slug", "hero_image", "hero_slides", "is_published", "created_at", "updated_at", 
            "category", "translations", "locale", "title", "subtitle", "body", "meta_title", "meta_description", 
            "sections", "translation_missing", "og_title", "og_description", "og_image", 
            "canonical_url", "seo_enabled", "jsonld_type", "jsonld_override"
        )

    def _get_requested_locale(self) -> Optional[str]:
        request = self.context.get('request')
        return getattr(request, 'LANGUAGE_CODE', None) if request else None

    def _get_translation(self, obj):
        if not obj:
            return None
        locale = self._get_requested_locale()
        if not locale:
            return obj.translations.first()
        return obj.translations.filter(locale=locale).first() or obj.translations.first()

    def get_hero_image(self, obj):
        translation = self._get_translation(obj)
        # Use translation-specific hero image if available, otherwise fallback to post hero image
        image = (translation.hero_image if translation else None) or obj.hero_image
        if image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(image.url)
            return image.url
        return None

    def get_translations(self, obj):
        return BlogPostTranslationSerializer(obj.translations.all(), many=True, context=self.context).data

    def get_locale(self, obj: BlogPost) -> str:
        translation = self._get_translation(obj)
        return translation.locale if translation else ""

    def get_title(self, obj: BlogPost) -> str:
        translation = self._get_translation(obj)
        return translation.title if translation else ""

    def get_subtitle(self, obj: BlogPost) -> str:
        translation = self._get_translation(obj)
        return translation.subtitle if translation else ""

    def get_body(self, obj: BlogPost) -> str:
        translation = self._get_translation(obj)
        return translation.body if translation else ""

    def get_meta_title(self, obj: BlogPost) -> str:
        translation = self._get_translation(obj)
        return translation.meta_title if translation else ""

    def get_meta_description(self, obj: BlogPost) -> str:
        translation = self._get_translation(obj)
        return translation.meta_description if translation else ""

    def get_hero_slides(self, obj: BlogPost) -> list:
        translation = self._get_translation(obj)
        if not translation:
            return []
        slides = translation.hero_slides.all().order_by('order')
        return BlogPostHeroSlideSerializer(slides, many=True, context=self.context).data

    def get_sections(self, obj: BlogPost):
        translation = self._get_translation(obj)
        if not translation:
            return []
        sections = translation.sections.all().order_by('order')
        return BlogPostSectionSerializer(sections, many=True, context=self.context).data

    def get_translation_missing(self, obj: BlogPost) -> bool:
        requested = self._get_requested_locale()
        translation = self._get_translation(obj)
        if not requested:
            return translation is None
        return translation is None or translation.locale != requested


class MediaFileSerializer(serializers.ModelSerializer):
    """Serializer for MediaFile API endpoint."""
    url = serializers.SerializerMethodField()
    thumbnail = serializers.SerializerMethodField()
    
    class Meta:
        model = MediaFile
        fields = ("id", "name", "url", "thumbnail", "uploaded_at", "file_size", "get_file_size_display")
        read_only_fields = ("uploaded_at", "file_size")
    
    def get_url(self, obj):
        """Return absolute URL for the media file."""
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None
    
    def get_thumbnail(self, obj):
        """Return thumbnail URL (same as main URL for images)."""
        return self.get_url(obj)


class NavigationMenuItemSerializer(serializers.ModelSerializer):
    """Serializer for navigation menu items API."""
    href = serializers.SerializerMethodField()
    
    class Meta:
        model = NavigationMenuItem
        fields = ("label", "href", "order")
        
    def get_href(self, obj):
        """Return the appropriate URL for this menu item."""
        if obj.url:
            # External URL - return as-is
            return obj.url
        elif obj.page:
            # Internal page - build locale-aware URL
            return f"/{obj.locale}/{obj.page.slug}/"
        elif obj.destination:
            # Destination - build locale-aware URL
            return f"/{obj.locale}/destinations/{obj.destination.slug}/"
        elif obj.blog_category:
            # Blog category - build locale-aware URL
            return f"/{obj.locale}/blog/category/{obj.blog_category.slug}/"
        return "#"


class FooterLinkSerializer(serializers.ModelSerializer):
    """Serializer for footer links."""
    
    class Meta:
        model = FooterLink
        fields = ("label", "url")


class FooterBlockSerializer(serializers.ModelSerializer):
    """Serializer for footer blocks API."""
    links = FooterLinkSerializer(many=True, read_only=True)
    
    class Meta:
        model = FooterBlock
        fields = ("title", "body", "links", "order")


class HomepageCategorySerializer(serializers.ModelSerializer):
    """Serializer for homepage category translations API."""
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = HomepageCategoryTranslation
        fields = ("title", "description", "image")
        
    def get_image(self, obj):
        """Return absolute image URL."""
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
        
    def to_representation(self, instance):
        """Flatten the structure to include category fields directly."""
        ret = super().to_representation(instance)
        ret['slug'] = instance.category.slug
        ret['order'] = instance.category.order
        # Include SEO fields from category
        ret['meta_title'] = instance.category.meta_title
        ret['meta_description'] = instance.category.meta_description
        ret['og_title'] = instance.category.og_title
        ret['og_description'] = instance.category.og_description
        ret['og_image'] = instance.category.og_image
        ret['canonical_url'] = instance.category.canonical_url
        ret['seo_enabled'] = instance.category.seo_enabled
        ret['jsonld_type'] = instance.category.jsonld_type
        ret['jsonld_override'] = instance.category.jsonld_override
        return ret
