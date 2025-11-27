#!/usr/bin/env python3
"""
Test script for Phase 6 Step 10 - Destination Listing Pages
Tests the enhanced CMS models and API endpoints.
"""

import os
import sys
import django
import json
from datetime import datetime

# Add the project root to Python path
sys.path.append('C:\\projects\\travelacrosseu')

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from cms.models import Country, City, Destination
from cms.serializers import CountrySerializer, CitySerializer, DestinationSerializer

def test_phase6_step10():
    """Test Phase 6 Step 10 implementation"""
    
    print("🚀 PHASE 6 STEP 10 - DESTINATION LISTING PAGES TEST")
    print("=" * 60)
    print(f"Test run: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Test 1: Check model field additions
    print("📋 Test 1: Model Field Additions")
    print("-" * 30)
    
    # Check Country model has short_description
    try:
        country_fields = [field.name for field in Country._meta.fields]
        assert 'short_description' in country_fields, "Country missing short_description field"
        print("✅ Country.short_description field exists")
    except Exception as e:
        print(f"❌ Country field test failed: {e}")
    
    # Check City model has short_description  
    try:
        city_fields = [field.name for field in City._meta.fields]
        assert 'short_description' in city_fields, "City missing short_description field"
        print("✅ City.short_description field exists")
    except Exception as e:
        print(f"❌ City field test failed: {e}")
    
    # Check Destination model has tags and is_featured
    try:
        dest_fields = [field.name for field in Destination._meta.fields]
        assert 'tags' in dest_fields, "Destination missing tags field"
        assert 'is_featured' in dest_fields, "Destination missing is_featured field"
        print("✅ Destination.tags and is_featured fields exist")
    except Exception as e:
        print(f"❌ Destination field test failed: {e}")
    
    print()
    
    # Test 2: Serializer enhancements
    print("🔧 Test 2: Serializer Enhancements")
    print("-" * 30)
    
    try:
        # Test Country serializer includes new fields
        country_serializer_fields = CountrySerializer.Meta.fields
        assert 'short_description' in country_serializer_fields
        print("✅ CountrySerializer includes short_description")
        
        # Test Destination serializer includes new fields
        dest_serializer_fields = DestinationSerializer.Meta.fields
        assert 'tags' in dest_serializer_fields
        assert 'is_featured' in dest_serializer_fields
        print("✅ DestinationSerializer includes tags and is_featured")
        
    except Exception as e:
        print(f"❌ Serializer test failed: {e}")
    
    print()
    
    # Test 3: Data creation and retrieval
    print("💾 Test 3: Data Creation & Retrieval")  
    print("-" * 30)
    
    try:
        # Create test country with new field
        test_country, created = Country.objects.get_or_create(
            slug='test-country-phase6',
            defaults={
                'name': 'Test Country Phase 6',
                'short_description': 'A beautiful test country for Phase 6 testing',
                'is_published': True,
                'order': 999
            }
        )
        
        if created:
            print("✅ Created test country with short_description")
        else:
            print("✅ Test country already exists")
        
        # Create test city with new field
        test_city, created = City.objects.get_or_create(
            slug='test-city-phase6',
            defaults={
                'name': 'Test City Phase 6',
                'short_description': 'A wonderful test city for Phase 6 testing',
                'country': test_country,
                'is_published': True,
                'order': 999
            }
        )
        
        if created:
            print("✅ Created test city with short_description")
        else:
            print("✅ Test city already exists")
        
        # Create test destination with new fields
        test_destination, created = Destination.objects.get_or_create(
            slug='test-destination-phase6',
            defaults={
                'title': 'Test Destination Phase 6',
                'summary': 'An amazing test destination for Phase 6 testing',
                'city': test_city,
                'tags': ['Museum', 'Architecture', 'Test'],
                'is_featured': True,
                'is_published': True,
                'order': 999
            }
        )
        
        if created:
            print("✅ Created test destination with tags and is_featured")
        else:
            print("✅ Test destination already exists")
        
    except Exception as e:
        print(f"❌ Data creation test failed: {e}")
    
    print()
    
    # Test 4: Serialization with new fields
    print("📤 Test 4: API Serialization")
    print("-" * 30)
    
    try:
        # Test country serialization
        country_data = CountrySerializer(test_country).data
        assert 'short_description' in country_data
        assert 'cities_count' in country_data
        print(f"✅ Country serialization: {country_data['name']} ({country_data['cities_count']} cities)")
        
        # Test city serialization  
        city_data = CitySerializer(test_city).data
        assert 'short_description' in city_data
        assert 'destinations_count' in city_data
        print(f"✅ City serialization: {city_data['name']} ({city_data['destinations_count']} destinations)")
        
        # Test destination serialization
        dest_data = DestinationSerializer(test_destination).data
        assert 'tags' in dest_data
        assert 'is_featured' in dest_data
        print(f"✅ Destination serialization: {dest_data['title']} (Featured: {dest_data['is_featured']})")
        
    except Exception as e:
        print(f"❌ Serialization test failed: {e}")
    
    print()
    
    # Test 5: Query and filtering capabilities
    print("🔍 Test 5: Query & Filtering")
    print("-" * 30)
    
    try:
        # Test featured destinations query
        featured_destinations = Destination.objects.filter(is_featured=True, is_published=True)
        print(f"✅ Found {featured_destinations.count()} featured destinations")
        
        # Test destinations with specific tags
        tagged_destinations = Destination.objects.filter(tags__contains=['Museum'], is_published=True)
        print(f"✅ Found {tagged_destinations.count()} destinations tagged 'Museum'")
        
        # Test country cities count
        countries_with_cities = Country.objects.filter(is_published=True).annotate(
            city_count=models.Count('cities', filter=models.Q(cities__is_published=True))
        )
        print(f"✅ Processed {countries_with_cities.count()} countries with city counts")
        
    except Exception as e:
        print(f"❌ Query test failed: {e}")
    
    print()
    print("🎉 PHASE 6 STEP 10 TESTS COMPLETED")
    print("=" * 60)
    print()
    print("📋 Next Steps:")
    print("1. Test frontend at: http://localhost:3000/en/destinations")
    print("2. Add content via Django admin: http://127.0.0.1:8000/admin/")
    print("3. Test search and filtering functionality")
    print("4. Verify responsive design on mobile devices")
    print()

if __name__ == '__main__':
    test_phase6_step10()