#!/usr/bin/env python3
"""
Create 20 country blog posts with consistent titles, descriptions, and SEO
"""

import json
import os
from pathlib import Path

def create_country_posts():
    """Generate 20 country blog posts JSON data"""
    
    countries = [
        {
            "country": "France",
            "slug": "discovering-france-complete-travel-guide",
            "title": "Discovering France: A Complete Travel Guide",
            "subtitle": "From Paris boulevards to Provence lavender fields — experience France's timeless charm.",
            "description": "Explore France's diverse regions, from the romantic streets of Paris to the sun-soaked French Riviera. Discover historic châteaux, world-class cuisine, and the art of living well.",
            "hero_image": "/images/countries/country-france.jpg",
            "tags": ["France", "Paris", "French Cuisine", "Châteaux", "Culture"]
        },
        {
            "country": "Italy", 
            "slug": "italy-travel-guide-art-food-history",
            "title": "Italy Travel Guide: Art, Food & History",
            "subtitle": "Where every city tells a story and every meal is a masterpiece.",
            "description": "Journey through Italy's Renaissance cities, rolling Tuscan landscapes, and coastal gems. From Rome's ancient ruins to Florence's artistic treasures and Venice's romantic canals.",
            "hero_image": "/images/countries/country-italy.jpg",
            "tags": ["Italy", "Renaissance", "Tuscany", "Italian Food", "Rome"]
        },
        {
            "country": "Spain",
            "slug": "spain-complete-travel-guide-culture-beaches",
            "title": "Spain Complete Travel Guide: Culture & Beaches",
            "subtitle": "Passionate flamenco rhythms meet Mediterranean sunshine.",
            "description": "Discover Spain's vibrant culture from Barcelona's Gaudí architecture to Seville's flamenco districts. Enjoy pristine beaches, tapas culture, and the warmth of Spanish hospitality.",
            "hero_image": "/images/countries/country-spain.jpg",
            "tags": ["Spain", "Barcelona", "Flamenco", "Tapas", "Mediterranean"]
        },
        {
            "country": "Portugal",
            "slug": "portugal-travel-guide-lisbon-porto-coast",
            "title": "Portugal Travel Guide: Lisbon, Porto & Coast", 
            "subtitle": "Discover Europe's best-kept secret along the Atlantic edge.",
            "description": "Explore Portugal's colorful cities, dramatic coastlines, and rich maritime history. From Lisbon's tiled facades to Porto's wine cellars and the Algarve's golden beaches.",
            "hero_image": "/images/countries/country-portugal.jpg",
            "tags": ["Portugal", "Lisbon", "Porto", "Atlantic Coast", "Wine"]
        },
        {
            "country": "Germany",
            "slug": "germany-travel-guide-castles-culture-cities",
            "title": "Germany Travel Guide: Castles, Culture & Cities",
            "subtitle": "From fairy-tale castles to modern Berlin — Germany's many faces.",
            "description": "Experience Germany's rich history through medieval towns, romantic castles, and vibrant cities. Discover Bavarian traditions, Rhine Valley wines, and Berlin's dynamic culture.",
            "hero_image": "/images/countries/country-germany.jpg",
            "tags": ["Germany", "Bavaria", "Castles", "Berlin", "Rhine Valley"]
        },
        {
            "country": "Netherlands",
            "slug": "netherlands-travel-guide-amsterdam-canals-tulips",
            "title": "Netherlands Travel Guide: Amsterdam, Canals & Tulips",
            "subtitle": "Cycling through tulip fields and canal-side cafés.",
            "description": "Explore the Netherlands' charming cities, colorful tulip fields, and progressive culture. From Amsterdam's museums to traditional windmills and coastal dunes.",
            "hero_image": "/images/countries/country-netherlands.jpg",
            "tags": ["Netherlands", "Amsterdam", "Tulips", "Windmills", "Cycling"]
        },
        {
            "country": "Belgium",
            "slug": "belgium-travel-guide-bruges-brussels-chocolate",
            "title": "Belgium Travel Guide: Bruges, Brussels & Chocolate",
            "subtitle": "Medieval charm meets world-class chocolate and beer.",
            "description": "Discover Belgium's medieval cities, world-renowned chocolates, and exceptional beers. From Bruges' romantic canals to Brussels' Grand Place and Antwerp's diamond district.",
            "hero_image": "/images/countries/country-belgium.jpg",
            "tags": ["Belgium", "Bruges", "Chocolate", "Beer", "Medieval Cities"]
        },
        {
            "country": "Austria",
            "slug": "austria-travel-guide-vienna-salzburg-alps",
            "title": "Austria Travel Guide: Vienna, Salzburg & Alps",
            "subtitle": "Classical music, imperial palaces, and Alpine adventures.",
            "description": "Experience Austria's imperial elegance, musical heritage, and stunning Alpine landscapes. From Vienna's palaces to Salzburg's charm and the Tyrol's mountain peaks.",
            "hero_image": "/images/countries/country-austria.jpg",
            "tags": ["Austria", "Vienna", "Salzburg", "Alps", "Classical Music"]
        },
        {
            "country": "Switzerland",
            "slug": "switzerland-travel-guide-alps-lakes-chocolate",
            "title": "Switzerland Travel Guide: Alps, Lakes & Chocolate",
            "subtitle": "Precision, beauty, and breathtaking mountain vistas.",
            "description": "Explore Switzerland's pristine Alpine landscapes, crystal-clear lakes, and charming mountain villages. From the Matterhorn's majesty to Swiss chocolate and efficient railways.",
            "hero_image": "/images/countries/country-switzerland.jpg",
            "tags": ["Switzerland", "Alps", "Matterhorn", "Lakes", "Swiss Chocolate"]
        },
        {
            "country": "Poland",
            "slug": "poland-travel-guide-krakow-warsaw-culture",
            "title": "Poland Travel Guide: Krakow, Warsaw & Culture",
            "subtitle": "Medieval squares, resilient spirit, and hearty traditions.",
            "description": "Discover Poland's rich history through beautifully preserved medieval towns, moving historical sites, and vibrant cultural traditions. From Krakow's charm to Warsaw's resilience.",
            "hero_image": "/images/countries/country-poland.jpg",
            "tags": ["Poland", "Krakow", "Warsaw", "Medieval", "History"]
        },
        {
            "country": "Czech Republic",
            "slug": "czech-republic-prague-travel-guide-bohemia",
            "title": "Czech Republic & Prague Travel Guide: Bohemia",
            "subtitle": "Golden Prague spires and centuries of Bohemian culture.",
            "description": "Explore Prague's fairy-tale architecture, world-famous beer culture, and the Czech Republic's Bohemian countryside. From medieval castles to modern Czech cuisine.",
            "hero_image": "/images/countries/country-czech-republic.jpg",
            "tags": ["Czech Republic", "Prague", "Bohemia", "Beer", "Castles"]
        },
        {
            "country": "Hungary",
            "slug": "hungary-budapest-travel-guide-thermal-baths",
            "title": "Hungary & Budapest Travel Guide: Thermal Baths",
            "subtitle": "Thermal springs, riverside parliament, and Magyar heritage.",
            "description": "Discover Hungary's unique culture, from Budapest's thermal baths and grand architecture to traditional folk traditions and hearty cuisine along the Danube.",
            "hero_image": "/images/countries/country-hungary.jpg",
            "tags": ["Hungary", "Budapest", "Thermal Baths", "Danube", "Magyar Culture"]
        },
        {
            "country": "Greece",
            "slug": "greece-travel-guide-islands-history-mythology",
            "title": "Greece Travel Guide: Islands, History & Mythology",
            "subtitle": "Ancient ruins meet azure seas in the cradle of democracy.",
            "description": "Explore Greece's ancient heritage, stunning islands, and Mediterranean lifestyle. From Athens' Acropolis to Santorini's sunsets and the warmth of Greek hospitality.",
            "hero_image": "/images/countries/country-greece.jpg",
            "tags": ["Greece", "Greek Islands", "Ancient History", "Mediterranean", "Mythology"]
        },
        {
            "country": "Croatia",
            "slug": "croatia-travel-guide-coast-dubrovnik-islands",
            "title": "Croatia Travel Guide: Coast, Dubrovnik & Islands",
            "subtitle": "Adriatic jewel with medieval walls and crystal waters.",
            "description": "Discover Croatia's stunning Adriatic coastline, historic cities, and pristine islands. From Dubrovnik's walls to Plitvice's waterfalls and Split's Roman heritage.",
            "hero_image": "/images/countries/country-croatia.jpg",
            "tags": ["Croatia", "Adriatic", "Dubrovnik", "Islands", "Coast"]
        },
        {
            "country": "Iceland",
            "slug": "iceland-travel-guide-northern-lights-nature",
            "title": "Iceland Travel Guide: Northern Lights & Nature",
            "subtitle": "Fire and ice in the land of dramatic natural wonders.",
            "description": "Experience Iceland's otherworldly landscapes, from geysers and waterfalls to glaciers and volcanic fields. Witness the Northern Lights in this Nordic island paradise.",
            "hero_image": "/images/countries/country-iceland.jpg",
            "tags": ["Iceland", "Northern Lights", "Waterfalls", "Glaciers", "Nordic"]
        },
        {
            "country": "Ireland",
            "slug": "ireland-travel-guide-green-landscapes-culture",
            "title": "Ireland Travel Guide: Green Landscapes & Culture",
            "subtitle": "Emerald hills, warm hearts, and centuries of storytelling.",
            "description": "Explore Ireland's lush countryside, dramatic coastlines, and rich cultural traditions. From Dublin's literary heritage to the Wild Atlantic Way and Celtic history.",
            "hero_image": "/images/countries/country-ireland.jpg",
            "tags": ["Ireland", "Green Landscapes", "Celtic Culture", "Dublin", "Atlantic Way"]
        },
        {
            "country": "United Kingdom",
            "slug": "uk-travel-guide-london-scotland-wales",
            "title": "UK Travel Guide: London, Scotland & Wales",
            "subtitle": "Royal heritage, rolling countryside, and cultural diversity.",
            "description": "Discover the United Kingdom's rich history, from London's iconic landmarks to Scotland's highlands and Wales' rugged beauty. Experience British culture and tradition.",
            "hero_image": "/images/countries/country-united-kingdom.jpg",
            "tags": ["United Kingdom", "London", "Scotland", "Wales", "Royal Heritage"]
        },
        {
            "country": "Norway",
            "slug": "norway-travel-guide-fjords-northern-lights",
            "title": "Norway Travel Guide: Fjords & Northern Lights",
            "subtitle": "Majestic fjords and midnight sun in Scandinavia's crown jewel.",
            "description": "Experience Norway's breathtaking fjords, Northern Lights, and midnight sun. From Bergen's colorful houses to the Lofoten Islands and Arctic adventures.",
            "hero_image": "/images/countries/country-norway.jpg",
            "tags": ["Norway", "Fjords", "Northern Lights", "Scandinavia", "Arctic"]
        },
        {
            "country": "Sweden",
            "slug": "sweden-travel-guide-stockholm-nature-design",
            "title": "Sweden Travel Guide: Stockholm, Nature & Design",
            "subtitle": "Scandinavian design, pristine forests, and innovative culture.",
            "description": "Explore Sweden's blend of modern design and natural beauty. From Stockholm's archipelago to Lapland's wilderness and the Swedish approach to work-life balance.",
            "hero_image": "/images/countries/country-sweden.jpg",
            "tags": ["Sweden", "Stockholm", "Scandinavian Design", "Nature", "Innovation"]
        },
        {
            "country": "Finland",
            "slug": "finland-travel-guide-helsinki-lapland-saunas",
            "title": "Finland Travel Guide: Helsinki, Lapland & Saunas",
            "subtitle": "Land of a thousand lakes, endless forests, and Nordic tranquility.",
            "description": "Discover Finland's pristine nature, innovative cities, and unique culture. From Helsinki's design districts to Lapland's wilderness and the Finnish sauna tradition.",
            "hero_image": "/images/countries/country-finland.jpg",
            "tags": ["Finland", "Helsinki", "Lapland", "Saunas", "Nordic Nature"]
        }
    ]

    # Create blog posts data
    blog_posts = []
    for i, country_data in enumerate(countries, 1):
        post = {
            "id": f"country-{i:02d}",
            "slug": country_data["slug"],
            "locale": "en",
            "category_slug": "countries",
            "title": country_data["title"],
            "subtitle": country_data["subtitle"],
            "body": f"# {country_data['title']}\n\n{country_data['description']}\n\n## Why Visit {country_data['country']}\n\n{country_data['country']} offers travelers an authentic European experience with its unique blend of history, culture, and natural beauty. Whether you're interested in iconic landmarks, local cuisine, or hidden gems, this destination provides memories that last a lifetime.\n\n## Best Time to Visit\n\nThe ideal time to visit {country_data['country']} depends on your preferences for weather, crowds, and activities. Spring and early fall generally offer the best balance of pleasant weather and manageable tourist numbers.\n\n## Travel Tips\n\n- Research local customs and basic phrases\n- Book accommodations in advance during peak season\n- Try regional specialties and local experiences\n- Consider sustainable travel options\n- Pack appropriately for the season and activities planned",
            "hero_image": country_data["hero_image"],
            "meta_title": f"{country_data['title']} | Travel Across EU",
            "meta_description": f"{country_data['description'][:150]}...",
            "og_title": country_data["title"],
            "og_description": country_data["subtitle"],
            "canonical_url": "",
            "seo_enabled": True,
            "jsonld_type": "Article",
            "jsonld_override": "",
            "tags": country_data["tags"]
        }
        blog_posts.append(post)
    
    return blog_posts

def main():
    """Main function to generate and save country blog posts"""
    
    # Generate the posts
    posts = create_country_posts()
    
    # Save to JSON file
    output_file = "content/countries_blog_posts.json"
    os.makedirs("content", exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Generated {len(posts)} country blog posts")
    print(f"📁 Saved to: {output_file}")
    print(f"🎯 Category: Countries")
    print(f"📝 Ready for JSON import via Django admin")
    
    # List the expected image filenames
    print(f"\n📸 Expected image files in media/countries/:")
    for i, post in enumerate(posts, 1):
        image_path = post["hero_image"].replace("/images/countries/", "")
        print(f"{i:2d}. {image_path}")

if __name__ == '__main__':
    main()