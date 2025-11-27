from django.core.management.base import BaseCommand
from cms.models import Country, City, Destination, DestinationTranslation


class Command(BaseCommand):
    help = "Create sample destination data for Phase 5 Step 9 testing"

    def handle(self, *args, **options):
        # Create Portugal
        portugal, created = Country.objects.get_or_create(
            slug="portugal",
            defaults={
                "name": "Portugal",
                "is_published": True,
                "order": 1,
            }
        )
        if created:
            self.stdout.write(f"Created country: {portugal.name}")

        # Create Lisbon
        lisbon, created = City.objects.get_or_create(
            slug="lisbon",
            country=portugal,
            defaults={
                "name": "Lisbon",
                "is_published": True,
                "order": 1,
            }
        )
        if created:
            self.stdout.write(f"Created city: {lisbon.name}")

        # Create Belém Tower destination
        belem_tower, created = Destination.objects.get_or_create(
            slug="belem-tower",
            city=lisbon,
            defaults={
                "is_published": True,
            }
        )
        if created:
            self.stdout.write(f"Created destination: {belem_tower.slug}")

        # Create English translation for Belém Tower
        en_translation, created = DestinationTranslation.objects.get_or_create(
            destination=belem_tower,
            locale="en",
            defaults={
                "title": "Belém Tower",
                "subtitle": "A UNESCO World Heritage fortress guarding Lisbon's harbor",
                "body": "The iconic Belém Tower (Torre de Belém) stands as one of Lisbon's most recognizable landmarks and a symbol of Portugal's Age of Discovery. Built in the early 16th century, this fortress served as a ceremonial gateway to Lisbon and a defense against invaders approaching from the Tagus River.\n\nThe tower's unique Manueline architecture combines Gothic and Renaissance elements with maritime motifs that reflect Portugal's seafaring heritage. Visitors can explore the tower's multiple levels, including the Governor's room, King's room, and the famous terrace that offers panoramic views of the Tagus River and surrounding area.\n\nDesignated as a UNESCO World Heritage Site in 1983, Belém Tower attracts over 600,000 visitors annually who come to admire its intricate stone carvings, defensive battlements, and historical significance in Portuguese maritime history.",
                "meta_title": "Belém Tower - UNESCO World Heritage Site in Lisbon, Portugal",
                "meta_description": "Explore the iconic Belém Tower in Lisbon, a UNESCO World Heritage fortress from the 16th century that symbolizes Portugal's Age of Discovery."
            }
        )
        if created:
            self.stdout.write(f"Created English translation for: {belem_tower.slug}")

        # Create French translation for Belém Tower
        fr_translation, created = DestinationTranslation.objects.get_or_create(
            destination=belem_tower,
            locale="fr",
            defaults={
                "title": "Tour de Belém",
                "subtitle": "Une forteresse classée au patrimoine mondial de l'UNESCO gardant le port de Lisbonne",
                "body": "L'emblématique Tour de Belém (Torre de Belém) se dresse comme l'un des monuments les plus reconnaissables de Lisbonne et un symbole de l'Âge des Découvertes du Portugal. Construite au début du XVIe siècle, cette forteresse servait de porte d'entrée cérémonielle à Lisbonne et de défense contre les envahisseurs approchant par le Tage.\n\nL'architecture manuéline unique de la tour combine des éléments gothiques et Renaissance avec des motifs maritimes qui reflètent l'héritage maritime du Portugal. Les visiteurs peuvent explorer les multiples niveaux de la tour, notamment la salle du Gouverneur, la salle du Roi et la célèbre terrasse qui offre des vues panoramiques sur le Tage et les environs.\n\nClassée au patrimoine mondial de l'UNESCO en 1983, la Tour de Belém attire plus de 600 000 visiteurs par an qui viennent admirer ses sculptures en pierre complexes, ses créneaux défensifs et son importance historique dans l'histoire maritime portugaise.",
                "meta_title": "Tour de Belém - Site du patrimoine mondial UNESCO à Lisbonne, Portugal",
                "meta_description": "Explorez l'emblématique Tour de Belém à Lisbonne, une forteresse classée au patrimoine mondial de l'UNESCO du XVIe siècle qui symbolise l'Âge des Découvertes du Portugal."
            }
        )
        if created:
            self.stdout.write(f"Created French translation for: {belem_tower.slug}")

        # Create Spain
        spain, created = Country.objects.get_or_create(
            slug="spain",
            defaults={
                "name": "Spain",
                "is_published": True,
                "order": 2,
            }
        )
        if created:
            self.stdout.write(f"Created country: {spain.name}")

        # Create Barcelona
        barcelona, created = City.objects.get_or_create(
            slug="barcelona",
            country=spain,
            defaults={
                "name": "Barcelona",
                "is_published": True,
                "order": 1,
            }
        )
        if created:
            self.stdout.write(f"Created city: {barcelona.name}")

        # Create Sagrada Familia destination
        sagrada_familia, created = Destination.objects.get_or_create(
            slug="sagrada-familia",
            city=barcelona,
            defaults={
                "is_published": True,
            }
        )
        if created:
            self.stdout.write(f"Created destination: {sagrada_familia.slug}")

        # Create English translation for Sagrada Familia
        en_translation, created = DestinationTranslation.objects.get_or_create(
            destination=sagrada_familia,
            locale="en",
            defaults={
                "title": "Sagrada Familia",
                "subtitle": "Gaudí's masterpiece basilica, an architectural wonder still under construction",
                "body": "The Sagrada Familia stands as Barcelona's most iconic landmark and Antoni Gaudí's crowning architectural achievement. This extraordinary basilica has been under construction for over 140 years and continues to evolve, embodying Gaudí's revolutionary vision of organic architecture.\n\nThe basilica's facade tells the story of Christ's birth, passion, and glory through intricate stone carvings that seem to bring the building to life. Inside, the forest-like columns create a mystical atmosphere as filtered light dances through Gaudí's innovative stained glass windows.\n\nDesignated as a UNESCO World Heritage Site, the Sagrada Familia attracts over 4 million visitors annually. Construction is expected to be completed by 2026, marking the centenary of Gaudí's death and fulfilling a dream over a century in the making.",
                "meta_title": "Sagrada Familia - Gaudí's Masterpiece Basilica in Barcelona, Spain",
                "meta_description": "Discover the Sagrada Familia in Barcelona, Antoni Gaudí's UNESCO World Heritage basilica that has been under construction for over 140 years."
            }
        )
        if created:
            self.stdout.write(f"Created English translation for: {sagrada_familia.slug}")

        self.stdout.write(
            self.style.SUCCESS("Successfully created sample destination data!")
        )
        self.stdout.write("Available destinations:")
        self.stdout.write(f"- Portugal > Lisbon > Belém Tower (belem-tower)")
        self.stdout.write(f"- Spain > Barcelona > Sagrada Familia (sagrada-familia)")