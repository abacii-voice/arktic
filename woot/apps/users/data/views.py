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
# account
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
			'role_display': {
				'worker': 'Transcriber',
				'admin': 'Admin',
				'moderator': 'Moderator',
			}
		})

		# 4. role and client
		one_client = user.clients.count() == 1
		if one_client:
			context_data.update({
				'one_client': True,
				'current_client': user.clients.get().name,
			})

		one_role = user.roles.count() == 1
		if one_role:
			context_data.update({
				'one_role': True,
				'current_role': user.roles.get().type,
			})

		return JsonResponse(context_data)

def context_projects(request):
	user, permission, verified = check_request(request)
	if verified:
		# initialise data
		project_data = {}

		# 1.


		return JsonResponse(project_data)

def load_attachment(request):
	user, permission, verified = check_request(request)
	if verified:
		# return audio file url or rule reference
		# data type
		# data content
		pass

# User signup
def us_data(request):
	if request.method == 'POST':
		# no permission required

		# get initial data
		initial_data = {
			'user_id': request.POST['user_id'],
			'activation_key': request.POST['activation_key'],
		}

		# compile user data
		user = User.objects.get(id=initial_data['user_id'])
		user_data = user.basic_data()

		return JsonResponse(user_data)
