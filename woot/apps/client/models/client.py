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

			# RETURN DATA
			if permission_role is not None:
				client_dict = {
					'name': self.name,
					'is_production': self.is_production,
					'is_contract': self.is_contract,
					'client_rules': [],
					'role_list': [
						role.type for role in self.roles.filter(user=permission_user)
					],
					'roles': {
						role.type: role.data() for role in self.roles.filter(user=permission_user)
					},
					'actions': [],
				}

				# projects
				if permission_role == 'productionadmin':
					client_dict.update({
						'project_list': [
							project.name for project in self.production_projects.all()
						],
						'projects': {
							project.name: project.data() for project in self.production_projects.all()
						},
					})

				# rules, uploads, projects
				if permission_role == 'contractadmin':
					client_dict.update({
						'new_rules': [],
						'uploads': [],
						'project_list': [
							project.name for project in self.contract_projects.all()
						],
						'projects': {
							project.name: project.data() for project in self.contract_projects.all()
						},
					})

				# users
				if permission_role in ['productionadmin', 'contractadmin', 'moderator']:
					client_dict.update({
						'user_list': [
							user.id for user in self.users(permission_user=permission_user, permission_role_type=permission_role)
						],
						'users': {
							user.id: user.data(self, permission_user=permission_user, permission_role_type=permission_role) for user in self.users(permission_user=permission_user, permission_role_type=permission_role)
						},
					})

				# moderations
				if permission_role == 'moderator':
					client_dict.update({
						'active_moderation': {},
						'moderations': self.get_moderation_set(),
						'new_moderations': [],
					})

				# transcriptions
				if permission_role == 'worker':
					client_dict.update({
						'active_transcription': {},
						'transcriptions': self.get_transcription_set(),
						'new_transcriptions': [],
					})

				return client_dict

			else:
				return {} # give nothing back
		else:
			return {} # give nothing back

	# moderations
	def get_moderation_set(self):
		return [0, 1, 2]

	def get_transcription_set(self):
		return [0, 1, 2]
