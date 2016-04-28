# django
from django.db import models

# local
from apps.tr.models.client.project import Project, Batch
from apps.tr.models.transcription.transcription import Transcription

# util
import os
from os.path import basename, join
import uuid

### Create your models here.
def rename_audio_file(instance, file_name):
	base = basename(file_name)
	root, ext = base.split('.')
	new_file_name = '{}_p-{}_f-{}-uuid-{}.{}'.format(instance.project.contract_client.name, instance.project.name, root, instance.id, ext)
	return join('audio', new_file_name)

class Utterance(models.Model):
	'''
	This is an audio clip. It is probably in the form of a compressed .wav file.
	In this case, it can be uncompressed for processing.
	'''

	### Connections
	project = models.ForeignKey(Project, related_name='utterances')
	batch = models.ForeignKey(Batch, related_name='utterances')
	transcription = models.OneToOneField(Transcription, related_name='utterance')

	### Properties
	# https://docs.djangoproject.com/en/1.9/ref/models/fields/#uuidfield
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	file = models.FileField(upload_to=rename_audio_file)

	### Methods
	def process(self):
		pass
