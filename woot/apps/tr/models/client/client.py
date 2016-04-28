# django
from django.db import models

# local
from apps.users.models import User

### Client model
class Client(models.Model):

	### Connections
	users = models.ManyToManyField(User, related_name='clients')

	### Properties
	# Identification
	name = models.CharField(max_length=255)

	# Type
	is_production = models.BooleanField(default=False)
	is_contract = models.BooleanField(default=False)

	### Methods
