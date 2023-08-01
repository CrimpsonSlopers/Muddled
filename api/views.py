import requests
from rest_framework import status
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import StreamSession, Video
from .serializers import *

from muddle.settings import YOUTUBE_API_KEY

class VideoView(generics.ListAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer


class StreamSessionView(APIView):

    def get(self, request, id=None):
        if id:
            stream_session = StreamSession.objects.get(id=id)
            serializer = StreamSessionSerializer(stream_session)
            return Response({"results": serializer.data}, status=status.HTTP_200_OK)
 
        stream_session = StreamSession.objects.all()
        serializer = StreamSessionSerializer(stream_session, many=True)
        return Response({"results": serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = StreamSessionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"results": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"results": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, id=None):
        stream_session = StreamSession.objects.get(id=id)
        serializer = StreamSessionSerializer(stream_session, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"results": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"results": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        


class AuthenticateUser(APIView):
    def get(self, request, format=None):
        if (request.user.is_staff):
            return Response(status=status.HTTP_200_OK)

        return Response(status=status.HTTP_401_UNAUTHORIZED)
  

class ParseIRCMessage(APIView):
    
    def post(self, request, format=None):
        video_id = request.data.get('video_id')
        submitted_by = request.data.get('submitted_by')

        params = {
            'part': 'snippet,contentDetails,statistics',
            'id': video_id,
            'key': YOUTUBE_API_KEY
        }
        youtube_api_url = f'https://youtube.googleapis.com/youtube/v3/videos'
        response = requests.get(youtube_api_url, params=params)
        data = response.json()
        print(data)

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

                return Response({"results": serializer.data}, status=status.HTTP_200_OK)
        
        return Response({"results": serializer.errors, "num_results": 0}, status=status.HTTP_200_OK)
