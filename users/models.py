from django.db import models

from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

from datetime import datetime

class CustomUserManager(BaseUserManager):

    def create_superuser(self, email, login, **other_fields):

        other_fields.setdefault('is_staff', True)
        other_fields.setdefault('is_superuser', True)
        other_fields.setdefault('is_active', True)

        if other_fields.get('is_staff') is not True:
            raise ValueError('Superuser must be assigned to is_staff=True.')
        if other_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must be assigned to is_superuser=True.')

        return self.create_user(email, login, **other_fields)

    def create_user(self, email, login, **other_fields):

        if not email:
            raise ValueError(_('You must provide an email address'))

        email = self.normalize_email(email)
        user = self.model(email=email, login=login, **other_fields)
        user.save()
        return user


class TwitchUser(AbstractBaseUser, PermissionsMixin):

    twitch_id = models.IntegerField(unique=True, null=True, blank=True)
    email = models.EmailField(_('email address'), unique=True)
    login = models.CharField(max_length=150, unique=True)
    display_name = models.CharField(max_length=150, null=True, blank=True)
    type = models.CharField(max_length=15, null=True, blank=True)
    broadcaster_type = models.CharField(max_length=15, null=True, blank=True)
    profile_image_url = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(default=datetime(2000,1,1))
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'login'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.login