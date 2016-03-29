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
def audio_upload(request):
	user, permission, verified = check_request(request)
	if verified:
		pass

def create_user(request):
	user, permission, verified = check_request(request)
	if verified:
		user_data = {
			'current_client': request.POST['current_client'],
			'first_name': request.POST['first_name'],
			'last_name': request.POST['last_name'],
			'email': request.POST['email'],
			'roles_admin': request.POST['roles_admin'],
			'roles_moderator': request.POST['roles_moderator'],
			'roles_worker': request.POST['roles_worker'],
		}

		# 0. get client
		client = Client.objects.get(name=user_data['current_client'])

		# 1. check if email is already in the system
		is_unique_email = User.objects.filter(email=user_data['email']).count()==0
		is_unique_email_for_client = True
		if not is_unique_email:
			is_unique_email_for_client = User.objects.get(email=user_data['email']).roles.filter(client=client).count()==0

		# 2. create user
		if is_unique_email_for_client:
			new_user = User.objects.create_user(
				user_data['first_name'],
				user_data['last_name'],
				user_data['email'],
			)

			if user_data['roles_admin']=='true':
				if client.is_production:
					new_user.create_productionadmin(client)
				else:
					new_user.create_contractadmin(client)

			if user_data['roles_moderator']=='true':
				new_user.create_moderator(client)

			if user_data['roles_worker']=='true':
				new_user.create_worker(client, client.available_moderator())

			# start activation
			new_user.send_verification_email()

			return JsonResponse(new_user.data(permission))

def modify_user(request):
	user, permission, verified = check_request(request)
	if verified:
		pass

def add_role_to_user(request):
	user, permission, verified = check_request(request)
	if verified:
		# get data
		return JsonResponse({'done': True})

def enable_role(request):
	user, permission, verified = check_request(request)
	if verified:
		# get data
		return JsonResponse({'done': True})

def disable_role(request):
	user, permission, verified = check_request(request)
	if verified:
		# get data
		return JsonResponse({'done': True})

def create_message(request):
	user, permission, verified = check_request(request)
	if verified:
		pass

def create_rule(request):
	user, permission, verified = check_request(request)
	if verified:
		pass

def modify_rule(request):
	user, permission, verified = check_request(request)
	if verified:
		pass

def create_caption(request):
	user, permission, verified = check_request(request)
	if verified:
		pass

def create_moderation(request):
	user, permission, verified = check_request(request)
	if verified:
		pass

def create_report(request):
	user, permission, verified = check_request(request)
	if verified:
		pass

def create_issue(request):
	user, permission, verified = check_request(request)
	if verified:
		pass
