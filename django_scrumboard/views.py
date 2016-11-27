# -*- coding: utf-8 -*-
from django.views.generic import (
    CreateView,
    DeleteView,
    DetailView,
    UpdateView,
    ListView
)

from .models import (
	Task,
)

from .forms import TaskForm

class TaskCreateView(CreateView):

    model = Task


class TaskDeleteView(DeleteView):

    model = Task


class TaskDetailView(DetailView):

    model = Task


class TaskUpdateView(UpdateView):

    model = Task


class TaskListView(ListView):

    model = Task

    def get_context_data(self, **kwargs):
        context = super(TaskListView, self).get_context_data(**kwargs)
        context['form'] = TaskForm
        return context

