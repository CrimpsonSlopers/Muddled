from django.db import models
from datetime import datetime


class StreamSession(models.Model):
    created_at = models.DateTimeField(default=datetime.now)

    class Meta:
        ordering = ["created_at"]

    def __str__(self) -> str:
        return f"Stream Session - {self.created_at}"


class Viewer(models.Model):
    login = models.CharField(max_length=250, primary_key=True)
    muted = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.login


class Video(models.Model):
    video_id = models.CharField(max_length=20, null=False)
    title = models.CharField(max_length=250, null=False)
    viewer = models.ForeignKey(
        Viewer,
        related_name="viewer_videos",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    submitted_at = models.DateTimeField(auto_now_add=True)
    channel_name = models.CharField(max_length=50, null=False)
    thumbnail_url = models.URLField(null=False)
    duration = models.IntegerField(default=0)
    view_count = models.IntegerField(default=0)
    like_count = models.IntegerField(default=0)
    published_at = models.DateTimeField(default=datetime(1970, 1, 1, 0, 0, 0))
    watch_later = models.BooleanField(null=False, default=False)
    session = models.ForeignKey(
        StreamSession, related_name="videos", on_delete=models.CASCADE
    )

    class Meta:
        ordering = ["-submitted_at"]

    def __str__(self):
        return f"Video - {self.title} (Added by: {self.viewer})"
