# django
from django.db import models

# local
from apps.client.models.client import Client

### Rule classes
class Rule(models.Model):
	'''
	An add-on to a text utterance.
	'''

	### Connections
	client = models.ForeignKey(Client, related_name='rules', null=True)

	### Properties
	number = models.PositiveIntegerField(default=0)
	name = models.CharField(max_length=255)
	description = models.TextField()
