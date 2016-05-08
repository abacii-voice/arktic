# django
from django.db import models

# local
from apps.tr.models.client.client import Client
from apps.tr.models.role.role import Role
from apps.tr.idgen import idgen

### Stat models
class Stat(models.Model):

	### Properties
	name = models.CharField(max_length=255)

class StatInstance(models.Model):

	### Connections
	parent = models.ForeignKey(Stat, related_name='instances')
	role = models.ForeignKey(Role, related_name='stats')

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
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
