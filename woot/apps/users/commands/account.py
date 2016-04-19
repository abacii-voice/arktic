# apps.users.commands.views

# django
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.core.cache import cache
from django.views.generic import View
from django.conf import settings
from django.template import Template
from django.core.files import File
from django.db.models import Count, F

# local
from apps.client.models.client import Client, production_client
from apps.users.models.user import User
from apps.tr.models.transcription import Transcription
from apps.tr.models.utterance import Utterance
from apps.client.models.project import Project, Upload
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
		batch_name = request.POST['batch_name']
		archive_name = request.POST['archive_name']
		relfile_name = request.POST['relfile_name']

		# get project
		client = Client.objects.get(name=client_name)
		project = client.contract_projects.get(name=project_name) # only upload from a contract client anyway.
		batch = project.batches.get(name=batch_name)
		upload = batch.uploads.get(archive_name=archive_name, relfile_name=relfile_name)

		# create new transcription
		transcription, transcription_created = Transcription.objects.get_or_create(
			project=project,
			batch=batch,
			filename=file_name,
		)

		if transcription_created:
			transcription.caption = caption
			transcription.save()

			# mark fragment as reconciled
			fragment, fragment_created = upload.fragments.get_or_create(filename=file_name)
			fragment.is_reconciled = True
			fragment.save()

			# create tmp directory for uploads
			tmp = join(settings.SITE_ROOT, 'tmp')
			if not exists(tmp):
				os.mkdir(tmp)

			if exists(join(tmp, file_name)):
				os.remove(join(tmp, file_name))

			with open(join(tmp, file_name), 'wb+') as destination:
				for chunk in file.chunks():
					destination.write(chunk)

			# let file close, then reopen
			with open(join(tmp, file_name), 'rb') as destination:
				# create new utterance using open file
				utterance, utterance_created = Utterance.objects.get_or_create(
					project=project,
					batch=batch,
					transcription=transcription,
					file=File(destination),
				)

				utterance.process()
				transcription.utterance = utterance
				transcription.save()

			# remove tmp file
			os.remove(join(tmp, file_name))

			# http://stackoverflow.com/questions/33543804/export-blob-data-to-file-in-django
			# Maybe answers source question and blob question at the same time.

			return JsonResponse({'created': True})
		else:
			return JsonResponse({'created': False})

def create_upload(request):
	user, permission, verified = check_request(request)
	if verified:

		# get data
		current_client = request.POST['current_client']
		project_name = request.POST['project_name']
		batch_name = request.POST['batch_name']
		archive_name = request.POST['archive_name']
		relfile_name = request.POST['relfile_name']
		fragments = request.POST.getlist('fragments[]')

		# create upload object
		client = Client.objects.get(name=current_client)
		project = client.contract_projects.get(name=project_name)
		batch = project.batches.get(name=batch_name)

		# determine if another upload exists with the same details
		upload, upload_created = None, False

		# relfile_name
		if archive_name == '':
			upload, upload_created = batch.uploads.get_or_create(relfile_name=relfile_name)

		# archive_name
		elif relfile_name == '':
			upload, upload_created = batch.uploads.get_or_create(archive_name=archive_name)

		# neither
		else:
			if batch.uploads.filter(relfile_name=relfile_name).exists():
				upload = batch.uploads.get(relfile_name=relfile_name)
				upload.archive_name = archive_name
				upload.save()
				upload_created = False

			elif batch.uploads.filter(archive_name=archive_name).exists():
				upload = batch.uploads.get(archive_name=archive_name)
				upload.relfile_name = relfile_name
				upload.save()
				upload_created = False

		if upload_created:
			upload.total_fragments = len(fragments)
			upload.save()

			for fragment_filename in fragments:
				fragment, fragment_created = upload.fragments.get_or_create(project=project, batch=batch, filename=fragment_filename)

			return JsonResponse({'created': True})

		else:
			return JsonResponse({'created': False})

def create_user(request):
	user, permission, verified = check_request(request)
	if verified:

		# get data
		current_client = request.POST['current_client']
		first_name = request.POST['first_name']
		last_name = request.POST['last_name']
		email = request.POST['email']
		roles_admin = request.POST['roles_admin']
		roles_moderator = request.POST['roles_moderator']
		roles_worker = request.POST['roles_worker']

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

		# get data
		current_client = request.POST['current_client']
		project_name = request.POST['name']
		batch_deadline = request.POST['batch_deadline']
		new_batch = request.POST['new_batch']
		batch_name = request.POST['batch_name']

		# 0. get client
		client = Client.objects.get(name=current_client)

		# 1. get or create project
		project, project_created = client.contract_projects.get_or_create(name=project_name, production_client=production_client())

		# 2. create batch
		if new_batch == 'true':
			batch, batch_created = project.batches.get_or_create(name=batch_name)
			if batch_created:
				batch.deadline = datetime.datetime.strptime(batch_deadline, '%Y/%m/%d').date()
				batch.save()

		return JsonResponse({'done': True})

def add_role_to_user(request):
	user, permission, verified = check_request(request)
	if verified and permission.is_productionadmin:

		# get data
		user_id = request.POST['user_id']
		current_client = request.POST['current_client']
		role_type = request.POST['role_type']

		# create role
		client = Client.objects.get(name=current_client)
		if permission.check_client(client):
			user = User.objects.get(id=user_id)

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
		user_id = request.POST['user_id']
		current_client = request.POST['current_client']
		role_type = request.POST['role_type']

		if permission.is_productionadmin or permission.is_contractadmin:
			user = User.objects.get(id=user_id)
			role = user.get_role(current_client, role_type)
			if role is not None:
				role.status = 'enabled'
				role.save()

		return JsonResponse({'done': True})

def disable_role(request):
	user, permission, verified = check_request(request)
	if verified:
		# get user role be disabled
		user_id = request.POST['user_id']
		current_client = request.POST['current_client']
		role_type = request.POST['role_type']

		if permission.is_productionadmin or permission.is_contractadmin:
			user = User.objects.get(id=user_id)
			role = user.get_role(current_client, role_type)
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
