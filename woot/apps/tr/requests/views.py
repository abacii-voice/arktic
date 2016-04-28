# django
from django.shortcuts import render
from django.views.generic import View
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.conf import settings

### TR views
# 1. Home view
class HomeView(View):
	def get(self, request):
		return render(request, 'tr/home.html', {})

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
			return render(request, 'users/account.html', {'user': user})

		else:
			# return to login view
			return HttpResponseRedirect('/login/')
