# django
from django.db import models

# local
from apps.tr.idgen import idgen

### Token classes
class Token(models.Model):

	### Connections
	dictionary = models.ForeignKey('tr.Dictionary', related_name='tokens')

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	type = models.CharField(max_length=255)
	content = models.CharField(max_length=255)

	### Methods
	# data
	def data(self, path, permission):
		data = {
			'type': self.type,
			'content': self.content,
		}

		return data

class TokenInstance(models.Model):

	### Connections
	parent = models.ForeignKey('tr.Token', related_name='instances')
	caption = models.ForeignKey('tr.CaptionInstance', related_name='tokens', null=True)
	phrase = models.ForeignKey('tr.PhraseInstance', related_name='tokens', null=True)

	### Properties
	index = models.IntegerField(default=0)

	### Methods
	# data
	def data(self, path, permission):
		data = self.parent.data(path, permission)
		data.update({
			'index': str(self.index),
		})

		return data

class TokenBlock(models.Model):
	'''
	Prevents a token from being displayed

	'''
