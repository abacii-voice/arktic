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
from util import check_request

# util
import json

### Commands
def check_client(request):
	if check_request(request):
		pass

def register_client(request):
	if check_request(request):
		pass
