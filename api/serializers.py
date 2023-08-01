from rest_framework import serializers

from .models import StreamSession, Video

class VideoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Video
        fields = '__all__'
        

class StreamSessionSerializer(serializers.ModelSerializer):
    videos = VideoSerializer(many=True, read_only=True)

    class Meta:
        model = StreamSession
        fields = '__all__'


