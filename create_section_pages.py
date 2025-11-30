#!/usr/bin/env python3

import os
import sys
import django

# Add the project root to Python path
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from cms.models import Page, PageTranslation, SUPPORTED_LOCALES
from openai import OpenAI
from django.conf import settings

def main():
    # Initialize OpenAI client
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    
    # Create page data for travel-stories and trip-ideas
    pages_data = [
        {
            'slug': 'travel-stories',
            'page_type': Page.PageType.CUSTOM,
            'translations': {
                'en': {
                    'title': 'Travel Stories',
                    'subtitle': 'First-hand stories and experiences from trips across Europe.',
                    'meta_title': 'Travel Stories – TravelAcross EU',
                    'meta_description': 'Real trips, honest lessons and calm, practical advice for travelling across Europe. Discover authentic travel stories from fellow European adventurers.',
                    'body': 'Explore our collection of real travel experiences, honest lessons learned, and practical advice for European adventures. From weekend city breaks to month-long journeys, discover how fellow travelers navigated Europe and what they learned along the way.'
                }
            }
        },
        {
            'slug': 'trip-ideas',
            'page_type': Page.PageType.CUSTOM,
            'translations': {
                'en': {
                    'title': 'Trip Ideas',
                    'subtitle': 'Weekend escapes, road trips, and longer itineraries across Europe.',
                    'meta_title': 'Trip Ideas – TravelAcross EU',
                    'meta_description': 'Simple itineraries and calm, realistic suggestions for trips around Europe. Discover carefully curated trip ideas for every type of traveler.',
                    'body': 'Discover carefully curated trip ideas and simple itineraries for European adventures. Whether you\'re planning a quick weekend getaway or an extended journey, find realistic suggestions that match your travel style and timeline.'
                }
            }
        }
    ]
    
    # Localized slug mappings for PageTranslation.slug field
    localized_slugs = {
        'travel-stories': {
            'en': 'travel-stories',
            'pt': 'historias-de-viagem',
            'fr': 'recits-de-voyage', 
            'nl': 'reisverhalen',
            'es': 'historias-de-viaje'
        },
        'trip-ideas': {
            'en': 'trip-ideas',
            'pt': 'ideias-de-viagem',
            'fr': 'idees-de-voyage',
            'nl': 'reis-ideeen', 
            'es': 'ideas-de-viaje'
        }
    }
    
    def translate_text(text, target_locale, context=""):
        """Translate text to target locale using OpenAI"""
        locale_names = {
            'pt': 'Portuguese',
            'fr': 'French', 
            'nl': 'Dutch',
            'es': 'Spanish'
        }
        
        if target_locale == 'en':
            return text
            
        target_language = locale_names.get(target_locale, target_locale)
        
        prompt = f"""Translate the following {context} text to {target_language}. 
Keep the tone professional and travel-focused. Maintain any technical terms appropriately.

Text to translate: "{text}"

Translation:"""
        
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=200,
                temperature=0.3
            )
            return response.choices[0].message.content.strip().strip('"')
        except Exception as e:
            print(f"Translation failed for {target_locale}: {e}")
            return text
    
    # Create pages and translations
    for page_data in pages_data:
        print(f"\n=== Creating page: {page_data['slug']} ===")
        
        # Create or get the Page
        page, created = Page.objects.get_or_create(
            slug=page_data['slug'],
            defaults={
                'page_type': page_data['page_type'],
                'is_published': True
            }
        )
        
        if created:
            print(f"✓ Created new Page: {page.slug}")
        else:
            print(f"✓ Page already exists: {page.slug}")
        
        # Get English content as source
        en_content = page_data['translations']['en']
        
        # Create translations for all locales
        for locale_code, locale_name in SUPPORTED_LOCALES:
            print(f"\n--- Processing locale: {locale_code} ---")
            
            # Check if translation already exists
            translation, created = PageTranslation.objects.get_or_create(
                page=page,
                locale=locale_code,
                defaults={'title': 'Temp Title'}  # Temporary, will be updated
            )
            
            if locale_code == 'en':
                # Use the source English content directly
                translation.slug = localized_slugs[page_data['slug']][locale_code]
                translation.title = en_content['title']
                translation.subtitle = en_content['subtitle']
                translation.meta_title = en_content['meta_title']
                translation.meta_description = en_content['meta_description']
                translation.body = en_content['body']
                translation.save()
                print(f"✓ Updated English translation")
            else:
                # Translate to target locale
                if created:
                    print(f"✓ Created new translation for {locale_code}")
                else:
                    print(f"✓ Updating existing translation for {locale_code}")
                
                # Translate each field
                translation.slug = localized_slugs[page_data['slug']][locale_code]
                translation.title = translate_text(en_content['title'], locale_code, "page title")
                translation.subtitle = translate_text(en_content['subtitle'], locale_code, "page subtitle")
                translation.meta_title = translate_text(en_content['meta_title'], locale_code, "SEO meta title")
                translation.meta_description = translate_text(en_content['meta_description'], locale_code, "SEO meta description")
                translation.body = translate_text(en_content['body'], locale_code, "page body content")
                translation.save()
                
                print(f"✓ Translated and saved {locale_code} content:")
                print(f"   Title: {translation.title}")
                print(f"   Slug: {translation.slug}")

    print("\n=== Summary ===")
    print("Created/updated Page records and PageTranslations for:")
    print("- travel-stories (with localized slugs)")
    print("- trip-ideas (with localized slugs)")
    print("\nAll translations completed for locales: en, pt, fr, nl, es")

if __name__ == "__main__":
    main()