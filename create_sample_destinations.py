#!/usr/bin/env python3
"""
Sample Destinations Creation Script
Creates diverse destinations across European countries with proper categories.
"""

import os
import sys
import django

# Setup Django environment
sys.path.append('/projects/travelacrosseu')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from cms.models import Country, City, Destination, DestinationTranslation
from django.utils.text import slugify

# Sample destinations data with categories
DESTINATIONS_DATA = [
    # France - Paris
    {
        'country_slug': 'france',
        'city_slug': 'paris',
        'destinations': [
            {'title': 'Louvre Museum', 'category': 'museum', 'short_desc': 'World\'s largest art museum housing the Mona Lisa and countless masterpieces.'},
            {'title': 'Eiffel Tower', 'category': 'landmark', 'short_desc': 'Iconic iron tower offering breathtaking views of Paris from 276 meters high.'},
            {'title': 'Montmartre District', 'category': 'neighborhood', 'short_desc': 'Bohemian hilltop neighborhood with artists, cafes, and the Sacré-Cœur Basilica.'},
            {'title': 'Seine River Viewpoint', 'category': 'viewpoint', 'short_desc': 'Perfect spots along the river to admire Paris\'s stunning architecture and bridges.'},
        ]
    },
    # Italy - Rome
    {
        'country_slug': 'italy',
        'city_slug': 'rome',
        'destinations': [
            {'title': 'Vatican Museums', 'category': 'museum', 'short_desc': 'Papal palaces housing one of the world\'s greatest art collections including the Sistine Chapel.'},
            {'title': 'Colosseum', 'category': 'landmark', 'short_desc': 'Ancient Roman amphitheater where gladiators once battled before 50,000 spectators.'},
            {'title': 'Trastevere Neighborhood', 'category': 'neighborhood', 'short_desc': 'Medieval district with cobblestone streets, trattorias, and authentic Roman nightlife.'},
            {'title': 'Palatine Hill', 'category': 'viewpoint', 'short_desc': 'Legendary birthplace of Rome with panoramic views over the Roman Forum.'},
        ]
    },
    # Spain - Madrid
    {
        'country_slug': 'spain',
        'city_slug': 'madrid',
        'destinations': [
            {'title': 'Prado Museum', 'category': 'museum', 'short_desc': 'Spain\'s premier art gallery featuring works by Velázquez, Goya, and El Greco.'},
            {'title': 'Royal Palace of Madrid', 'category': 'landmark', 'short_desc': 'Lavish baroque palace with 3,418 rooms and spectacular state apartments.'},
            {'title': 'Malasaña District', 'category': 'neighborhood', 'short_desc': 'Trendy area known for its alternative culture, vintage shops, and vibrant nightlife.'},
            {'title': 'Templo de Debod', 'category': 'viewpoint', 'short_desc': 'Ancient Egyptian temple offering stunning sunset views over Casa de Campo park.'},
        ]
    },
    # United Kingdom - London
    {
        'country_slug': 'united-kingdom',
        'city_slug': 'london',
        'destinations': [
            {'title': 'British Museum', 'category': 'museum', 'short_desc': 'World-famous museum with Egyptian mummies, Greek sculptures, and the Rosetta Stone.'},
            {'title': 'Tower Bridge', 'category': 'landmark', 'short_desc': 'Victorian Gothic bridge with glass floor walkways 42 meters above the Thames.'},
            {'title': 'Camden Market Area', 'category': 'neighborhood', 'short_desc': 'Alternative district famous for markets, live music venues, and diverse street food.'},
            {'title': 'Primrose Hill', 'category': 'viewpoint', 'short_desc': 'Elevated park offering postcard-perfect views of London\'s skyline including the Shard.'},
        ]
    },
    # Germany - Berlin
    {
        'country_slug': 'germany',
        'city_slug': 'berlin',
        'destinations': [
            {'title': 'Museum Island', 'category': 'museum', 'short_desc': 'UNESCO site with five world-class museums including the Pergamon and Neues Museum.'},
            {'title': 'Brandenburg Gate', 'category': 'landmark', 'short_desc': 'Neoclassical monument and symbol of German reunification in the heart of Berlin.'},
            {'title': 'Kreuzberg District', 'category': 'neighborhood', 'short_desc': 'Multi-cultural area known for Turkish cuisine, street art, and alternative lifestyle.'},
            {'title': 'TV Tower Observation Deck', 'category': 'viewpoint', 'short_desc': '368-meter tower with revolving restaurant offering 360° views of Berlin.'},
        ]
    },
    # Netherlands - Amsterdam
    {
        'country_slug': 'netherlands',
        'city_slug': 'amsterdam',
        'destinations': [
            {'title': 'Van Gogh Museum', 'category': 'museum', 'short_desc': 'Largest collection of Van Gogh paintings and drawings in the world.'},
            {'title': 'Anne Frank House', 'category': 'landmark', 'short_desc': 'Historic house and museum dedicated to Jewish wartime diarist Anne Frank.'},
            {'title': 'Jordaan District', 'category': 'neighborhood', 'short_desc': 'Former working-class area now filled with art galleries, antique shops, and cozy cafés.'},
            {'title': 'A\'DAM Lookout', 'category': 'viewpoint', 'short_desc': 'Observation deck with swing over the edge for adrenaline junkies and city views.'},
        ]
    },
]

def create_destinations():
    """Create sample destinations with translations"""
    created_count = 0
    
    for country_data in DESTINATIONS_DATA:
        try:
            # Get country
            country = Country.objects.get(slug=country_data['country_slug'])
            print(f"✓ Found country: {country.name}")
            
            # Get or create city
            city = None
            if country_data['city_slug']:
                try:
                    city = City.objects.get(slug=country_data['city_slug'], country=country)
                    print(f"  ✓ Found city: {city.name}")
                except City.DoesNotExist:
                    print(f"  ✗ City not found: {country_data['city_slug']}")
                    continue
            
            # Create destinations
            for dest_data in country_data['destinations']:
                slug = slugify(dest_data['title'])
                
                # Create or get destination
                destination, created = Destination.objects.get_or_create(
                    slug=slug,
                    defaults={
                        'category': dest_data['category'],
                        'city': city,
                        'is_published': True,
                        'is_featured': True,
                    }
                )
                
                if created:
                    # Create English translation
                    DestinationTranslation.objects.create(
                        destination=destination,
                        locale='en',
                        title=dest_data['title'],
                        subtitle=f"Explore {dest_data['category']} in {city.name if city else country.name}",
                        short_description=dest_data['short_desc'],
                        body=f"<p>{dest_data['short_desc']}</p><p>This is a detailed description of {dest_data['title']}. Perfect for travelers looking to explore {dest_data['category']}s in {city.name if city else country.name}.</p>",
                        meta_title=dest_data['title'],
                        meta_description=dest_data['short_desc'][:160],
                    )
                    
                    created_count += 1
                    print(f"    ✓ Created: {dest_data['title']} ({dest_data['category']})")
                else:
                    print(f"    - Already exists: {dest_data['title']}")
                    
        except Country.DoesNotExist:
            print(f"✗ Country not found: {country_data['country_slug']}")
            continue
    
    print(f"\n🎉 Created {created_count} new destinations!")
    print(f"📊 Total destinations in database: {Destination.objects.count()}")
    
    # Show category breakdown
    categories = Destination.objects.values_list('category', flat=True).distinct()
    print(f"📂 Categories: {list(categories)}")

if __name__ == "__main__":
    create_destinations()