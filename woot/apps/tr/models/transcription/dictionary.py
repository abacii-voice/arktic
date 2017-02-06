# django
from django.db import models

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

		if path.check('phrases'):
			data.update({
				'phrases': self.top_phrases(path.down('phrases'), permission, path.get_filter('phrases')),
			})

		if path.check('tokens'):
			data.update({
				'tokens': self.top_tokens(path.down('tokens'), permission, path.get_filter('tokens')),
			})

		return data

	def top_phrases(self, path, permission, fltr):
		limit = 20
		return {phrase.id: phrase.data(path, permission) for phrase in self.phrases.annotate(token_count=models.Count('tokens')).filter(**fltr)[0:limit]}

	def top_tokens(self, path, permission, fltr):
		limit = 100
		return {token.id: token.data(path, permission) for token in self.tokens.filter(**fltr)[0:limit]}

	def create_phrase(self, content=None, tokens=None):
		if content is not None or tokens is not None:
			if content is None:
				content = ' '.join(['{type}{content}'.format(type=token['type'], content=token['complete']) for token in tokens])

			if tokens is None:
				if content:
					tokens = [{'type': (primitive[0] if primitive[0] in token_types else 'word'), 'complete': (primitive if primitive[0] not in token_types else (primitive[1:] if len(primitive)>1 else ''))} for primitive in content.rstrip().split(' ')]
				else:
					tokens = [{'type': 'word', 'complete': ''}]

			# create phrase
			phrase, phrase_created = self.phrases.get_or_create(content=content)

			# create tokens
			if phrase_created:
				for index, token_primitive in enumerate(tokens):
					if token_primitive['complete'] != '':
						token, token_created = self.tokens.get_or_create(type=token_primitive['type'], content=token_primitive['complete'])
						token_instance, token_instance_created = token.instances.get_or_create(phrase=phrase, index=index)

			return phrase, phrase_created
