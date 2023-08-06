from django.urls import path, re_path
from .views import *

urlpatterns = [
    path("stream_session", StreamSessionView.as_view()),
    path("stream_session/<int:id>", StreamSessionView.as_view()),

    path("video", VideoView.as_view()),

    path("authenticate", AuthenticateUser.as_view()),
    path("login", Login.as_view()),
    path("parse_irc_message", ParseIRCMessage.as_view())
]
