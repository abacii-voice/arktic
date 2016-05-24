
# django

# local
from apps.tr.models.client.client import Client

# util
import collections
import json

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
		self.is_productionadmin = self.role is not None and self.role.type == 'admin' and self.role.client.is_production
		self.is_contractadmin = self.role is not None and not self.is_productionadmin and self.role.type == 'admin'
		self.is_admin = self.is_productionadmin or self.is_contractadmin
		self.is_moderator = self.role is not None and self.role.type == 'moderator'
		self.is_worker = self.role is not None and self.role.type == 'worker'
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
		self.is_blank = path == ''
		self.key = ''
		self.id = ''
		self.index = 0

		# locations
		if not self.is_blank:
			self.locations = collections.OrderedDict()
			s = path.split('.')
			for i in range(0, len(s), 2):
				self.locations.update({s[i]: s[i+1] if i+1 != len(s) else ''})

			self.key, self.id = list(self.locations.items())[self.index]

	def __str__(self):
		return 'B: {blank}, key: {key}, id: {id}, index: {index}'.format(
			blank=self.is_blank,
			key=self.key if self.key is not '' else '_',
			id=self.id if self.id is not '' else '_',
			index=self.index,
		)

	def check(self, location, blank=True):
		# If a check is successful, it should lock the search to this path.
		# A record should be kept so that the path can return to this level.
		return self.key == location if not self.is_blank else blank

	def get_id(self):
		# get id should have no effect on any levels or locking.
		return self.id

	def down(self, key):
		# This should shift the index to the next token, or if the key is the same as a previous key,
		# the index should rewind to this key instead.
		if not self.is_blank:
			key_index = list(self.locations.keys()).index(key) + 1
			self.index = key_index if key_index < self.index else (self.index + 1)

			if self.index < len(self.locations):
				self.key, self.id = list(self.locations.items())[self.index]
			else:
				return Path('')

		return self

### Access
def access(original_path, permission):
	# 1. create path
	path = Path(original_path)
	data = {}

	if path.check('clients'):
		data.update({
			'clients': {client.id: client.data(path.down('clients'), permission) for client in Client.objects.filter(id__startswith=path.get_id()) if client.users.filter(id=permission.user.id).exists()},
		})

	if path.check('user'):
		data.update({
			'user': permission.user.client_data(path.down('user'), permission),
		})

	# cut to size
	if original_path != '':
		for token in original_path.split('.'):
			data = data[token]

	return data

### Requests
def process_request(request):
	# 1. process data
	data = json.loads(request.body.decode('utf8'))

	# 2. get user and role_type
	user = request.user
	client_id = data['permission']['client_id'] if 'permission' in data else ''
	role_type = data['permission']['role_type'] if 'permission' in data else ''

	# 3. get permission
	permission = Permission(user, role=user.get_role(client_id, role_type))

	# 4. get verification
	verified = request.method == 'POST' and request.user.is_authenticated()

	return user, permission, data, verified