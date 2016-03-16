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

	# methods
	# data
	def users(self, permission_user=None, permission_role_type=None):
		# DETERMINE PERMISSIONS

		# RETURN DATA
		return set([role.user for role in self.roles.all()])

	def data(self, permission_user=None, permission_role_type=None):
		if permission_user is not None:

			# DETERMINE PERMISSIONS
			permission_role = None
			if permission_role_type is not None:
				# return results using the permission level of the specified role
				if self.roles.filter(user=permission_user, type=permission_role_type).count():
					# user has specified role with client
					permission_role = permission_role_type
			else:
				permission_role = 'basic'

			# RETURN DATA
			if permission_role is not None:
				client_data = {
					'name': self.name,
					'is_production': self.is_production,
					'is_contract': self.is_contract,
					'client_rules': [],
					'role_list': [
						role.type for role in self.roles.filter(user=permission_user)
					],
					'roles': {
						role.type: role.data(permission_user=permission_user, permission_role_type=permission_role_type) for role in self.roles.filter(user=permission_user)
					},
					'new_roles': [],
				}

				# projects
				if permission_role == 'productionadmin':
					client_data.update(self.production_project_data())

				# rules, uploads, projects
				if permission_role == 'contractadmin':
					client_data.update({
						'new_rules': [],
						'uploads': [],
					})

					client_data.update(self.contract_project_data())

				# users
				if permission_role in ['productionadmin', 'contractadmin', 'moderator']:
					client_data.update(self.user_data(permission_user, permission_role))

				# moderations
				if permission_role == 'moderator':
					client_data.update(self.moderation_data())

				# transcriptions
				if permission_role == 'worker':
					client_data.update(self.transcription_data())

				return client_data

			else:
				return {} # give nothing back
		else:
			return {} # give nothing back

	def contract_project_data(self):
		contract_project_data = {
			'project_list': [
				project.name for project in self.contract_projects.all()
			],
			'projects': {
				project.name: project.data(project_is_contract=False) for project in self.contract_projects.all()
			},
		}

		return contract_project_data

	def production_project_data(self):
		production_project_data = {
			'project_list': [
				project.name for project in self.production_projects.all()
			],
			'projects': {
				project.name: project.data(project_is_contract=True) for project in self.production_projects.all()
			},
		}

		return production_project_data

	def user_data(self, permission_user, permission_role_type):
		user_data = {
			'user_list': [
				user.id for user in self.users(permission_user=permission_user, permission_role_type=permission_role_type)
			],
			'users': {
				user.id: user.data(self, permission_user=permission_user, permission_role_type=permission_role_type) for user in self.users(permission_user=permission_user, permission_role_type=permission_role_type)
			},
		}

		return user_data

	def moderation_data(self):
		moderation_data = {
			'active_moderation': {},
			'moderations': self.get_moderation_set(),
			'new_moderations': [],
		}

		return moderation_data

	def transcription_data(self):
		transcription_data = {
			'active_transcription': {},
			'transcriptions': self.get_transcription_set(),
			'new_transcriptions': [],
		}

		return transcription_data

	# moderations
	def get_moderation_set(self):
		return [0, 1, 2]

	def get_transcription_set(self):
		return [0, 1, 2]
