# django
from django.db import models

# local
from apps.tr.models.client.client import Client
from apps.tr.models.client.project import Project
from apps.tr.models.transcription.caption import Caption
from apps.tr.models.role.role import Role

# util
import uuid

### Rule classes
class Rule(models.Model):
	'''
	An add-on to a text caption.
	'''

	### Connections
	client = models.ForeignKey(Client, related_name='rules', null=True)
	project = models.ForeignKey(Project, related_name='rules', null=True)

	### Properties
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	number = models.PositiveIntegerField(default=0)
	name = models.CharField(max_length=255)
	description = models.TextField(default='')

	### Methods
	# data
	def data(self):
		data = {
			'project': str(self.project.id),
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

	### Methods
	# data
	def data(self):
		data = self.parent.data()

		return data
