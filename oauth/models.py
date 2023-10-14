from django.db import models
from django.contrib.auth.models import User


BROADCASTER_TYPE_CHOICES = [
    ("", ""),
    ("affiliate", "affiliate"),
    ("partner", "partner"),
]

USER_TYPE_CHOICES = [
    ("", ""),
    ("admin", "admin"),
    ("global_mod", "global_mod"),
    ("staff", "staff"),
]


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    display_name = models.CharField(max_length=25, blank=True)
    type = models.CharField(
        choices=USER_TYPE_CHOICES, max_length=10, default="", blank=True
    )
    broadcaster_type = models.CharField(
        choices=BROADCASTER_TYPE_CHOICES, max_length=9, default="", blank=True
    )
    description = models.TextField(max_length=1500, blank=True)
    profile_image_url = models.URLField(max_length=250, blank=True)
    offline_image_url = models.URLField(max_length=250, blank=True)
    view_count = models.IntegerField(default=0, blank=True)
    created_at = models.DateTimeField(auto_now=True, editable=True)

    def __str__(self):
        return f"{self.user.username}"
