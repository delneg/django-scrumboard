# -*- coding: utf-8 -*-
from django.conf.urls import url

from . import views

urlpatterns = [
    url(
        regex="^tasks/create/$",
        view=views.task_create_view,
        name='task_create',
    ),
    url(
        regex="^tasks/$",
        view=views.task_list_view,
        name='task_list',
    ),
    url(
        regex="^tasks/delete/(?P<pk>\d+)/$",
        view=views.task_delete_view,
        name='task_delete',
    ),
    url(
        regex="^tasks/(?P<pk>\d+)/$",
        view=views.TaskDetailView.as_view(),
        name='task_detail',
    ),
    url(
        regex="^tasks/update/(?P<pk>\d+)/$",
        view=views.task_update_view,
        name='task_update',
    ),
    url(
        regex="^$",
        view=views.TaskIndexView.as_view(),
        name='task_index',
    ),
]
