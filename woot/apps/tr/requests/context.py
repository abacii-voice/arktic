# django
from django.shortcuts import render
from django.views.generic import View
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.conf import settings

# local
from apps.tr.access import access, process_request

# util


### Context
def context(request, path):
	user, permission, data, verified = process_request(request)
	print(permission)
	if verified:
		return JsonResponse(access(path, permission))
