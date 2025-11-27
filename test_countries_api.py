#!/usr/bin/env python3

import urllib.request
import json

def test_countries_api():
    """Test the countries API endpoint to check hero_image URLs"""
    try:
        response = urllib.request.urlopen('http://127.0.0.1:8000/api/cms/countries/')
        data = json.loads(response.read().decode())
        
        print(f"✅ Countries API returned {len(data)} countries")
        
        # Check a few countries and their hero_image values
        for country in data[:5]:  # First 5 countries
            name = country.get('name', 'Unknown')
            hero_image = country.get('hero_image', 'None')
            slug = country.get('slug', 'Unknown')
            
            print(f"Country: {name}")
            print(f"  Slug: {slug}")
            print(f"  Hero Image: {hero_image}")
            print()
            
        # Test a specific image URL
        if data and data[0].get('hero_image'):
            image_url = data[0]['hero_image']
            print(f"Testing image URL: {image_url}")
            
            try:
                img_response = urllib.request.urlopen(image_url)
                print(f"✅ Image accessible: {img_response.getcode()}")
            except Exception as e:
                print(f"❌ Image error: {e}")
        
    except Exception as e:
        print(f"❌ API Error: {e}")

if __name__ == "__main__":
    test_countries_api()