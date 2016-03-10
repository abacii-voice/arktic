# django
from django.db import models

# local
from apps.client.models.client import Client
from apps.users.models.user import User

### Role classes
class Role(models.Model):
	### Properties
	type = models.CharField(max_length=255)

class RoleInstance(models.Model):
	### Connections
	role = models.ForeignKey(Role, related_name='instances')
	client = models.ForeignKey(Client, related_name='roles')
	user = models.ForeignKey(User, related_name='roles')

	### Properties
	is_new = models.BooleanField(default=True)
	is_approved = models.BooleanField(default=False)
	is_enabled = models.BooleanField(default=False)
