#!/usr/bin/env python
"""Test CMS page API directly to find the error"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from cms.models import Page, PageTranslation
from cms.serializers import PageDetailSerializer

def test_page_api():
    """Test the page detail serializer to find the error"""
    
    try:
        # Check if page exists
        page = Page.objects.get(slug='home', is_published=True)
        print(f'✅ Page found: {page.slug}')
        
        # Check translation
        translation = PageTranslation.objects.get(page=page, locale='en')
        print(f'✅ Translation found: {translation.title}')
        print(f'📝 Hero image value: {repr(translation.hero_image)}')
        print(f'📝 Hero image type: {type(translation.hero_image)}')
        
        # Test serializer directly
        serializer = PageDetailSerializer(page, context={
            'translation': translation, 
            'requested_locale': 'en'
        })
        
        # Try to get data
        data = serializer.data
        print(f'✅ Serializer success!')
        print(f'✅ Response Data Keys: {list(data.keys())}')
        print(f'✅ Title: {data.get("title", "No title")}')
        print(f'✅ Meta Title: {data.get("meta_title", "No meta title")}')
        print(f'✅ Hero Image: {data.get("hero_image", "No hero image")}')
        
    except Exception as e:
        print(f'❌ Error: {e}')
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    test_page_api()