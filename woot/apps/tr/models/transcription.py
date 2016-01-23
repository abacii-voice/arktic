# django
from django.db import models

# local
from apps.client.models.project import Project

### Transcription classes
class Transcription(models.Model):
	'''
	The central object of the system. It is the connection between audio data and text utterances.

	'''

	### Connections
	project = models.ForeignKey(Project, related_name='transcriptions')

	### Properties
	original_utterance = models.CharField(max_length=255, default='')
	requests = models.IntegerField(default=0)
	date_created = models.DateTimeField(auto_now_add=True)
	date_last_requested = models.DateTimeField(auto_now=True)

	### Methods
