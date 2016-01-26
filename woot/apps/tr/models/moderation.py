# django
from django.db import models

# local
from apps.users.models.moderator import Moderator
from apps.tr.models.utterance import Utterance
from apps.tr.models.overwatch import Overwatch

### Moderation classes
class AbstractModeration(models.Model):
	class Meta():
		abstract = True

	### Connections
	moderator = models.ForeignKey(Moderator, related_name='%(app_label)s_%(class)s_moderations')

	###
	score = models.BooleanField(default=True)

class UtteranceModeration(AbstractModeration):

	### Connections
	utterance = models.ForeignKey(Utterance, related_name='utterance_moderations')

class OverwatchModeration(AbstractModeration):

	### Connections
	overwatch = models.ForeignKey(Overwatch, related_name='overwatch_moderations')
