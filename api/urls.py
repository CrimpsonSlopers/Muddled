from django.urls import path, re_path
from .views import *

urlpatterns = [
    path("user/", UserView.as_view()),
    path("oauth/", TwitchAuthView.as_view()),
]
