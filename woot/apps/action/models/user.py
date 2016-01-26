# django
from django.db import models

# local
from apps.action.models.abstract import AbstractAction
from apps.users.models.user import User
from apps.tr.models.utterance import Utterance
from apps.tr.models.overwatch import Overwatch

### Action classes
class UserAbstractAction(AbstractAction):
	class Meta(AbstractAction.Meta):
		pass

	### Connections
	user = models.ForeignKey(User, related_name='actions')

class UserUtteranceAction(UserAbstractAction):

	### Connections
	utterance = models.ForeignKey(Utterance, related_name='user_actions')

class UserOverwatchAction(UserAbstractAction):

	### Connections
	overwatch = models.ForeignKey(Overwatch, related_name='user_actions')
