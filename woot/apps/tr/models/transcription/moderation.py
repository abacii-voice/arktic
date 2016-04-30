# django
from django.db import models

# local
from apps.tr.models.transcription.transcription import Transcription
from apps.tr.models.transcription.caption import Caption
from apps.tr.models.role.role import Role

# util
import uuid

### Moderation classes
class Moderation(models.Model):

	### Connections
	transcription = models.ForeignKey(Transcription, related_name='moderations')
	caption = models.ForeignKey(Caption, related_name='moderations')
	moderator = models.ForeignKey(Role, related_name='moderations')

	### Properties
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	date_created = models.DateTimeField(auto_now_add=True)
	is_approved = models.BooleanField(default=True)
	metadata = models.TextField(default='')

	### Methods
	# data
	def data(self):
		data = {
			'id': str(self.id),
			'date_created': str(self.date_created),
			'is_approved': self.is_approved,
			'metadata': self.metadata,
		}

		return data
