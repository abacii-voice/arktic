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
	content = models.TextField()

class Attachment(models.Model):

	### Connections
	message = models.ForeignKey(Message, related_name='attachments')

	### Properties
	package_name = models.CharField(max_length=255)
	class_name = models.CharField(max_length=255)
	attach_pk = models.CharField(max_length=255)
