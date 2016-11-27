# -*- coding: utf-8 -*-

from django.db import models

from model_utils.models import TimeStampedModel
from django.utils.translation import ugettext_lazy as _



class Task(TimeStampedModel):
    STATUS_CHOICES = (
        (_('Rejected'), _('Rejected')),
        (_("Pending"), _("Pending")),
        (_("Developement"), _("Developement")),
        (_("Testing"), _("Testing")),
        (_("Done"), _("Done"))

    )
    title = models.CharField(max_length=255,verbose_name=_("Title"))
    description = models.TextField(verbose_name=_("Description"))
    url = models.URLField(verbose_name=_("Remote URL"))
    assigned_to = models.CharField(max_length=255,verbose_name=_("Assigned to"))
    status = models.CharField(choices=STATUS_CHOICES,max_length=20,verbose_name=_("Status"),default=_("Pending"))
    def to_json(self):
        return {
            "title": self.title,
            "description": self.description,
            "url": self.url,
            "assigned_to": self.assigned_to,
            "status": self.status.lower(),
            "id":self.id
        }

    def __str__(self):
        return self.title
    class Meta:
        verbose_name = _("Task")
        verbose_name_plural = _("Tasks")



