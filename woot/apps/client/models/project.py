# django
from django.db import models

# local
from apps.client.models.client import Client

# util

### Project model
class Project(models.Model):

	### Connection
	production_client = models.ForeignKey(Client, related_name='production_projects')
	contract_client = models.ForeignKey(Client, related_name='contract_projects')

	### Properties
	name = models.CharField(max_length=255)
