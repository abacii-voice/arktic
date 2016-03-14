# django
from django.db import models

# util

### Client model
class Client(models.Model):

	### Properties
	# Identification
	name = models.CharField(max_length=255)

	# Type
	is_production = models.BooleanField(default=False)
	is_contract = models.BooleanField(default=False)
