# django
from django.db import models

# local
from apps.client.models.client import Client
from apps.users.models.user import User

### Role classes
class Role(models.Model):
	### Connections
	supervisor = models.ForeignKey('self', related_name='subordinates', null=True)
	client = models.ForeignKey(Client, related_name='roles')
	user = models.ForeignKey(User, related_name='roles')

	### Properties
	# type
	type = models.CharField(max_length=255)

	# status
	is_new = models.BooleanField(default=True)
	is_approved = models.BooleanField(default=False)
	is_enabled = models.BooleanField(default=False)

	### Methods
	# data
	def data(self, permission):
		if permission.is_basic:
			# only give type
			return self.type

		elif permission.is_contractadmin or permission.is_productionadmin:
			role_data = {
				'is_new': self.is_new,
				'is_approved': self.is_approved,
				'is_enabled': self.is_enabled,
			}

			return role_data
