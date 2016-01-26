# django
from django.db import models
from django.apps.apps import get_model

# local
from apps.users.models.base import BaseUser

# util

### Superadmin classes
class Superadmin(BaseUser):
	'''
	This is the free spirit of the system. It has all permissions and can access and load any page as any user.
	Is this too much power for one user to hold? Some say yes. I say: risks are there to be taken.
	'''

	### Connections: unknown
	base = models.OneToOneField(BaseUser, parent_link=True, related_name='superadmin') # link back to parent class

	### Properties: unknown
	# Who or what is this thing?

	### Methods
	def create_surrogate_admin(self, client):
		surrogate_admin = self.surrogate_admins.create(client=client, email='admin_{}'.format(self.email), first_name=self.first_name, last_name=self.last_name, client)
		surrogate_admin.is_surrogate = True
		surrogate_admin.is_approved = True
		surrogate_admin.save()

		return surrogate_admin

	def create_surrogate_moderator(self, client):
		surrogate_moderator = self.surrogate_moderators.create(client=client, email='moderator_{}'.format(self.email), first_name=self.first_name, last_name=self.last_name, client)
		surrogate_moderator.is_surrogate = True
		surrogate_moderator.is_approved = True
		surrogate_moderator.save()

		return surrogate_moderator

	def create_surrogate_user(self, client, moderator=None):
		surrogate_user = self.surrogate_users.create(client=client, user_moderator=moderator, email='user_{}'.format(self.email), first_name=self.first_name, last_name=self.last_name)
		surrogate_user.is_surrogate = True
		surrogate_user.is_approved = True
		surrogate_user.save()

		return surrogate_user
