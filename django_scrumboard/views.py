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
from django.http import HttpResponseBadRequest,JsonResponse,HttpResponse,Http404
from django.views.decorators.http import require_POST,require_GET,require_http_methods
from django.core import serializers
from .forms import TaskForm
from django.shortcuts import get_object_or_404
import copy

@require_POST
def TaskCreateView(request):
    if request.is_ajax():
        form = TaskForm(request.POST)
        if form.is_valid():
            t = Task(title=form.cleaned_data['title'],description=form.cleaned_data['description'],url=form.cleaned_data['url'],assigned_to=form.cleaned_data['assigned_to'])
            t.save()
            return JsonResponse({"result":True,"id":t.id,"status":t.status.lower()})
        else:
            return JsonResponse(form.errors)
    else:
        return HttpResponseBadRequest("Must be ajax")


@require_GET
def TaskListView(request):
    if request.is_ajax():
        return JsonResponse({"objects":[i.to_json() for i in Task.objects.all()]})
    else:
        return HttpResponseBadRequest("Must be ajax")

@require_http_methods(['DELETE'])
def TaskDeleteView(request,pk):
    if request.is_ajax():
        t = Task.objects.filter(id=pk).first()
        if not t:
            return Http404("No such task")
        deleted_id = copy.copy(t.id)
        t.delete()
        return JsonResponse({"result":True,"id":deleted_id})
    else:
        return HttpResponseBadRequest("Must be ajax")



class TaskDetailView(DetailView):

    model = Task

@require_POST
def TaskUpdateView(request,pk):
    if request.is_ajax():
        t = Task.objects.filter(id=pk).first()
        if not t:
            return Http404("No such task")
        status = request.POST.get("status",None)
        if status:
            if not isinstance(status, str):
                return HttpResponseBadRequest("Status must be a string")
            #  TODO: add check for choices
            t.status = status
            t.save()
            return JsonResponse({"result":True,"id":t.id})



    else:
        return HttpResponseBadRequest("Must be ajax")


class TaskIndexView(ListView):
    template_name = "django_scrumboard/index.html"
    model = Task

    def get_context_data(self, **kwargs):
        context = super(TaskIndexView, self).get_context_data(**kwargs)
        context['form'] = TaskForm
        return context

