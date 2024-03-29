# django
from django.db import models

# local
import uuid

### Token classes
class Token(models.Model):

	### Connections
	dictionary = models.ForeignKey('tr.Dictionary', related_name='tokens')

	### Properties
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	type = models.CharField(max_length=255, default='')
	content = models.CharField(max_length=255, default='')

	### Methods
	# data
	def data(self, path, permission):
		data = {
			'type': self.type,
			'content': self.content,
		}

		if permission.is_worker and permission.check_client(self.dictionary.project.production_client):
			if self.shortcuts.filter(role=permission.role).count():
				data.update({
					'shortcut': self.shortcuts.get(role=permission.role).data(path, permission),
				})

		return data

class TokenInstance(models.Model):

	### Connections
	parent = models.ForeignKey('tr.Token', related_name='instances')
	phrase = models.ForeignKey('tr.Phrase', related_name='tokens')

	### Properties
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	index = models.IntegerField(default=0)

	### Methods
	# data
	def data(self, path, permission):
		data = self.parent.data(path, permission)
		data.update({
			'index': str(self.index),
			'content': self.parent.content,
		})

		return data

class TokenShortcut(models.Model):
	'''
	Allows a keyboard shortcut to be assigned to a token

	'''

	### Connections
	parent = models.ForeignKey('tr.Token', related_name='shortcuts')
	role = models.ForeignKey('tr.Role', related_name='token_shortcuts')

	### Properties
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	date_created = models.DateTimeField(auto_now_add=True)
	is_active = models.BooleanField(default=True)
	combo = models.CharField(max_length=255)

	# methods
	def data(self, path, permission):
		data = {
			'date_created': str(self.date_created),
			'is_active': str(self.is_active),
			'combo': self.combo,
		}

		return data
