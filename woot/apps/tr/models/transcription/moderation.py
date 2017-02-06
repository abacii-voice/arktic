# django
from django.db import models

# local
from apps.tr.idgen import idgen

### Moderation classes
class ModerationToken(models.Model):

	'''

	A token keeps track of the moderation objects that have been requested by a user. It has a limit and will deactivate after that limit.

	'''


	### Connections
	project = models.ForeignKey('tr.Project', related_name='moderation_tokens')
	role = models.ForeignKey('tr.Role', related_name='moderation_tokens')

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	date_created = models.DateTimeField(auto_now_add=True)
	moderation_limit = models.PositiveIntegerField(default=20)
	is_active = models.BooleanField(default=True)

	### Methods
	def get_moderations(self):
		if self.fragments.count() != self.moderation_limit and self.is_active:
			for i in range(self.moderation_limit):
				moderation = self.project.get_moderation()
				if moderation is not None:
					self.fragments.create(parent=moderation)

	def update(self):
		if self.moderations.filter(is_active=False) == self.moderation_limit:
			self.is_active = False
			self.save()

	def data(self, path, permission):
		data = {}
		if permission.check_user(self.role.user):
			data.update({
				'date_created': str(self.date_created),
			})

		return data

class Moderation(models.Model):

	### Connections
	project = models.ForeignKey('tr.Project', related_name='moderations')
	transcription = models.ForeignKey('tr.TranscriptionInstance', related_name='moderations')

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	date_created = models.DateTimeField(auto_now_add=True)
	is_approved = models.BooleanField(default=True)
	is_active = models.BooleanField(default=True)
	is_available = models.BooleanField(default=True)
	metadata = models.TextField(default='')

	### Methods
	# data
	def data(self, path, permission):
		data = {
			'date_created': str(self.date_created),
			'is_approved': self.is_approved,
			'metadata': self.metadata,
		}

		return data

class ModerationFragment(models.Model):

	### Connections
	parent = models.ForeignKey('tr.Moderation', related_name='fragments')
	token = models.ForeignKey('tr.ModerationToken', related_name='fragments')
	session = models.ForeignKey('users.Session', related_name='moderation_fragments')

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	index = models.PositiveIntegerField(default=0)
	date_created = models.DateTimeField(auto_now_add=True)
	date_reconciled = models.DateTimeField(auto_now_add=True)
	is_reconciled = models.BooleanField(default=False)
	is_released = models.BooleanField(default=False)
	was_released_by_session = models.BooleanField(default=False)

	# methods
	def data(self, path, permission):
		data = {
			'date_created': str(self.date_created),
			'is_reconciled': str(self.is_reconciled),
			'is_released': str(self.is_reconciled),
			'was_released_by_session': str(self.was_released_by_session),
			'phrase': self.parent.content.data(path, permission),
			'index': str(self.index),
			'parent': self.parent.id,
		}

		return data

	def release(self):
		pass

	def reconcile(self, revision):
		pass

class ModerationInstance(models.Model):

	### Connections
	parent = models.ForeignKey('tr.Moderation', related_name='instances')
	moderator = models.ForeignKey('tr.Role', related_name='moderations')
	fragment = models.OneToOneField('tr.ModerationFragment', related_name='moderation')
	token = models.ForeignKey('tr.ModerationToken', related_name='moderations')
	phrase = models.OneToOneField('tr.PhraseInstance', related_name='moderation')

	### Properties
	date_created = models.DateTimeField(auto_now_add=True)

	# methods
	def data(self, path, permission):
		data = {
			'date_created': str(self.date_created),
		}

		return data
