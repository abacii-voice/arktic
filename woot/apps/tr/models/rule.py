# django
from django.db import models

# local
from apps.client.models.client import Client

### Rule classes
class RuleManager(models.Manager):
	def client_specific_tags(self):
		return self.filter(is_client_specific=True)

	def issue_tags(self):
		return self.filter(is_issue=True)

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
	is_client_specific = models.BooleanField(default=False)
