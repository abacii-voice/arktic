# apps.users.command

# django
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.core.cache import cache
from django.views.generic import View
from django.conf import settings
from django.template import Template

# local


# util
import json

### Commands
def user_context(request):
	if request.method=='POST':
		user = request.user
		if user.is_authenticated():

			# make context
			context = {
				'clients': user.clients(),
				'roles': user.roles(),
				'stats': '',
				'current_client': '',
				'current_role': '',
			}

			return JsonResponse(context)
