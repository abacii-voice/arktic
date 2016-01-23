# apps.audio.models

# django
from django.db import models

# local
from apps.client.models import Client

### Create your models here.
class Audio(models.Model):
	pass

class Grammar(models.Model):
	'''
	This is the second final product. It is an XML document generated from the best utterances.

	It belongs to an end client and is part of a project: Project.generate_grammar()
	'''

	### Connections
	client = models.ForeignKey(Client, related_name='grammars')
	project = models.ForeignKey(Project, related_name='grammars')

	# sub: transcription, audiofile

	### Properties
	metadata = models.TextField(default='')
	date_created = models.DateTimeField(auto_now_add=True)
	file = models.FileField(upload_to='grammars')
