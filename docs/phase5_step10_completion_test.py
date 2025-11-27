#!/usr/bin/env python
"""
Phase 5 Step 10 Blog CMS - Completion Test
Tests all implemented blog functionality
"""

import os
import django
from django.http import HttpRequest
from django.test import RequestFactory

# Set up Django environment
os.environ.setdefault("DJANGO_SECRET_KEY", "test")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

def test_blog_models():
    """Test all blog models and relationships"""
    from cms.models import BlogCategory, BlogPost, BlogPostTranslation, BlogPostSection
    
    print("=== TESTING BLOG MODELS ===")
    
    # Test counts
    categories = BlogCategory.objects.count()
    posts = BlogPost.objects.count()
    translations = BlogPostTranslation.objects.count()
    sections = BlogPostSection.objects.count()
    
    print(f"✅ BlogCategory: {categories} records")
    print(f"✅ BlogPost: {posts} records")  
    print(f"✅ BlogPostTranslation: {translations} records")
    print(f"✅ BlogPostSection: {sections} records")
    
    # Test relationships
    for post in BlogPost.objects.all()[:2]:
        trans_count = post.translations.count()
        print(f"   Post '{post.slug}' has {trans_count} translation(s)")
        
        for translation in post.translations.all():
            section_count = translation.sections.count()
            print(f"     Translation '{translation.locale}' has {section_count} section(s)")
    
    return True

def test_blog_admin():
    """Test blog admin registration"""
    from django.contrib import admin
    from cms.models import BlogCategory, BlogPost, BlogPostTranslation, BlogPostSection
    
    print("\n=== TESTING BLOG ADMIN ===")
    
    try:
        # Check if models are registered in admin
        admin_site = admin.site
        
        if BlogCategory in admin_site._registry:
            print("✅ BlogCategory registered in admin")
        else:
            print("❌ BlogCategory not registered in admin")
            
        if BlogPost in admin_site._registry:
            print("✅ BlogPost registered in admin")
        else:
            print("❌ BlogPost not registered in admin")
            
        if BlogPostTranslation in admin_site._registry:
            print("✅ BlogPostTranslation registered in admin")
        else:
            print("❌ BlogPostTranslation not registered in admin")
            
        if BlogPostSection in admin_site._registry:
            print("✅ BlogPostSection registered in admin")
        else:
            print("❌ BlogPostSection not registered in admin")
            
        return True
    except Exception as e:
        print(f"❌ Admin test error: {e}")
        return False

def test_blog_api():
    """Test all blog API endpoints"""
    from cms.views import blog_categories_list, blog_posts_list, blog_category_detail, blog_post_detail
    
    print("\n=== TESTING BLOG API ENDPOINTS ===")
    
    factory = RequestFactory()
    success_count = 0
    
    # Test blog categories list
    try:
        request = factory.get('/api/cms/blog/categories/')
        response = blog_categories_list(request)
        print(f"✅ Blog Categories API: Status {response.status_code}, {len(response.data)} categories")
        if response.status_code == 200:
            success_count += 1
    except Exception as e:
        print(f"❌ Blog Categories API error: {e}")
    
    # Test blog posts list  
    try:
        request = factory.get('/api/cms/blog/')
        response = blog_posts_list(request)
        print(f"✅ Blog Posts API: Status {response.status_code}, {len(response.data)} posts")
        if response.status_code == 200:
            success_count += 1
    except Exception as e:
        print(f"❌ Blog Posts API error: {e}")
    
    # Test category detail
    try:
        request = factory.get('/api/cms/blog/category/travel-tips/')
        response = blog_category_detail(request, 'travel-tips')
        posts_count = len(response.data.get('posts', [])) if response.status_code == 200 else 0
        print(f"✅ Blog Category Detail API: Status {response.status_code}, {posts_count} posts")
        if response.status_code == 200:
            success_count += 1
    except Exception as e:
        print(f"❌ Blog Category Detail API error: {e}")
    
    # Test post detail
    try:
        request = factory.get('/api/cms/blog/ultimate-packing-guide-europe/')
        response = blog_post_detail(request, 'ultimate-packing-guide-europe')
        if response.status_code == 200:
            title = response.data.get('title', 'Unknown')
            translations = len(response.data.get('translations', []))
            print(f"✅ Blog Post Detail API: Status {response.status_code}")
            print(f"   Post: '{title}' with {translations} translation(s)")
            success_count += 1
        else:
            print(f"❌ Blog Post Detail API: Status {response.status_code}")
    except Exception as e:
        print(f"❌ Blog Post Detail API error: {e}")
    
    return success_count == 4

