from django.contrib import admin

from users.models import TwitchUser
from django.contrib.auth.admin import UserAdmin


class UserAdminConfig(UserAdmin):
    model = TwitchUser
    search_fields = ('twitch_id', 'email', 'login', 'display_name', 'type', 'profile_image_url', 'created_at')
    list_filter = ('twitch_id', 'email', 'login', 'display_name', 'type', 'profile_image_url', 'created_at', 'is_active', 'is_staff')
    ordering = ('-login',)
    list_display = ('twitch_id', 'email', 'login', 'display_name', 'type', 'profile_image_url', 'created_at', 'is_active', 'is_staff')
    fieldsets = (
        (None, {'fields': ('twitch_id', 'email', 'login', 'display_name', 'type', 'profile_image_url', 'created_at',)}),
        ('Permissions', {'fields': ('is_staff', 'is_active')})
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('twitch_id', 'email', 'login', 'display_name', 'type', 'profile_image_url', 'created_at', 'password1', 'password2', 'is_active', 'is_staff')}
         ),
    )


admin.site.register(TwitchUser, UserAdminConfig)