# django
from django.db import models

# local
from apps.client.models.client import Project
from apps.tr.models.utterance import Utterance

### Token classes
class AbstractToken(models.Model):
	class Meta():
		abstract = True

	'''
	This can be either a word or a tag and can be accessed like a dictionary.
	Each token has a position in an utterance.
	'''

	### Connections
	project = models.ForeignKey(Project, related_name='%(app_label)s_%(class)s_tokens') # specific to a project

	### Properties
	text = models.CharField(max_length=30)

class AbstractTokenInstance(models.Model):
	class Meta():
		abstract = True

	'''
	A token connected to an utterance.
	'''

	### Connections
	utterance = models.ForeignKey(Utterance, related_name='%(app_label)s_%(class)s_token_instances')

	### Properties
	position = models.PositiveIntegerField(default=0)

### Words
class Word(AbstractToken):
	'''
	Your typical dictionary entry.
	'''
	pass

class WordInstance(AbstractTokenInstance):
	'''
	A word connected to an utterance.
	'''

	### Connections
	word = models.ForeignKey(Word, related_name='instances')

### Tags
class Tag(AbstractToken):
	'''

	'''

	### Properties
	name = models.CharField(max_length=30)
	shortcut = models.CharField(max_length=255)
	is_issue = models.BooleanField(default=False)

class WordInstance(AbstractTokenInstance):
	'''
	A word connected to an utterance.
	'''

	### Connections
	tag = models.ForeignKey(Tag, related_name='instances')
