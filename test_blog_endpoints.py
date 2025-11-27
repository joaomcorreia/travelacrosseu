import urllib.request
import json

def test_blog_api():
    try:
        # Test blog posts endpoint
        response = urllib.request.urlopen('http://127.0.0.1:8000/api/cms/blog/')
        posts_data = json.loads(response.read().decode())
        print(f"✅ Blog Posts API: Status 200, Found {len(posts_data)} posts")
        if posts_data:
            print(f"   First post: {posts_data[0]['title']}")
            print(f"   Categories: {[post['category']['name'] for post in posts_data]}")
        
        # Test blog categories endpoint  
        response = urllib.request.urlopen('http://127.0.0.1:8000/api/cms/blog/categories/')
        categories_data = json.loads(response.read().decode())
        print(f"✅ Blog Categories API: Status 200, Found {len(categories_data)} categories")
        if categories_data:
            print(f"   Categories: {[cat['name'] for cat in categories_data]}")
            
        # Test specific category endpoint
        travel_tips_response = urllib.request.urlopen('http://127.0.0.1:8000/api/cms/blog/category/travel-tips/')
        travel_tips_data = json.loads(travel_tips_response.read().decode())
        print(f"✅ Travel Tips Category: Found {len(travel_tips_data['posts'])} posts")
        
        # Test specific post endpoint
        post_response = urllib.request.urlopen('http://127.0.0.1:8000/api/cms/blog/ultimate-packing-guide-europe/')
        post_data = json.loads(post_response.read().decode())
        print(f"✅ Specific Post: {post_data['title']}")
        print(f"   Translations: {len(post_data['translations'])}")
        
        return True
    except Exception as e:
        print(f"❌ API Error: {e}")
        return False

if __name__ == "__main__":
    test_blog_api()