from django.urls import path, re_path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import *

urlpatterns = [
    # Authenticate
    path("token/", ObtainTokenView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
    path("auth/", TwitchAuthView.as_view()),
]
