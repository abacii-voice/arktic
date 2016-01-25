# django
from django.db import models

# local
from apps.users.models.base import BaseUser
from apps.client.models.client import Client
from apps.users.models.superadmin import Superadmin

# util

### Admin classes
class Admin(BaseUser):
	'''
	Top-level management. They have the ability to oversee work done by their users and moderators. They can also function
	as both users and moderators.
	'''

	### Connections
	client = models.ForeignKey(Client, related_name='admins')
	base = models.OneToOneField(BaseUser, parent_link=True, related_name='admin') # link back to parent class

	# surrogates
	surrogate_superadmin = models.OneToOneField(Superadmin, related_name='surrogate_admin', null=True)

	### Properties
