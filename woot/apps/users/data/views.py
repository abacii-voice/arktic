# apps.users.data.views

# django
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.core.cache import cache
from django.views.generic import View
from django.conf import settings
from django.template import Template

# local
from apps.client.models.client import Client
from apps.users.models.user import User
from apps.tr.models.rule import RuleInstance
from apps.users.models.message import Message
from permission import check_request

# util
import json

### Data
def context(request):
	user, permission, verified = check_request(request)
	if verified:
		# initialise data
		context_data = {}

		# 1. basic current user details
		context_data.update({
			'user': user.basic_data()
		})

		# 2. client data
		context_data.update(user.client_data(permission))

		# 3. initialise data
		context_data.update({
			'actions': [],
		})

		return JsonResponse(context_data)

def context_projects(request):
	if check_request(request):
		pass

def load_attachment(request):
	if check_request(request):
		# return audio file url or rule reference
		# data type
		# data content
		pass
