
# django

# local
from apps.tr.models.client.client import Client

# util
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
		self.is_done = False
		self.just_done = False
		self.is_blank = path == ''
		self.id = ''
		self.type = ''

		# locations
		if not self.is_blank:
			self.locations = []
			s = path.split('.')
			for i in range(0, len(s), 2):
				self.locations.append((s[i], (s[i+1] if i+1 != len(s) else '')))

			self.step()

	def __str__(self):
		return 'done: {done}, just: {just}, blank: {blank}, type: {type}, id: {id}, locations: {locations}'.format(
			done=self.is_done,
			just=self.just_done,
			blank=self.is_blank,
			type=self.type if self.type != '' else '_',
			id=self.id if self.id != '' else '_',
			locations=self.locations if hasattr(self, 'locations') else 'None',
		)

	def step(self):
		if not self.is_blank:
			if not self.is_done:
				if self.locations:
					self.type, self.id = self.locations.pop(0)
					self.is_done = not self.locations
					self.just_done = self.is_done
			else:
				self.type, self.id = 'NONE', 'DONE'

	def check(self, location, blank=True):
		print('check', self.type, self.id, location)
		return self.type == location if not self.is_blank else blank

	def get_id(self):
		print('id', self.type, self.id)
		return self.id

	def down(self, parent):
		print('down', parent, self.type, self.id)
		if self.just_done:
			self.just_done = False
			return Path('')
		else:
			self.step()
			return self

### Access
def access(original_path, permission):
	# 1. create path
	path = Path(original_path)
	data = {}

	if path.check('clients'):
		data.update({
			'clients': {client.id: client.data(path.down('clients'), permission) for client in Client.objects.filter(id__contains=path.get_id()) if client.users.filter(id=permission.user.id).exists()},
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
