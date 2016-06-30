# django
from django.conf.urls import include, url

# local
from apps.tr.requests.commands.commands import load_audio

# util

### Commands
urlpatterns = [
	url(r'^load_audio/', load_audio),
]
