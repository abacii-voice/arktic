# django
from django.db import models

# local
from apps.tr.models.client.client import Client
from apps.tr.models.client.project import Project
from apps.users.models import User

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
	def data(self):
		data = {
			'type': self.type,
			'status': self.status,
		}

		return data

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

	### Methods
	# data
	def data(self):
		data = {
			'date_created': str(self.date_created),
			'transcription_threshold': str(self.transcription_threshold),
			'transcriptions_done': str(self.transcriptions_done),
			'moderations_done': str(self.moderations_done),
			'goal_percentage': str(self.goal_percentage),
			'reached_percentage': str(self.reached_percentage),
		}

		return data
