from typing import Optional

from django.db.models import Prefetch, Q
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response

from cms.models import (
    Page, PageTranslation, MediaFile, NavigationMenuItem, FooterBlock,
    Destination, DestinationTranslation, BlogPost, BlogPostTranslation, BlogCategory,
    HomepageCategory, HomepageCategoryTranslation
)
from cms.serializers import PageDetailSerializer, MediaFileSerializer, NavigationMenuItemSerializer, FooterBlockSerializer, HomepageCategorySerializer


FALLBACK_LOCALE = "en"


def _select_translation(page: Page, locale: Optional[str]) -> Optional[PageTranslation]:
    translations = list(page.translations.all())
    if not translations:
        return None

    translations_by_locale = {translation.locale: translation for translation in translations}

    if locale and locale in translations_by_locale:
        return translations_by_locale[locale]

    if FALLBACK_LOCALE in translations_by_locale:
        return translations_by_locale[FALLBACK_LOCALE]

    return translations[0]


@api_view(["GET"])
def page_detail(request: Request, slug: str) -> Response:
    locale = request.query_params.get("locale")

    try:
        page = (
            Page.objects.filter(is_published=True, slug=slug)
            .prefetch_related(
                Prefetch(
                    "translations", 
                    queryset=PageTranslation.objects.prefetch_related("sections").order_by("locale")
                )
            )
            .get()
        )
    except Page.DoesNotExist:
        return Response({"detail": "Page not found."}, status=status.HTTP_404_NOT_FOUND)

    translation = _select_translation(page, locale)
    serializer = PageDetailSerializer(
        page,
        context={
            "translation": translation,
            "requested_locale": locale,
            "request": request,
        },
    )
    payload = serializer.data

    return Response(payload)


# Destination views
@api_view(["GET"])
def countries_list(request: Request) -> Response:
    """List all published countries with content counts"""
    from django.db.models import Count, Q
    from cms.models import Country
    from cms.serializers import CountrySerializer
    
    countries = (
        Country.objects
        .filter(is_published=True)
        .annotate(
            destinations_count=Count(
                "cities__destinations",
                filter=Q(cities__destinations__is_published=True),
                distinct=True,
            ),
            stories_count=Count(
                "cities__destinations__translations",
                filter=Q(cities__destinations__translations__destination__is_published=True),
                distinct=True,
            ),
        )
        .order_by("order", "name")
    )
    serializer = CountrySerializer(countries, many=True, context={"request": request})
    return Response(serializer.data)


@api_view(["GET"])
def cities_list(request: Request) -> Response:
    """List all published cities, optionally filtered by country"""
    from cms.models import City
    from cms.serializers import CitySerializer
    
    queryset = City.objects.filter(is_published=True).select_related("country")
    
    country_slug = request.query_params.get("country")
    if country_slug:
        queryset = queryset.filter(country__slug=country_slug, country__is_published=True)
    
    cities = queryset.order_by("order", "name")
    serializer = CitySerializer(cities, many=True, context={"request": request})
    return Response(serializer.data)


@api_view(["GET"])
def destinations_list(request: Request) -> Response:
    """List all published destinations, optionally filtered by country and/or city"""
    from cms.models import Destination
    from cms.serializers import DestinationSerializer
    
    queryset = Destination.objects.filter(is_published=True).select_related("city__country")
    
    country_slug = request.query_params.get("country")
    city_slug = request.query_params.get("city")
    
    if country_slug:
        queryset = queryset.filter(city__country__slug=country_slug, city__country__is_published=True)
    
    if city_slug:
        queryset = queryset.filter(city__slug=city_slug, city__is_published=True)
    
    destinations = queryset.order_by("slug")
    serializer = DestinationSerializer(destinations, many=True, context={"request": request})
    return Response(serializer.data)


