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
