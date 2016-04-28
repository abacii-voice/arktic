# django
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.core.cache import cache
from django.views.generic import View
from django.conf import settings
from django.template import Template

# local


### Action views

def add_caption_token(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

def add_flag(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

def replay(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

def add_word(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

def remove_word(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

def remove_token(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

def submit_caption(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

def submit_moderation(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

def check_rule(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

def add_rule(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

def click_button(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

def submit_issue(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass
