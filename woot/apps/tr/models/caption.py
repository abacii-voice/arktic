# django
from django.db import models

# local
from apps.tr.models.transcription import Transcription
from apps.users.models.user import User
from apps.users.models.role import Role

### Utterance classes
class Caption(models.Model):

	'''
	A text utterance associated with a transcription.
	'''

	### Connections
	user = models.ForeignKey(User, related_name='captions')
	role = models.ForeignKey(Role, related_name='captions')
	transcription = models.ForeignKey(Transcription, related_name='captions')

	### Properties
	from_recogniser = models.BooleanField(default=False)
	metadata = models.TextField()
	date_created = models.DateTimeField(auto_now_add=True)
