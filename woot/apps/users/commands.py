# apps.users.commands

# django
from django.conf.urls import patterns, include, url

# local
from apps.users.command import *

### Command entry points
urlpatterns = [
	url(r'^user_roles/', user_roles),
]
