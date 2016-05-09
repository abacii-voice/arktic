# django
from django.db import models

# local
from apps.tr.models.client.project import Project
from apps.tr.models.role.role import Role
from apps.tr.idgen import idgen

### Dictionary classes
class Dictionary(models.Model):

	### Connections
	project = models.ForeignKey(Project, related_name='dictionaries')

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	name = models.CharField(max_length=255)
	total_tokens = models.PositiveIntegerField(default=0)

	### Methods
	# data
	def data(self, path, permission):
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
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)

	### Methods
	# data
	def data(self, path, permission):
		data = self.parent.data(path, permission)
		data.update({
			'role': self.role.id,
		})

		return data
