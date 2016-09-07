# django
from django.shortcuts import render
from django.views.generic import View
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.conf import settings

# local
from apps.tr.access import access, process_request

# util
import json

### Context
def context(request, path):
	user, permission, data, verified = process_request(request)
	if verified:
		fltr = data['filter'] if 'filter' in data else {}
		data = access(path, permission, fltr=fltr)
		return JsonResponse(data)
