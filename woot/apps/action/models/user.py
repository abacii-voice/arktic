# django
from django.db import models

# local
from apps.action.models.abstract import AbstractAction
from apps.users.models.roles import Worker
from apps.tr.models.utterance import WorkerUtterance
from apps.tr.models.overwatch import Overwatch

### Action classes
class UserAbstractAction(AbstractAction):
	class Meta(AbstractAction.Meta):
		pass

	### Connections
	worker = models.ForeignKey(Worker, related_name='actions')

class UserUtteranceAction(UserAbstractAction):

	### Connections
	utterance = models.ForeignKey(WorkerUtterance, related_name='user_actions')

class UserOverwatchAction(UserAbstractAction):

	### Connections
	overwatch = models.ForeignKey(Overwatch, related_name='user_actions')
