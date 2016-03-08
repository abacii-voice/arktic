# apps.users.command

# django
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.core.cache import cache
from django.views.generic import View
from django.conf import settings
from django.template import Template

# local
from apps.client.models.client import ProductionClient, ContractClient
from apps.users.models.user import User

# util
import json

### Commands

# admin signup
def check_client(request):
	pass

def register_client(request):
	pass

# user signup


# account
def user_context(request):
	if request.method=='POST':
		user = request.user
		if user.is_authenticated():

			# get data
			client_list = sorted(user.clients())
			role_data = user.roles()

			# single client test
			one_client = len(client_list)==1
			one_client_name = client_list[0] if one_client else ''

			# single role test
			one_role = len(role_data['clients'][one_client_name]['roles'])==1 if one_client else False
			one_role_name = role_data['clients'][one_client_name]['roles'][0] if one_role else ''

			# make context
			context = {
				'clients': client_list,
				'roles': user.roles(),
				'stats': '',
				'current_relfile_lines':[],
				'one_client': one_client,
				'one_role': one_role,
				'current_client': one_client_name,
				'current_role': one_role_name,
				'role_display': {
					'worker': 'Transcriber',
					'moderator': 'Moderator',
					'productionadmin': 'Admin',
					'contractadmin': 'Admin',
				},
				'role-state': {
					'worker': 'worker'
				}
			}

			return JsonResponse(context)

def user_list(request):
	if request.method=='POST':
		user = request.user
		if user.is_authenticated():
			# input data
			current_client = request.POST['current_client']
			current_role = request.POST['current_role']

			# determine the list of users needed
			client = ProductionClient.objects.get(name=current_client)

			role = None
			user_dict = None
			if current_role == 'moderator':
				role = user.users_moderator_roles.get(client__name=current_client)

				if role is not None:
					worker_users = [worker.user for worker in role.workers.all()]

					user_dict = {'users': [user.details(client, current_role) for user in worker_users]}

			elif current_role == 'productionadmin':
				role = user.users_productionadmin_roles.get(client__name=current_client)

				if role is not None:
					users = User.objects.filter(production_clients__in=[client])

					user_dict = {'users': [user.details(client, current_role) for user in users]}
					print(users[0].details(client, current_role))

			if user_dict is not None:
				return JsonResponse(user_dict)

def audio_upload(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass
