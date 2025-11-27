"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework import routers

from core.views import (
    CategoryViewSet,
    CityViewSet,
    CountryViewSet,
    TravelPageViewSet,
    ai_generate_travel_page,
    api_root,
)
from cms.admin_dashboard import admin_dashboard
from cms.admin_urls import MediaLibraryView

router = routers.DefaultRouter()
router.register(r"countries", CountryViewSet, basename="country")
router.register(r"cities", CityViewSet, basename="city")
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"pages", TravelPageViewSet, basename="travelpage")

urlpatterns = [
    path('admin/dashboard/', admin_dashboard, name='admin-dashboard'),
    path('admin/media-library/', MediaLibraryView.as_view(), name='media_library'),
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/', include(router.urls)),
    path('api/ai/generate-page/', ai_generate_travel_page, name='ai-generate-page'),
    path('api/cms/', include('cms.urls')),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
