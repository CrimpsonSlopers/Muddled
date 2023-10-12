import requests

from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model
from django.conf import settings


class TwitchBackend(BaseBackend):
    AUTHORIZATION_URL = "https://id.twitch.tv/oauth2/authorize"
    ACCESS_TOKEN_URL = "https://id.twitch.tv/oauth2/token"
    ACCESS_TOKEN_VALIDATE = "https://id.twitch.tv/oauth2/validate"
    USER_DETAILS_URL = "https://api.twitch.tv/helix/users"

    def authenticate(self, request, token=None):
        response = requests.get(
            self.USER_DETAILS_URL,
            headers={
                "Accept": "application/vnd.twitchtv.v5+json",
                "Client-ID": settings.TWITCH_CLIENT_ID,
                "Authorization": f"Bearer {token}",
            },
        )
        if response.ok:
            user_informations = response.json()["data"][0]
            user_data = {
                "username": user_informations["login"],
                "email": user_informations["email"],
            }
            try:
                user = User.objects.get(**user_data)
            except User.DoesNotExist:
                user = User.objects.create(**user_data)
            return user
        return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
