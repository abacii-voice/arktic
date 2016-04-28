# django
from django.conf.urls import patterns, include, url

# local
from apps.action.action import *

### Actions
urlpatterns = [
	url(r'^add_caption_token/', add_caption_token),
	url(r'^add_flag/', add_flag),
	url(r'^replay/', replay),
	url(r'^add_word/', add_word),
	url(r'^remove_word/', remove_word),
	url(r'^remove_token/', remove_token),
	url(r'^submit_caption/', submit_caption),
	url(r'^submit_moderation/', submit_moderation),
	url(r'^check_rule/', check_rule),
	url(r'^add_rule/', add_rule),
	url(r'^click_button/', click_button),
	url(r'^submit_issue/', submit_issue),
]
