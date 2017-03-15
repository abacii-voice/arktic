# django
from django.db import models

# local
import uuid

### Correction classes
class QualityCheck(models.Model):

	### Connections
	client = models.ForeignKey('tr.Client', related_name='checks')

	### Properties
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
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
	parent = models.ForeignKey('tr.QualityCheck', related_name='instances')
	transcription = models.ForeignKey('tr.TranscriptionInstance', related_name='checks')

	### Properties
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
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
