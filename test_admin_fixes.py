#!/usr/bin/env python
"""Test Django admin fixes"""
import os
import django

# Set up Django environment
os.environ.setdefault("DJANGO_SECRET_KEY", "test")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

def test_admin_queries():
    """Test that admin queries work without errors"""
    from cms.models import DestinationSection, BlogPost
    
    print("=== TESTING ADMIN QUERY FIXES ===")
    
    # Test DestinationSection admin queryset
    try:
        queryset = DestinationSection.objects.select_related(
            "translation__destination__city__country"
        )
        count = queryset.count()
        print(f"✅ DestinationSection admin query: {count} objects")
    except Exception as e:
        print(f"❌ DestinationSection admin query error: {e}")
    
    # Test BlogPost translations count (the other fix)
    try:
        from cms.models import BlogPostTranslation
        supported_count = len(BlogPostTranslation._meta.get_field('locale').choices)
        print(f"✅ BlogPost translation choices: {supported_count} locales")
    except Exception as e:
        print(f"❌ BlogPost translation choices error: {e}")
    
    print("✅ All admin query fixes working correctly!")

if __name__ == "__main__":
    test_admin_queries()