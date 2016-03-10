# django
from django.db import models

# local
from apps.users.models.role import RoleInstance

### Message models
class Message(models.Model):

	### Connections
	from_user = models.ForeignKey(RoleInstance, related_name='messages_from')
	to_user = models.ForeignKey(RoleInstance, related_name='messages_to')

	### Properties
	date_created = models.DateTimeField(auto_now_add=True)

class Token(models.Model):

	### Connections
	message = models.ForeignKey(Message, related_name='tokens')

	### Properties
	index = models.PositiveIntegerField(default=0)

class Attachment(models.Model):

	### Connections
	message = models.ForeignKey(Message, related_name='attachments')

	### Properties
	index = models.PositiveIntegerField(default=0)
	package_name = models.CharField(max_length=255)
	class_name = models.CharField(max_length=255)
	attach_pk = models.CharField(max_length=255)
