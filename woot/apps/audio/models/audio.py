# django
from django.db import models

# local
from apps.client.models.project import Project
from apps.tr.models.transcription import Transcription

# util
import os
from os.path import basename, join
import uuid

### Create your models here.
def rename_audio_file(instance, file_name):
	base = basename(file_name)
	root, ext = base.split('.')
	new_file_name = '{}_p-{}_f-{}-uuid-{}.{}'.format(instance.project.client.name, instance.project.name, root, instance.id, ext)
	return join('audio', new_file_name)

class Audio(models.Model):
	'''
	This is an audio clip. It is probably in the form of a compressed .wav file.
	In this case, it can be uncompressed for processing.
	'''

	### Connections
	project = models.ForeignKey(Project, related_name='audio_files')
	transcription = models.OneToOneField(Transcription, related_name='audio')

	### Properties
	# https://docs.djangoproject.com/en/1.9/ref/models/fields/#uuidfield
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	file = models.FileField(upload_to=rename_audio_file)
