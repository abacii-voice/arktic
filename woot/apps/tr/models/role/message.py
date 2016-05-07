# django
from django.db import models

# local
from apps.tr.models.client.client import Client
from apps.tr.models.role.role import Role

# util
import uuid

### Message models
class Message(models.Model):

	### Connections
	from_user = models.ForeignKey(Role, related_name='messages_from')
	to_user = models.ForeignKey(Role, related_name='messages_to')

	### Properties
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	date_created = models.DateTimeField(auto_now_add=True)

	### Methods
	# data
	def data(self):
		data = {
			# basic data
			'from_user': self.from_user.user.id,
			'to_user': self.to_user.user.id,
			'date_created': str(self.date_created),

			# connections
			'tokens': {str(token.index): token.data() for token in self.tokens.all()},
			'attachments': {str(attachment.index): attachment.data() for attachment in self.attachments.all()},
		}

		return data

class MessageToken(models.Model):

	### Connections
	message = models.ForeignKey(Message, related_name='tokens')

	### Properties
	value = models.CharField(max_length=255)
	index = models.PositiveIntegerField(default=0)

	### Methods
	# data
	def data(self):
		data = {
			'is_token': True,
			'index': self.index,
			'value': self.value,
		}

		return data

class Attachment(models.Model):

	### Connections
	message = models.ForeignKey(Message, related_name='attachments')

	### Properties
	index = models.PositiveIntegerField(default=0)
	package_name = models.CharField(max_length=255)
	class_name = models.CharField(max_length=255)
	attach_pk = models.CharField(max_length=255)

	### Methods
	# data
	def data(self):
		data = {
			'is_token': False,
			'index': self.index,
			'package_name': self.package_name,
			'class_name': self.class_name,
			'attach_pk': self.attach_pk,
		}

		return data
