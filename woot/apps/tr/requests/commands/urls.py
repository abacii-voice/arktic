# django
from django.conf.urls import include, url

# local
from apps.tr.requests.commands.commands import *

# util

### Commands
urlpatterns = [
	url(r'^load_audio/', load_audio),
	url(r'^submit_revisions/', submit_revisions),
]
