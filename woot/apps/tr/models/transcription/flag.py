# django
from django.db import models

# local
from apps.tr.idgen import idgen

### Flag classes
class Flag(models.Model):

	### Connections
	client = models.ForeignKey('tr.Client', related_name='flags')

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	name = models.CharField(max_length=255)

	### Methods
	# data
	def data(self, path, permission):
		data = {
			'client': self.client.id,
			'name': self.name,
		}

		if permission.is_worker and permission.check_client(self.client):
			if self.shortcuts.filter(role=permission.role).count():
				data.update({
					'shortcut': self.shortcuts.get(role=permission.role).data(path, permission),
				})

		return data

class FlagInstance(models.Model):

	### Connections
	parent = models.ForeignKey('tr.Flag', related_name='instances')
	transcription = models.ForeignKey('tr.TranscriptionInstance', related_name='flags')
	role = models.ForeignKey('tr.Role', related_name='flags')

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)

	### Methods
	# data
	def data(self, path, permission):
		data = self.parent.data(path, permission)
		data.update({
			'transcription': str(self.transcription.id),
		})

		return data

class FlagShortcut(models.Model):
	'''
	Allows a keyboard shortcut to be assigned to a flag

	'''

	### Connections
	parent = models.ForeignKey('tr.Flag', related_name='shortcuts')
	role = models.ForeignKey('tr.Role', related_name='flag_shortcuts')

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
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
