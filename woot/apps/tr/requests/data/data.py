# django
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.core.cache import cache
from django.views.generic import View
from django.conf import settings
from django.template import Template

# local
from apps.tr.models.client.client import Client
from apps.tr.permissions import process_request

# util
import json

### Data
# account
def context(request):
	user, permission, data, verified = process_request(request)
	if verified:

		# NEED TO PARSE PATH
		path = 'clients.TestClient.name' # for example


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

def load_attachment(request):
	user, permission, data, verified = process_request(request)
	if verified:
		# return audio file url or rule reference
		# data type
		# data content
		pass
