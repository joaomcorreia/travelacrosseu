#!/usr/bin/env python3

import django
import os
import sys
import urllib.request
import json

# Add the project directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def test_blog_images():
    print("Testing blog post images...")
    
    try:
        response = urllib.request.urlopen('http://127.0.0.1:8000/api/cms/blog/?category=travel-stories')
        data = json.loads(response.read().decode())
        
        print(f"Found {len(data)} travel stories:")
        for i, post in enumerate(data[:5]):  # First 5 posts
            print(f"{i+1}. {post['title']}")
            print(f"   Hero Image: {post['hero_image']}")
            print()
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    test_blog_images()