# django
from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
from django.utils.crypto import get_random_string
from django.core.mail import send_mail

# util
import uuid

# local
from apps.client.models.client import Client

### User classes
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

	# get list of clients
	def clients(self):
		return set(self.roles.values_list('client', flat=True))

	# roles
	def create_productionadmin(self, production_client):
		# test if production client is_production
		if production_client.is_production:
			production_admin_role, production_admin_role_created = self.roles.get_or_create(client=production_client, type='productionadmin')

			return production_admin_role

	def create_contractadmin(self, contract_client):
		# test if production client is_production
		if contract_client.is_contract:
			contract_admin_role, contract_admin_role_created = self.roles.get_or_create(client=contract_client, type='contractadmin')

			return contract_admin_role

	def create_moderator(self, production_client):
		# test if production client is_production
		if production_client.is_production:
			moderator_role, moderator_role_created = self.roles.get_or_create(client=production_client, type='moderator')

			return moderator_role

	def create_worker(self, production_client, moderator):
		# test if production client is_production
		if production_client.is_production:
			# test if moderator shares the same production_client
			if moderator.client == production_client:
				worker_role, worker_role_created = self.roles.get_or_create(supervisor=moderator, client=production_client, type='worker')

				return production_admin_role
