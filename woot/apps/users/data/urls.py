# apps.users.data.urls

# django
from django.conf.urls import patterns, include, url

# local
from apps.users.data.views import *

### Data
urlpatterns = [
	url(r'^context/$', context),
	url(r'^context/projects$', context_projects),
]
