from django.contrib import admin
from django.urls import path, include, re_path


urlpatterns = [
    path('accounts/', include('allauth.urls')),
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),
    path("", include("frontend.urls")),
]
