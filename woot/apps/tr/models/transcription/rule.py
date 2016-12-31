# django
from django.db import models

# local
from apps.tr.idgen import idgen

### Rule classes
class Rule(models.Model):
	'''
	An add-on to a text caption.
	'''

	### Connections
	client = models.ForeignKey('tr.Client', related_name='rules') # need to have default rules that are added to a client
	project = models.ForeignKey('tr.Project', related_name='rules', null=True)

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	number = models.PositiveIntegerField(default=0)
	name = models.CharField(max_length=255)
	description = models.TextField(default='')

	### Methods
	# data
	def data(self, path, permission):
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
	parent = models.ForeignKey('tr.Rule', related_name='instances')
	transcription = models.ForeignKey('tr.TranscriptionInstance', related_name='rules_cited')
	role = models.ForeignKey('tr.Role', related_name='rules_cited')

	### Methods
	# data
	def data(self, path, permission):
		data = {
			'name': self.parent.name,
		}

		return data
