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
from apps.tr.models.transcription import Transcription
from permission import check_request

# util
import json
import os
from os.path import join, exists
import datetime

### Commands
def upload_audio(request):
	user, permission, verified = check_request(request)
	if verified:
		# get file
		file = request.FILES['file']

		# get metadata
		file_name = request.POST['filename']
		caption = request.POST['caption']
		client_name = request.POST['current_client']
		project_name = request.POST['project_name']

		# get project
		project = Project.objects.get()

		# create tmp directory for uploads
		tmp = join(settings.SITE_ROOT, 'tmp')
		if not exists(tmp):
			os.mkdir(tmp)

		with open(join(tmp, file_name), 'wb') as destination:
			for chunk in file.chunks():
				destination.write(chunk)

			# create new transcription
			transcription, transcription_created = Transcription.objects.get_or_create(

			)

		# http://stackoverflow.com/questions/33543804/export-blob-data-to-file-in-django
		# Maybe answers source question and blob question at the same time.

		return JsonResponse({'done': True})

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

def create_project(request):
	user, permission, verified = check_request(request)
	if verified:
		project_data = {
			'current_client': request.POST['current_client'],
			'project_name': request.POST['name'],
			'batch_deadline': request.POST['batch_deadline'],
			'new_batch': request.POST['new_batch'],
			'batch_name': request.POST['batch_name'],
		}

		# 0. get client
		client = Client.objects.get(name=project_data['current_client'])

		# 1. get or create project
		project, project_created = client.contract_projects.get_or_create(name=project_data['project_name'])

		# 2. create batch
		if project_data['new_batch'] == 'true':
			batch, batch_created = project.batches.get_or_create(name=project_data['batch_name'])
			if batch_created:
				batch.due_date = datetime.datetime.strptime(project_data['batch_deadline'], "%Y-%m-%d").date()
				batch.save()

		return JsonResponse({'done': True})

def add_role_to_user(request):
	user, permission, verified = check_request(request)
	if verified and permission.is_productionadmin:
		# get data
		role_data = {
			'id': request.POST['user_id'],
			'client': request.POST['current_client'],
			'type': request.POST['role_type'],
		}

		# create role
		client = Client.objects.get(name=role_data['client'])
		if permission.check_client(client):
			user = User.objects.get(id=role_data['id'])

			role_type = role_data['type']
			if role_type == 'admin':
				if client.is_production:
					user.create_productionadmin(client)
				else:
					user.create_contractadmin(client)

			elif role_type == 'moderator':
				user.create_moderator(client)

			elif role_type == 'worker':
				if user.get_role(client.name, 'worker') is None:
					user.create_worker(client, client.available_moderator())

		return JsonResponse({'done': True})

def modify_user(request):
	user, permission, verified = check_request(request)
	if verified:
		# get data
		return JsonResponse({'done': True})

def enable_role(request):
	user, permission, verified = check_request(request)
	if verified:
		# get user role be enabled
		role_data = {
			'id': request.POST['user_id'],
			'client': request.POST['current_client'],
			'type': request.POST['role_type'],
		}

		if permission.is_productionadmin or permission.is_contractadmin:
			user = User.objects.get(id=role_data['id'])
			role = user.get_role(role_data['client'], role_data['type'])
			if role is not None:
				role.status = 'enabled'
				role.save()

		return JsonResponse({'done': True})

def disable_role(request):
	user, permission, verified = check_request(request)
	if verified:
		# get user role be disabled
		role_data = {
			'id': request.POST['user_id'],
			'client': request.POST['current_client'],
			'type': request.POST['role_type'],
		}

		if permission.is_productionadmin or permission.is_contractadmin:
			user = User.objects.get(id=role_data['id'])
			role = user.get_role(role_data['client'], role_data['type'])
			if role is not None:
				role.status = 'disabled'
				role.save()

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
