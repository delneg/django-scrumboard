from django.contrib import admin
from .models import *


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title','url','assigned_to','get_status_display')
