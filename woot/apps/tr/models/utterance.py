# django
from django.db import models

# local
from apps.tr.models.transcription import Transcription
from apps.users.models.roles import Worker

### Utterance classes
class AbstractUtterance(models.Model):
	class Meta():
		abstract = True

	'''
	A text utterance associated with a transcription.
	'''

	### Connections
	transcription = models.ForeignKey(Transcription, related_name='%(app_label)s_%(class)s_utterances')

	### Properties
	text = models.TextField()
	metadata = models.TextField()
	date_created = models.DateTimeField(auto_now_add=True)

class WorkerUtterance(AbstractUtterance):
	'''
	A text utterance added by a worker
	'''

	### Connections
	worker = models.ForeignKey(Worker, related_name='utterances')

class RecogniserUtterance(AbstractUtterance):
	'''
	An utterance defined by a speech recogniser.
	'''

	### Properties
	recogniser = models.CharField(max_length=255)
