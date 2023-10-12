from django.urls import path, re_path
from .views import *

urlpatterns = [
    # Authenticate
    path("register", RegisterUser.as_view()),
    path("authenticate", AuthenticateUser.as_view()),
    path("logout", LogoutUser.as_view()),
]
