# django
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

# util
import uuid

### Abstract classes
class BaseUser(AbstractBaseUser, PermissionsMixin):

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

	def get_child(self):
		if hasattr(self, 'user'):
			# corresponds to a user object
			is_superadmin, is_admin, is_moderator, is_user = False, False, False, True

			return is_superadmin, is_admin, is_moderator, is_user, self.is_approved, self.user

		elif hasattr(self, 'moderator'):
			# corresponds to a moderator object
			is_superadmin, is_admin, is_moderator = False, False, True

			# only display user data if the moderator has a surrogate_user
			is_user = hasattr(self.moderator, 'surrogate_user')

			return is_superadmin, is_admin, is_moderator, is_user, self.is_approved, self.moderator

		elif hasattr(self, 'admin'):
			# corresponds to a admin object
			is_superadmin, is_admin = False, True

			# only display moderator data if the admin has a surrogate_moderator
			is_moderator = hasattr(self.admin, 'surrogate_moderator')

			# only display user data if the admin has a surrogate_user
			is_user = hasattr(self.admin, 'surrogate_user')

			return is_superadmin, is_admin, is_moderator, is_user, self.is_approved, self.admin

		elif hasattr(self, 'superadmin'):
			# corresponds to a superadmin object
			is_superadmin = True

			# only display admin data if the superadmin has a surrogate_admin
			is_moderator = hasattr(self.superadmin, 'surrogate_admin')

			# only display moderator data if the admin has a surrogate_moderator
			is_moderator = hasattr(self.superadmin, 'surrogate_moderator')

			# only display user data if the admin has a surrogate_user
			is_user = hasattr(self.superadmin, 'surrogate_user')

			return is_superadmin, is_admin, is_moderator, is_user, self.is_approved, self.superadmin
