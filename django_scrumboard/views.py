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
from django.forms import URLField,ValidationError
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
        deleted_title = copy.copy(t.title)
        t.delete()
        return JsonResponse({"result":True,"title":deleted_title})
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
        description = request.POST.get("description",None)
        url = request.POST.get("url",None)
        assigned_to = request.POST.get("assigned_to",None)

        if status:
            if not isinstance(status, str):
                return HttpResponseBadRequest("Status must be a string")
            #  TODO: add check for choices
            t.status = status
        elif description:
            if not isinstance(description,str):
                return HttpResponseBadRequest("Description must be a string")
            t.description = description

        elif url:
            if not isinstance(url,str):
                return HttpResponseBadRequest("URL must be a string")
            else:
                try:
                    f = URLField()
                    f.clean(url)
                except ValidationError:
                    return HttpResponseBadRequest("Not a valid URL")
                except Exception:
                    return HttpResponseBadRequest("Unknown error with URL")
            t.url = url

        elif assigned_to:
            if not isinstance(assigned_to,str):
                return HttpResponseBadRequest("Assigned_to must be a string")
            t.assigned_to = assigned_to
        else:
            return HttpResponseBadRequest("No valid field to edit")
        t.save()
        return JsonResponse({"result": True, "id": t.id, "title": t.title})
    else:
        return HttpResponseBadRequest("Must be ajax")


class TaskIndexView(ListView):
    template_name = "django_scrumboard/index.html"
    model = Task

    def get_context_data(self, **kwargs):
        context = super(TaskIndexView, self).get_context_data(**kwargs)
        context['form'] = TaskForm
        return context

