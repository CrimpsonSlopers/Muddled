import isodate
import requests
from django.contrib.auth import authenticate, login
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Count
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import *
from api.serializers import *
from muddle.settings import *


class AuthenticateUser(APIView):
    def get(self, request, format=None):
        if request.user.is_staff:
            return Response(status=status.HTTP_200_OK)

        return Response(status=status.HTTP_401_UNAUTHORIZED)


class Login(APIView):
    def post(self, request, format=None):
        username = request.data["username"]
        password = request.data["password"]
        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            return Response(status=status.HTTP_200_OK)

        return Response(status=status.HTTP_401_UNAUTHORIZED)


class VideoView(APIView):
    def get(self, request, id=None):
        try:
            if id:
                video = Video.objects.get(id=id)
                serializer = VideoSerializer(video)
                return Response({"results": serializer.data}, status=status.HTTP_200_OK)

            else:
                video = Video.objects.all()
                serializer = VideoSerializer(video)
                return Response({"results": serializer.data}, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return Response(
                {"error": "Video not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def post(self, request):
        serializer = VideoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"results": serializer.data}, status=status.HTTP_200_OK)

        else:
            return Response(
                {"results": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
            )

    def put(self, request, id=None):
        try:
            video = Video.objects.get(id=id)
            serializer = VideoSerializer(video, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({"results": serializer.data}, status=status.HTTP_200_OK)

            else:
                return Response(
                    {"results": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
                )

        except ObjectDoesNotExist:
            return Response(
                {"error": "Video not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def patch(self, request, id=None):
        try:
            video = Video.objects.get(id=id)
            serializer = VideoSerializer(video, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"results": serializer.data}, status=status.HTTP_200_OK)

            else:
                return Response(
                    {"results": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
                )

        except ObjectDoesNotExist:
            return Response(
                {"error": "Video not found"}, status=status.HTTP_404_NOT_FOUND
            )


class SavedVideosView(generics.ListAPIView):
    queryset = Video.objects.filter(watch_later=True)
    serializer_class = VideoSerializer


class StreamSessionView(APIView):
    def get(self, request, id=None):
        try:
            StreamSession.objects.annotate(video_count=Count("videos")).filter(
                video_count=0
            ).delete()
            if id:
                stream_session = StreamSession.objects.get(id=id)
                serializer = StreamSessionSerializer(stream_session)
                return Response({"results": serializer.data}, status=status.HTTP_200_OK)

            else:
                sessions = StreamSession.objects.all()[:10]
                serializer = StreamSessionSerializer(sessions, many=True)
                return Response({"results": serializer.data}, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return Response(
                {"error": "Stream session not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def post(self, request):
        try:
            session = StreamSession.objects.create()
            serializer = StreamSessionSerializer(session)
            return Response({"results": serializer.data}, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return Response(
                {"error": "Stream session not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def put(self, request, id=None):
        try:
            stream_session = StreamSession.objects.get(id=id)
            serializer = StreamSessionSerializer(
                stream_session, data=request.data, partial=True
            )
            if serializer.is_valid():
                serializer.save()
                return Response({"results": serializer.data}, status=status.HTTP_200_OK)

            else:
                return Response(
                    {"results": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
                )

        except ObjectDoesNotExist:
            return Response(
                {"error": "Stream session not found"}, status=status.HTTP_404_NOT_FOUND
            )


class VideoSubmitted(APIView):
    def post(self, request, format=None):
        session_id = request.data.get("session_id")
        video_id = request.data.get("video_id")
        login = request.data.get("login")

        viewer, _ = Viewer.objects.get_or_create(login=login)
        if viewer.muted:
            return Response(
                {"error": "Viewer is muted"}, status=status.HTTP_400_BAD_REQUEST
            )

        session = StreamSession.objects.get(id=session_id)

        if Video.objects.filter(session=session, video_id=video_id).exists():
            return Response(
                {"error": "Video already exists in current session"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            params = {
                "part": "snippet,contentDetails,statistics",
                "id": video_id,
                "key": YOUTUBE_API_KEY,
            }
            youtube_api_url = f"https://youtube.googleapis.com/youtube/v3/videos"
            response = requests.get(youtube_api_url, params=params)
            response.raise_for_status()
            data = response.json()

            if data["pageInfo"]["totalResults"] == 1:
                data = data["items"][0]
                duration = isodate.parse_duration(data["contentDetails"]["duration"])
                video = Video(
                    video_id=video_id,
                    title=data["snippet"]["title"],
                    viewer=viewer,
                    channel_name=data["snippet"]["channelTitle"],
                    thumbnail_url=data["snippet"]["thumbnails"]["medium"]["url"],
                    duration=duration.total_seconds(),
                    view_count=data["statistics"]["viewCount"],
                    like_count=data["statistics"]["likeCount"],
                    published_at=data["snippet"]["publishedAt"],
                    session=session,
                )
                video.save()
                serializer = VideoSerializer(video)
                return Response({"results": serializer.data}, status=status.HTTP_200_OK)

            else:
                return Response(
                    {"error": "Video not found in YouTube API"},
                    status=status.HTTP_404_NOT_FOUND,
                )

        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Error while fetching YouTube API data"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ViewerView(APIView):
    def get(self, request, login=None):
        try:
            if login:
                viewer = Viewer.objects.get_or_create(login=login)
                serializer = ViewerSerializer(viewer)
                return Response({"results": serializer.data}, status=status.HTTP_200_OK)

            else:
                viewers = Viewer.objects.all()
                serializer = ViewerSerializer(viewers, many=True)
                return Response({"results": serializer.data}, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return Response(
                {"error": "Viewer not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def post(self, request):
        try:
            serializer = ViewerSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"results": serializer.data}, status=status.HTTP_201_CREATED
                )

            else:
                return Response(
                    {"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
                )

        except ObjectDoesNotExist:
            return Response(
                {"error": "Stream session not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def put(self, request, login=None):
        try:
            viewer = Viewer.objects.get(login=login)
            serializer = ViewerSerializer(viewer, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({"results": serializer.data}, status=status.HTTP_200_OK)

            else:
                return Response(
                    {"results": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
                )

        except ObjectDoesNotExist:
            return Response(
                {"error": "Viewer not found"}, status=status.HTTP_404_NOT_FOUND
            )
