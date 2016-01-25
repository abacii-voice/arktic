# django
from django.db import models

# local
from apps.users.models.abstract import AbstractUser
from apps.client.models.client import Client
from apps.users.models.superadmin import Superadmin
from apps.users.models.admin import Admin

# util

### Moderator classes
class Moderator(AbstractUser):
	'''
	This is mid-level management. Moderators are responsible for the quality assurance of transcriptions from a number of users.
	They report to an admin, who in turn is associated with a client.

	They can function as users.
	'''

	### Connections
	client = models.ForeignKey(Client, related_name='moderators')

	# surrogates
	surrogate_superadmin = models.OneToOneField(Superadmin, related_name='surrogate_moderator', null=True)
	surrogate_admin = models.OneToOneField(Admin, related_name='surrogate_moderator', null=True)

	### Properties
