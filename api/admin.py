from django.contrib import admin
from api.models import Video, Viewer, StreamSession
from django.contrib import admin


@admin.register(Viewer)
class ViewerAdmin(admin.ModelAdmin):
    model = Viewer

    list_display = ("username", "muted")
    list_filter = ("muted",)
    search_fields = ("username", "muted")
    ordering = ("username",)
    list_editable = ("muted",)


admin.site.register(Video)
admin.site.register(StreamSession)
