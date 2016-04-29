# django
from django.db import models

# local
from apps.tr.models.client.client import Client
from apps.tr.models.transcription.caption import Caption
from apps.tr.models.role.role import Role

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
	description = models.TextField(default='')

	### Methods
	# data
	def data(self):
		data = {
			'number': str(self.number),
			'name': self.name,
			'description': self.description,
		}

		return data

class RuleInstance(models.Model):
	'''
	A rule attached to a moderation.
	'''

	### Connections
	parent = models.ForeignKey(Rule, related_name='instances')
	caption = models.ForeignKey(Caption, related_name='rules_cited')
	role = models.ForeignKey(Role, related_name='rules_cited')
