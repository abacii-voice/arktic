
# django
from django.db import models

# local
from apps.tr.idgen import idgen

class Phrase(models.Model):
	### Connections
	dictionary = models.ForeignKey('tr.Dictionary', related_name='phrases')

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	content = models.TextField(default='')

	# methods
	def data(self, path, permission):
		data = {
			'content': self.content,
		}

		if path.check('tokens'):
			data.update({
				'token_instances': {token.id: token.data(path, permission) for token in self.tokens.filter(**path.get_filter('token_instances'))},
			})

		if permission.is_worker and permission.check_client(self.dictionary.project.production_client):
			data.update({
				'subscriptions': {subscription.id: subscription.data(path, permission) for subscription in self.subscriptions.filter(**path.get_filter('subscriptions')).filter(role=permission.role)}
			})

		return data

class PhraseInstance(models.Model):
	### Connections
	parent = models.ForeignKey('tr.Phrase', related_name='instances')
	role = models.ForeignKey('tr.Role', related_name='phrases')

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
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

class PhraseSubscription(models.Model):
	'''
	Available for a user to add to their list of commonly used phrases.
	'''

	### Connections
	parent = models.ForeignKey('tr.Phrase', related_name='subscriptions')
	role = models.ForeignKey('tr.Role', related_name='phrase_subscriptions')

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
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
