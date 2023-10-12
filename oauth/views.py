import requests


from django.conf import settings
from django.http import HttpResponseRedirect
from django.views import View
from django.contrib.auth import login, logout, authenticate

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

client_id = f"""
client_id={settings.TWITCH_CLIENT_ID}
&client_secret={settings.TWITCH_SECRET_ID}
&code=gulfwdmys5lsm6qyz4xiz9q32l10
&grant_type=authorization_code
&redirect_uri=http://localhost:8000/
"""


class AuthenticateUser(APIView):
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        if request.user.is_authenticated:
            return Response(request.data, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_401_UNAUTHORIZED)


class LoginUser(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        code = request.GET.get("code", None)
        if code is not None:
            user = authenticate(request, access_token)
            login(request, user)
            return Response(request.user, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_401_UNAUTHORIZED)


class LogoutUser(APIView):
    def get(self, request, format=None):
        logout(request)
        return Response(status=status.HTTP_200_OK)


class TwitchCallback(View):
    def _generate_token(self, request):
        code = request.GET.get("code", None)
        if code is not None:
            token_params = {
                "client_id": settings.TWITCH_CLIENT_ID,
                "client_secret": settings.TWITCH_CLIENT_SECRET,
                "code": code,
                "redirect_uri": "http://localhost:8000",
                "grant_type": "authorization_code",
            }
            response = requests.post(
                "https://id.twitch.tv/oauth2/authorize", params=token_params
            )
            response.raise_for_status()
            extra_data = response.json()

            return extra_data

        else:
            raise Exception()

    def _get_token(self, request):
        try:
            return request.session["access_token"]
        except KeyError:
            return self._generate_token(request)

    def get(self, request, *args, **kwargs):
        redirect_url = request.GET.get("next") or "/"
        if request.user.is_authenticated:
            return HttpResponseRedirect(redirect_url)

        token = self._get_token(request)
        if token is not None:
            user = authenticate(request, token=token)
            login(request, user)
            return HttpResponseRedirect(redirect_url)

        return HttpResponseRedirect("/")
