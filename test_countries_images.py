#!/usr/bin/env python3

import django
import os
import sys

# Add the project directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from cms.models import Country

def test_country_images():
    print("Checking country images...")
    countries = Country.objects.all()
    
    print(f"Found {countries.count()} countries:")
    for country in countries:
        print(f"- {country.name}: hero_image='{country.hero_image}'")
        if country.hero_image:
            print(f"  Full path: {country.hero_image.path}")
            print(f"  URL: {country.hero_image.url}")
        print()

if __name__ == '__main__':
    test_country_images()