# django
from django.shortcuts import render
from django.views.generic import View
from django.http import HttpResponse, HttpResponseRedirect
from django.conf import settings

# local
from apps.users.models import Session

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

			# setup
			# 1. create session and deactivate all other sessions
			for session in Session.objects.filter(user=user):
				session.deactivate()

			session = user.sessions.create(type='account')

			# METADATA
			return render(request, 'tr/account.html', {'user': user})

		else:
			# return to login view
			return HttpResponseRedirect('/login/')
