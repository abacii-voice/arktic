# django
from django.db import models

# local
from apps.users.models.base import BaseUser

# util

### Superadmin classes
class Superadmin(BaseUser):
	'''
	This is the free spirit of the system. It has all permissions and can access and load any page as any user.
	Is this too much power for one user to hold? Some say yes. I say: risks are there to be taken.
	'''

	### Connections: unknown
	base = models.OneToOneField(BaseUser, parent_link=True, related_name='superadmin') # link back to parent class

	### Properties: unknown
	### Who or what is this thing?

	pass
