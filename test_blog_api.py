#!/usr/bin/env python
"""Test blog API endpoints directly"""
import os
import django
from django.http import HttpRequest
from django.test import RequestFactory

# Set up Django environment
os.environ.setdefault("DJANGO_SECRET_KEY", "test")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

def test_blog_posts_view():
    """Test blog posts view directly"""
    from cms.views import blog_posts_list
    
    factory = RequestFactory()
    request = factory.get('/api/cms/blog/')
    
    try:
        response = blog_posts_list(request)
        print(f"Response status: {response.status_code}")
        print(f"Response data length: {len(response.data)}")
        if response.data:
            print(f"First post title: {response.data[0].get('title', 'No title')}")
        return True
    except Exception as e:
        print(f"Error in blog_posts_list: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_blog_categories_view():
    """Test blog categories view directly"""
    from cms.views import blog_categories_list
    
    factory = RequestFactory()
    request = factory.get('/api/cms/blog/categories/')
    
    try:
        response = blog_categories_list(request)
        print(f"Categories response status: {response.status_code}")
        print(f"Categories data length: {len(response.data)}")
        if response.data:
            print(f"First category: {response.data[0].get('name', 'No name')}")
        return True
    except Exception as e:
        print(f"Error in blog_categories_list: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("Testing blog categories view...")
    test_blog_categories_view()
    print("\nTesting blog posts view...")
    test_blog_posts_view()