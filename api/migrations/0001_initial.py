# Generated by Django 4.2.3 on 2023-07-29 01:55

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="StreamSession",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
        migrations.CreateModel(
            name="Video",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("video_id", models.CharField(max_length=20)),
                ("title", models.CharField(max_length=250)),
                ("submitted_by", models.CharField(max_length=20)),
                ("submitted_at", models.DateTimeField(auto_now_add=True)),
                ("channel_name", models.CharField(max_length=50)),
                ("thumbnail_url", models.URLField()),
                ("duration", models.CharField(max_length=20)),
                ("view_count", models.IntegerField(default=0)),
                ("like_count", models.IntegerField(default=0)),
                (
                    "published_at",
                    models.DateTimeField(default=datetime.datetime(1970, 1, 1, 0, 0)),
                ),
                ("watch_later", models.BooleanField(default=False)),
                (
                    "session",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="videos",
                        to="api.streamsession",
                    ),
                ),
            ],
            options={
                "ordering": ["-submitted_at"],
            },
        ),
    ]
