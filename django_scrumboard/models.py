# -*- coding: utf-8 -*-

from django.db import models

from model_utils.models import TimeStampedModel
from django.utils.translation import ugettext_lazy as _

class Task(TimeStampedModel):
    title = models.CharField(verbose_name=_("Title"))
    description = models.TextField(verbose_name=_("Description"))
    url = models.URLField(verbose_name=_("Remote URL"))
    assigned_to = models.CharField(verbose_name=_("Assigned to"))
    def __str__(self):
        return self.title
    class Meta:
        verbose_name = _("Task")
        verbose_name_plural = _("Tasks")



