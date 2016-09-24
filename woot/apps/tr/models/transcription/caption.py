# django
from django.db import models

# local
from apps.tr.idgen import idgen

### Caption classes
class Caption(models.Model):

	'''
	A unique text associated with a grammar
	'''

	### Connections
	project = models.ForeignKey('tr.Project', related_name='captions')
	grammar = models.ForeignKey('tr.Grammar', related_name='captions')

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	date_created = models.DateTimeField(auto_now_add=True)
	from_recogniser = models.BooleanField(default=False)
	content = models.TextField(default='')

	### Methods
	# data
	def data(self, path, permission):
		data = {
			'date_created': str(self.date_created),
			'from_recogniser': self.from_recogniser,
			'content': self.caption.metadata,
			'instances': {instances.id: instances.data(path, permission) for instances in self.instances.all()},
		}

		return data

class CaptionInstance(models.Model):

	'''
	A text associated with a transcription
	'''

	### Connections
	caption = models.ForeignKey(Caption, related_name='instances')
	role = models.ForeignKey('tr.Role', related_name='captions')
	transcription = models.ForeignKey('tr.Transcription', related_name='captions')

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	date_created = models.DateTimeField(auto_now_add=True)
	metadata = models.TextField(default='')

	### Methods
	# data
	def data(self, path, permission):
		data = {
			'date_created': str(self.date_created),
			'metadata': self.metadata,
			'tokens': {str(token.index): token.data(path, permission) for token in self.tokens.all()},
			'flags': {flag.id: flag.data(path, permission) for flag in self.flags.all()},
			'rules': {rule.id: rule.data(path, permission) for rule in self.rules_cited.all()},
			'checks': {check.id: check.data(path, permission) for check in self.checks.all()}
		}

		return data
