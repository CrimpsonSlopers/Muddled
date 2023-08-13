from django.contrib import admin
from .models import *


admin.site.register(Video)
admin.site.register(Viewer)
admin.site.register(StreamSession)