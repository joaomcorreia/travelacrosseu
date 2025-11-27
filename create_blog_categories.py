#!/usr/bin/env python3
import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from cms.models import BlogCategory

def create_blog_categories():
    # Create travel-stories category
    travel_stories, created = BlogCategory.objects.get_or_create(
        slug='travel-stories',
        defaults={
            'name': 'Travel Stories',
            'is_published': True,
            'order': 10
        }
    )
    print(f'Travel Stories category: {"created" if created else "already exists"}')

    # Create trip-ideas category  
    trip_ideas, created = BlogCategory.objects.get_or_create(
        slug='trip-ideas',
        defaults={
            'name': 'Trip Ideas',
            'is_published': True,
            'order': 20
        }
    )
    print(f'Trip Ideas category: {"created" if created else "already exists"}')

    print('\nAll categories:')
    for cat in BlogCategory.objects.all():
        print(f'- {cat.slug}: {cat.name}')

if __name__ == '__main__':
    create_blog_categories()