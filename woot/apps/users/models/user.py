# django
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

# util
import uuid

### Abstract classes
class User(AbstractBaseUser, PermissionsMixin):

	### Properties
	# identification
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	email = models.EmailField(max_length=255, unique=True)
	first_name = models.CharField(max_length=255)
	last_name = models.CharField(max_length=255)

	# type
	is_approved = models.BooleanField(default=False)

	# preferences

	# other
	USERNAME_FIELD = 'email'

	### Methods
	def __str__(self):
		return '{}, ({}, {})'.format(self.email, self.last_name, self.first_name)

	def create_superadmin(self):
		# only one can exist per user
		superadmin_role, superadmin_role_created = self.users_superadmin_roles.get_or_create()
		return superadmin_role

	def create_admin(self, client):
		# only one per client
		admin_role, admin_role_created = self.users_admin_roles.get_or_create(client=client)
		return admin_role

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
