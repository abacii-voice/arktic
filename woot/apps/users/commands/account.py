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
	if check_request(request):
		pass

def create_user(request):
	if check_request(request):
		pass

def modify_user(request):
	if check_request(request):
		pass

def add_role_to_user(request):
	if check_request(request):
		pass

def create_message(request):
	if check_request(request):
		pass

def create_rule(request):
	if check_request(request):
		pass

def modify_rule(request):
	if check_request(request):
		pass

def create_caption(request):
	if check_request(request):
		pass

def create_moderation(request):
	if check_request(request):
		pass

def create_report(request):
	if check_request(request):
		pass

def create_issue(request):
	if check_request(request):
		pass
