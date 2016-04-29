# django
from django.db import models

# local
from apps.tr.models.role.role import Role

### Action
class Action(models.Model):

	### Connections
	role = models.ForeignKey(Role, related_name='actions')

	### Properties
	date_created = models.DateTimeField(auto_now_add=True)
	type = models.CharField(max_length=255)
	metadata = models.TextField(default='')

	### Methods
	# data
	def data(self):
		data = {
			'date_created': str(self.date_created),
			'type': self.type,
			'metadata': self.metadata,
		}

		return data
