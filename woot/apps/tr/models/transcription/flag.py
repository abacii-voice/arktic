# django
from django.db import models

# local
from apps.tr.models.transcription.caption import Caption

# util
import uuid

### Flag classes
class Flag(models.Model):

	### Properties
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	name = models.CharField(max_length=255)

	### Methods
	# data
	def data(self):
		data = {
			'id': str(self.id),
			'name': self.name,
		}

		return data

class FlagInstance(models.Model):

	### Connections
	parent = models.ForeignKey(Flag, related_name='instances')
	caption = models.ForeignKey(Caption, related_name='flags')

	### Properties
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

	### Methods
	# data
	def data(self):
		data = self.parent.data()

		return data
