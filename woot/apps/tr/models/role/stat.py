# django
from django.db import models

# local
import uuid

### Stat models
class Stat(models.Model):

	### Properties
	name = models.CharField(max_length=255)

class StatInstance(models.Model):

	### Connections
	parent = models.ForeignKey('tr.Stat', related_name='instances')
	role = models.ForeignKey('tr.Role', related_name='stats')

	### Properties
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	value = models.FloatField(default=0.0)
	date_created = models.DateTimeField(auto_now_add=True)

	### Methods
	# data
	def data(self):
		data = {
			'parent': self.parent.name,
			'value': str(self.value),
			'date_created': str(self.date_created),
		}

		return data
