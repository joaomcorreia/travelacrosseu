#!/usr/bin/env python
"""Create missing CMS pages for frontend integration"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from cms.models import Page, PageTranslation

def create_cms_pages():
    """Create the missing CMS pages that frontend expects"""
    
    pages_data = [
        {
            'slug': 'home',
            'page_type': 'standard',
            'translations': {
                'en': {
                    'title': 'TravelAcross EU — AI travel guides for every EU locale',
                    'subtitle': 'Discover Europe with AI-powered travel guides',
                    'body': 'Plan city breaks, coastal escapes, and cultural trips with AI-generated guides in five EU languages. Our platform combines editorial standards with automation to help you explore European destinations thoughtfully.',
                    'hero_image': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=600&fit=crop',
                    'meta_title': 'TravelAcross EU — AI Travel Guides for Europe',
                    'meta_description': 'Discover Europe with AI-powered travel guides covering cities, culture, and destinations across the EU in multiple languages.',
                    'og_title': 'TravelAcross EU — AI Travel Guides',
                    'og_description': 'Plan your European adventure with AI-generated travel guides',
                    'og_image': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=600&fit=crop',
                    'seo_enabled': True,
                    'jsonld_type': 'WebPage'
                }
            }
        },
        {
            'slug': 'about',
            'page_type': 'standard',
            'translations': {
                'en': {
                    'title': 'About TravelAcross EU',
                    'subtitle': 'AI-assisted travel publishing built for multilingual teams',
                    'body': 'TravelAcross EU is an AI-assisted travel content project focused on showcasing thoughtfully structured guides for European destinations. The platform mixes editorial standards with automation, so travelers can quickly explore countries, cities, and themed collections that feel ready for publication.\n\nThe project is still in an early phase. Layouts, languages, and features will keep evolving as we learn from editors and travelers. Expect frequent iterations as we refine the CMS, improve localization, and publish more demo itineraries.',
                    'hero_image': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop',
                    'meta_title': 'About TravelAcross EU — AI Travel Publishing Platform',
                    'meta_description': 'Learn about TravelAcross EU, an AI-assisted travel content platform for European destinations with multilingual support.',
                    'og_title': 'About TravelAcross EU',
                    'og_description': 'AI-assisted travel publishing for European destinations',
                    'og_image': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop',
                    'seo_enabled': True,
                    'jsonld_type': 'AboutPage'
                }
            }
        },
        {
            'slug': 'contact',
            'page_type': 'standard', 
            'translations': {
                'en': {
                    'title': 'Contact TravelAcross EU',
                    'subtitle': 'Get in touch with our team',
                    'body': 'TravelAcross EU is currently in active development. We welcome feedback, suggestions, and collaboration opportunities from travel publishers, content creators, and developers interested in AI-assisted publishing.\n\nA dedicated contact form and support flow will be added in a later phase.',
                    'hero_image': 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200&h=600&fit=crop',
                    'meta_title': 'Contact TravelAcross EU — Get in Touch',
                    'meta_description': 'Contact TravelAcross EU for feedback, collaboration, or questions about our AI travel publishing platform.',
                    'og_title': 'Contact TravelAcross EU',
                    'og_description': 'Get in touch with our travel publishing team',
                    'og_image': 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200&h=600&fit=crop',
                    'seo_enabled': True,
                    'jsonld_type': 'ContactPage'
                }
            }
        }
    ]
    
    created_count = 0
    updated_count = 0
    
    for page_data in pages_data:
        try:
            # Create or get page
            page, page_created = Page.objects.get_or_create(
                slug=page_data['slug'],
                defaults={
                    'page_type': page_data['page_type'],
                    'is_published': True
                }
            )
            
            if page_created:
                created_count += 1
                print(f'✅ Created page: {page.slug}')
            else:
                print(f'📄 Page exists: {page.slug}')
            
            # Create or update translations
            for locale, translation_data in page_data['translations'].items():
                translation, trans_created = PageTranslation.objects.update_or_create(
                    page=page,
                    locale=locale,
                    defaults=translation_data
                )
                
                if trans_created:
                    print(f'   ✅ Created translation: {locale}')
                else:
                    updated_count += 1
                    print(f'   📝 Updated translation: {locale}')
                    
        except Exception as e:
            print(f'❌ Error creating page {page_data["slug"]}: {e}')
    
    print(f'\n📊 Summary: {created_count} pages created, {updated_count} translations updated')
    print(f'🎯 Pages available at:')
    print(f'   - http://127.0.0.1:8000/api/cms/pages/home/?locale=en')
    print(f'   - http://127.0.0.1:8000/api/cms/pages/about/?locale=en')
    print(f'   - http://127.0.0.1:8000/api/cms/pages/contact/?locale=en')

if __name__ == '__main__':
    create_cms_pages()