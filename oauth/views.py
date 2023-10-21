import json
import requests

from django.http import HttpResponseRedirect
from django.conf import settings
from django.contrib.auth.models import User
from django.views.generic import View

from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from oauth.serializers import UserWithProfileSerializer
from oauth.authentication import JWTAuthentication
from oauth.models import Profile

CALLBACK_URL = "http://localhost:8000/callback/"


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(Self, request):
        response = Response({"message": "logged_out"}, status=status.HTTP_200_OK)
        response.delete_cookie("token")

        return response


class LoggedInView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if request.user.is_authenticated:
            serializer = UserWithProfileSerializer(request.user)
            return Response(
                {"logged_in": True, "user": serializer.data}, status=status.HTTP_200_OK
            )

        return Response({"logged_in": False}, status=status.HTTP_401_UNAUTHORIZED)


class ObtainTokenView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        code = request.query_params.get("code")
        if not code:
            return Response(
                {"message": "Authorization code must be provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token_url = f"https://id.twitch.tv/oauth2/token"
            data = f"client_id={settings.TWITCH_CLIENT_ID}&client_secret={settings.TWITCH_SECRET_ID}&code={code}&grant_type=authorization_code&redirect_uri=http://localhost:8000/callback/"
            response = requests.post(token_url, data=data)
            response_data = response.json()
            access_token = response_data.get("access_token")

            if not access_token:
                return Response(
                    {"message": "Auth error"}, status=status.HTTP_400_BAD_REQUEST
                )

            user_data = self.get_twitch_user_data(access_token)
            username = user_data.pop("login")
            email = user_data.pop("email")
            user, is_new = User.objects.get_or_create(username=username, email=email)

            if is_new:
                profile = Profile.objects.create(user=user, **user_data)
                profile.save()

            jwt_token = JWTAuthentication.create_jwt(user)
            serializer = UserWithProfileSerializer(user)

            response = Response({"user": serializer.data}, status=status.HTTP_200_OK)
            response.set_cookie("token", jwt_token, httponly=True)

            return response

        except Exception as err:
            return Response(
                {"message": str(err) or "Server error"},
                status=status.HTTP_INTERNAL_SERVER_ERROR,
            )

    def get_twitch_user_data(self, access_token):
        data_url = "https://api.twitch.tv/helix/users"
        headers = {
            "Client-ID": settings.TWITCH_CLIENT_ID,
            "Authorization": f"Bearer {access_token}",
        }

        response = requests.get(data_url, headers=headers)
        data = response.json()

        return data["data"][0]
