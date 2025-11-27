from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render
from django.db.models import Count
from cms.models import (
    Page, PageTranslation, PageSection,
    Country, City, Destination, DestinationTranslation, DestinationSection,
    BlogCategory, BlogPost, BlogPostTranslation, BlogPostSection,
    MediaFile, NavigationMenuItem, FooterBlock,
    SUPPORTED_LOCALES
)


@staff_member_required
def admin_dashboard(request):
    """
    Custom admin dashboard with content overview and translation status
    """
    
    # Content Statistics
    content_stats = {
        'pages': {
            'total': Page.objects.count(),
            'published': Page.objects.filter(is_published=True).count(),
            'translations': PageTranslation.objects.count(),
            'sections': PageSection.objects.count(),
        },
        'destinations': {
            'countries': Country.objects.count(),
            'countries_published': Country.objects.filter(is_published=True).count(),
            'cities': City.objects.count(),
            'cities_published': City.objects.filter(is_published=True).count(),
            'destinations': Destination.objects.count(),
            'destinations_published': Destination.objects.filter(is_published=True).count(),
            'translations': DestinationTranslation.objects.count(),
            'sections': DestinationSection.objects.count(),
        },
        'blog': {
            'categories': BlogCategory.objects.count(),
            'categories_published': BlogCategory.objects.filter(is_published=True).count(),
            'posts': BlogPost.objects.count(),
            'posts_published': BlogPost.objects.filter(is_published=True).count(),
            'translations': BlogPostTranslation.objects.count(),
            'sections': BlogPostSection.objects.count(),
        },
        'media': {
            'total_files': MediaFile.objects.count(),
            'total_size': MediaFile.objects.aggregate(total=Count('file_size'))['total'] or 0,
        },
        'navigation': {
            'menu_items': NavigationMenuItem.objects.count(),
            'active_items': NavigationMenuItem.objects.filter(is_active=True).count(),
        },
        'footer': {
            'footer_blocks': FooterBlock.objects.count(),
            'footer_links': FooterBlock.objects.prefetch_related('links').annotate(link_count=Count('links')).aggregate(total_links=Count('links'))['total_links'] or 0,
        }
    }
    
    # Translation Coverage by Locale
    translation_coverage = []
    for locale_code, locale_name in SUPPORTED_LOCALES:
        # Page translations
        page_translations = PageTranslation.objects.filter(locale=locale_code).count()
        total_pages = Page.objects.filter(is_published=True).count()
        
        # Blog post translations
        blog_translations = BlogPostTranslation.objects.filter(locale=locale_code).count()
        total_blog_posts = BlogPost.objects.filter(is_published=True).count()
        
        # Destination translations
        destination_translations = DestinationTranslation.objects.filter(locale=locale_code).count()
        total_destinations = Destination.objects.filter(is_published=True).count()
        
        translation_coverage.append({
            'locale_code': locale_code,
            'locale_name': locale_name,
            'pages': {
                'translated': page_translations,
                'total': total_pages,
                'percentage': round((page_translations / total_pages * 100) if total_pages > 0 else 0, 1)
            },
            'blog_posts': {
                'translated': blog_translations,
                'total': total_blog_posts,
                'percentage': round((blog_translations / total_blog_posts * 100) if total_blog_posts > 0 else 0, 1)
            },
            'destinations': {
                'translated': destination_translations,
                'total': total_destinations,
                'percentage': round((destination_translations / total_destinations * 100) if total_destinations > 0 else 0, 1)
            }
        })
    
    # Recent Activity (last 10 items)
    recent_pages = Page.objects.order_by('-updated_at')[:5]
    recent_blog_posts = BlogPost.objects.order_by('-updated_at')[:5]
    recent_destinations = Destination.objects.order_by('-updated_at')[:5]
    
    context = {
        'title': 'TravelAcrossEU Dashboard',
        'content_stats': content_stats,
        'translation_coverage': translation_coverage,
        'recent_activity': {
            'pages': recent_pages,
            'blog_posts': recent_blog_posts,
            'destinations': recent_destinations,
        }
    }
    
    return render(request, 'admin/dashboard.html', context)