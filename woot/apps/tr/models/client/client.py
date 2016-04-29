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
			'id': self.id,
			'name': self.name,
			'is_production': self.is_production,

			# connections
			'projects': {project.id: project.data() for project in self.projects.all()},
			'rules': {rule.id: rule.data() for rule in self.rules.all()},
			'users': {user.id: user.data() for user in self.users.all()},
		}

		return data
