from django import forms
from .models import Task
from django.utils.translation import ugettext_lazy as _
class TaskForm(forms.ModelForm):
    """A form for the ``Task`` model."""

    def __init__(self, *args, **kwargs):
        super(TaskForm, self).__init__(*args, **kwargs)
        self.fields['title'].widget = forms.TextInput(attrs={
            "autofocus":"autofocus",
            "name":"title",
            'placeholder': _("Title")})
        self.fields['description'].widget = forms.Textarea(attrs={
            "name": "description",
            "rows":"3",
            'placeholder': _("Description")
        })
        self.fields['description'].required = True
        self.fields['url'].widget = forms.TextInput(attrs={
            "name": "remote_url",
            'placeholder': _("Task remote URL")
        })
        self.fields['url'].required = False
        self.fields['assigned_to'].widget = forms.TextInput(attrs={
            "name": "assigned_to",
            'placeholder': _("Assigned To")
        })
        self.fields['assigned_to'].required = False
    class Meta:
        model = Task
        exclude = ["status"]
