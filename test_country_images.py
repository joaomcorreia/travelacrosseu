#!/usr/bin/env python3
"""
Test API response for countries with images
"""

import urllib.request
import json

try:
    response = urllib.request.urlopen('http://127.0.0.1:8000/api/cms/countries/')
    data = json.loads(response.read().decode())
    
    print(f'Found {len(data)} countries')
    print('\nCountries with hero images:')
    
    for country in data:
        if country['hero_image']:
            print(f'✅ {country["name"]}: {country["hero_image"]}')
    
    print('\nCountries without hero images:')
    no_image_count = 0
    for country in data:
        if not country['hero_image']:
            print(f'❌ {country["name"]}')
            no_image_count += 1
    
    print(f'\nSummary: {len(data) - no_image_count} with images, {no_image_count} without images')
    
except Exception as e:
    print(f'Error: {e}')