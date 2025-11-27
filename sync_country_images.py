#!/usr/bin/env python3
"""
Sync country images from countries_images.json to existing Country models in database
"""

import json
import os
import django
from pathlib import Path
from django.core.files import File
from django.core.files.storage import default_storage

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from cms.models import Country

def sync_country_images():
    """Update existing countries with hero_image paths based on countries_images.json"""
    
    # Load the image mapping
    try:
        with open('countries_images.json', 'r', encoding='utf-8') as f:
            image_data = json.load(f)
    except FileNotFoundError:
        print("Error: countries_images.json not found")
        return
    
    # Create a mapping of slug to image filename
    slug_to_image = {item['slug']: item['image_filename'] for item in image_data}
    
    # Update countries
    updated_count = 0
    countries = Country.objects.all()
    
    print(f"Found {countries.count()} countries in database")
    print(f"Found {len(slug_to_image)} image mappings")
    
    for country in countries:
        if country.slug in slug_to_image:
            image_filename = slug_to_image[country.slug]
            
            # Check if image file exists in frontend directory
            frontend_image_path = Path('frontend/public/images/countries') / image_filename
            
            if frontend_image_path.exists():
                # Update hero_image field with the path that Next.js will use
                country.hero_image = f"/images/countries/{image_filename}"
                country.save()
                print(f"✅ Updated {country.name} with image: {image_filename}")
                updated_count += 1
            else:
                print(f"⚠️  Image not found for {country.name}: {frontend_image_path}")
        else:
            print(f"❌ No image mapping found for {country.name} (slug: {country.slug})")
    
    print(f"\nUpdated {updated_count} countries with hero images")

if __name__ == "__main__":
    sync_country_images()