# django
from django.db import models

# local
from apps.users.models import User
from apps.tr.idgen import idgen

### Client model
class Client(models.Model):

	### Connections
	users = models.ManyToManyField(User, related_name='clients')

	### Properties
	# Identification
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	name = models.CharField(max_length=255)

	# Type
	is_production = models.BooleanField(default=False)

	### Methods
	# data
	def data(self, path, permission):
		data = {}

		if path.is_blank:
			data.update({
				'name': self.name,
				'is_production': self.is_production,
			})

		# paths
		if path.check('rules'):
			data.update({
				'rules': {rule.id: rule.data(path.down(), permission) for rule in self.rules.filter(id__contains=path.get_id())},
			})

		if path.check('flags'):
			data.update({
				'flags': {flag.id: flag.data(path.down(), permission) for flag in self.flags.filter(id__contains=path.get_id())},
			})

		if path.check('checks') and permission.is_productionadmin:
			data.update({
				'checks': {check.id: check.data(path.down(), permission) for check in self.checks.filter(id__contains=path.get_id())},
			})

		if path.check('users') and permission.is_admin:
			data.update({
				'users': {user.id: user.data(path.down(), permission) for user in self.users.filter(id__contains=path.get_id())},
			})

		if self.is_production:
			if path.check('production_projects') and permission.is_productionadmin:
				data.update({
					'production_projects': {project.id: project.data(path.down(), permission) for project in self.production_projects.filter(id__contains=path.get_id())},
				})
		else:
			if path.check('contract_projects') and permission.is_contractadmin:
				data.update({
					'contract_projects': {project.id: project.data(path.down(), permission) for project in self.contract_projects.filter(id__contains=path.get_id())},
				})

		return data

	def user_data(self, path, permission):
		data = {}

		if path.check('roles'):
			data.update({
				'roles': {role.id: role.user_data(path, permission) for role in self.roles.filter(user=permission.user, id__contains=path.get_id())},
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
			role, role_created = self.roles.get_or_create(user=user, type='worker', supervisor=moderator)
			return role
