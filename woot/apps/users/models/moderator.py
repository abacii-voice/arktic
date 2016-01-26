# django
from django.db import models

# local
from apps.users.models.base import BaseUser
from apps.client.models.client import Client
from apps.users.models.superadmin import Superadmin
from apps.users.models.admin import Admin

# util

### Moderator classes
class Moderator(BaseUser):
	'''
	This is mid-level management. Moderators are responsible for the quality assurance of transcriptions from a number of users.
	They report to an admin, who in turn is associated with a client.

	They can function as users.
	'''

	### Connections
	client = models.ForeignKey(Client, related_name='moderators')
	base = models.OneToOneField(BaseUser, parent_link=True, related_name='moderator') # link back to parent class

	# surrogates
	surrogate_superadmin = models.ForeignKey(Superadmin, related_name='surrogate_moderators')
	surrogate_admin = models.OneToOneField(Admin, related_name='surrogate_moderator', null=True)

	### Properties

	### Methods
	def create_surrogate_user(self):
		pass
