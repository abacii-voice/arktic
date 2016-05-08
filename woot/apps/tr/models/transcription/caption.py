# django
from django.db import models

# local
from apps.tr.models.transcription.transcription import Transcription
from apps.tr.models.role.role import Role
from apps.tr.idgen import idgen

### Utterance classes
class Caption(models.Model):

	'''
	A text utterance associated with a transcription.
	'''

	### Connections
	transcription = models.ForeignKey(Transcription, related_name='captions')
	role = models.ForeignKey(Role, related_name='captions')

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	date_created = models.DateTimeField(auto_now_add=True)
	from_recogniser = models.BooleanField(default=False)
	metadata = models.TextField(default='')

	### Methods
	# data
	def data(self, path):
		data = {
			'date_created': str(self.date_created),
			'from_recogniser': self.from_recogniser,
			'metadata': self.metadata,
			'tokens': {str(token.index): token.data(path) for token in self.tokens.all()},
			'flags': {str(flag.id): flag.data(path) for flag in self.flags.all()},
			'rules': {str(rule.id): rule.data(path) for rule in self.rules_cited.all()},
			'checks': {str(check.id): check.data(path) for check in self.checks.all()}
		}

		return data
