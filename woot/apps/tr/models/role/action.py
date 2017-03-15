# django
from django.db import models

# local
import uuid

### Action
class Action(models.Model):

	### Connections
	role = models.ForeignKey('tr.Role', related_name='actions')
	session = models.ForeignKey('users.Session', related_name='actions') # used to uniquely identify the action

	### Properties
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	context = models.CharField(max_length=255)
	session_index = models.PositiveIntegerField(default=0)
	date_created = models.DateTimeField(auto_now_add=True)
	type = models.CharField(max_length=255)
	metadata = models.TextField(default='')

	### Methods
	# data
	def data(self):
		data = {
			'context': self.context,
			'index': str(self.index),
			'date_created': str(self.date_created),
			'type': self.type,
			'metadata': self.metadata,
		}

		return data
