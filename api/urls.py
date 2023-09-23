from django.urls import path, re_path
from .views import *

urlpatterns = [
    # Special Urls
    path("muted-viewers", MutedViewersView.as_view()),
    # Authenticate
    path("authenticate", AuthenticateUser.as_view()),
    path("login", LoginView.as_view()),
    path("logout", LogoutView.as_view()),
]
