# apps.users.models

# django
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin

# local
from apps.client.models import Client

### Create your models here.
class UserManager(BaseUserManager):


class User(AbstractBaseUser, PermissionsMixin):
	### Connections


	### Properties