@api_view(["GET"])
def destination_detail(request: Request, slug: str) -> Response:
    """Get a specific destination with all translations and sections"""
    from cms.models import Destination, DestinationTranslation
    from cms.serializers import DestinationSerializer
    
    locale = request.query_params.get("locale")

    try:
        destination = (
            Destination.objects.filter(is_published=True, slug=slug)
            .select_related("city__country")
            .prefetch_related(
                Prefetch(
                    "translations", 
                    queryset=DestinationTranslation.objects.prefetch_related("sections").order_by("locale")
                )
            )
            .get()
        )
    except Destination.DoesNotExist:
        return Response({"detail": "Destination not found."}, status=status.HTTP_404_NOT_FOUND)

    # Set the requested language for the serializer
    if locale:
        request.LANGUAGE_CODE = locale

    serializer = DestinationSerializer(destination, context={"request": request})
    return Response(serializer.data)


# Blog views
@api_view(["GET"])
def blog_categories_list(request: Request) -> Response:
    """List all published blog categories"""
    from cms.models import BlogCategory
    from cms.serializers import BlogCategorySerializer
    
    categories = BlogCategory.objects.filter(is_published=True).order_by("order", "name")
    serializer = BlogCategorySerializer(categories, many=True, context={"request": request})
    return Response(serializer.data)


@api_view(["GET"])
def blog_posts_list(request: Request) -> Response:
    """List all published blog posts, optionally filtered by category"""
    from django.db.models import Prefetch
    from cms.models import BlogPost, BlogPostTranslation
    from cms.serializers import BlogPostSerializer
    
    queryset = BlogPost.objects.filter(is_published=True).select_related("category")
    
    category_slug = request.query_params.get("category")
    if category_slug:
        queryset = queryset.filter(category__slug=category_slug, category__is_published=True)
    
    locale = request.query_params.get("locale")
    if locale:
        request.LANGUAGE_CODE = locale
    
    posts = queryset.prefetch_related(
        Prefetch(
            "translations", 
            queryset=BlogPostTranslation.objects.prefetch_related("sections").order_by("locale")
        )
    ).order_by("-created_at")
    
    serializer = BlogPostSerializer(posts, many=True, context={"request": request})
    return Response(serializer.data)


@api_view(["GET"])
def blog_category_detail(request: Request, slug: str) -> Response:
    """Get blog posts for a specific category"""
    from django.db.models import Prefetch
    from cms.models import BlogCategory, BlogPost, BlogPostTranslation
    from cms.serializers import BlogPostSerializer
    
    try:
        category = BlogCategory.objects.get(slug=slug, is_published=True)
    except BlogCategory.DoesNotExist:
        return Response({"detail": "Category not found."}, status=status.HTTP_404_NOT_FOUND)
    
    locale = request.query_params.get("locale")
    if locale:
        request.LANGUAGE_CODE = locale
    
    posts = BlogPost.objects.filter(
        category=category, 
        is_published=True
    ).select_related("category").prefetch_related(
        Prefetch(
            "translations", 
            queryset=BlogPostTranslation.objects.prefetch_related("sections").order_by("locale")
        )
    ).order_by("-created_at")
    
    serializer = BlogPostSerializer(posts, many=True, context={"request": request})
    
    return Response({
        "category": {
            "id": category.id,
            "name": category.name,
            "slug": category.slug,
        },
        "posts": serializer.data
    })


@api_view(["GET"])
def blog_post_detail(request: Request, slug: str) -> Response:
    """Get a specific blog post with all translations and sections"""
    from django.db.models import Prefetch
    from cms.models import BlogPost, BlogPostTranslation
    from cms.serializers import BlogPostSerializer
    
    locale = request.query_params.get("locale")

    try:
        post = (
            BlogPost.objects.filter(is_published=True, slug=slug)
            .select_related("category")
            .prefetch_related(
                Prefetch(
                    "translations", 
                    queryset=BlogPostTranslation.objects.prefetch_related("sections").order_by("locale")
                )
            )
            .get()
        )
    except BlogPost.DoesNotExist:
        return Response({"detail": "Blog post not found."}, status=status.HTTP_404_NOT_FOUND)

    # Set the requested language for the serializer
    if locale:
        request.LANGUAGE_CODE = locale

    serializer = BlogPostSerializer(post, context={"request": request})
    return Response(serializer.data)


