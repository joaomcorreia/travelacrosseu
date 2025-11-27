#!/usr/bin/env python3
import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from cms.models import BlogPost, BlogPostTranslation, BlogCategory

def create_sample_blog_posts():
    # Get categories
    try:
        travel_stories_category = BlogCategory.objects.get(slug='travel-stories')
        trip_ideas_category = BlogCategory.objects.get(slug='trip-ideas')
    except BlogCategory.DoesNotExist:
        print("Blog categories not found. Run create_blog_categories.py first.")
        return

    # Sample Travel Stories
    travel_stories_data = [
        {
            'slug': 'first-time-solo-travel-europe',
            'title': 'My First Solo Trip Across Europe: What I Wish I Knew',
            'subtitle': 'Real lessons from a nervous first-timer who learned to love solo European adventures.',
            'body': 'Starting my first solo European adventure was terrifying. I had planned everything down to the minute, researched every hostel review, and packed enough backup plans to fill a suitcase. Looking back after three weeks of incredible experiences, here\'s what I actually needed to know...'
        },
        {
            'slug': 'budget-travel-mistakes-eastern-europe',
            'title': 'Budget Travel Mistakes I Made in Eastern Europe',
            'subtitle': 'How spending too little money actually cost me more in the long run.',
            'body': 'Everyone talks about overspending while traveling, but what about underspending? During my month-long trip through Poland, Czech Republic, and Hungary, I learned that being too budget-conscious can actually make travel more expensive and less enjoyable...'
        },
        {
            'slug': 'train-travel-vs-flying-europe-comparison',
            'title': 'Train vs Flight: My 6-Month Europe Experiment',
            'subtitle': 'I spent 6 months traveling Europe by train and another 6 by plane. Here\'s the honest comparison.',
            'body': 'To settle the debate once and for all, I decided to split my year-long European adventure: six months traveling exclusively by train, and six months flying between cities. The results surprised me in ways I never expected...'
        }
    ]

    # Sample Trip Ideas  
    trip_ideas_data = [
        {
            'slug': '5-day-prague-vienna-budapest',
            'title': '5 Days, 3 Cities: Prague → Vienna → Budapest',
            'subtitle': 'A realistic Central European triangle for first-time visitors with limited time.',
            'body': 'The Central European triangle of Prague, Vienna, and Budapest is perfect for travelers who want maximum culture in minimum time. This 5-day itinerary focuses on the highlights without rushing, leaving you wanting to return rather than exhausted...'
        },
        {
            'slug': 'lisbon-porto-weekend-train-route',
            'title': 'Lisbon to Porto: The Perfect Weekend Train Route',
            'subtitle': 'Two days, two cities, and the most scenic train journey in Portugal.',
            'body': 'Portugal\'s train connection between Lisbon and Porto offers one of Europe\'s most underrated rail experiences. This weekend itinerary maximizes both cities while enjoying the beautiful countryside views along the way...'
        },
        {
            'slug': 'amsterdam-bruges-ghent-cycling-circuit',
            'title': 'Amsterdam → Bruges → Ghent: A Low Countries Cycling Circuit',
            'subtitle': 'Four days of flat cycling through Holland and Belgium\'s most charming cities.',
            'body': 'This cycling route connects three of the Low Countries\' most beautiful cities via dedicated bike paths, canals, and countryside. Perfect for intermediate cyclists who want culture with their cardio...'
        }
    ]

    # Create Travel Stories posts
    print("Creating Travel Stories posts...")
    for i, post_data in enumerate(travel_stories_data):
        post, created = BlogPost.objects.get_or_create(
            slug=post_data['slug'],
            defaults={
                'category': travel_stories_category,
                'is_published': True
            }
        )
        
        if created:
            print(f"✓ Created post: {post_data['title']}")
        else:
            print(f"- Post already exists: {post_data['title']}")

        # Create English translation
        translation, trans_created = BlogPostTranslation.objects.get_or_create(
            post=post,
            locale='en',
            defaults={
                'title': post_data['title'],
                'subtitle': post_data['subtitle'],
                'body': post_data['body']
            }
        )
        
        if trans_created:
            print(f"  ✓ Created EN translation")

    # Create Trip Ideas posts
    print("\nCreating Trip Ideas posts...")
    for i, post_data in enumerate(trip_ideas_data):
        post, created = BlogPost.objects.get_or_create(
            slug=post_data['slug'],
            defaults={
                'category': trip_ideas_category,
                'is_published': True
            }
        )
        
        if created:
            print(f"✓ Created post: {post_data['title']}")
        else:
            print(f"- Post already exists: {post_data['title']}")

        # Create English translation
        translation, trans_created = BlogPostTranslation.objects.get_or_create(
            post=post,
            locale='en',
            defaults={
                'title': post_data['title'],
                'subtitle': post_data['subtitle'],
                'body': post_data['body']
            }
        )
        
        if trans_created:
            print(f"  ✓ Created EN translation")

    # Summary
    print(f"\nSummary:")
    print(f"- Travel Stories posts: {BlogPost.objects.filter(category__slug='travel-stories').count()}")
    print(f"- Trip Ideas posts: {BlogPost.objects.filter(category__slug='trip-ideas').count()}")
    print(f"- Total blog posts: {BlogPost.objects.count()}")

if __name__ == '__main__':
    create_sample_blog_posts()