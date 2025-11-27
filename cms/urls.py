from django.urls import path

from cms import views

urlpatterns = [
    path("pages/<slug:slug>/", views.page_detail, name="cms-page-detail"),
    path("countries/", views.countries_list, name="cms-countries-list"),
    path("cities/", views.cities_list, name="cms-cities-list"),
    path("destinations/", views.destinations_list, name="cms-destinations-list"),
    path("destinations/<slug:slug>/", views.destination_detail, name="cms-destination-detail"),
    path("blog/", views.blog_posts_list, name="cms-blog-posts-list"),
    path("blog/categories/", views.blog_categories_list, name="cms-blog-categories-list"),
    path("blog/category/<slug:slug>/", views.blog_category_detail, name="cms-blog-category-detail"),
    path("blog/<slug:slug>/", views.blog_post_detail, name="cms-blog-post-detail"),
    path("media/", views.media_list, name="cms-media-list"),
    path("navigation/", views.navigation_list, name="cms-navigation-list"),
    path("footer/", views.footer_list, name="cms-footer-list"),
    path("homepage-categories/", views.homepage_categories, name="cms-homepage-categories"),
    path("resolve-translation/", views.resolve_translation, name="cms-resolve-translation"),
]
