from django.urls import path
from .views import *

urlpatterns = [
    path('stream-session', StreamSessionView.as_view()),
    path('stream-session/<int:id>', StreamSessionView.as_view()),

    path('video', VideoView.as_view()),
    path('video/<int:id>', VideoView.as_view()),
    path('saved-videos', SavedVideosView.as_view()),
    path('video-submitted', VideoSubmitted.as_view()),
    
    path('get-access-token', GetAccessToken.as_view()),
    path('authenticate', Authenticate.as_view()),
    path('register_by_access_token/<str:backend>/$', register_by_access_token)
]
