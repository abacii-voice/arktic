# django
from django.db import models

# local
from apps.users.models.abstract import AbstractUser

# util

### Superadmin classes
class Superadmin(AbstractUser):
	'''
	This is the free spirit of the system. It has all permissions and can access and load any page as any user.
	Is this too much power for one user to hold? Some say yes. I say: risks are there to be taken.
	'''

	### Connections: unknown
	### Properties: unknown
	### Who or what is this thing?

	pass
