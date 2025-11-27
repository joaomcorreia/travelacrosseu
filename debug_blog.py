#!/usr/bin/env python
"""Debug script to test blog API"""
import os
import django

# Set up Django environment
os.environ.setdefault("DJANGO_SECRET_KEY", "test")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

def test_blog_models():
    """Test blog models directly"""
    from cms.models import BlogCategory, BlogPost, BlogPostTranslation, BlogPostSection
    
    print("Testing blog models...")
    print(f"Categories count: {BlogCategory.objects.count()}")
    print(f"Posts count: {BlogPost.objects.count()}")
    print(f"Translations count: {BlogPostTranslation.objects.count()}")
    print(f"Sections count: {BlogPostSection.objects.count()}")
    
    # Test post query with prefetch
    from django.db.models import Prefetch
    try:
        posts = BlogPost.objects.filter(is_published=True).select_related("category")
        print(f"Published posts: {posts.count()}")
        
        posts_with_translations = posts.prefetch_related(
            Prefetch(
                "translations", 
                queryset=BlogPostTranslation.objects.prefetch_related("sections").order_by("locale")
            )
        ).order_by("-created_at")
        
        print(f"Posts with translations: {posts_with_translations.count()}")
        for post in posts_with_translations:
            print(f"  - {post.slug} (translations: {post.translations.count()})")
            
    except Exception as e:
        print(f"Error in query: {e}")
        import traceback
        traceback.print_exc()

def test_blog_serializer():
    """Test blog serializer"""
    from cms.models import BlogPost
    from cms.serializers import BlogPostSerializer
    from django.http import HttpRequest
    
    print("\nTesting blog serializer...")
    try:
        posts = BlogPost.objects.filter(is_published=True)[:1]
        if posts:
            request = HttpRequest()
            request.method = 'GET'
            serializer = BlogPostSerializer(posts[0], context={"request": request})
            print("Serializer data:", serializer.data)
        else:
            print("No published posts found")
    except Exception as e:
        print(f"Error in serializer: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_blog_models()
    test_blog_serializer()