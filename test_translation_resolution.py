#!/usr/bin/env python
"""
Test script for translation resolution API
Tests different content types and scenarios
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"
API_ENDPOINT = f"{BASE_URL}/api/cms/resolve-translation/"

def test_translation_resolution(slug, content_type, target_locale, description):
    """Test translation resolution for specific content"""
    print(f"\n🔍 Testing: {description}")
    print(f"   Slug: {slug}")
    print(f"   Content Type: {content_type}")
    print(f"   Target Locale: {target_locale}")
    
    try:
        params = {
            'slug': slug,
            'content_type': content_type,
            'locale': target_locale
        }
        
        response = requests.get(API_ENDPOINT, params=params)
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Success: {data}")
        else:
            print(f"   ❌ Error {response.status_code}: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Exception: {e}")

def main():
    """Run all translation resolution tests"""
    print("=" * 60)
    print("🌍 TRANSLATION RESOLUTION API TESTS")
    print("=" * 60)
    
    # Test cases: (slug, content_type, target_locale, description)
    test_cases = [
        # Home page tests
        ("", "home", "fr", "Home page → FR"),
        ("", "home", "en", "Home page → EN"),
        ("", "home", "es", "Home page → ES"),
        
        # Static page tests  
        ("about", "static", "pt", "About page → PT"),
        ("contact", "static", "fr", "Contact page → FR"),
        ("privacy", "static", "nl", "Privacy page → NL"),
        
        # CMS page tests (using known pages from database)
        ("about", "page", "en", "CMS About page → EN"),
        ("home", "page", "fr", "CMS Home page → FR"),
        
        # Destination tests (hypothetical)
        ("paris", "destination", "nl", "Paris destination → NL"),
        ("amsterdam", "destination", "en", "Amsterdam destination → EN"),
        
        # Blog tests (hypothetical)
        ("sample-post", "blog_post", "es", "Blog post → ES"),
        ("travel", "blog_category", "fr", "Blog category → FR"),
        
        # Invalid tests
        ("non-existent", "page", "fr", "Non-existent page"),
        ("about", "static", "invalid", "Invalid locale test"),
    ]
    
    for slug, content_type, target_locale, description in test_cases:
        test_translation_resolution(slug, content_type, target_locale, description)
    
    print("\n" + "=" * 60)
    print("🏁 Translation resolution testing complete!")
    print("=" * 60)

if __name__ == "__main__":
    main()