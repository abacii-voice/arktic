# django
from django.db import models

# local
from apps.client.models.client import Client
from apps.users.models.user import User

### Role classes
class Role(models.Model):
	### Connections
	supervisor = models.ForeignKey('self', related_name='subordinates', null=True)
	client = models.ForeignKey(Client, related_name='roles')
	user = models.ForeignKey(User, related_name='roles')

	### Properties
	# type
	type = models.CharField(max_length=255)

	# status
	is_new = models.BooleanField(default=True)
	is_approved = models.BooleanField(default=False)
	is_enabled = models.BooleanField(default=False)

	### Methods
	# data
	def data(self, permission_user=None, permission_role_type=None):
		# DETERMINE PERMISSIONS
		permission_role = None
		if permission_user is not None and permission_role_type is not None:
			# if user has role
			if self.client.roles.filter(user=permission_user, type=permission_role_type).count():
				permission_role = permission_role_type

		# RETURN DATA
		if permission_role is not None:
			role_data = {}

			# moderator and productionadmin
			if permission_role == 'moderator' and self.type == 'worker':
				role_data.update({
					'stat_list': [
						stat.parent.name for stat in self.stats.all()
					],
					'stats': {
						stat.parent.name: state.value for stat in self.stats.all()
					},
				})

			# productionadmin
			if permission_role == 'productionadmin':
				role_data.update({
					'is_new': self.is_new,
					'is_approved': self.is_approved,
					'is_enabled': self.is_enabled,
					'stat_list': [
						stat.parent.name for stat in self.stats.all()
					],
					'stats': {
						stat.parent.name: state.value for stat in self.stats.all()
					},
				})

			return role_data
		else:
			return {}
