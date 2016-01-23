# apps.tr.models

# django
from django.db import models

# local
from apps.client.models import Client, Project
from apps.users.models import User

# util

### Create your models here.

### STRUCTURES
class Sample(models.Model):
	'''
	A set of transcriptions sampled from a single project to be subjected to a trial as a group.
	When such a group is transcribed, it can be used to generate an automatic grammar that will be
	applied to the rest of the project, or indeed, another sample. A single transcription can
	appear in multiple samples.

	This is also used to generate the final product of the process. This container is associated
	with a product file, or list of transcriptions and their best utterances.

	'''

	### Connections
	client = models.ForeignKey(Client, related_name='samples')
	project = models.ForeignKey(Project, related_name='samples')

	### Properties
	metadata = models.TextField(default='')
	date_created = models.DateTimeField(auto_now_add=True)
	product_file = models.FileField(upload_to='products')
	grammar_file = models.FileField(upload_to='grammars')

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

class UtteranceManager(models.Manager):
	def generated_utterances(self):
		return self.filter(is_user_generated=False)

	def user_utterances(self):
		return self.filter(is_user_generated=True)

class Utterance(models.Model):
	'''
	A text utterance associated with a transcription.
	'''

	### Connections
	client = models.ForeignKey(Client, related_name='utterances')
	project = models.ForeignKey(Project, related_name='utterances')
	sample = models.ForeignKey(Sample, related_name='utterances')
	transcription = models.ForeignKey(Transcription, related_name='utterances')
	transcription_instance = models.ForeignKey(TranscriptionInstance, related_name='utterances')
	user = models.ForeignKey(User, related_name='utterances', null=True) # does not have to have an associated user.

	### Properties
	is_user_generated = models.BooleanField(default=True)
	recogniser = models.CharField(max_length=255, default='user')
	text = models.TextField()
	metadata = models.TextField()
	date_created = models.DateTimeField(auto_now_add=True)

	objects = UtteranceManager()

class CommentManager(models.Manager):
	def moderator_comments(self):
		return self.filter(is_moderator_comment=True)

	def user_comments(self):
		return self.filter(is_moderator_comment=False)

class Comment(models.Model):
	'''
	A comment made on a transcription by the user or moderator.
	'''

	### Connections
	client = models.ForeignKey(Client, related_name='comments')
	project = models.ForeignKey(Project, related_name='comments')
	sample = models.ForeignKey(Sample, related_name='comments')
	transcription = models.ForeignKey(Transcription, related_name='comments')
	transcription_instance = models.ForeignKey(TranscriptionInstance, related_name='comments')
	user = models.ForeignKey(User, related_name='comments')

	### Properties
	is_moderator_comment = models.BooleanField(default=False)
	text = models.TextField()
	date_created = models.DateTimeField(auto_now_add=True)

	objects = CommentManager()

class TagManager(models.Manager):
	def client_specific_tags(self):
		return self.filter(is_client_specific=True)

	def issue_tags(self):
		return self.filter(is_issue=True)

class Tag(models.Model):
	'''
	An add-on to a text utterance.
	'''

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
	client = models.ForeignKey(Client, related_name='tag_instances')
	project = models.ForeignKey(Project, related_name='tag_instances')
	sample = models.ForeignKey(Sample, related_name='tag_instances')
	transcription = models.ForeignKey(Transcription, related_name='tag_instances')
	transcription_instance = models.ForeignKey(TranscriptionInstance, related_name='tag_instances')
	utterance = models.ForeignKey(Utterance, related_name='tag_instances')

	### Properties
	position = models.IntegerField(default=0) # location in text
