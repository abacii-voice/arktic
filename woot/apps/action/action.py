# apps.action.action

# django
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.core.cache import cache
from django.views.generic import View
from django.conf import settings
from django.template import Template

# local


### Action views

# url(r'^add_caption_token/', add_caption_token),
def add_caption_token(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

# url(r'^add_flag/', add_flag),
def add_flag(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

# url(r'^replay/', replay),
def replay(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

# url(r'^add_word/', add_word),
def add_word(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

# url(r'^remove_word/', remove_word),
def remove_word(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

# url(r'^remove_token/', remove_token),
def remove_token(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

# url(r'^submit_caption/', submit_caption),
def submit_caption(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

# url(r'^submit_moderation/', submit_moderation),
def submit_moderation(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

# url(r'^check_rule/', check_rule),
def check_rule(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

# url(r'^add_rule/', add_rule),
def add_rule(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

# url(r'^click_button/', click_button),
def click_button(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass

# url(r'^submit_issue/', submit_issue),
def submit_issue(request):
	if request.method == 'POST':
		user = request.user
		if user.is_authenticated():
			pass
