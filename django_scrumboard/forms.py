from django import forms
from .models import Task
class TaskForm(forms.ModelForm):
    """A form for the ``Task`` model."""
    class Meta:
        model = Task
        exclude = []
