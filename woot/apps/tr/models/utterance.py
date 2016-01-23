# django
from django.db import models

# local
from apps.client.models import Client, Project
from apps.tr.models import Sample, Transcription, TranscriptionInstance
from apps.users.models import User

### Utterance classes
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
