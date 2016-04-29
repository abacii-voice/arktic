# django
from django.db import models

# local
from apps.tr.models.role.role import Role

# util
import uuid

### Email models
class Email(models.Model):

	### Connections
	from_user = models.ForeignKey(Role, related_name='emails_from')
	to_user = models.ForeignKey(Role, related_name='emails_to')

	### Properties
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	subject = models.CharField(max_length=255)
	date_created = models.DateTimeField(auto_now_add=True)
	text_content = models.TextField()
	html_content = models.TextField()

	### Methods
	# data
	def data(self):
		data = {
			'from': self.from_user.user.email,
			'to': self.to_user.user.email,
			'subject': self.subject,
			'id': self.id,
			'date_created': str(self.date_created),
			'text_content': self.text_content,
			'html_content': self.html_content,
		}

		return data
