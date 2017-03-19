# django
from django.db import models

# local
from apps.tr.models.client.project import Project
from util import filterOrAllOnBlank

# util
import uuid

### Role classes
class Role(models.Model):
	### Connections
	client = models.ForeignKey('tr.Client', related_name='roles')
	project = models.ForeignKey('tr.Project', related_name='assigned', null=True)
	user = models.ForeignKey('users.User', related_name='roles')

	### Properties
	date_created = models.DateTimeField(auto_now_add=True)
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	type = models.CharField(max_length=255)
	display = models.CharField(max_length=255)
	status = models.CharField(max_length=255, default='pending') # shows the stage of becoming a full user.

	# billing and activity
	time_zone = models.CharField(max_length=255)

	### Methods
	# data
	def data(self, path, permission):
		data = {
			# 'project': self.project_override_id, # DON'T KNOW YET
			'user': self.user.id,
			'date_created': str(self.date_created),
			'type': self.type,
			'display': self.display,
			'status': self.status,
		}

		if (permission.is_moderator or permission.is_productionadmin or permission.check_user(self.user)) and (self.type == 'worker' or self.type == 'moderator'):
			data.update({
				'project': self.project.id if self.project is not None else '',
			})

		if path.check('stats') and (permission.is_moderator or permission.is_productionadmin or permission.check_user(self.user)):
			data.update({
				'stats': {str(stat.id): stat.data() for stat in filterOrAllOnBlank(self.stats, id=path.get_id())},
			})

		if path.check('thresholds') and (permission.is_moderator or permission.is_productionadmin) and self.type == 'worker':
			data.update({
				'thresholds': {str(threshold.id): threshold.data() for threshold in filterOrAllOnBlank(self.thresholds, id=path.get_id())},
			})

		if path.check('active_transcription_token', blank=False) and self.project is not None and self.type == 'worker' and permission.check_user(self.user):
			data.update({
				'active_transcription_token': self.active_transcription_token(force=path.check('active_transcription_token', blank=False)).data(path.down('active_transcription_token'), permission),
			})

		if path.check('active_moderation_token', blank=False) and self.project is not None and self.type == 'moderator' and permission.check_user(self.user):
			data.update({
				'active_moderation_token': self.active_moderation_token(force=path.check('active_moderation_token', blank=False)).data(path.down('active_moderation_token'), permission),
			})

		if self.type == 'moderator' or self.type == 'worker':
			data.update({
				'cycle_count': self.active_cycle().count(),
				'daily_count': self.active_day().count,
			})

		return data

	# project
	def auto_project_assign(self):
		if self.project is None and (self.type == 'worker' or self.type == 'moderator'):
			self.project = client.projects.earliest()

		return self.project

	def assign_project(self, project):
		if self.project is None and (self.type == 'worker' or self.type == 'moderator'):
			self.project = project
			self.save()

	def total_transcriptions(self, project=None):
		project_name = project.name if project is not None else ''
		return sum([token.transcriptions.count() for token in self.transcription_tokens.filter(project__name__contains=project_name)])

	# threshold
	def add_threshold(self, project):
		# set index and verify moderator
		return self.thresholds.create(project=project)

	# tokens
	def active_transcription_token(self, force=False):
		for token in self.transcription_tokens.filter(project=self.project, is_active=True):
			token.is_active = False
			token.save()

		new_token = self.transcription_tokens.create(project=self.project)
		new_token.get_transcriptions()
		return new_token

	def active_moderation_token(self, force=False):
		for token in self.transcription_tokens.filter(project=self.project, is_active=True):
			token.is_active = False
			token.save()

		new_token = self.moderation_tokens.create(project=self.project)
		new_token.get_moderations()
		return new_token

	def active_cycle(self):
		return self.cycles.filter(is_active=True)[0] if self.cycles.filter(is_active=True).count() > 0 else self.cycles.create()

	def active_day(self):
		return self.days.filter(is_active=True)[0] if self.days.filter(is_active=True).count() > 0 else self.days.create(cycle=self.active_cycle())

class Threshold(models.Model):

	### Connections
	project = models.ForeignKey('tr.Project', related_name='thresholds')
	role = models.ForeignKey('tr.Role', related_name='thresholds')

	### Properties
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	date_created = models.DateTimeField(auto_now_add=True)
	is_active = models.BooleanField(default=True)
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
			'is_active': self.is_active,
			'date_created': str(self.date_created),
			'transcription_threshold': str(self.transcription_threshold),
			'transcriptions_done': str(self.transcriptions_done),
			'moderations_done': str(self.moderations_done),
			'goal_percentage': str(self.goal_percentage),
			'reached_percentage': str(self.reached_percentage),
		}

		return data
