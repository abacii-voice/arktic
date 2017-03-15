# django
from django.db import models

# local
import uuid

### Grammar model
class Grammar(models.Model):
	'''
	This is generated automatically to narrow the results of the recogniser.
	It belongs to an end client.
	'''

	### Connections
	client = models.ForeignKey('tr.Client', related_name='grammars')

	### Properties
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	name = models.CharField(max_length=255)
	date_created = models.DateTimeField(auto_now_add=True)
	metadata = models.TextField(default='')
	file = models.FileField(upload_to='grammars')

	### Methods
	# data
	def data(self, path, permission):
		data = {
			'date_created': str(self.date_created),
			'metadata': self.metadata,
			'filename': self.file.url,
		}

		return data
