# django
from django.db import models

# local
from apps.client.models import Client, Project

### Sample classes
class Sample(models.Model):
	'''
	A set of transcriptions sampled from a single project to be subjected to a trial as a group.
	When such a group is transcribed, it can be used to generate an automatic grammar that will be
	applied to the rest of the project, or indeed, another sample. A single transcription can
	appear in multiple samples.

	This is also used to generate the final product of the process. This container is associated
	with a product file, or list of transcriptions and their best utterances.

	'''

	### Connections
	client = models.ForeignKey(Client, related_name='samples')
	project = models.ForeignKey(Project, related_name='samples')

	### Properties
	metadata = models.TextField(default='')
	date_created = models.DateTimeField(auto_now_add=True)
	product_file = models.FileField(upload_to='products')
	grammar_file = models.FileField(upload_to='grammars')
