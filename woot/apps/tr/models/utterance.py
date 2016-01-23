# django
from django.db import models

# local
from apps.tr.models.transcription import Transcription
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
	transcription = models.ForeignKey(Transcription, related_name='utterances')
	user = models.ForeignKey(User, related_name='utterances', null=True) # does not have to have an associated user.

	### Properties
	is_user_generated = models.BooleanField(default=True)
	recogniser = models.CharField(max_length=255, default='user')
	text = models.TextField()
	metadata = models.TextField()
	date_created = models.DateTimeField(auto_now_add=True)

	objects = UtteranceManager()
