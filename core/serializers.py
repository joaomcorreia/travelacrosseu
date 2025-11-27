from rest_framework import serializers

from .models import Category, City, Country, TravelPage


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ["id", "code", "name", "slug"]


class CitySerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)

    class Meta:
        model = City
        fields = ["id", "name", "slug", "country"]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class TravelPageSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)
    city = CitySerializer(read_only=True)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = TravelPage
        fields = [
            "id",
            "group_id",
            "language",
            "slug",
            "title",
            "summary",
            "body",
            "is_published",
            "country",
            "city",
            "category",
            "created_at",
            "updated_at",
        ]


class AIGenerateTravelPageSerializer(serializers.Serializer):
    language = serializers.CharField(max_length=5)
    country = serializers.CharField(max_length=100)
    city = serializers.CharField(
        max_length=100, required=False, allow_blank=True, allow_null=True
    )
    category = serializers.CharField(
        max_length=100, required=False, allow_blank=True, allow_null=True
    )
    tone = serializers.CharField(
        max_length=100,
        required=False,
        default="friendly and informative",
    )


class AIGeneratedTravelPageSerializer(serializers.Serializer):
    title = serializers.CharField()
    summary = serializers.CharField()
    body = serializers.CharField()
