# django
from django.db import models

# local
from apps.users.models.abstract import AbstractUser
from apps.client.models.client import Client
from apps.users.models.superadmin import Superadmin

# util

### Admin classes
class Admin(AbstractUser):
	'''
	Top-level management. They have the ability to oversee work done by their users and moderators. They can also function
	as both users and moderators.
	'''

	### Connections
	client = models.ForeignKey(Client, related_name='admins')

	# surrogates
	surrogate_superadmin = models.OneToOneField(Superadmin, related_name='surrogate_admin', null=True)

	### Properties
	
