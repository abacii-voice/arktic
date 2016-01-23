# django
from django.db import models

# local
from apps.client.models.client import Client
from apps.tr.models.utterance import Utterance
from apps.users.models import User

### Tag classes
class TagManager(models.Manager):
	def client_specific_tags(self):
		return self.filter(is_client_specific=True)

	def issue_tags(self):
		return self.filter(is_issue=True)

class Tag(models.Model):
	'''
	An add-on to a text utterance.
	'''

	### Connections
	client = models.ForeignKey(Client, related_name='tags', null=True)

	### Properties
	name = models.CharField(max_length=255)
	text = models.CharField(max_length=255)
	is_client_specific = models.BooleanField(default=False)
	is_issue = models.BooleanField(default=False)

class TagInstanceManager(models.Model):
	def client_specific_tag_instances(self):
		return self.filter(tag__is_client_specific=True)

	def issue_tag_instances(self):
		return self.filter(tag__is_issue=True)

class TagInstance(models.Model):
	'''
	A tag connected to a transcription
	'''

	### Connections
	tag = models.ForeignKey(Tag, related_name='instances')
	utterance = models.ForeignKey(Utterance, related_name='tag_instances')

	### Properties
	position = models.PositiveIntegerField(default=0) # location in text
