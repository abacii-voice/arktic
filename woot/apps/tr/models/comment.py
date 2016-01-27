# django
from django.db import models

# local
from apps.tr.models.utterance import WorkerUtterance
from apps.tr.models.overwatch import Overwatch

### Comment classes
class AbstractComment(models.Model):
	class Meta():
		abstract = True

	'''
	A comment made on a transcription by the user or moderator.
	'''

	### Properties
	text = models.TextField()
	date_created = models.DateTimeField(auto_now_add=True)

class UtteranceComment(AbstractComment):

	### Connections
	utterance = models.ForeignKey(WorkerUtterance, related_name='utterance_comments')

class OverwatchComment(AbstractComment):

	### Connections
	overwatch = models.ForeignKey(Overwatch, related_name='overwatch_comments')
