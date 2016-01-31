# django
from django.db import models

# local
from apps.client.models.client import ProductionClient, ContractClient

# util

### Project model
class Project(models.Model):

	### Connection
	production_client = models.ForeignKey(ProductionClient, related_name='projects')
	contract_client = models.ForeignKey(ContractClient, related_name='projects')

	### Properties
	name = models.CharField(max_length=255)
