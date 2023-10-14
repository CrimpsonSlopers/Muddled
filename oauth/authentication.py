import jwt

from datetime import datetime, timedelta
from django.conf import settings
from django.contrib.auth import get_user_model

from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed, ParseError


User = get_user_model()


class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        jwt_token = request.META.get("HTTP_AUTHORIZATION")
        if jwt_token is None:
            return None

        jwt_token = JWTAuthentication.get_the_token_from_header(jwt_token)

        try:
            payload = jwt.decode(jwt_token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.exceptions.InvalidSignatureError:
            raise AuthenticationFailed("Invalid Signature")
        except:
            raise ParseError()

        username = payload.get("user_identifier")
        if username is None:
            raise AuthenticationFailed("User not found.")

        user = User.objects.get(username=username)
        if user is None:
            raise AuthenticationFailed("User not found.")

        return user, payload

    def authenticate_header(self, request):
        return "Bearer"

    @classmethod
    def create_jwt(cls, user, serializer):
        payload = {
            "user_identifier": user.username,
            "exp": int((datetime.now() + timedelta(hours=5)).timestamp()),
            "iat": datetime.now().timestamp(),
            "user": serializer,
        }

        jwt_token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

        return jwt_token

    @classmethod
    def get_the_token_from_header(cls, token):
        token = token.replace("Bearer", "").replace(" ", "")
        return token
