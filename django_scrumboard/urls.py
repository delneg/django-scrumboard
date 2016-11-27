# -*- coding: utf-8 -*-
from django.conf.urls import url
from django.views.generic import TemplateView

from . import views

urlpatterns = [
    url(
        regex="^tasks/create/$",
        view=views.TaskCreateView,
        name='task_create',
    ),
    url(
        regex="^tasks/$",
        view=views.TaskListView,
        name='task_list',
    ),
    url(
        regex="^tasks/delete/(?P<pk>\d+)/$",
        view=views.TaskDeleteView,
        name='task_delete',
    ),
    url(
        regex="^tasks/(?P<pk>\d+)/$",
        view=views.TaskDetailView.as_view(),
        name='task_detail',
    ),
    url(
        regex="^tasks/update/(?P<pk>\d+)/$",
        view=views.TaskUpdateView,
        name='task_update',
    ),
    url(
        regex="^$",
        view=views.TaskIndexView.as_view(),
        name='task_index',
    ),
]
