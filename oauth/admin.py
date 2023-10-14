from django.contrib import admin
from oauth.models import Profile
from django.contrib import admin


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    model = Profile

    list_display = (
        "id",
        "display_name",
    )
    search_fields = (
        "display_name",
        "id",
    )
    ordering = (
        "display_name",
        "id",
    )
