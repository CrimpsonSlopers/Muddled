from django.contrib import admin
from api.models import Video, Archive, Thumbnail, Save
from django.contrib import admin


@admin.register(Thumbnail)
class ThumbnailAdmin(admin.ModelAdmin):
    model = Thumbnail

    list_display = (
        "url",
        "key",
        "height",
        "width",
    )
    search_fields = ("key", "url")
    ordering = ("key",)


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    model = Video

    list_display = (
        "video_id",
        "published_at",
        "title",
        "channel_title",
        "duration",
        "view_count",
        "like_count",
        "submitted_by",
        "submitted_at",
    )
    search_fields = ("title", "submitted_by")
    ordering = ("submitted_at",)


@admin.register(Archive)
class ArchiveAdmin(admin.ModelAdmin):
    model = Archive

    list_display = (
        "streamer",
        "created_at",
    )
    search_fields = ("streamer", "submitted_by")
    ordering = ("streamer",)
    list_editable = ("created_at",)


admin.site.register(Save)
