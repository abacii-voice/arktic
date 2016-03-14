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
from util import check_request

# util
import json

### Data
def context(request):
	if check_request(request):
		user = request.user

		# context containing everything about user and clients
		context_dict = {
			'user': {
				'first_name': user.first_name,
				'last_name': user.last_name,
				'email': user.email,
			},
			'client_list': [
				client.name for client in user.clients()
			],
			'clients': {
				client.name: client.dict(permission_user=user) for client in user.clients()
			},
			'global_rules': ["rules that don't have clients"],
		}

		return JsonResponse(context_dict)
