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
def user_roles(request):
	if request.method=='POST':
		user = request.user
		if user.is_authenticated():
			return JsonResponse(user.roles())
