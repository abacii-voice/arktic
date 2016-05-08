# django
from django.db import models

# local
from apps.tr.models.client.client import Client
from apps.tr.models.client.project import Project
from apps.tr.models.transcription.caption import Caption
from apps.tr.models.role.role import Role
from apps.tr.idgen import idgen

### Rule classes
class Rule(models.Model):
	'''
	An add-on to a text caption.
	'''

	### Connections
	client = models.ForeignKey(Client, related_name='rules', null=True)
	project = models.ForeignKey(Project, related_name='rules', null=True)

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	number = models.PositiveIntegerField(default=0)
	name = models.CharField(max_length=255)
	description = models.TextField(default='')

	### Methods
	# data
	def data(self, path):
		data = {
			'project': self.project.id,
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
	def data(self, path):
		data = self.parent.data(path)

		return data
