# django
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.core.cache import cache
from django.views.generic import View
from django.conf import settings
from django.template import Template

# local
from apps.users.models import User

# util
import json

### Views
# User signup
class UserSignupView(View):
	'''
	Responds to the link sent to the user's email. This link is of the form:

	http://localhost:8000/verify/0c26e88d-e901-4a33-9946-76da9387a414/7lfGzO4lly5J
	r'^verify/(?P<user>.+)/(?P<key>.+)/$'

	If the user is verified by this method, they will be redirected to the user signup page to choose a password.
	If not, they will be redirected to the login page.
	'''

	def get(self, request, **kwargs):
		# logout any user by default
		logout(request)

		# get data
		user_data = {
			'user_id': kwargs['user'],
			'activation_key': kwargs['key'],
		}

		# get user and determine if user is already verified or details are incorrect
		user = User.objects.get(id=user_data['user_id'])
		is_verified = user.verify(user_data['activation_key'])

		if not is_verified:
			# redirect to login
			return HttpResponseRedirect('/login/')
		else:
			return render(request, 'users/user-signup.html', user_data)

# User signup
def us_data(request):
	if request.method == 'POST':
		# no permission required

		# get initial data
		initial_data = {
			'user_id': request.POST['user_id'],
			'activation_key': request.POST['activation_key'],
		}

		# compile user data
		user = User.objects.get(id=initial_data['user_id'])
		user_data = user.basic_data()

		return JsonResponse(user_data)

def verify(request, **kwargs):
	if request.method == 'POST':

		# get user data
		user_id = request.POST['user_id']
		first_name = request.POST['first_name']
		last_name = request.POST['last_name']
		email = request.POST['email']
		password = request.POST['password']

		# get user and set data
		user = User.objects.get(id=user_id)
		user.first_name = first_name
		user.last_name = last_name
		user.email = email

		# set password
		user.set_password(password)

		# activate roles
		for role in user.roles.all():
			role.status = 'enabled'
			role.save()

		user.save()

		# return token response
		return JsonResponse({'done': True})

# 4. Login view
class LoginView(View):
	'''
	It is the responsability of the Login view to determine
	whether the user should be granted entry into the first portal. It is not the
	responsability of the Login view to determine the character or type of the user. This
	is a decision left for the Account SPA.
	'''

	def get(self, request):
		if request.user.is_authenticated():
			return HttpResponseRedirect('/account/')
		else:
			return render(request, 'users/login.html', {})

	def post(self, request):
		form = LoginForm(request.POST)

		if form.is_valid():
			user = authenticate(email=request.POST['email'], password=request.POST['password'])
			user_test = User.objects.get(email=request.POST['email'])
			if user is not None and user.is_active:
				login(request, user)
				return HttpResponseRedirect('/account/')
			else:
				return render(request, 'users/login.html', {'invalid_username_or_password':True})
		else:
			print('form invalid')
			return render(request, 'users/login.html', {'bad_formatting':True})

# Logout view
def logout_view(request):
	'''
	The only purpose of this view is to log the user out. That's it.
	'''

	logout(request)
	return HttpResponseRedirect('/login/')
