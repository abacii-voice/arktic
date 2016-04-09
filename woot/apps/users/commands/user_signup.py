# apps.users.commands.views

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
from permission import check_request

# util
import json

### Commands
def verify(request):
	if request.method == 'POST':
		# get user data
		user_data = {
			'user_id': request.POST['user_id'],
			'first_name': request.POST['first_name'],
			'last_name': request.POST['last_name'],
			'email': request.POST['email'],
			'password': request.POST['password'],
		}

		# get user and set data
		user = User.objects.get(id=user_data['user_id'])
		user.first_name = user_data['first_name']
		user.last_name = user_data['last_name']
		user.email = user_data['email']

		# set password
		user.set_password(user_data['password'])

		# activate roles
		for role in user.roles.all():
			role.status = 'enabled'
			role.save()

		user.save()

		# return token response
		return JsonResponse({'done': True})
