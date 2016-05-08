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
			'name': self.name,
			'is_production': self.is_production,

			# connections
			'rules': {str(rule.id): rule.data() for rule in self.rules.all()},
			'flags': {str(flag.id): flag.data() for flag in self.flags.all()},
			'checks': {str(check.id): check.data() for check in self.checks.all()},
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

	# roles
	def add_admin(self, user):
		if not self.users.filter(id=user.id).exists():
			self.users.add(user)
		role, role_created = self.roles.get_or_create(user=user, type='admin')
		return role

	def add_moderator(self, user):
		if self.is_production:
			if not self.users.filter(id=user.id).exists():
				self.users.add(user)
			role, role_created = self.roles.get_or_create(user=user, type='moderator')
			return role

	def add_worker(self, user, moderator):
		if self.is_production and moderator.type == 'moderator':
			if not self.users.filter(id=user.id).exists():
				self.users.add(user)
			role, role_created = self.roles.get_or_create(user=user, type='admin', supervisor=moderator)
			return role
