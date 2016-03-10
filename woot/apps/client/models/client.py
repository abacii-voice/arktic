# django
from django.db import models

# util

### Client model
class Client(models.Model):

	### Properties
	# identification
	name = models.CharField(max_length=255)
