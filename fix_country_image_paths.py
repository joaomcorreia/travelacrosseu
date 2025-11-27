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
import json

# Load the country image mapping
with open('countries_images.json', 'r') as f:
    image_mapping = json.load(f)

def fix_country_image_paths():
    print("Fixing country image paths...")
    
    # First, clear any problematic entries
    countries_with_bad_paths = Country.objects.exclude(hero_image__isnull=True).exclude(hero_image__exact='')
    for country in countries_with_bad_paths:
        if country.hero_image and ('http' in str(country.hero_image) or str(country.hero_image).startswith('/images')):
            print(f"Clearing bad path for {country.name}: {country.hero_image}")
            country.hero_image = None
            country.save()
    
    # Now set correct relative paths
    for country_data in image_mapping:
        slug = country_data['slug']
        filename = country_data['image_filename']
        try:
            country = Country.objects.get(slug=slug)
            # Set relative path within media directory
            relative_path = f'images/countries/{filename}'
            country.hero_image = relative_path
            country.save()
            print(f"Updated {country.name}: {relative_path}")
        except Country.DoesNotExist:
            print(f"Country not found: {slug}")
        except Exception as e:
            print(f"Error updating {slug}: {e}")

if __name__ == '__main__':
    fix_country_image_paths()
    
    print("\nVerifying updates...")
    countries = Country.objects.exclude(hero_image__isnull=True).exclude(hero_image__exact='')
    for country in countries:
        print(f"- {country.name}: {country.hero_image}")