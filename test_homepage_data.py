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

def test_homepage_data():
    print("Testing homepage CMS data...")
    
    try:
        response = urllib.request.urlopen('http://127.0.0.1:8000/api/cms/pages/homepage/')
        data = json.loads(response.read().decode())
        
        print("Homepage CMS data:")
        print(f"Hero image: {data.get('hero_image', 'None')}")
        print(f"Hero slides: {data.get('hero_slides', 'None')}")
        print(f"Has hero_slides: {'hero_slides' in data}")
        
        if 'hero_slides' in data and data['hero_slides']:
            print(f"Number of hero slides: {len(data['hero_slides'])}")
            for i, slide in enumerate(data['hero_slides']):
                print(f"  Slide {i+1}: {slide}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    test_homepage_data()