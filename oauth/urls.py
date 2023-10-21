from django.urls import path, re_path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import *

urlpatterns = [
    # Authenticate
    path("token", ObtainTokenView.as_view()),
    path("refresh", TokenRefreshView.as_view()),
    path("logged_in", LoggedInView.as_view()),
    path("logout", LogoutView.as_view()),
]
