# django
from django.db import models

# local
from apps.client.models.client import Client
from apps.users.models.role import Role

### Message models
class Message(models.Model):

	### Connections
	client = models.ForeignKey(Client, related_name='messages')
	from_user = models.ForeignKey(Role, related_name='messages_from')
	to_user = models.ForeignKey(Role, related_name='messages_to')

	### Properties
	date_created = models.DateTimeField(auto_now_add=True)

	### Methods
	# data
	def data(self):
		unsorted_items = list(self.tokens.all()) + list(self.attachments.all())
		sorted_items = sorted(unsorted_items, key=lambda i: i.index)

		message_dict = {
			'client': self.client.name,
			'from_user': self.from_user.user.id,
			'to_user': self.to_user.user.id,
			'items': [
				item.dict for item in sorted_items
			],
		}

		return message_dict

class Token(models.Model):

	### Connections
	message = models.ForeignKey(Message, related_name='tokens')

	### Properties
	value = models.CharField(max_length=255)
	index = models.PositiveIntegerField(default=0)

	### Methods
	# data
	def data(self):
		token_dict = {
			'is_token': True,
			'index': self.index,
			'value': self.value,
		}

		return token_dict

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
		attachment_dict = {
			'is_token': False,
			'index': self.index,
			'package_name': self.package_name,
			'class_name': self.class_name,
			'attach_pk': self.attach_pk,
		}

		return attachment_dict
