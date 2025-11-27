#!/usr/bin/env python
"""Test Country JSON import functionality"""

import json
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from cms.admin import CountryAdmin
from cms.models import Country
from django.http import HttpRequest

def test_country_import():
    # Load test data
    with open('sample_countries_import.json', 'r') as f:
        data = json.load(f)

    print('Testing Country JSON import...')
    print(f'Loaded {len(data)} countries from JSON')

    # Create admin instance and mock request  
    admin = CountryAdmin(Country, None)
    request = HttpRequest()

    # Test import logic
    created_count = 0
    updated_count = 0

    for item in data:
        try:
            result = admin.import_json_item(item, request)
            if result == 'created':
                created_count += 1
            elif result == 'updated':
                updated_count += 1
            print(f'✅ {item["slug"]}: {result}')
        except Exception as e:
            print(f'❌ {item["slug"]}: {e}')

    print(f'\n📊 Results: Created {created_count}, Updated {updated_count}')
    print(f'📊 Total countries in DB: {Country.objects.count()}')

    # Verify SEO fields
    portugal = Country.objects.filter(slug='portugal').first()
    if portugal:
        print(f'\n🇵🇹 Portugal SEO check:')
        print(f'   meta_title: {portugal.meta_title}')
        print(f'   seo_enabled: {portugal.seo_enabled}')
        print(f'   jsonld_type: {portugal.jsonld_type}')

if __name__ == '__main__':
    test_country_import()