#!/usr/bin/env python
"""Test CMS page API with actual HTTP request"""

import requests

def test_api():
    """Test the CMS API endpoints"""
    
    pages_to_test = ['home', 'about', 'contact']
    
    for page_slug in pages_to_test:
        print(f"\n🔍 Testing {page_slug} page...")
        try:
            url = f"http://127.0.0.1:8000/api/cms/pages/{page_slug}/?locale=en"
            response = requests.get(url)
            
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ {page_slug} API Success!")
                print(f"Title: {data.get('title')}")
                print(f"Meta Title: {data.get('meta_title')}")
                print(f"Translation Missing: {data.get('translation_missing')}")
            else:
                print(f"❌ {page_slug} Error: {response.status_code}")
                print(f"Response: {response.text[:200]}...")
                
        except Exception as e:
            print(f"❌ {page_slug} Exception: {e}")

if __name__ == '__main__':
    test_api()