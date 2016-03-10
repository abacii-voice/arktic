# django
from django.db import models

# local
from apps.client.models.client import Client
from apps.tr.models.moderation import Moderation

### Rule classes
class Rule(models.Model):
	'''
	An add-on to a text caption.
	'''

	### Connections
	client = models.ForeignKey(Client, related_name='rules', null=True)

	### Properties
	number = models.PositiveIntegerField(default=0)
	name = models.CharField(max_length=255)
	description = models.TextField()

class RuleInstance(models.Model):
	'''
	A rule attached to a moderation.
	'''

	### Connections
	parent = models.ForeignKey(Rule, related_name='instances')
	moderation = models.ForeignKey(Moderation, related_name='rules_cited')
