# -*- coding: utf-8 -*-
from django.conf.urls import url
from django.views.generic import TemplateView

from . import views

urlpatterns = [
    url(
        regex="^tasks/~create/$",
        view=views.TaskCreateView.as_view(),
        name='task_create',
    ),
    url(
        regex="^tasks/(?P<pk>\d+)/~delete/$",
        view=views.TaskDeleteView.as_view(),
        name='task_delete',
    ),
    url(
        regex="^tasks/(?P<pk>\d+)/$",
        view=views.TaskDetailView.as_view(),
        name='task_detail',
    ),
    url(
        regex="^tasks/(?P<pk>\d+)/~update/$",
        view=views.TaskUpdateView.as_view(),
        name='task_update',
    ),
    url(
        regex="^tasks/$",
        view=views.TaskListView.as_view(),
        name='task_list',
    ),
	]
