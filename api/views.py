import requests
import json

from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import redirect
from django.urls import reverse
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from django.contrib.auth import login
from social_django.utils import psa
from social_core.backends.oauth import BaseOAuth1, BaseOAuth2
from django.http import HttpResponse, HttpResponseBadRequest

from api.models import StreamSession, Video
from api.serializers import *
from muddle.settings import *

class VideoView(APIView):

    def get(self, request, id=None):
        if id:
            video = Video.objects.get(id=id)
            serializer = VideoSerializer(video)
            return Response({"results": serializer.data}, status=status.HTTP_200_OK)
 
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        serializer = VideoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"results": serializer.data}, status=status.HTTP_200_OK)
        
        else:
            return Response({"results": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, id=None):
        video = Video.objects.get(id=id)
        serializer = VideoSerializer(video, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"results": serializer.data}, status=status.HTTP_200_OK)
        
        else:
            return Response({"results": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class SavedVideosView(generics.ListAPIView):
    queryset = Video.objects.filter(watch_later=True)
    serializer_class = VideoSerializer


class StreamSessionView(APIView):

    def get(self, request, id=None):
        try:
            if id:
                stream_session = StreamSession.objects.get(id=id)
                serializer = StreamSessionSerializer(stream_session)
                return Response({"results": serializer.data}, status=status.HTTP_200_OK)
            
            else:
                stream_session = StreamSession.objects.all()
                serializer = StreamSessionSerializer(stream_session, many=True)
                return Response({"results": serializer.data}, status=status.HTTP_200_OK)
            
        except ObjectDoesNotExist:
            return Response({"error": "Stream session not found"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        serializer = StreamSessionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"results": serializer.data}, status=status.HTTP_201_CREATED)
        
        else:
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, id=None):
        try:
            stream_session = StreamSession.objects.get(id=id)
            serializer = StreamSessionSerializer(stream_session, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"results": serializer.data}, status=status.HTTP_200_OK)
            
            else:
                return Response({"results": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
            
        except ObjectDoesNotExist:
            return Response({"error": "Stream session not found"}, status=status.HTTP_404_NOT_FOUND)
  

class VideoSubmitted(APIView):
    
    def post(self, request, format=None):
        session_id = request.data.get('session_id')
        video_id = request.data.get('video_id')
        submitted_by = request.data.get('submitted_by')
        raw_message = request.data.get('raw_message')
        
        if session_id is None:
            session = StreamSession.objects.create()
        else:
            session = StreamSession.objects.get(id=session_id)

        video = Video.objects.filter(session=session, video_id=video_id).first()
        if video is None:
            try:
                params = {
                    'part': 'snippet,contentDetails,statistics',
                    'id': video_id,
                    'key': YOUTUBE_API_KEY
                }
                youtube_api_url = f'https://youtube.googleapis.com/youtube/v3/videos'
                response = requests.get(youtube_api_url, params=params)
                response.raise_for_status()
                data = response.json()

                if data['pageInfo']['totalResults'] == 1:
                    data = data['items'][0]
                    video_dict = {
                        'video_id': video_id,
                        'title': data['snippet']['title'],
                        'submitted_by': submitted_by,
                        'channel_name': data['snippet']['channelTitle'],
                        'thumbnail_url': data['snippet']['thumbnails']['medium']['url'],
                        'duration': data['contentDetails']['duration'],
                        'view_count': data['statistics']['viewCount'],
                        'like_count': data['statistics']['likeCount'],
                        'published_at': data['snippet']['publishedAt'],
                        'session': 1
                    }
                    
                    serializer = VideoSerializer(data=video_dict)
                    if serializer.is_valid():
                        serializer.save()
                        return Response({"results": serializer.data}, status=status.HTTP_201_CREATED)
                    
                    return Response({"results": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
                
                else:
                    return Response({"error": "Video not found in YouTube API"}, status=status.HTTP_400_BAD_REQUEST)
                
            except requests.exceptions.RequestException as e:
                return Response({"error": "Error while fetching YouTube API data"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({"error": "Video already exists in current session"}, status=status.HTTP_400_BAD_REQUEST)
    

class GetAccessToken(APIView):
    def get(self, request, format=None):
        try:
            code = request.GET.get('code')
            data = {
                'client_id': SOCIAL_AUTH_TWITCH_KEY,
                'client_secret': SOCIAL_AUTH_TWITCH_SECRET,
                'code': code,
                'grant_type': 'authorization_code',
                'redirect_uri': 'http://localhost:8000/get-smarter'
            }
            response = requests.post('https://id.twitch.tv/oauth2/token', data=data)
            response.raise_for_status()
            data = response.json()

            return redirect(f"/?access_token={data['access_token']}&refresh_token={data['refresh_token']}")
        
        except requests.exceptions.RequestException as e:
            return Response({'errors': 'e'}, status=status.HTTP_400_BAD_REQUEST)
        

class Authenticate(APIView):
    def get(self, request, format=None):
        return Response({"results": 'serializer' }, status=status.HTTP_200_OK)
    


@psa("social:complete")
def ajax_auth(request, backend):
    """AJAX authentication endpoint"""
    if isinstance(request.backend, BaseOAuth1):
        token = {
            "oauth_token": request.REQUEST.get("access_token"),
            "oauth_token_secret": request.REQUEST.get("access_token_secret"),
        }
    elif isinstance(request.backend, BaseOAuth2):
        token = request.REQUEST.get("access_token")
    else:
        raise HttpResponseBadRequest("Wrong backend type")
    user = request.backend.do_auth(token, ajax=True)
    login(request, user)
    data = {"id": user.id, "username": user.username}
    return HttpResponse(json.dumps(data), mimetype="application/json")