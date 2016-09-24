# django
from django.db import models

# local
from apps.tr.idgen import idgen

### Dictionary classes
class Dictionary(models.Model):

	### Connections
	project = models.ForeignKey('tr.Project', related_name='dictionaries')
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

		if permission.check_client(self.project.production_client):
			data.update({
				'tokens': {token.id: token.data(path, permission) for token in self.tokens.filter(**path.get_filter('tokens'))},
			})

		return data

	def user_tokens(self, role):
		user_dictionary = self.children.filter(role=role)


class UserDictionary(models.Model):

	### Connections
	parent = models.ForeignKey('tr.Dictionary', related_name='children')
	role = models.ForeignKey('tr.Role', related_name='dictionaries')

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)

	### Methods
	# data
	def data(self, path, permission):
		data = self.parent.data(path, permission)
		data.update({
			'role': self.role.id,
		})

		return data
