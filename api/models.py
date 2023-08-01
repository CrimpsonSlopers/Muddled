from django.db import models
from datetime import datetime


class StreamSession(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering  = ["-created_at"]

    def __str__(self) -> str:
        return f"Stream Session - {self.created_at}"


class Video(models.Model):
    video_id = models.CharField(max_length=20, null=False)
    title = models.CharField(max_length=250, null=False)
    submitted_by = models.CharField(max_length=20, null=False)
    submitted_at = models.DateTimeField(auto_now_add=True)
    channel_name = models.CharField(max_length=50, null=False)
    thumbnail_url = models.URLField(null=False)
    duration = models.CharField(max_length=20, null=False)
    view_count = models.IntegerField(default=0)
    like_count = models.IntegerField(default=0)
    published_at = models.DateTimeField(default=datetime(1970,1,1,0,0,0))
    watch_later = models.BooleanField(null=False, default=False)
    session = models.ForeignKey(StreamSession, related_name="videos", on_delete=models.CASCADE)

    class Meta:
        ordering  = ["-submitted_at"]

    def __str__(self):
        return f"Video - {self.title} (Added by: {self.submitted_by})"