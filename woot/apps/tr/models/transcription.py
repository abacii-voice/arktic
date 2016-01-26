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
	# initialisation if it exists
	original_utterance = models.CharField(max_length=255, default='')
	date_created = models.DateTimeField(auto_now_add=True)

	# requests and flags
	requests = models.PositiveIntegerField(default=0)
	request_allowance = models.PositiveIntegerField(default=1) # this can be incremented by an "unsure" button
	request_allowance_threshold = models.PositiveIntegerField(default=3) # reaching this threshold will flag the transcription
	flagged_for_review = models.BooleanField(default=False)
	date_last_requested = models.DateTimeField(auto_now=True)

	### Methods
