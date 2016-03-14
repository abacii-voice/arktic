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
				if self.roles.filter(user=permission_user, type='productionadmin').count():
					highest_permission_role = 'productionadmin'
				elif self.roles.filter(user=permission_user, type='moderator').count():
					highest_permission_role = 'moderator'

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
				}

				# projects
				if permission_role == 'productionadmin':
					client_dict.update({
						'project_list': [
							project.name for project in self.projects.all()
						],
						'projects': {
							project.name: project.dict() for project in self.projects.all()
						},
					})
				elif permission_role == 'moderator':


					'user_list': [
						user.name for user in self.users()
					],
					'users': {
						user.name: user.dict(client=self) for user in self.users(permission_user)
					},
					'transcriptions'
				}
			else:
				return {} # give nothing back
		else:
			return {} # give nothing back
