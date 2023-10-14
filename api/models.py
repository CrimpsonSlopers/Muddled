from django.db import models
from django.utils.timezone import now
from django.contrib.auth.models import User


THUMBNAIL_KEYS = [
    ("default", "default"),
    ("medium", "medium"),
    ("high", "high"),
    ("standard", "standard"),
    ("maxres", "maxres"),
]


class Archive(models.Model):
    streamer = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="%(app_label)s_%(class)s"
    )
    created_at = models.DateTimeField(default=now, editable=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self) -> str:
        return f"{self.streamer.username} => {self.created_at}"


class Video(models.Model):
    video_id = models.SlugField(max_length=20, null=False)
    published_at = models.DateTimeField(default=now)
    channel_id = models.SlugField(max_length=25)
    title = models.CharField(max_length=250, null=False)
    channel_title = models.CharField(max_length=50, null=False)
    category_id = models.CharField(max_length=50, null=False)
    duration = models.IntegerField(default=0)
    dimension = models.CharField(max_length=50)
    definition = models.CharField(max_length=50)
    view_count = models.IntegerField(default=0)
    like_count = models.IntegerField(default=0)
    dislike_count = models.IntegerField(default=0)
    favorite_count = models.IntegerField(default=0)
    comment_count = models.IntegerField(default=0)
    submitted_at = models.DateTimeField(auto_now_add=True, editable=True)
    submitted_by = models.CharField(max_length=50)
    archive = models.ForeignKey(
        Archive, on_delete=models.CASCADE, related_name="%(app_label)s_%(class)s"
    )
    saves = models.ManyToManyField(User, through="api.Save")

    class Meta:
        ordering = ["-submitted_at"]

    def __str__(self):
        return f"{self.title} from {self.submitted_by})"


class Thumbnail(models.Model):
    video = models.ForeignKey(
        Video, on_delete=models.CASCADE, related_name="%(app_label)s_%(class)s"
    )
    key = models.CharField(choices=THUMBNAIL_KEYS, max_length=10)
    url = models.URLField(max_length=500)
    height = models.IntegerField()
    width = models.IntegerField()

    def __str__(self):
        return f"{self.video.title} => {self.key})"


class Save(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = [("video", "user")]


"""
{
    "id": string,
    "snippet": {
        "publishedAt": datetime,
        "channelId": string,
        "title": string,
        "thumbnails": {
            (key): {
                "url": string,
                "width": unsigned integer,
                "height": unsigned integer
            }
        },
        "channelTitle": string,
        "categoryId": string,
    },
    "contentDetails": {
        "duration": string,
        "dimension": string,
        "definition": string,
    },
    "statistics": {
        "viewCount": string,
        "likeCount": string,
        "dislikeCount": string,
        "favoriteCount": string,
        "commentCount": string
    }
}
"""
