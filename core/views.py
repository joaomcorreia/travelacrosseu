from django.http import JsonResponse
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from core.ai import generate_travel_page_draft

from .models import Category, City, Country, TravelPage
from .serializers import (
    AIGenerateTravelPageSerializer,
    AIGeneratedTravelPageSerializer,
    CategorySerializer,
    CitySerializer,
    CountrySerializer,
    TravelPageSerializer,
)


class CountryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer


class CityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = City.objects.select_related("country").all()
    serializer_class = CitySerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class TravelPageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TravelPage.objects.select_related(
        "country",
        "city",
        "category",
    ).all()
    serializer_class = TravelPageSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        language = self.request.query_params.get("language")
        slug = self.request.query_params.get("slug")
        group_id = self.request.query_params.get("group_id")

        if language:
            qs = qs.filter(language=language)
        if slug:
            qs = qs.filter(slug=slug)
        if group_id:
            qs = qs.filter(group_id=group_id)

        return qs


def api_root(request):
    return JsonResponse({
        "status": "ok",
        "project": "TravelAcrossEU",
    })


@api_view(["POST"])
@permission_classes([AllowAny])
def ai_generate_travel_page(request):
    """Generate travel page drafts via OpenAI without persisting any data."""

    input_serializer = AIGenerateTravelPageSerializer(data=request.data)
    input_serializer.is_valid(raise_exception=True)

    data = input_serializer.validated_data

    draft = generate_travel_page_draft(
        language=data["language"],
        country=data["country"],
        city=data.get("city") or None,
        category=data.get("category") or None,
        tone=data.get("tone") or "friendly and informative",
    )

    output_serializer = AIGeneratedTravelPageSerializer(data=draft)
    output_serializer.is_valid(raise_exception=True)

    return Response(output_serializer.data, status=status.HTTP_200_OK)
