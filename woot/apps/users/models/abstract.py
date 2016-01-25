# django
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

# local
from apps.client.models.client import Client

# util
import uuid

### Abstract classes
class AbstractUser(AbstractBaseUser, PermissionsMixin):

	### Properties
	# identification
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	email = models.EmailField(max_length=255, unique=True)
	first_name = models.CharField(max_length=255)
	last_name = models.CharField(max_length=255)

	# type
	is_approved = models.BooleanField(default=False)
	is_active = models.BooleanField(default=False)
	has_user_permissions = models.BooleanField(default=True)
	has_moderator_permissions = models.BooleanField(default=False)

	# preferences

	# other
	USERNAME_FIELD = 'email'

	### Methods
	def __str__(self):
		return '{}, ({}, {})'.format(self.email, self.last_name, self.first_name)

	### Meta
	class Meta():
		abstract = True
