# django
from django.db import models

# local
from apps.action.models.abstract import AbstractAction
from apps.users.models.moderator import Moderator
from apps.tr.models.utterance import Utterance
from apps.tr.models.overwatch import Overwatch

### Action classes
class ModeratorAbstractAction(AbstractAction):
	class Meta(AbstractAction.Meta):
		pass

	### Connections
	moderator = models.ForeignKey(Moderator, related_name='actions')

class ModeratorUtteranceAction(ModeratorAbstractAction):

	### Connections
	utterance = models.ForeignKey(Utterance, related_name='moderator_actions')

class ModeratorOverwatchAction(ModeratorAbstractAction):

	### Connections
	overwatch = models.ForeignKey(Overwatch, related_name='moderator_actions')
