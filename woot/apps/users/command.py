# apps.users.command

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

# util
import json

### Commands

# admin signup
def check_client(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

def register_client(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

# user signup


# account
def audio_upload(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

def create_user(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

def modify_user(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

def add_role_to_user(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

def create_message(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

def create_rule(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

def modify_rule(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

def create_caption(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

def create_moderation(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

def create_report(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

def create_issue(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass
