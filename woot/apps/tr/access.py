
# django

# local
from apps.tr.models.client.client import Client

# util
import collections

### Permissions
class Permission():
	def __str__(self):
		return 'user: {}, role: {}, C: {}, P: {}, M: {}, W: {}'.format(
			self.user.id,
			self.role.type if self.role is not None else 'none',
			self.is_contractadmin,
			self.is_productionadmin,
			self.is_moderator,
			self.is_worker
		)

	def __init__(self, user, role=None):
		# associations
		self.user = user
		self.role = role

		# types
		self.is_productionadmin = self.role.type == 'admin' and self.role.client.is_production and self.role is not None
		self.is_contractadmin = not self.is_productionadmin and self.role is not None
		self.is_moderator = self.role.type == 'moderator' and self.role is not None
		self.is_worker = self.role.type == 'worker' and self.role is not None
		self.is_basic = self.role is None

	def check_client(self, client):
		return self.role is not None and self.role.client == client

	def check_user(self, user):
		return self.user == user

### Paths
class Path():
	def __init__(self, path):
		self.is_done = False
		self.is_blank = path == ''
		self.locations = path.split('.')
		self.index = 0

	def check(self, location):
		if self.is_blank:
			return True
		elif self.is_done:
			return False
		else:
			if self.locations[self.index] == location:
				self.step()
				return True
			else:
				return False

	def id(self):
		if self.is_blank:
			return ''
		elif self.is_done:
			return 'DONE'
		else:
			value = self.locations[self.index]
			self.step()
			return value

	def step(self):
		if not self.is_done:
			self.index += 1
			if self.index > len(self.locations) - 1:
				self.is_done = True

### Access
def access(path, permission):
	# 1. create path
	path = Path(path)
	data = {}

	if path.check('clients'):
		data.update({
			'clients': {str(client.id): client.data(path) for client in Client.objects.filter(id__contains=path.id())},
		})

	return data

### Requests
