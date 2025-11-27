#!/usr/bin/env python
"""Test homepage categories API"""

import urllib.request
import json

try:
    response = urllib.request.urlopen('http://127.0.0.1:8000/api/cms/homepage-categories/?locale=en')
    data = json.loads(response.read().decode())
    print(f'Categories found: {len(data)}')
    for i, cat in enumerate(data):
        print(f'Category {i+1}: {cat.get("title", "No title")}')
        image_value = cat.get("image", "No image field")
        print(f'  Image: {repr(image_value)}')
        print(f'  Image type: {type(image_value)}')
        if image_value and hasattr(image_value, 'strip'):
            print(f'  Image empty?: {image_value.strip() == ""}')
        print('---')
except Exception as e:
    print(f'Error: {e}')