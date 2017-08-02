# django
from django.db import models

# local
from util import filterOrAllOnBlank

# util
import uuid

### Client model
class Client(models.Model):

	### Connections
	users = models.ManyToManyField('users.User', related_name='clients')
	contract_clients = models.ManyToManyField('tr.Client', related_name='production_clients')

	### Properties
	# Identification
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	name = models.CharField(max_length=255)

	# Type
	is_production = models.BooleanField(default=False)

	### Methods
	# data
	def data(self, path, permission):
		data = {}

		path.set_key('client', self.id)
		if path.is_blank:
			data.update({
				'name': self.name,
				'is_production': self.is_production,
			})

		# paths
		if path.check('rules'):
			data.update({
				'rules': {str(rule.id): rule.data(path.down('rules'), permission) for rule in filterOrAllOnBlank(self.rules, id=path.get_id())},
			})

		if path.check('flags'):
			data.update({
				'flags': {str(flag.id): flag.data(path.down('flags'), permission) for flag in filterOrAllOnBlank(self.flags, id=path.get_id())},
			})

		if path.check('checks') and permission.is_productionadmin:
			data.update({
				'checks': {str(check.id): check.data(path.down('checks'), permission) for check in filterOrAllOnBlank(self.checks, id=path.get_id())},
			})

		if path.check('users') and permission.is_admin:
			data.update({
				'users': {str(user.id): user.role_data(self, path.down('users'), permission) for user in filterOrAllOnBlank(self.users, id=path.get_id())},
			})

		if self.is_production:
			if path.check('projects'):
				data.update({
					'projects': {str(project.id): project.data(path.down('projects'), permission) for project in filterOrAllOnBlank(self.production_projects, id=path.get_id())},
				})

			if path.check('contract_clients') and permission.is_productionadmin:
				data.update({
					'contract_clients': {str(contract_client.id): contract_client.contract_client_data(path.down('contract_clients'), permission) for contract_client in filterOrAllOnBlank(self.contract_clients, id=path.get_id())},
				})
		else:
			if path.check('projects'):
				data.update({
					'projects': {str(project.id): project.data(path.down('projects'), permission) for project in filterOrAllOnBlank(self.contract_projects, id=path.get_id())},
				})

		return data

	def user_data(self, path, permission):
		data = {}

		if path.check('roles'):
			data.update({
				'roles': {str(role.id): role.data(path.down('roles'), permission) for role in filterOrAllOnBlank(self.roles, user=permission.user, id=path.get_id())},
			})

		return data

	def contract_client_data(self, path, permission):
		data = {}
		if not self.is_production and permission.is_productionadmin:
			data.update({
				'name': self.name,
			})

			if path.check('projects'):
				data.update({
					'projects': {str(project.id): project.contract_client_data(path.down('projects'), permission) for project in filterOrAllOnBlank(self.contract_projects, id=path.get_id())},
				})

		return data

	# roles
	def add_admin(self, user):
		if not self.users.filter(id=user.id).exists():
			self.users.add(user)
		role, role_created = self.roles.get_or_create(user=user, type='admin', display='Admin')
		role.status = 'enabled'
		role.save()
		return role

	def add_moderator(self, user):
		if self.is_production:
			if not self.users.filter(id=user.id).exists():
				self.users.add(user)
			role, role_created = self.roles.get_or_create(user=user, type='moderator', display='Moderator')
			role.status = 'enabled'
			role.save()
			return role

	def add_worker(self, user):
		if self.is_production:
			if not self.users.filter(id=user.id).exists():
				self.users.add(user)
			role, role_created = self.roles.get_or_create(user=user, type='worker', display='Transcriber')
			role.status = 'enabled'
			role.save()
			return role

	def create_rule(self, name, description, project=None):
		rule, rule_created = self.rules.get_or_create(project=project, name=name, description=description)
		rule.number = self.rules.count()
		rule.save()

	def create_flag(self, name, project=None):
		flag, flag_created = self.flags.get_or_create(project=project, name=name)

	# projects
	def has_active_projects(self):
		if self.is_production:
			return self.production_projects.filter(is_active=True).exists()
		else:
			return self.contract_projects.filter(is_active=True).exists()

	def oldest_active_project(self):
		if self.is_production:
			return self.production_projects.filter(is_active=True).earliest()
		else:
			return self.contract_projects.filter(is_active=True).earliest()
