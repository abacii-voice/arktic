
# django

# local

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
		self.path = path
		self.locations = path.split('.')
		self.active = 0

	def reconcile(self, location):
		# if
		pass


### Access
def access(path, permission):
	# 1. create path
	path = Path(path)

	data = {
		'clients': 
	}

	return data

### Requests
