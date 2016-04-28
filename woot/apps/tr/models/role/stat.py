# django
from django.db import models

# local
from apps.tr.models.client.client import Client
from apps.tr.models.role.role import Role

### Stat models
class Stat(models.Model):

	### Properties
	name = models.CharField(max_length=255)

class StatInstance(models.Model):

	### Connections
	parent = models.ForeignKey(Stat, related_name='instances')
	client = models.ForeignKey(Client, related_name='stats')
	role = models.ForeignKey(Role, related_name='stats')

	### Properties
	value = models.FloatField(default=0.0)

	### Methods
	def data(self):
		pass
