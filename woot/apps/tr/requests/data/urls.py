# django
from django.conf.urls import patterns, include, url

# local
from apps.tr.requests.data.data import *

### Data
urlpatterns = [
	url(r'^context/(?P<path>.+)$', context),
]
