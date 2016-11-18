# django
from django.db import models
from django.db import transaction

# local
from apps.tr.idgen import idgen

token_types = {
	':': 'tag',
	'_': 'ghost',
}

### Dictionary classes
class Dictionary(models.Model):

	### Connections
	project = models.OneToOneField('tr.Project', related_name='dictionary')
	grammar = models.ForeignKey('tr.Grammar', related_name='dictionaries')

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)

	### Methods
	# data
	def data(self, path, permission):
		data = {
			# basic data
			'total_tokens': str(self.tokens.count()),
		}

		if True:
			data.update({
				'phrases': self.top_phrases(path, permission, path.get_filter('phrases')),
				'tokens': self.top_tokens(path, permission, path.get_filter('tokens')),
			})

		return data

	def top_phrases(self, path, permission, fltr):
		limit = 20
		return {phrase.id: phrase.data(path, permission) for phrase in self.phrases.annotate(token_count=models.Count('tokens')).filter(**fltr)[0:limit]}

	def top_tokens(self, path, permission, fltr):
		limit = 100
		return {token.id: token.data(path, permission) for token in self.tokens.filter(**fltr)[0:limit]}

	def create_phrase(self, content):
		# create phrases
		phrase, phrase_created = self.phrases.get_or_create(content=content)

		# create tokens
		if phrase_created:
			token_primitives = content.rstrip().split(' ')
			for index, token_primitive in enumerate(token_primitives):
				type = 'word'
				if token_primitive[0] in token_types:
					type = token_types[token_primitive[0]]
					token_primitive = token_primitive[1:]

				token, token_created = self.tokens.get_or_create(type=type, content=token_primitive)
				token_instance, token_instance_created = token.instances.get_or_create(phrase=phrase, index=index)

		return phrase, phrase_created
