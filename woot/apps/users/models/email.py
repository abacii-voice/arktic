# django
from django.db import models

# local
from apps.users.models.role import Role

### Email models
class Email(models.Model):

	### Connections
	from_user = models.ForeignKey(Role, related_name='emails_from')
	to_user = models.ForeignKey(Role, related_name='emails_to')

	### Properties
	to_email = models.CharField(max_length=255)
	subject = models.CharField(max_length=255)
	date_created = models.DateTimeField(auto_now_add=True)
	text_content = models.TextField()
	html_content = models.TextField()
