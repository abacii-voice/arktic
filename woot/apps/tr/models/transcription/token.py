# django
from django.db import models

# local
from apps.tr.idgen import idgen

### Token classes
class Token(models.Model):

	### Connections
	dictionary = models.ForeignKey('tr.Dictionary', related_name='tokens')
	user_dictionary = models.ForeignKey('tr.UserDictionary', related_name='tokens', null=True) # for exclusion purposes

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	is_tag = models.BooleanField(default=False)
	content = models.CharField(max_length=255)

	### Methods
	# data
	def data(self, path, permission):
		data = {
			'is_tag': self.is_tag,
			'content': self.content,
		}

		return data

class TokenInstance(models.Model):

	### Connections
	parent = models.ForeignKey('tr.Token', related_name='instances')
	caption = models.ForeignKey('tr.CaptionInstance', related_name='tokens')

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
