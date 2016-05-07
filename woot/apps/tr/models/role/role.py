# django
from django.db import models

# local
from apps.tr.models.client.client import Client
from apps.tr.models.client.project import Project
from apps.users.models import User

# util
import uuid

### Role classes
class Role(models.Model):
	### Connections
	client = models.ForeignKey(Client, related_name='roles')
	supervisor = models.ForeignKey('self', related_name='subordinates', null=True)
	project_override = models.ForeignKey(Project, related_name='assigned_workers', null=True)
	user = models.ForeignKey(User, related_name='roles')

	### Properties
	date_created = models.DateTimeField(auto_now_add=True)
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	type = models.CharField(max_length=255)
	status = models.CharField(max_length=255, default='pending') # shows the stage of becoming a full user.

	### Methods
	# data
	def data(self):
		data = {
			# basic data
			'supervisor': self.supervisor.id,
			# 'project': self.project_override_id, # DON'T KNOW YET
			'user': self.user.id,
			'date_created': str(self.date_created),
			'type': self.type,
			'status': self.status,

			# connections
			'stats': {stat.parent.name: stat.data() for stat in self.stats.all()},
		}

		return data

	# threshold
	def add_threshold(self, project):
		# set index and verify moderator
		return self.thresholds.create(project=project)

class Threshold(models.Model):

	### Connections
	project = models.ForeignKey(Project, related_name='thresholds')
	role = models.ForeignKey(Role, related_name='thresholds')

	### Properties
	date_created = models.DateTimeField(auto_now_add=True)
	index = models.PositiveIntegerField(default=0)
	transcription_threshold = models.PositiveIntegerField(default=0)
	transcriptions_done = models.PositiveIntegerField(default=0)
	moderations_done = models.PositiveIntegerField(default=0)
	goal_percentage = models.FloatField(default=0.0)
	reached_percentage = models.FloatField(default=0.0)

	### Methods
	# data
	def data(self):
		data = {
			'role': self.role.id,
			'index': str(self.index),
			'date_created': str(self.date_created),
			'transcription_threshold': str(self.transcription_threshold),
			'transcriptions_done': str(self.transcriptions_done),
			'moderations_done': str(self.moderations_done),
			'goal_percentage': str(self.goal_percentage),
			'reached_percentage': str(self.reached_percentage),
		}

		return data
