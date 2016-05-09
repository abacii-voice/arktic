# django
from django.db import models

# local
from apps.tr.models.client.client import Client
from apps.tr.models.transcription.caption import Caption
from apps.tr.idgen import idgen

### Flag classes
class Flag(models.Model):

	### Connections
	client = models.ForeignKey(Client, related_name='flags')

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
	parent = models.ForeignKey(Flag, related_name='instances')
	caption = models.ForeignKey(Caption, related_name='flags')

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)

	### Methods
	# data
	def data(self, path, permission):
		data = self.parent.data(path, permission)
		data.update({
			'caption': self.caption.id,
		})

		return data
