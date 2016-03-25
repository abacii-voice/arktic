# Verify requests and get permissions

# Check request for login
class Permission(object):
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
		is_same_client = self.role is not None and self.role.client == client
		return is_same_client

def check_request(request):
	# 1. get user and role_type
	user = request.user
	client_name = request.POST['current_client'] if 'current_client' in request.POST else ''
	role_type = request.POST['current_role'] if 'current_role' in request.POST else ''
	role = user.get_role(client_name, role_type)

	# 2. get permission
	permission = Permission(user, role=role)

	# 3. get verification
	verified = request.method == 'POST' and request.user.is_authenticated()

	return user, permission, verified
