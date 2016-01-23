# django
from django.db import models

# local
from apps.tr.models.utterance import Utterance
from apps.users.models import User

### Comment classes
class CommentManager(models.Manager):
	def moderator_comments(self):
		return self.filter(is_moderator_comment=True)

	def user_comments(self):
		return self.filter(is_moderator_comment=False)

class Comment(models.Model):
	'''
	A comment made on a transcription by the user or moderator.
	'''

	### Connections
	utterance = models.ForeignKey(Utterance, related_name='comments')
	user = models.ForeignKey(User, related_name='comments')

	### Properties
	is_moderator_comment = models.BooleanField(default=False)
	text = models.TextField()
	date_created = models.DateTimeField(auto_now_add=True)

	objects = CommentManager()
