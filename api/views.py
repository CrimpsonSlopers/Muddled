import isodate
import requests
from muddle.settings import *
from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Count

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

from api.models import *
from api.serializers import *
from muddle.settings import *


class AuthenticateUser(APIView):
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        if request.user.is_authenticated:
            serializer = UserSerializer(request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_401_UNAUTHORIZED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        username = request.data["username"]
        password = request.data["password"]
        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    def get(self, request, format=None):
        logout(request)
        return Response(status=status.HTTP_200_OK)


class MutedViewersView(generics.ListCreateAPIView):
    queryset = Viewer.objects.filter(muted=True)
    serializer_class = ViewerSerializer


"""class VideoView(APIView):
    def get(self, request, id=None):
        try:
            if id:
                video = Video.objects.get(id=id)
                serializer = VideoSerializer(video)
                return Response({"results": serializer.data}, status=status.HTTP_200_OK)

            else:
                videos = Video.objects.all()
                serializer = VideoSerializer(videos, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)

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
            stream_session = StreamSession.objects.create(user=request.user)
            serializer = StreamSessionSerializer(stream_session)
            return Response(serializer.data, status=status.HTTP_200_OK)

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

            )


class ViewerView(APIView):
    def get(self, request, username=None):
        try:
            if username:
                viewer = Viewer.objects.get_or_create(username=username)
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

    def put(self, request, username=None):
        try:
            viewer = Viewer.objects.get(username=username)
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


class ArchiveView(APIView):
    def get(self, request, session_id=None):
        try:
            archive = StreamSession.objects.get(id=session_id)
            if archive:
                videos = Video.objects.filter(session=archive)
                serializer = VideoSerializer(videos, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response(
                {"error": "Archive does not exists"}, status=status.HTTP_404_NOT_FOUND
            )

        except:
            return Response(
                {"error": "Error getting archive"}, status=status.HTTP_404_NOT_FOUND
            )


class SidebarView(APIView):
    def get(self, request):
        try:
            archives = StreamSession.objects.all()
            serializer = NavBarSerializer(archives, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except:
            return Response(
                {"error": "Error getting archive"}, status=status.HTTP_404_NOT_FOUND
            )


from urllib.parse import urlparse, parse_qs
import json
import re
from tqdm import tqdm
import datetime
from dateutil import parser
import pytz


utc_timezone = pytz.UTC


def get_id(url):
    u_pars = urlparse(url)
    quer_v = parse_qs(u_pars.query).get("v")
    if quer_v:
        return quer_v[0]
    pth = u_pars.path.split("/")
    if pth:
        return pth[-1]


class AddArchiveFromFile(APIView):
    def get(self, requets):
        with open("chat/[7-26-23] - Chat.json", "r", encoding="utf-8") as f:
            data = json.load(f)

        dt = parser.parse(data["video"]["created_at"])
        dt_utc = dt.replace(tzinfo=utc_timezone)
        session = StreamSession.objects.create(
            user=User.objects.get(username="crimpsonsloper"), created_at=dt_utc
        )
        for comment in tqdm(data["comments"]):
            regex = r"(?i)\b((?:https?://|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))"
            url = re.findall(regex, comment["message"]["body"])
            for x in url:
                video_id = get_id(x[0])
                if video_id:
                    username = comment["commenter"]["display_name"]

                    viewer, _ = Viewer.objects.get_or_create(username=username)
                    if Video.objects.filter(
                        session=session, video_id=video_id
                    ).exists():
                        tqdm.write("Video already exists in current session")
                        break

                    try:
                        params = {
                            "part": "snippet,contentDetails,statistics",
                            "id": video_id,
                            "key": YOUTUBE_API_KEY,
                        }
                        youtube_api_url = (
                            f"https://youtube.googleapis.com/youtube/v3/videos"
                        )
                        response = requests.get(youtube_api_url, params=params)
                        response.raise_for_status()
                        data = response.json()

                        if data["pageInfo"]["totalResults"] == 1:
                            try:
                                data = data["items"][0]
                                duration = isodate.parse_duration(
                                    data["contentDetails"]["duration"]
                                )
                                video = Video(
                                    video_id=video_id,
                                    title=data["snippet"]["title"],
                                    viewer=viewer,
                                    channel_name=data["snippet"]["channelTitle"],
                                    thumbnail_url=data["snippet"]["thumbnails"][
                                        "medium"
                                    ]["url"],
                                    duration=duration.total_seconds(),
                                    view_count=data["statistics"]["viewCount"],
                                    like_count=data["statistics"]["likeCount"],
                                    published_at=data["snippet"]["publishedAt"],
                                    session=session,
                                )
                                video.save()
                            except:
                                tqdm.write("Error adding vid")

                    except requests.exceptions.RequestException:
                        tqdm.write("Error while fetching YouTube API data")
"""
