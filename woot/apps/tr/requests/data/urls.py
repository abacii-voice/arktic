# django
from django.conf.urls import patterns, include, url

# local
from apps.users.data.views import *

### Data
urlpatterns = [
	url(r'^context/(?P<path>.+)$', context),
	url(r'^us_data/$', us_data),
]
