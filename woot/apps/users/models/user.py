# django
from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
from django.utils.crypto import get_random_string
from django.core.mail import send_mail

# util
import uuid
from permission import Permission

# local
from apps.client.models.client import Client

### User classes
class UserManager(BaseUserManager):
	def create_user(self, first_name, last_name, email, password=None):
		user = self.model(first_name=first_name, last_name=last_name, email=self.normalize_email(email))

		user.set_password(password)
		user.activation_key = get_random_string(length=20)
		user.save()
		return user

class User(AbstractBaseUser, PermissionsMixin):

	### Connections
	clients = models.ManyToManyField(Client, related_name='users')

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

	# settings
	billing_date = models.DateTimeField(auto_now_add=True)

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
			'no-reply@arktic.com', # from email: not sure yet
			[self.email], # recipient list
			html_message='Click <a href="http://localhost:8000/verify/{}/{}/">the link</a>'.format(self.id, self.activation_key) # html message: needs rendering and stuff
		)

		# 3. toggle activation_email_sent
		self.activation_email_sent = True
		self.save()

	def verify(self, activation_key):
		print(self.activation_key, activation_key, self.id)
		if self.activation_key == activation_key and not self.is_activated:
			# reset activation
			self.is_activated = True
			self.activation_key = ''
			self.save()

			# return to confirm
			return True
		else:
			return False # change to False when testing is done

	# roles
	def create_productionadmin(self, production_client):
		# test if production client is_production
		if production_client.is_production:
			production_admin_role, production_admin_role_created = self.roles.get_or_create(client=production_client, type='productionadmin')
			self.clients.add(production_client)
			self.save()

			return production_admin_role

	def create_contractadmin(self, contract_client):
		# test if production client is_production
		if contract_client.is_contract:
			contract_admin_role, contract_admin_role_created = self.roles.get_or_create(client=contract_client, type='contractadmin')
			self.clients.add(contract_client)
			self.save()

			return contract_admin_role

	def create_moderator(self, production_client):
		# test if production client is_production
		if production_client.is_production:
			moderator_role, moderator_role_created = self.roles.get_or_create(client=production_client, type='moderator')
			self.clients.add(production_client)
			self.save()

			return moderator_role

	def create_worker(self, production_client, moderator):
		# test if production client is_production
		if production_client.is_production:
			# test if moderator shares the same production_client
			if moderator.client == production_client:
				worker_role, worker_role_created = self.roles.get_or_create(supervisor=moderator, client=production_client, type='worker')
				self.clients.add(production_client)
				self.save()

				return worker_role

	# get role
	def get_role(self, client_name, role_type):
		role = None
		if role_type=='admin':
			if client_name!='' and Client.objects.get(name=client_name).is_production:
				role_type = 'productionadmin'
			else:
				role_type = 'contractadmin'

		if role_type is not None and self.roles.filter(client__name=client_name, type=role_type).count():
			role = self.roles.get(client__name=client_name, type=role_type)

		return role

	# get permission
	def get_permission(self, client_name, role_type=None):
		return Permission(self, self.get_role(client_name, role_type))

	def data(self, permission):
		user_data = {}

		is_moderator_sub = permission.is_moderator and permission.role.subordinates.filter(user=self)
		if is_moderator_sub or permission.is_contractadmin or permission.is_productionadmin:

			# basic data
			user_data.update(self.basic_data())

		if permission.is_contractadmin or permission.is_productionadmin:

			# roles
			user_data.update(self.role_data(permission))

		return user_data

	# details - basic data that does not require permissions
	def basic_data(self):
		basic_data = {
			'id': str(self.id),
			'first_name': self.first_name,
			'last_name': self.last_name,
			'email': self.email,
		}

		return basic_data

	def role_data(self, permission):
		role_data = {}

		if permission.is_contractadmin or permission.is_productionadmin:
			role_data.update({
				'roles': {
					role.get_type(): role.data(permission) for role in self.roles.filter(client=permission.role.client)
				}
			})

		return role_data

	# clients - fetch data using permissions
	def client_data(self, permission):
		client_data = {
			'clients': {
				client.name: client.data(permission) for client in self.clients.all()
			}
		}
		return client_data
