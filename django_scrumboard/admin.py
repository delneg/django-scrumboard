from django.contrib import admin
from django_scrumboard.models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'url', 'assigned_to', 'get_status_display')
