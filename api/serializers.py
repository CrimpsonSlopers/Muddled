from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Archive, Video, Save, Thumbnail


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class ViewerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Archive
        fields = "__all__"


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = "__all__"


class StreamSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Save
        fields = "__all__"


class CREATEVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thumbnail
        fields = "__all__"