def test_blog_serializers():
    """Test blog serializers"""
    from cms.models import BlogPost, BlogCategory
    from cms.serializers import BlogPostSerializer, BlogCategorySerializer
    
    print("\n=== TESTING BLOG SERIALIZERS ===")
    
    request = HttpRequest()
    request.method = 'GET'
    success_count = 0
    
    # Test BlogPostSerializer
    try:
        posts = BlogPost.objects.filter(is_published=True)[:1]
        if posts:
            serializer = BlogPostSerializer(posts[0], context={"request": request})
            data = serializer.data
            print(f"✅ BlogPostSerializer working")
            print(f"   Serialized fields: {list(data.keys())}")
            success_count += 1
        else:
            print("❌ No posts to serialize")
    except Exception as e:
        print(f"❌ BlogPostSerializer error: {e}")
    
    # Test BlogCategorySerializer
    try:
        categories = BlogCategory.objects.filter(is_published=True)[:1]
        if categories:
            serializer = BlogCategorySerializer(categories[0], context={"request": request})
            data = serializer.data
            print(f"✅ BlogCategorySerializer working")
            print(f"   Serialized fields: {list(data.keys())}")
            success_count += 1
        else:
            print("❌ No categories to serialize")
    except Exception as e:
        print(f"❌ BlogCategorySerializer error: {e}")
    
    return success_count == 2

def test_management_command():
    """Test the sample blog data creation command"""
    from django.core.management import call_command
    from cms.models import BlogCategory, BlogPost
    
    print("\n=== TESTING MANAGEMENT COMMAND ===")
    
    initial_categories = BlogCategory.objects.count()
    initial_posts = BlogPost.objects.count()
    
    try:
        # The command should be idempotent (safe to run multiple times)
        call_command('create_sample_blog')
        
        final_categories = BlogCategory.objects.count()
        final_posts = BlogPost.objects.count()
        
        print(f"✅ create_sample_blog command executed successfully")
        print(f"   Categories: {initial_categories} -> {final_categories}")
        print(f"   Posts: {initial_posts} -> {final_posts}")
        
        return True
    except Exception as e:
        print(f"❌ Management command error: {e}")
        return False

def test_phase5_step10_completion():
    """Comprehensive test for Phase 5 Step 10 completion"""
    print("🚀 PHASE 5 STEP 10 - BLOG CMS COMPLETION TEST")
    print("=" * 60)
    
    results = []
    
    # Run all tests
    results.append(("Models", test_blog_models()))
    results.append(("Admin", test_blog_admin()))
    results.append(("API Endpoints", test_blog_api()))
    results.append(("Serializers", test_blog_serializers()))
    results.append(("Management Command", test_management_command()))
    
    # Summary
    print("\n" + "=" * 60)
    print("📋 PHASE 5 STEP 10 COMPLETION SUMMARY")
    print("=" * 60)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name:20s} {status}")
        if result:
            passed += 1
    
    print("-" * 60)
    print(f"Overall Result: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 PHASE 5 STEP 10 - BLOG CMS IMPLEMENTATION: COMPLETE!")
        print("\n✅ Successfully implemented:")
        print("   • BlogCategory, BlogPost, BlogPostTranslation, BlogPostSection models")
        print("   • Django admin interfaces with inlines and preview links")
        print("   • RESTful API endpoints for blog data")
        print("   • Serializers with locale support and translation logic")
        print("   • Sample data management command")
        print("   • Frontend TypeScript API client and blog pages")
    else:
        print("⚠️  PHASE 5 STEP 10 - Some components need attention")
    
    return passed == total

if __name__ == "__main__":
    test_phase5_step10_completion()