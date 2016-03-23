# django
from django.db import models

# local
from apps.client.models.client import Client
from apps.client.models.project import Project
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
	is_approved = models.BooleanField(default=True)
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
				'performances': self.performance_data(),
			}

			return role_data

	def get_type(self):
		if self.type == 'contractadmin' or self.type == 'productionadmin':
			return 'admin'
		else:
			return self.type

	def performance_data(self):
		pass

class Performance(models.Model):

	### Connections
	role = models.ForeignKey(Role, related_name='performances')
	project = models.ForeignKey(Project, related_name='performances')

	### Properties
	date_created = models.DateTimeField(auto_now_add=True)
	transcription_threshold = models.PositiveIntegerField(default=0)
	transcriptions_done = models.PositiveIntegerField(default=0)
	moderations_done = models.PositiveIntegerField(default=0)
	goal_percentage = models.FloatField(default=0.0)
	reached_percentage = models.FloatField(default=0.0)
