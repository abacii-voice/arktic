
# django
from django.db import models

# local
import uuid

class Phrase(models.Model):
	### Connections
	dictionary = models.ForeignKey('tr.Dictionary', related_name='phrases')

	### Properties
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	content = models.TextField(default='')

	# methods
	def data(self, path, permission):
		data = {
			'content': self.content,
		}

		# if path.check('token_instances'):
		data.update({
			'token_instances': {str(token.id): token.data(path, permission) for token in self.tokens.filter(**path.get_filter('token_instances'))},
		})

		if permission.is_worker and permission.check_client(self.dictionary.project.production_client):
			data.update({
				'subscribed': self.subscriptions.filter(role=permission.role).count()>0,
			})

		return data

	def render(self):
		return ' '.join([ti.render() for ti in self.token_instances.order_by('index')])

class PhraseInstance(models.Model):
	### Connections
	parent = models.ForeignKey('tr.Phrase', related_name='instances')
	role = models.ForeignKey('tr.Role', related_name='phrases')

	### Properties
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	from_recogniser = models.BooleanField(default=False)
	date_created = models.DateTimeField(auto_now_add=True)
	metadata = models.TextField(default='')

	# methods
	def data(self, path, permission):
		data = {
			'from_recogniser': str(self.from_recogniser),
			'date_created': str(self.date_created),
			'metadata': self.metadata,
		}

		return data

	def render(self):
		return self.parent.render()

class PhraseSubscription(models.Model):
	'''
	Available for a user to add to their list of commonly used phrases.
	'''

	### Connections
	parent = models.ForeignKey('tr.Phrase', related_name='subscriptions')
	role = models.ForeignKey('tr.Role', related_name='phrase_subscriptions')

	### Properties
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	date_created = models.DateTimeField(auto_now_add=True)
	date_last_activated = models.DateTimeField(auto_now_add=True)
	is_active = models.BooleanField(default=True)
	metadata = models.TextField(default='')

	# methods
	def data(self, path, permission):
		data = {
			'is_active': str(self.is_active),
			'metadata': self.metadata,
		}

		return data
