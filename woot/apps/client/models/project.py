# django
from django.db import models

# local
from apps.client.models.client import Client

# util

### Project model
class Project(models.Model):

	### Connection
	client = models.ForeignKey(Client, related_name='projects')

	### Properties
	name = models.CharField(max_length=255)
