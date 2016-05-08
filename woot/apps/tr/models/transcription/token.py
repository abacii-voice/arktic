# django
from django.db import models

# local
from apps.tr.models.transcription.dictionary import Dictionary, UserDictionary
from apps.tr.models.transcription.caption import Caption
from apps.tr.idgen import idgen

### Token classes
class Token(models.Model):

	### Connections
	dictionary = models.ForeignKey(Dictionary, related_name='tokens')
	user_dictionary = models.ForeignKey(UserDictionary, related_name='tokens', null=True) # for exclusion purposes

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	is_tag = models.BooleanField(default=False)
	content = models.CharField(max_length=255)

	### Methods
	# data
	def data(self, path):
		data = {
			'is_tag': self.is_tag,
			'content': self.content,
		}

		return data

class TokenInstance(models.Model):

	### Connections
	parent = models.ForeignKey(Token, related_name='instances')
	caption = models.ForeignKey(Caption, related_name='tokens')

	### Properties
	index = models.IntegerField(default=0)

	### Methods
	# data
	def data(self, path):
		data = self.parent.data(path)
		data.update({
			'index': str(self.index),
		})

		return data
