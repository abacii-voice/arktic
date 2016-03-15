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

	def dict(self, permission_user=None, permission_role_type=None):
		if permission_user is not None:

			# DETERMINE PERMISSIONS
			permission_role = None
			if permission_role_type is not None:
				# return results using the permission level of the specified role
				if self.roles.filter(user=permission_user, type=permission_role_type).count():
					# user has specified role with client
					permission_role = permission_role_type

			else:
				# return results using the highest permission level
				highest_permission_role = None
				if self.roles.filter(user=permission_user, type='contractadmin').count():
					highest_permission_role = 'contractadmin'
				elif self.roles.filter(user=permission_user, type='productionadmin').count():
					highest_permission_role = 'productionadmin'
				elif self.roles.filter(user=permission_user, type='moderator').count():
					highest_permission_role = 'moderator'
				elif self.roles.filter(user=permission_user, type='worker').count():
					highest_permission_role = 'worker'

				permission_role = highest_permission_role

			# RETURN DATA
			if permission_role is not None:
				client_dict = {
					'name': self.name,
					'production': self.is_production,
					'contract': self.is_contract,
					'messages_from': [
						message.dict() for message in self.messages.filter(from_user__user=permission_user)
					],
					'messages_to': [
						message.dict() for message in self.messages.filter(to_user__user=permission_user)
					],
					'client_rules': [],
					'roles': [role.type for role in self.roles.filter(user=permission_user)],
					'actions': [],
				}

				# projects
				if permission_role == 'productionadmin':
					client_dict.update({
						'project_list': [
							project.name for project in self.production_projects.all()
						],
						'projects': {
							project.name: project.dict() for project in self.production_projects.all()
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
							project.name: project.dict() for project in self.contract_projects.all()
						},
					})

				# users
				if permission_role in ['productionadmin', 'contractadmin', 'moderator']:
					client_dict.update({
						'user_list': [
							user.email for user in self.users(permission_user=permission_user, permission_role_type=permission_role)
						],
						'users': {
							user.email: user.dict(client=self, permission_user=permission_user, permission_role_type=permission_role) for user in self.users(permission_user=permission_user, permission_role_type=permission_role)
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
