# django
from django.db import models

# local
from apps.tr.idgen import idgen

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
				'tokens': {token.id: token.data(path, permission) for token in self.tokens.filter(**path.get_filter('tokens'))},
			})

		return data
