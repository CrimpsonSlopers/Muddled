import requests

from django.conf import settings
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from oauth.serializers import ProfileSerializer, UserWithProfileSerializer
from oauth.models import Profile
import time

CALLBACK_URL = "http://localhost:8000/callback/"


class UserView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        serializer = UserWithProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TwitchAuthView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            return HttpResponseRedirect("/")

        authorization_url = "https://id.twitch.tv/oauth2/authorize"
        twitch_auth_url = f"{authorization_url}?client_id={settings.TWITCH_CLIENT_ID}&redirect_uri={CALLBACK_URL}&response_type=code&scope=user_read"

        return HttpResponseRedirect(twitch_auth_url)


from urllib.parse import urlparse, parse_qs
import json
import re
from tqdm import tqdm
import datetime
from dateutil import parser
import pytz


utc_timezone = pytz.UTC

"""
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
