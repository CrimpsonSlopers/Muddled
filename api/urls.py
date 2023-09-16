from django.urls import path, re_path
from .views import *

urlpatterns = [
    path("session", StreamSessionView.as_view()),
    path("session/<int:id>", StreamSessionView.as_view()),
    path("video", VideoView.as_view()),
    path("video/<int:id>", VideoView.as_view()),
    path("saved-videos", SavedVideosView.as_view()),
    path("video-submitted", VideoSubmitted.as_view()),
    path("viewer", ViewerView.as_view()),
    path("viewer/<str:login>", ViewerView.as_view()),
    # Authenticate
    path("authenticate", AuthenticateUser.as_view()),
    path("login", Login.as_view()),
]
