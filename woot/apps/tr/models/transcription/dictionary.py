# django
from django.db import models

# local
from apps.tr.models.client.project import Project
from apps.tr.models.role.role import Role

# util
import uuid

### Dictionary classes
class Dictionary(models.Model):

	### Connections
	project = models.ForeignKey(Project, related_name='dictionaries')

	### Properties
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	name = models.CharField(max_length=255)
	total_tokens = models.PositiveIntegerField(default=0)

	### Methods
	# data
	def data(self):
		data = {
			# basic data
			'name': self.name,
			'total_tokens': str(self.total_tokens),
		}

		return data

class UserDictionary(models.Model):

	### Connections
	parent = models.ForeignKey(Dictionary, related_name='children')
	role = models.ForeignKey(Role, related_name='dictionaries')

	### Properties
