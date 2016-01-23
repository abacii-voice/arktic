# django
from django.db import models

# local
from apps.client.models.client import Client
from apps.tr.models.utterance import Utterance
from apps.users.models import User

### Word classes
class Word(models.Model):
	'''
	Part of a text utterance.
	'''

	### Connections
	project = models.ForeignKey(Client, related_name='words')

	### Properties
	text = models.CharField(max_length=255)

class WordInstance(models.Model):
	'''
	A tag connected to a transcription
	'''

	### Connections
	word = models.ForeignKey(Word, related_name='instances')
	utterance = models.ForeignKey(Utterance, related_name='word_instances')

	### Properties
	position = models.IntegerField(default=0) # location in text