@api_view(["GET"])
def media_list(request: Request) -> Response:
    """
    API endpoint for media files - supports search and filtering.
    
    Query parameters:
    - q: Search query for name or filename
    - folder: Filter by folder path (e.g., 'uploads/page_hero_slides/')
    """
    queryset = MediaFile.objects.all().order_by('-uploaded_at')
    
    # Search functionality
    search_query = request.query_params.get('q', '').strip()
    if search_query:
        queryset = queryset.filter(
            Q(name__icontains=search_query) |
            Q(file__icontains=search_query)
        )
    
    # Folder filtering
    folder_filter = request.query_params.get('folder', '').strip()
    if folder_filter:
        queryset = queryset.filter(file__startswith=folder_filter)
    
    serializer = MediaFileSerializer(queryset, many=True, context={"request": request})
    return Response(serializer.data)


@api_view(["GET"])
def navigation_list(request: Request) -> Response:
    """
    API endpoint for navigation menu items.
    
    Query parameters:
    - locale: Filter by locale (e.g., 'en', 'fr') - defaults to 'en'
    """
    locale = request.query_params.get('locale', 'en')
    
    # Get active navigation items for the specified locale
    queryset = NavigationMenuItem.objects.filter(
        locale=locale,
        is_active=True
    ).order_by('order', 'label')
    
    serializer = NavigationMenuItemSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def footer_list(request: Request) -> Response:
    """
    API endpoint for footer blocks.
    
    Query parameters:
    - locale: Filter by locale (e.g., 'en', 'fr') - defaults to 'en'
    """
    locale = request.query_params.get('locale', 'en')
    
    # Get footer blocks for the specified locale with their links
    queryset = FooterBlock.objects.filter(
        locale=locale
    ).prefetch_related('links').order_by('order', 'title')
    
    serializer = FooterBlockSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def resolve_translation(request: Request) -> Response:
    """
    API endpoint to resolve translation paths for the language switcher.
    
    Query parameters:
    - slug: The current page slug or path segment
    - content_type: Type of content (page, destination, blog_post, blog_category, static)
    - locale: Target locale to resolve to
    - current_path: Full current path for context (optional)
    """
    slug = request.query_params.get('slug', '').strip()
    content_type = request.query_params.get('content_type', '').strip()
    target_locale = request.query_params.get('locale', 'en').strip()
    current_path = request.query_params.get('current_path', '').strip()
    
    # Validate required parameters
    if not content_type:
        return Response({
            "found": False,
            "url": f"/{target_locale}",
            "reason": "missing_content_type"
        })
    
    # Slug is required for most content types but can be empty for home
    if not slug and content_type != 'home':
        return Response({
            "found": False,
            "url": f"/{target_locale}",
            "reason": "missing_slug"
        })
    
    # Validate target locale
    valid_locales = ['en', 'fr', 'nl', 'es', 'pt']
    if target_locale not in valid_locales:
        return Response({
            "found": False,
            "url": f"/en",
            "reason": "invalid_locale"
        })
    
    try:
        # Static pages (about, contact, privacy, etc.) - same slug across locales
        if content_type == 'static':
            return Response({
                "found": True,
                "url": f"/{target_locale}/{slug}/",
                "reason": "static_page"
            })
        
        # Home page
        elif content_type == 'home':
            return Response({
                "found": True,
                "url": f"/{target_locale}/",
                "reason": "home_page"
            })
        
        # CMS Pages
        elif content_type == 'page':
            try:
                # Find the page by slug
                page = Page.objects.get(slug=slug)
                # Look for translation in target locale
                translation = PageTranslation.objects.filter(
                    page=page, locale=target_locale
                ).first()
                
                if translation:
                    return Response({
                        "found": True,
                        "url": f"/{target_locale}/{page.slug}/",
                        "reason": "page_translated"
                    })
                else:
                    return Response({
                        "found": False,
                        "url": f"/{target_locale}/",
                        "reason": "page_translation_missing"
                    })
            except Page.DoesNotExist:
                return Response({
                    "found": False,
                    "url": f"/{target_locale}/",
                    "reason": "page_not_found"
                })
        
        # Destinations (country/city/destination)
        elif content_type == 'destination':
            try:
                # Parse path to extract destination parts
                path_parts = current_path.strip('/').split('/')
                
                # Remove locale and 'destinations' from path
                if len(path_parts) >= 2 and path_parts[1] == 'destinations':
                    dest_parts = path_parts[2:]  # Get parts after /locale/destinations/
                    
                    if len(dest_parts) >= 3:
                        # Full destination path: /locale/destinations/country/city/destination
                        country_slug, city_slug, dest_slug = dest_parts[:3]
                        try:
                            destination = Destination.objects.get(slug=dest_slug)
                            translation = DestinationTranslation.objects.filter(
                                destination=destination, locale=target_locale
                            ).first()
                            
                            if translation:
                                return Response({
                                    "found": True,
                                    "url": f"/{target_locale}/destinations/{country_slug}/{city_slug}/{dest_slug}/",
                                    "reason": "destination_translated"
                                })
                        except Destination.DoesNotExist:
                            pass
                    
                    elif len(dest_parts) >= 2:
                        # City path: /locale/destinations/country/city
                        country_slug, city_slug = dest_parts[:2]
                        return Response({
                            "found": True,
                            "url": f"/{target_locale}/destinations/{country_slug}/{city_slug}/",
                            "reason": "city_page"
                        })
                    
                    elif len(dest_parts) >= 1:
                        # Country path: /locale/destinations/country
                        country_slug = dest_parts[0]
                        return Response({
                            "found": True,
                            "url": f"/{target_locale}/destinations/{country_slug}/",
                            "reason": "country_page"
                        })
                
                # Default to destinations index
                return Response({
                    "found": True,
                    "url": f"/{target_locale}/destinations/",
                    "reason": "destinations_index"
                })
                
            except Exception:
                return Response({
                    "found": False,
                    "url": f"/{target_locale}/destinations/",
                    "reason": "destination_parsing_error"
                })
        
        # Blog Posts
        elif content_type == 'blog_post':
            try:
                blog_post = BlogPost.objects.get(slug=slug)
                translation = BlogPostTranslation.objects.filter(
                    post=blog_post, locale=target_locale
                ).first()
                
                if translation:
                    return Response({
                        "found": True,
                        "url": f"/{target_locale}/blog/{blog_post.slug}/",
                        "reason": "blog_post_translated"
                    })
                else:
                    return Response({
                        "found": False,
                        "url": f"/{target_locale}/blog/",
                        "reason": "blog_post_translation_missing"
                    })
            except BlogPost.DoesNotExist:
                return Response({
                    "found": False,
                    "url": f"/{target_locale}/blog/",
                    "reason": "blog_post_not_found"
                })
        
        # Blog Categories
        elif content_type == 'blog_category':
            try:
                category = BlogCategory.objects.get(slug=slug)
                # Blog categories don't have translations, use same slug
                return Response({
                    "found": True,
                    "url": f"/{target_locale}/blog/category/{category.slug}/",
                    "reason": "blog_category"
                })
            except BlogCategory.DoesNotExist:
                return Response({
                    "found": False,
                    "url": f"/{target_locale}/blog/",
                    "reason": "blog_category_not_found"
                })
        
        # Blog Index
        elif content_type == 'blog':
            return Response({
                "found": True,
                "url": f"/{target_locale}/blog/",
                "reason": "blog_index"
            })
        
        # Unknown content type
        else:
            return Response({
                "found": False,
                "url": f"/{target_locale}/",
                "reason": "unknown_content_type"
            })
    
    except Exception as e:
        return Response({
            "found": False,
            "url": f"/{target_locale}/",
            "reason": f"error: {str(e)}"
        })


@api_view(['GET'])
def homepage_categories(request: Request) -> Response:
    """
    API endpoint to fetch homepage categories for a specific locale.
    
    Query parameters:
    - locale (required): Language code (e.g., 'en', 'fr', 'es')
    
    Returns:
    - Array of category objects with slug, title, description, image, order
    """
    locale = request.GET.get('locale', FALLBACK_LOCALE)
    
    # Fetch published category translations for the requested locale
    # where the parent category is active
    categories = HomepageCategoryTranslation.objects.filter(
        locale=locale,
        is_published=True,
        category__is_active=True
    ).select_related('category').order_by('category__order', 'category__slug')
    
    serializer = HomepageCategorySerializer(categories, many=True, context={'request': request})
    return Response(serializer.data)
