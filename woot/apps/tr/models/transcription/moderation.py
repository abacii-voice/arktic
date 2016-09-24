# django
from django.db import models

# local
from apps.tr.models.client.project import Project
from apps.tr.models.transcription.transcription import Transcription
from apps.tr.models.transcription.caption import CaptionInstance
from apps.tr.models.role.role import Role
from apps.tr.idgen import idgen

### Moderation classes
class ModerationToken(models.Model):

	'''

	A token keeps track of the moderation objects that have been requested by a user. It has a limit and will deactivate after that limit.

	'''


	### Connections
	project = models.ForeignKey(Project, related_name='moderation_tokens')
	role = models.ForeignKey(Role, related_name='moderation_tokens')

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	date_created = models.DateTimeField(auto_now_add=True)
	moderation_limit = models.PositiveIntegerField(default=20)
	is_active = models.BooleanField(default=True)

	### Methods
	def get_moderations(self):
		if self.moderations.count() != self.moderation_limit and self.is_active:
			for i in range(self.moderation_limit):
				moderation = self.project.get_moderation()
				if moderation is not None:
					self.moderations.add(moderation)
					self.save()

	def update(self):
		if self.moderations.filter(is_active=False) == self.moderation_limit:
			self.is_active = False
			self.save()

	def data(self, path, permission):
		data = {}
		if permission.check_user(self.role.user):
			data.update({
				'id': self.id,
				'date_created': str(self.date_created),
			})

		return data

class Moderation(models.Model):

	### Connections
	project = models.ForeignKey(Project, related_name='moderations')
	caption = models.ForeignKey(CaptionInstance, related_name='moderations')
	moderator = models.ForeignKey(Role, related_name='moderations')
	token = models.ForeignKey(ModerationToken, related_name='moderations', null=True)

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	date_created = models.DateTimeField(auto_now_add=True)
	is_approved = models.BooleanField(default=True)
	metadata = models.TextField(default='')
	is_active = models.BooleanField(default=True)
	is_available = models.BooleanField(default=True)

	### Methods
	# data
	def data(self, path, permission):
		data = {
			'date_created': str(self.date_created),
			'is_approved': self.is_approved,
			'metadata': self.metadata,
		}

		return data
