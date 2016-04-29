# django
from django.conf.urls import patterns, include, url

# local
from apps.tr.requests.commands.account import *

### Command entry points
urlpatterns = [
	# account
	url(r'^create_user/', create_user), # name, email
	url(r'^create_project/', create_project), # name, email
	url(r'^create_upload/', create_upload), # name, email
	url(r'^modify_user/', modify_user), # user, name, email
	url(r'^add_role_to_user/', add_role_to_user), # email, role
	url(r'^enable_role/', enable_role), # email, role
	url(r'^disable_role/', disable_role), # email, role
	url(r'^create_message/', create_message), # from_user, to_user, text, attachments
	url(r'^create_rule/', create_rule),
	url(r'^modify_rule/', modify_rule),
	url(r'^create_caption/', create_caption),
	url(r'^create_moderation/', create_moderation),
	url(r'^create_report/', create_report),
	url(r'^create_issue/', create_issue),
	url(r'^upload_audio/', upload_audio),
]