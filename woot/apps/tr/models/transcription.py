# django
from django.db import models

# local
from apps.client.models.project import Project, Batch

### Transcription classes
class Transcription(models.Model):
	'''
	The central object of the system. It is the connection between audio data and text utterances.

	'''

	### Connections
	project = models.ForeignKey(Project, related_name='transcriptions')
	batch = models.ForeignKey(Batch, related_name='transcriptions')

	### Properties
	# initialisation if it exists
	original_caption = models.CharField(max_length=255, default='')
	date_created = models.DateTimeField(auto_now_add=True)

	# unique identifier
	filename = models.CharField(max_length=255)

	# requests and flags
	requests = models.PositiveIntegerField(default=0)
	request_allowance = models.PositiveIntegerField(default=1)
	date_last_requested = models.DateTimeField(auto_now=True)

	### Methods
