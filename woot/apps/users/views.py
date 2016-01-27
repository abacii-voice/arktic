# django
from django.shortcuts import render
from django.views.generic import View
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.conf import settings

# local
from apps.users.forms import LoginForm
from apps.users.models.user import User

# util

### User views
# Views represented here
# 1. Login view
class LoginView(View):
	'''
	It is the responsability of the Login view to determine
	whether the user should be granted entry into the first portal. It is not the
	responsability of the Login view to determine the character or type of the user. This
	is a decision left for the Account SPA.
	'''

	def get(self, request):
		if request.user.is_authenticated():
			return HttpResponseRedirect('/start/')
		else:
			return render(request, 'users/login.html', {})

	def post(self, request):
		form = LoginForm(request.POST)

		if form.is_valid():
			user = authenticate(email=request.POST['email'], password=request.POST['password'])
			if user is not None and user.is_active:
				login(request, user)
				return HttpResponseRedirect('/start/')
			else:
				return render(request, 'users/login.html', {'invalid_username_or_password':True})
		else:
			return render(request, 'users/login.html', {'bad_formatting':True})

# 2. Logout view
def logout_view(request):
	'''
	The only purpose of this view is to log the user out. That's it.
	'''

	logout(request)
	return HttpResponseRedirect('/login/')

# 3. Account SPA
class AccountSPAView(View):
	'''
	The Account SPA view serves a skeleton template containing a small amount of data,
	but mostly <targets> for the js SPA that it referres to. The SPA handles the interface.
	Information can be requested dynamically.

	There is a small matter of permissions and account type. Once the login page has said ok to the
	user, the type of user need to be determined, along with their permissions.
	'''

	def get(self, request):

		# get the user from the request
		user = request.user
		if user.is_authenticated():

			# get base user object
			user = User.objects.get(email=user)

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
