# django
from django.db import models

# util

### Client model
class Client(models.Model):

	### Properties
	# identification
	name = models.CharField(max_length=255)

	# contract type -> might make subclasses for this
	is_production = models.BooleanField(default=False)
	is_contract = models.BooleanField(default=True)
