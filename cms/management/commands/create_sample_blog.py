from django.core.management.base import BaseCommand
from cms.models import BlogCategory, BlogPost, BlogPostTranslation, BlogPostSection


class Command(BaseCommand):
    help = "Create sample blog data for Phase 5 Step 10 testing"

    def handle(self, *args, **options):
        # Create Travel Tips category
        travel_tips, created = BlogCategory.objects.get_or_create(
            slug="travel-tips",
            defaults={
                "name": "Travel Tips",
                "is_published": True,
                "order": 1,
            }
        )
        if created:
            self.stdout.write(f"Created category: {travel_tips.name}")

        # Create Travel Guides category
        travel_guides, created = BlogCategory.objects.get_or_create(
            slug="travel-guides",
            defaults={
                "name": "Travel Guides",
                "is_published": True,
                "order": 2,
            }
        )
        if created:
            self.stdout.write(f"Created category: {travel_guides.name}")

        # Create Food & Culture category
        food_culture, created = BlogCategory.objects.get_or_create(
            slug="food-culture",
            defaults={
                "name": "Food & Culture",
                "is_published": True,
                "order": 3,
            }
        )
        if created:
            self.stdout.write(f"Created category: {food_culture.name}")

        # Create first blog post
        packing_tips, created = BlogPost.objects.get_or_create(
            slug="ultimate-packing-guide-europe",
            defaults={
                "category": travel_tips,
                "is_published": True,
            }
        )
        if created:
            self.stdout.write(f"Created blog post: {packing_tips.slug}")

        # Create English translation for packing tips
        en_packing, created = BlogPostTranslation.objects.get_or_create(
            post=packing_tips,
            locale="en",
            defaults={
                "title": "The Ultimate Packing Guide for Europe",
                "subtitle": "Everything you need to know about packing smart for your European adventure",
                "body": "Packing for a European trip can be challenging, especially when you're visiting multiple countries with different climates and cultures. Whether you're planning a summer Mediterranean cruise or a winter Christmas market tour, having the right items in your luggage can make or break your travel experience.\\n\\nThe key to successful European packing is versatility. Choose items that can be mixed, matched, and layered to adapt to changing weather conditions and social situations. Focus on quality over quantity, and always remember that you can buy forgotten items once you arrive.\\n\\nIn this comprehensive guide, we'll walk through essential packing strategies, must-have items for each season, and insider tips from seasoned European travelers.",
                "meta_title": "Ultimate Europe Packing Guide 2025 - Travel Light, Travel Smart",
                "meta_description": "Master European packing with our comprehensive guide. Learn what to pack for every season, essential items, and insider tips for traveling light across Europe."
            }
        )
        if created:
            self.stdout.write(f"Created English translation for: {packing_tips.slug}")

        # Create French translation for packing tips
        fr_packing, created = BlogPostTranslation.objects.get_or_create(
            post=packing_tips,
            locale="fr",
            defaults={
                "title": "Le Guide Ultime pour Faire ses Bagages en Europe",
                "subtitle": "Tout ce que vous devez savoir pour faire vos bagages intelligemment pour votre aventure européenne",
                "body": "Faire ses bagages pour un voyage européen peut être difficile, surtout lorsque vous visitez plusieurs pays avec des climats et des cultures différents. Que vous planifiiez une croisière méditerranéenne en été ou une visite des marchés de Noël en hiver, avoir les bons articles dans vos bagages peut faire ou défaire votre expérience de voyage.\\n\\nLa clé d'un emballage européen réussi est la polyvalence. Choisissez des articles qui peuvent être mélangés, assortis et superposés pour s'adapter aux conditions météorologiques changeantes et aux situations sociales. Concentrez-vous sur la qualité plutôt que sur la quantité, et rappelez-vous toujours que vous pouvez acheter des articles oubliés une fois arrivé.\\n\\nDans ce guide complet, nous passerons en revue les stratégies d'emballage essentielles, les articles indispensables pour chaque saison, et les conseils d'initiés de voyageurs européens expérimentés.",
                "meta_title": "Guide Ultime des Bagages Europe 2025 - Voyager Léger, Voyager Intelligent",
                "meta_description": "Maîtrisez l'art de faire ses bagages européens avec notre guide complet. Apprenez quoi emballer pour chaque saison, les articles essentiels, et les conseils d'initiés."
            }
        )
        if created:
            self.stdout.write(f"Created French translation for: {packing_tips.slug}")

        # Create sections for English translation
        section1, created = BlogPostSection.objects.get_or_create(
            translation=en_packing,
            order=1,
            defaults={
                "section_type": "text",
                "title": "Essential Clothing Strategy",
                "body": "Build your European wardrobe around a neutral color palette. Stick to blacks, grays, navy blues, and one accent color. This allows you to mix and match pieces effortlessly while maintaining a polished appearance. Choose wrinkle-resistant fabrics like merino wool, which naturally resists odors and regulates temperature.\\n\\nLayering is crucial in Europe, where weather can change dramatically throughout the day. Pack lightweight pieces that can be combined for warmth or worn separately in milder conditions. A good base layer, insulating mid-layer, and waterproof outer shell will handle most European weather scenarios."
            }
        )

        section2, created = BlogPostSection.objects.get_or_create(
            translation=en_packing,
            order=2,
            defaults={
                "section_type": "text_image",
                "title": "Must-Have Footwear",
                "body": "Comfortable walking shoes are non-negotiable for European travel. European cities involve extensive walking on cobblestone streets, uneven surfaces, and long museum corridors. Invest in high-quality, broken-in shoes with good arch support.\\n\\nPack a maximum of three pairs: comfortable walking shoes for daily sightseeing, dressier shoes for evenings out, and weatherproof boots if traveling in winter or to northern regions. Avoid new shoes that haven't been tested on long walks."
            }
        )

        section3, created = BlogPostSection.objects.get_or_create(
            translation=en_packing,
            order=3,
            defaults={
                "section_type": "cta",
                "title": "Ready to Pack Smart?",
                "body": "Download our complete European packing checklist and never forget an essential item again. Our printable PDF includes season-specific recommendations, luggage weight tips, and space-saving techniques used by professional travelers.",
                "cta_label": "Get Free Packing Checklist",
                "cta_url": "/resources/europe-packing-checklist"
            }
        )

        # Create second blog post
        lisbon_guide, created = BlogPost.objects.get_or_create(
            slug="48-hours-lisbon-complete-guide",
            defaults={
                "category": travel_guides,
                "is_published": True,
            }
        )
        if created:
            self.stdout.write(f"Created blog post: {lisbon_guide.slug}")

        # Create English translation for Lisbon guide
        en_lisbon, created = BlogPostTranslation.objects.get_or_create(
            post=lisbon_guide,
            locale="en",
            defaults={
                "title": "48 Hours in Lisbon: A Complete Weekend Guide",
                "subtitle": "Make the most of your weekend in Portugal's captivating capital",
                "body": "Lisbon is the perfect European city break destination, offering a compelling mix of historic charm, contemporary culture, and spectacular Atlantic coastline views. With its colorful tiled buildings, vintage trams, and world-class pastéis de nata, Portugal's capital city delivers an unforgettable experience that can be thoroughly enjoyed in just 48 hours.\\n\\nThis weekend itinerary is designed to help you experience Lisbon's essential highlights while leaving room for spontaneous discoveries. From the historic Alfama district to the trendy LX Factory, we'll guide you through the must-see attractions, hidden gems, and authentic local experiences that make Lisbon special.\\n\\nWhether you're interested in history, food, art, or simply soaking up the laid-back Portuguese lifestyle, this guide ensures you'll make the most of every moment in this enchanting city.",
                "meta_title": "48 Hours in Lisbon: Perfect Weekend Itinerary | Travel Guide 2025",
                "meta_description": "Discover the best of Lisbon in 48 hours with our complete weekend guide. Historic neighborhoods, must-try food, hidden gems, and insider tips for Portugal's capital."
            }
        )
        if created:
            self.stdout.write(f"Created English translation for: {lisbon_guide.slug}")

        # Create sections for Lisbon guide
        lisbon_section1, created = BlogPostSection.objects.get_or_create(
            translation=en_lisbon,
            order=1,
            defaults={
                "section_type": "text",
                "title": "Day 1: Historic Lisbon",
                "body": "Start your Lisbon adventure in the historic Alfama district, the city's oldest neighborhood that survived the devastating 1755 earthquake. Wander through its narrow, winding streets lined with traditional houses adorned with colorful azulejo tiles. Visit the impressive Lisbon Cathedral and climb to the Miradouro da Senhora do Monte for panoramic city views.\\n\\nAfternoon highlights include exploring the iconic Commerce Square (Praça do Comércio) and taking the famous Tram 28 for a scenic tour through Lisbon's seven hills. End your first day in the vibrant Bairro Alto district, known for its traditional fado music and excellent restaurants."
            }
        )

        lisbon_section2, created = BlogPostSection.objects.get_or_create(
            translation=en_lisbon,
            order=2,
            defaults={
                "section_type": "text",
                "title": "Day 2: Modern Lisbon & Belém",
                "body": "Dedicate your second day to the Belém district, home to some of Portugal's most important monuments. Visit the iconic Belém Tower and Jerónimos Monastery, both UNESCO World Heritage sites that showcase Portugal's maritime heritage during the Age of Discovery.\\n\\nDon't miss the original Pastéis de Belém bakery for authentic pastéis de nata. In the afternoon, explore the modern Parque das Nações area, featuring contemporary architecture, the impressive Oceanarium, and beautiful riverside walkways along the Tagus River."
            }
        )

        # Create third blog post about Portuguese cuisine
        portuguese_food, created = BlogPost.objects.get_or_create(
            slug="portuguese-cuisine-beyond-pastel-de-nata",
            defaults={
                "category": food_culture,
                "is_published": True,
            }
        )
        if created:
            self.stdout.write(f"Created blog post: {portuguese_food.slug}")

        # Create English translation for Portuguese food post
        en_food, created = BlogPostTranslation.objects.get_or_create(
            post=portuguese_food,
            locale="en",
            defaults={
                "title": "Portuguese Cuisine: Beyond Pastéis de Nata",
                "subtitle": "Discover the rich culinary traditions of Portugal's diverse regional foods",
                "body": "While pastéis de nata may be Portugal's most famous culinary export, the country's gastronomic landscape extends far beyond this beloved custard tart. Portuguese cuisine reflects centuries of maritime exploration, bringing together influences from Africa, Asia, and the Americas while maintaining distinctly Iberian roots.\\n\\nFrom the hearty francesinha sandwiches of Porto to the fresh seafood cataplanas of the Algarve, each Portuguese region offers unique specialties shaped by local ingredients and cultural traditions. Understanding Portuguese food culture opens doors to authentic travel experiences and connects visitors with the soul of this maritime nation.\\n\\nJoin us on a culinary journey through Portugal's diverse food landscape, where ancient recipes meet modern innovation, and every meal tells a story of exploration, tradition, and community.",
                "meta_title": "Portuguese Cuisine Guide: Traditional Foods Beyond Pastéis de Nata",
                "meta_description": "Explore authentic Portuguese cuisine beyond the famous pastéis de nata. Discover regional specialties, traditional dishes, and food culture across Portugal."
            }
        )
        if created:
            self.stdout.write(f"Created English translation for: {portuguese_food.slug}")

        self.stdout.write(
            self.style.SUCCESS("Successfully created sample blog data!")
        )
        self.stdout.write("Available blog content:")
        self.stdout.write(f"- Travel Tips > Ultimate Packing Guide for Europe ({packing_tips.slug})")
        self.stdout.write(f"- Travel Guides > 48 Hours in Lisbon ({lisbon_guide.slug})")
        self.stdout.write(f"- Food & Culture > Portuguese Cuisine Beyond Pastéis de Nata ({portuguese_food.slug})")