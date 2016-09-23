# django
from django.db import models

# local
from apps.tr.models.client.project import Project
from apps.tr.models.transcription.grammar import Grammar
from apps.tr.models.role.role import Role
from apps.tr.idgen import idgen

### Dictionary classes
class Dictionary(models.Model):

	### Connections
	project = models.ForeignKey(Project, related_name='dictionaries')
	grammar = models.ForeignKey(Grammar, related_name='dictionaries')

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	total_tokens = models.PositiveIntegerField(default=0)

	### Methods
	# data
	def data(self, path, permission):
		data = {
			# basic data
			'name': self.name,
			'total_tokens': str(self.total_tokens),
			'tokens': {token.id: token.data(path, permission) for token in self.tokens.filter(**path.get_filter('tokens'))},
		}

		return data

	def user_tokens(self, role):
		user_dictionary = self.children.filter(role=role)


class UserDictionary(models.Model):

	### Connections
	parent = models.ForeignKey(Dictionary, related_name='children')
	role = models.ForeignKey(Role, related_name='dictionaries')

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
