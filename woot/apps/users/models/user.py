# django
from django.db import models

# local
from apps.users.models.base import BaseUser
from apps.client.models.client import Client
from apps.users.models.superadmin import Superadmin
from apps.users.models.admin import Admin
from apps.users.models.moderator import Moderator

# util

### Moderator classes
class BaseUser():
	'''
	This is your common-garden worker bee. They do the grunt work that keeps the site going. They report to a specific moderator.
	'''

	### Connections
	client = models.ForeignKey(Client, related_name='users')
	base = models.OneToOneField(BaseUser, parent_link=True, related_name='user') # link back to parent class
	user_moderator = models.ForeignKey(Moderator, related_name='users', null=True)

	# surrogates
	# These are pretend connections for admins and moderators to function as users.
	surrogate_superadmin = models.ForeignKey(Superadmin, related_name='surrogate_users')
	surrogate_admin = models.OneToOneField(Admin, related_name='surrogate_user', null=True)
	surrogate_moderator = models.OneToOneField(Moderator, related_name='surrogate_user', null=True)

	### Properties
