from django.contrib import admin
from django.urls import path, include, re_path
from api import views as api_views


urlpatterns = [
    path('auth/', include('drf_social_oauth2.urls', namespace='social')),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('', include('frontend.urls')),
]
