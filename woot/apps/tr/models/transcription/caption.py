# django
from django.db import models

# local
from apps.tr.models.transcription.transcription import Transcription
from apps.tr.models.role.role import Role

### Utterance classes
class Caption(models.Model):

	'''
	A text utterance associated with a transcription.
	'''

	### Connections
	transcription = models.ForeignKey(Transcription, related_name='captions')
	role = models.ForeignKey(Role, related_name='captions')

	### Properties
	date_created = models.DateTimeField(auto_now_add=True)
	from_recogniser = models.BooleanField(default=False)
	metadata = models.TextField(default='')

	### Methods
	# data
	def data(self):
		data = {
			'date_created': str(self.date_created),
			'from_recogniser': self.from_recogniser,
			'metadata': self.metadata,
		}

		return data