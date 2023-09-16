from django.conf import settings
from django.db import models
from django.utils.timezone import now


class StreamSession(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="%(app_label)s_%(class)s",
    )
    created_at = models.DateTimeField(default=now, editable=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self) -> str:
        return f"Archive - {self.created_at}"


class Viewer(models.Model):
    username = models.CharField(max_length=250, primary_key=True)
    muted = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.username


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
    published_at = models.DateTimeField(default=now)
    watch_later = models.BooleanField(null=False, default=False)

    class Meta:
        ordering = ["-submitted_at"]

    def __str__(self):
        return f"Video - {self.title} (Added by: {self.viewer})"
