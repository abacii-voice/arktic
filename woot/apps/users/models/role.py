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
	project_override = models.ForeignKey(Project, related_name='assigned_workers', null=True)
	user = models.ForeignKey(User, related_name='roles')

	### Properties
	# type
	type = models.CharField(max_length=255)

	# status
	status = models.CharField(max_length=255, default='pending') # shows the stage of becoming a full user.

	### Methods
	# data
	def data(self, permission):
		role_data = {
			'type': self.get_type(),
		}

		if permission.is_contractadmin or permission.is_productionadmin:
			role_data.update({
				'status': self.status,
				'thresholds': self.threshold_data(),
			})

		if ((permission.is_productionadmin and self.get_type()=='worker') or permission.user == self.user) and self.project_override is not None:
			role_data.update({
				'project_override': self.project_override.name,
			})

		return role_data

	def get_type(self):
		if self.type == 'contractadmin' or self.type == 'productionadmin':
			return 'admin'
		else:
			return self.type

	def threshold_data(self):
		pass

class Threshold(models.Model):

	### Connections
	role = models.ForeignKey(Role, related_name='thresholds')
	project = models.ForeignKey(Project, related_name='thresholds')

	### Properties
	date_created = models.DateTimeField(auto_now_add=True)
	transcription_threshold = models.PositiveIntegerField(default=0)
	transcriptions_done = models.PositiveIntegerField(default=0)
	moderations_done = models.PositiveIntegerField(default=0)
	goal_percentage = models.FloatField(default=0.0)
	reached_percentage = models.FloatField(default=0.0)
