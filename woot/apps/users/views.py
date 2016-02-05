# django
from django.shortcuts import render
from django.views.generic import View
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.conf import settings

# local
from apps.users.forms import LoginForm, NewAdminForm
from apps.users.models.user import User

# util

### User views
# Views represented here
# 0. Home view
class HomeView(View):
	def get(self, request):
		return render(request, 'users/home.html', {})

# 1. Admin signup
class AdminSignupView(View):
	'''
	Only admins can sign up directly to the site. All other users (except superusers) are added by an admin. In this view, all details about an admin and their corporation are entered so that objects can be created.

	'''

	def get(self, request, **kwargs):
		# send the account creation form
		# if the url includes a client key, it will be preset in the form. This is so a link to this interface can be emailed to other admins.

		user = request.user
		if user.is_authenticated():
			'''
			If the user is logged in already, they will need to log out before creating a new admin user. If they want to add an admin for the same client, they can do so from the admin account interface.
			'''

			return HttpResponseRedirect('/logged-in/')
		else:
			# get form
			form = NewAdminForm()

			return render(request, 'users/admin_signup.html', {'form':form})

	def post(self, request, **kwargs):
		'''
		The new admin form needs to be verified. New objects can then be created.
		'''
		form = NewAdminForm(request.POST)

		if form.is_valid():
			# 1. create new user
			email = form.cleaned_data['email']
			email = form.cleaned_data['email']
			email = form.cleaned_data['email']

			admin_user = User.objects.create()

			# 2. set activation key
			# 3. get or create new client
			# 4. add admin role to user
			# 5. send email with activation key
			# 6. add token to superuser register
			pass

		else:
			pass

def new_admin_logged_in_redirect(request):
	'''
	This is a message that redirects to the account page after a few seconds of notifying the user that they are required to log out before attempting to signup for a new admin account.
	'''
	if request.method == 'GET':
		user = request.user
		if user.is_authenticated():


			return render(request, 'users/logged_in_redirect.html', {})
		else:
			# return to login view
			return HttpResponseRedirect('/login/')

# 2. Account SPA
class AccountSPAView(View):
	'''
	The Account SPA view serves a skeleton template containing a small amount of data,
	but mostly <targets> for the js SPA that it referres to. The SPA handles the interface.
	Information can be requested dynamically.

	There is a small matter of permissions and account type. Once the login page has said ok to the
	user, the type of user need to be determined, along with their permissions.
	'''

	def get(self, request, **kwargs):

		# get the user from the request
		user = request.user
		if user.is_authenticated():

			# METADATA
			# several things about the user must be known in order to continue.
			# 1. Is the user a {superadmin, admin, moderator, or user}?
			#   a. if superadmin, which user profile?
			# 2. Is the user approved for activity?
			# 3. How many clients does the user work for?
			# 4. How many roles does the user have with those clients?
			# need a dictionary like this:
			# {
			# 	'client1':{
			# 		'admin':{
			# 			'is_approved':True,
			# 			'is_active':True,
			# 		},
			# 		'worker':{
			# 			'is_approved':True,
			# 			'is_active':True,
			# 		},
			# 	},
			# }

			# PSYCH! The decision about the user permissions isn't even made here! It's made by the template by
			# simply adding or omitting components server side. What comes across in the code will
			# just not have parts of the interface that do not pertain to the user.
			return render(request, 'users/account.html', {'user':user, 'roles':user.roles()})

		else:
			# return to login view
			return HttpResponseRedirect('/login/')

# 3. Login view
class LoginView(View):
	'''
	It is the responsability of the Login view to determine
	whether the user should be granted entry into the first portal. It is not the
	responsability of the Login view to determine the character or type of the user. This
	is a decision left for the Account SPA.
	'''

	def get(self, request, **kwargs):
		# process kwargs
		if 'key' in kwargs:
			activation_key = kwargs['key']

		if request.user.is_authenticated():
			return HttpResponseRedirect('/account/')
		else:
			return render(request, 'users/login.html', {})

	def post(self, request):
		form = LoginForm(request.POST)

		if form.is_valid():
			user = authenticate(email=request.POST['email'], password=request.POST['password'])
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
