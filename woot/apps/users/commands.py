# apps.users.commands

# django
from django.conf.urls import patterns, include, url

# local
from apps.users.command import *

### Command entry points
urlpatterns = [
	# admin signup
	url(r'^check_client/', check_client),
	url(r'^register_client/', register_client),

	# user signup


	# account
	url(r'^user_context/', user_context),
	url(r'^audio_upload/', audio_upload),
]
