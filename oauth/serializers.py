from django.contrib.auth.models import User
from rest_framework import serializers

from oauth.models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"


class UserWithProfileSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=True)

    class Meta:
        model = User
        fields = "__all__"
