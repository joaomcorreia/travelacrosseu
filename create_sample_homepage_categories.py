#!/usr/bin/env python3
"""
Create sample homepage categories for Phase 6 Step 11
"""

import os
import sys
import django

# Setup Django environment
sys.path.append('C:\\projects\\travelacrosseu')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from cms.models import HomepageCategory, HomepageCategoryTranslation

def create_sample_categories():
    """Create sample homepage categories with translations."""
    
    # Sample categories data
    categories_data = [
        {
            'slug': 'city-breaks',
            'order': 0,
            'translations': {
                'en': {
                    'title': 'City Breaks',
                    'description': 'Explore Europe\'s vibrant capitals and historic cities'
                },
                'fr': {
                    'title': 'Escapades Urbaines',
                    'description': 'Découvrez les capitales dynamiques et villes historiques d\'Europe'
                },
                'es': {
                    'title': 'Escapadas de Ciudad',
                    'description': 'Explora las capitales vibrantes y ciudades históricas de Europa'
                }
            }
        },
        {
            'slug': 'beaches',
            'order': 1,
            'translations': {
                'en': {
                    'title': 'Beach Escapes',
                    'description': 'Discover stunning coastlines and seaside towns'
                },
                'fr': {
                    'title': 'Plages',
                    'description': 'Découvrez des côtes magnifiques et villes balnéaires'
                },
                'es': {
                    'title': 'Playas',
                    'description': 'Descubre costas impresionantes y pueblos costeros'
                }
            }
        },
        {
            'slug': 'nature',
            'order': 2,
            'translations': {
                'en': {
                    'title': 'Nature & Outdoors',
                    'description': 'Hiking, cycling, and wilderness adventures'
                },
                'fr': {
                    'title': 'Nature et Plein Air',
                    'description': 'Randonnée, cyclisme et aventures en nature'
                },
                'es': {
                    'title': 'Naturaleza',
                    'description': 'Senderismo, ciclismo y aventuras en la naturaleza'
                }
            }
        },
        {
            'slug': 'food-wine',
            'order': 3,
            'translations': {
                'en': {
                    'title': 'Food & Wine',
                    'description': 'Culinary journeys and wine tasting experiences'
                },
                'fr': {
                    'title': 'Gastronomie et Vins',
                    'description': 'Voyages culinaires et dégustations de vins'
                },
                'es': {
                    'title': 'Gastronomía y Vinos',
                    'description': 'Viajes culinarios y experiencias de cata de vinos'
                }
            }
        }
    ]
    
    print("Creating sample homepage categories...")
    
    for cat_data in categories_data:
        # Create or get the category
        category, created = HomepageCategory.objects.get_or_create(
            slug=cat_data['slug'],
            defaults={
                'order': cat_data['order'],
                'is_active': True
            }
        )
        
        if created:
            print(f"✅ Created category: {category.slug}")
        else:
            print(f"📋 Category exists: {category.slug}")
        
        # Create translations
        for locale, trans_data in cat_data['translations'].items():
            translation, created = HomepageCategoryTranslation.objects.get_or_create(
                category=category,
                locale=locale,
                defaults={
                    'title': trans_data['title'],
                    'description': trans_data['description'],
                    'is_published': True
                }
            )
            
            if created:
                print(f"  ✅ Created translation: {locale} - {translation.title}")
            else:
                print(f"  📋 Translation exists: {locale} - {translation.title}")
    
    print("\n🎉 Sample categories created successfully!")
    print("\n📋 Next Steps:")
    print("1. Visit Django admin to add images to categories")
    print("2. Test the API: http://127.0.0.1:8000/api/cms/homepage-categories/?locale=en")
    print("3. Check homepage: http://localhost:3000/en")

if __name__ == '__main__':
    create_sample_categories()