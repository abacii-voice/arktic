# django
from django.db import models

# util

### Client model
class Client(models.Model):

	### Properties
	# Identification
	name = models.CharField(max_length=255)

	# Type
	is_production = models.BooleanField(default=False)
	is_contract = models.BooleanField(default=False)

	### Methods
	# users
	def users(self):
		return list(set([role.user for role in self.roles.all()]))

	# data
	def data(self, permission):
		client_data = {}

		# basic
		client_data.update(self.basic_data(permission))

		# projects
		client_data.update(self.project_data(permission))

		# roles
		client_data.update(self.role_data(permission))

		# users
		client_data.update(self.user_data(permission))

		# rules
		client_data.update(self.rule_data(permission))

		return client_data

	# roles
	def basic_data(self, permission):
		basic_data = {
			'name': self.name
		}

		if permission.is_productionadmin or permission.is_contractadmin:
			basic_data.update({
				'is_production': self.is_production,
				'is_contract': self.is_contract,
			})

		return basic_data

	# projects
	def project_data(self, permission):
		project_data = {}

		if permission.is_productionadmin:
			project_data.update({
				'projects': {
					project.name: project.data(permission) for project in self.production_projects.all()
				}
			})

		elif permission.is_contractadmin:
			project_data.update({
				'projects': {
					project.name: project.data(permission) for project in self.contract_projects.all()
				}
			})

		return project_data

	# roles for a single user
	def role_data(self, permission):
		'''
		Give a list of all roles for this client + user.
		'''
		role_data = {}

		roles = self.roles.filter(user=permission.user)
		role_data.update({
			'roles': [role.type for role in roles],
		})

		return role_data

	# users
	def user_data(self, permission):
		user_data = {}

		if permission.is_productionadmin or permission.is_contractadmin or permission.is_moderator:
			user_data.update({
				'users': {
					str(user.id): user.data(permission) for user in self.users.all()
				}
			})

		return user_data

	def rule_data(self, permission):
		rule_data = {
			'rules': {
				rule.name: rule.data(permission) for rule in self.rules.all()
			}
		}

		return rule_data
