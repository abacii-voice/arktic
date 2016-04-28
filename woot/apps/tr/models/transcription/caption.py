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
	from_recogniser = models.BooleanField(default=False)
	content = models.TextField()
	metadata = models.TextField(default='')
	date_created = models.DateTimeField(auto_now_add=True)
