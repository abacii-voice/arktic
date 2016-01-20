# apps.users.models

# django
from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin

# local
from apps.client.models import Client

### Create your models here.
class UserManager(BaseUserManager):

	### Methods
	def create_user(self, email, first_name, last_name, password=None):
		user = self.model(email=self.normalize_email(email), first_name=first_name, last_name=last_name)
		user.set_password(password)
		user.save()
		return user

class User(AbstractBaseUser, PermissionsMixin):
	### Connections
	client = models.ForeignKey(Client, related_name='users')

	### Properties
	# identification
	email = models.EmailField(max_length=255, unique=True)
	first_name = models.CharField(max_length=255)
	last_name = models.CharField(max_length=255)

	# type
	is_approved = models.BooleanField(default=False)
	is_active = models.BooleanField(default=False)
	is_superadmin = models.BooleanField(default=False)
	is_admin = models.BooleanField(default=False)
	is_moderator = models.BooleanField(default=False)
	is_worker = models.BooleanField(default=False)

	# preferences

	# other
	USERNAME_FIELD = 'email'
	objects = UserManager()

	### Methods
	def __str__(self):
		return '{}, ({}, {})'.format(self.email, self.last_name, self.first_name)
