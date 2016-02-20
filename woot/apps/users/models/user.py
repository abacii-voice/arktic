# django
from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin

# util
import uuid

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
	activation_key = models.CharField(max_length=20) # use utils to generate unique key

	# type
	is_approved = models.BooleanField(default=False)

	# preferences

	# other
	objects = UserManager()
	USERNAME_FIELD = 'email'

	### Methods
	def __str__(self):
		return '{}, ({}, {})'.format(self.email, self.last_name, self.first_name)

	def clients(self):
		return list(self.roles()['clients'].keys())

	def roles(self):
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
						role_dictionary['clients'][role.client.name] = {'roles':[]}
					role_dictionary['clients'][role.client.name]['roles'].append(role_name)

		return role_dictionary

	def create_superadmin(self):
		# only one can exist per user
		superadmin_role, superadmin_role_created = self.users_superadmin_roles.get_or_create()
		return superadmin_role

	def create_productionadmin(self, production_client):
		# only one per client
		productionadmin_role, productionadmin_created = self.users_productionadmin_roles.get_or_create(client=production_client)
		return productionadmin

	def create_contractadmin(self, contract_client):
		# only one per client
		contractadmin_role, contractadmin_created = self.users_contractadmin_roles.get_or_create(client=contract_client)
		return contractadmin

	def create_moderator(self, client):
		# only one per client
		moderator_role, moderator_role_created = self.users_moderator_roles.get_or_create(client=client)
		return moderator_role

	def create_worker(self, client, moderator):
		# 1. only one per client
		# 2. moderator must be from the same client
		if moderator.client==client:
			worker_role, worker_role_created = self.users_worker_roles.get_or_create(client=client, moderator=moderator)
			return worker_role
		else:
			return None
