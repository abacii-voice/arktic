
# django

# local
from apps.tr.models.client.client import Client
from apps.tr.external import get_faq, get_rules
from util import filterOrAllOnBlank

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
			self.is_worker,
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
		return self.role is not None and (self.role.client == client or str(self.role.client.id) == str(client))

	def check_user(self, user):
		return self.user == user

### Paths
class Path():
	'''
	this represents a request path and should change as parts of it are reconciled.

	1. If the path is blank, any check should be True (any object should pass)
	2. If the path is blank, the id should be ''

	'''

	def __init__(self, path, fltr={}):
		# properties
		self.is_blank = path == ''
		self.key = ''
		self.id = ''
		self.index = 0
		self.fltr = fltr
		self.metadata = {}

		# locations
		if not self.is_blank:
			self.locations = collections.OrderedDict()
			s = path.split('.')
			i = 0
			while i < len(s):
				self.locations.update({s[i]: s[i+1] if (i+1 != len(s) and '-' in s[i+1]) else ''})
				i += 2 if (i+1 != len(s) and '-' in s[i+1]) else 1

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

	def get_filter(self, key):
		# simulates going down so that the filter can be returned on the last object.
		if not self.is_blank:
			last_key, last_id = list(self.locations.items())[-1]
			if key == last_key and key in self.fltr:
				return self.fltr[key]
			else:
				return {}

		return {}

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

	def set_key(self, key, value):
		self.metadata[key] = value

	def get_key(self, key):
		return self.metadata[key]

### Access
def access(original_path, permission, fltr={}):
	# 1. create path
	path = Path(original_path, fltr=fltr)
	data = {}

	if path.check('clients'):
		data.update({
			'clients': {str(client.id): client.data(path.down('clients'), permission) for client in filterOrAllOnBlank(Client.objects, id=path.get_id()) if client.users.filter(id=permission.user.id).exists()},
		})

	if path.check('user'):
		data.update({
			'user': permission.user.client_data(path.down('user'), permission),
		})

	if path.check('faq'):
		data.update({
			'faq': get_faq(),
		})

	if path.check('rules'):
		data.update({
			'rules': get_rules(),
		})

	# cut to size
	if original_path != '':
		for token in original_path.split('.'):
			if token in data:
				data = data[token]

	return data

### Requests
def process_request(request):
	# 1. process data
	data = json.loads(request.body.decode('utf8'))

	# 2. get user and role_type
	user = request.user
	role_id = data['permission']
	role = user.roles.get(id=role_id) if role_id and user.roles.filter(id=role_id).exists() else None

	# 3. get permission
	permission = Permission(user, role=role)

	# 4. get verification
	verified = request.method == 'POST' and request.user.is_authenticated()

	return user, permission, data, verified
