from django.contrib import admin

from users.models import TwitchUser
from django.contrib.auth.admin import UserAdmin



admin.site.register(TwitchUser)