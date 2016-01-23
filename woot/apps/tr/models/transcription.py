# django
from django.db import models

# local
from apps.client.models import Client, Project
from apps.tr.models import Sample

### Transcription classes
class Transcription(models.Model):
	'''
	The central object of the system. It is the connection between audio data and text utterances.

	'''

	### Connections
	client = models.ForeignKey(Client, related_name='transcriptions')
	project = models.ForeignKey(Project, related_name='transcriptions')

	### Properties
	original_utterance = models.CharField(max_length=255, default='')
	requests = models.IntegerField(default=0)
	date_created = models.DateTimeField(auto_now_add=True)
	date_last_requested = models.DateTimeField(auto_now=True)

	### Methods

class TranscriptionInstance(models.Model):
	'''
	A transcription as part of a sample.
	'''

	### Connections
	client = models.ForeignKey(Client, related_name='transcription_instances')
	project = models.ForeignKey(Project, related_name='transcription_instances')
	sample = models.ForeignKey(Sample, related_name='transcription_instances')
	transcription = models.ForeignKey(Transcription, related_name='instances')

	### Properties
	requests = models.IntegerField(default=0)
	date_created = models.DateTimeField(auto_now_add=True)
	date_last_requested = models.DateTimeField(auto_now=True)
