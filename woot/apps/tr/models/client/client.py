# django
from django.db import models

# local
from apps.users.models import User

# util
import uuid

### Client model
class Client(models.Model):

	### Connections
	users = models.ManyToManyField(User, related_name='clients')

	### Properties
	# Identification
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	name = models.CharField(max_length=255)

	# Type
	is_production = models.BooleanField(default=False)

	### Methods
	# data
	def data(self):
		data = {
			# basic data
			'id': str(self.id),
			'name': self.name,
			'is_production': self.is_production,

			# connections
			'rules': {str(rule.id): rule.data() for rule in self.rules.all()},
			'users': {str(user.id): user.data() for user in self.users.all()},
		}

		if self.is_production:
			data.update({
				'production_projects': {str(project.id): project.data() for project in self.production_projects.all()},
			})
		else:
			data.update({
				'contract_projects': {str(project.id): project.data() for project in self.contract_projects.all()},
			})

		return data
