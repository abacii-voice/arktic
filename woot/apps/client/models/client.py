# django
from django.db import models

# util

### Client model
class AbstractClient(models.Model):
	class Meta():
		abstract = True

	### Properties
	# identification
	name = models.CharField(max_length=255)

class ProductionClient(AbstractClient):
	'''
	A client that does transcription and hires workers and moderators, but does not own the original audio
	or receive the final product.
	'''
	pass

class ContractClient(AbstractClient):
	'''
	A client that owns the audio and final product, but does not hire workers.
	'''
	pass
