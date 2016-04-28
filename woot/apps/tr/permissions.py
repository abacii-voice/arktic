def is_dictionary(test):
	return isinstance(test, dict)

# Verify requests and get permissions

# Check request for login
class Permission(object):
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
		self.user = user
		self.role = role
		if role is not None:
			self.is_contractadmin = role.type == 'contractadmin'
			self.is_productionadmin = role.type == 'productionadmin'
			self.is_moderator = role.type == 'moderator'
			self.is_worker = role.type == 'worker'
			self.is_basic = False
		else:
			self.is_contractadmin = False
			self.is_productionadmin = False
			self.is_moderator = False
			self.is_worker = False
			self.is_basic = True

	def check_client(self, client):
		return self.role is not None and self.role.client == client

	def check_user(self, user):
		return self.user == user

def process_request(request):
	# 1. process data
	data = walk(request.POST)

	# 2. get user and role_type
	user = request.user
	client_name = data['active']['client'] if 'active' in data else ''
	role_type = data['active']['role'] if 'active' in data else ''
	role = user.get_role(client_name, role_type)

	# 3. get permission
	permission = Permission(user, role=role)

	# 4. get verification
	verified = request.method == 'POST' and request.user.is_authenticated()

	return user, permission, data, verified

def walk(dictionary):
	data = {}
	for key, value in dictionary.items():
		if '[]' in key: # array of values
			key = key[:-2]

		if is_dictionary(value):
			data[key] = walk(value)
		else:
			if value == 'true':
				data[key] = True
			elif value == 'false':
				data[key] = False
			elif float(value) == int(value): # is integer
				data[key] = int(value)
			elif float(value) != int(value): # is float
				data[key] = float(value)

	return data
