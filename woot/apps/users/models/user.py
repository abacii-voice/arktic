# django
from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
from django.utils.crypto import get_random_string
from django.core.mail import send_mail

# util
import uuid

# local
from apps.client.models.client import ProductionClient, ContractClient

### Abstract classes
class UserManager(BaseUserManager):
	def create_user(self, email, password=None):
		user = self.model(email=self.normalize_email(email))

		user.set_password(password)
		user.save()
		return user

class User(AbstractBaseUser, PermissionsMixin):

	### Properties
	# identification
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	email = models.EmailField(max_length=255, unique=True)
	first_name = models.CharField(max_length=255)
	last_name = models.CharField(max_length=255)

	# activation
	is_activated = models.BooleanField(default=False)
	activation_email_sent = models.BooleanField(default=False)
	activation_key = models.CharField(max_length=20) # use utils to generate unique key

	# type
	is_approved = models.BooleanField(default=False) # admin approval

	# preferences

	# associated clients
	production_clients = models.ManyToManyField(ProductionClient, related_name='users')
	contract_clients = models.ManyToManyField(ContractClient, related_name='users')

	# other
	objects = UserManager()
	USERNAME_FIELD = 'email'

	### Methods
	def __str__(self):
		return '{}, ({}, {})'.format(self.email, self.last_name, self.first_name)

	# verify
	def send_verification_email(self):
		# 1. generate activation key
		self.activation_key = get_random_string()

		# 2. send email with key
		send_mail(
			'Arktic account verification for {}'.format(self.email), # subject
			'Follow the link below to verify your email:', # text message
			'', # from email: not sure yet
			[self.email], # recipient list
			'html-message' # html message: needs rendering and stuff
		)

		# 3. toggle activation_email_sent
		pass

	def verify_email(self, activation_key):
		if self.activation_key == activation_key:
			self.is_activated = True
			self.activation_key = ''
			self.save()
			return True
		else:
			return False

	def clients(self):
		return list(self.roles()['clients'].keys())

	def details(self, request_client, request_role):
		level = request_role == 'productionadmin'

		user_dict = {
			'first_name': self.first_name,
			'last_name': self.last_name,
			'email': self.email,
			'roles': self.roles(request_client) if level else '',
			'settings': self.settings(),
		}

		return user_dict

	def settings(self):
		return ''

	def roles(self, request_client=None):
		'''
		Returns a dictionary containing all the information about the roles currently held by the user.

		need a dictionary like this:
		{
			'superadmin':True,
			'client1':{
				'admin':True,
				'worker':{
					'is_approved':True,
					'is_active':True,
				},
			},
		}
		'''
		is_superadmin = bool(self.users_superadmin_roles.count())

		role_dictionary = {
			'is_active':self.is_active,
			'is_approved':self.is_approved,
			'is_superadmin':is_superadmin,
			'clients':{},
		}

		accessor_dictionary = {
			'productionadmin':self.users_productionadmin_roles if hasattr(self, 'users_productionadmin_roles') else None,
			'contractadmin':self.users_contractadmin_roles if hasattr(self, 'users_contractadmin_roles') else None,
			'moderator':self.users_moderator_roles if hasattr(self, 'users_moderator_roles') else None,
			'worker':self.users_worker_roles if hasattr(self, 'users_worker_roles') else None,
		}

		for role_name, role_accessor in accessor_dictionary.items():
			if role_accessor is not None:
				for role in role_accessor.all():
					if role.client.name not in role_dictionary['clients']:
						if request_client is None or request_client.name == role.client.name:
							role_dictionary['clients'][role.client.name] = {'roles':[]}
					if request_client is None or request_client.name == role.client.name:
						role_dictionary['clients'][role.client.name]['roles'].append(role_name)

		return role_dictionary

	def create_superadmin(self):
		# only one can exist per user
		superadmin_role, superadmin_role_created = self.users_superadmin_roles.get_or_create()
		return superadmin_role

	def create_productionadmin(self, production_client):
		# only one per client
		self.production_clients.add(production_client)
		production_client.users.add(self)
		production_client.save()
		self.save()
		productionadmin_role, productionadmin_created = self.users_productionadmin_roles.get_or_create(client=production_client)
		return productionadmin_role

	def create_contractadmin(self, contract_client):
		# only one per client
		self.contract_clients.add(contract_client)
		contract_client.users.add(self)
		contract_client.save()
		self.save()
		contractadmin_role, contractadmin_created = self.users_contractadmin_roles.get_or_create(client=contract_client)
		return contractadmin_role

	def create_moderator(self, client):
		# only one per client
		self.production_clients.add(client)
		client.users.add(self)
		client.save()
		self.save()
		moderator_role, moderator_role_created = self.users_moderator_roles.get_or_create(client=client)
		return moderator_role

	def create_worker(self, client, moderator):
		# 1. only one per client
		# 2. moderator must be from the same client
		self.production_clients.add(client)
		client.users.add(self)
		client.save()
		self.save()
		if moderator.client==client:
			worker_role, worker_role_created = self.users_worker_roles.get_or_create(client=client, moderator=moderator)
			return worker_role
		else:
			return None
