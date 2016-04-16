# apps.users.commands.urls

# django
from django.conf.urls import patterns, include, url

# local
from apps.users.commands.admin_signup import *
from apps.users.commands.user_signup import *
from apps.users.commands.account import *

### Command entry points
urlpatterns = [
	# admin signup
	url(r'^check_client/', check_client),
	url(r'^register_client/', register_client),

	# user signup
	url(r'^verify/', verify),

	# account
	url(r'^create_user/', create_user), # name, email
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
