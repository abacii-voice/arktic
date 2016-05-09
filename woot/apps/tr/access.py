
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
		self.is_contractadmin = not self.is_productionadmin and self.role is not None and self.role.type == 'admin'
		self.is_admin = self.is_productionadmin or self.is_contractadmin
		self.is_moderator = self.role.type == 'moderator' and self.role is not None
		self.is_worker = self.role.type == 'worker' and self.role is not None
		self.is_basic = self.role is None

	def check_client(self, client):
		return self.role is not None and self.role.client == client

	def check_user(self, user):
		return self.user == user

### Paths
class Path():
	'''
	this represents a request path and should change as parts of it are reconciled.

	1. If the path is blank, any check should be True (any object should pass)
	2. If the path is blank, the id should be ''

	'''

	def __init__(self, path):
		# properties
		self.is_done = False
		self.just_done = False
		self.is_blank = path == ''
		self.id = ''

		# locations
		if not self.is_blank:
			self.locations = collections.OrderedDict()
			s = path.split('.')
			for i in range(0, len(s), 2):
				self.locations[s[i]] = s[i+1] if i+1 != len(s) else ''

			self.step()

	def step(self):
		if not self.is_blank:
			if not self.is_done:
				if self.locations:
					self.type, self.id = self.locations.popitem(last=False)
					self.is_done = not self.locations
					self.just_done = self.is_done
			else:
				self.type, self.id = None, 'DONE'

	def check(self, location, blank=True):
		return self.type == location if not self.is_blank else blank

	def get_id(self):
		value = self.id
		return value

	def down(self):
		if self.just_done:
			self.just_done = False
			return Path('')
		else:
			self.step()
			return self

### Access
def access(path, permission):
	# 1. create path
	path = Path(path)
	data = {}

	if path.check('clients'):
		data.update({
			'clients': {client.id: client.data(path.down(), permission) for client in Client.objects.filter(id__contains=path.get_id())},
		})

	if path.check('user'):
		data.update({
			'user': permission.user.data(path.down(), permission),
		})

	return data

### Requests
