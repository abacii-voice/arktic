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
			'name': self.parent.name,
		})

		return data
