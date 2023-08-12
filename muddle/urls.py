from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('auth/', include('drf_social_oauth2.urls', namespace='drf')),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('', include('frontend.urls')),
]
