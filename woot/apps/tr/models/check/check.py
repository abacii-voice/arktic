# django
from django.db import models

# local
from apps.tr.models.client.client import Client
from apps.tr.models.transcription.caption import CaptionInstance
from apps.tr.idgen import idgen

### Correction classes
class QualityCheck(models.Model):

	### Connections
	client = models.ForeignKey(Client, related_name='checks')

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	name = models.CharField(max_length=255)
	is_automatic = models.BooleanField(default=True)

	### Methods
	# data
	def data(self, path, permission):
		data = {
			'name': self.name,
			'is_automatic': self.is_automatic,
		}

		return data

class QualityCheckInstance(models.Model):

	### Connections
	parent = models.ForeignKey(QualityCheck, related_name='instances')
	caption = models.ForeignKey(CaptionInstance, related_name='checks')

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	is_successful = models.BooleanField(default=True)
	date_created = models.DateTimeField(auto_now_add=True)

	### Methods
	def data(self, path, permission):
		data = self.parent.data(path, permission)
		data.update({
			'is_successful': self.is_successful,
			'date_created': str(self.date_created),
		})

		return data
