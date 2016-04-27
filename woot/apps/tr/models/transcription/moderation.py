# django
from django.db import models

# local
from apps.tr.models.transcription import Transcription
from apps.tr.models.caption import Caption
from apps.users.models.role import Role

### Moderation classes
class Moderation(models.Model):

	### Connections
	transcription = models.ForeignKey(Transcription, related_name='moderations')
	caption = models.ForeignKey(Caption, related_name='moderations')
	moderator = models.ForeignKey(Role, related_name='moderations')

	### Properties
	is_approved = models.BooleanField(default=True)
	comment = models.TextField()
