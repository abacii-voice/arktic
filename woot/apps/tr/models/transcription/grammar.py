# django
from django.db import models

# local
from apps.tr.models.client.project import Project, Batch
from apps.tr.idgen import idgen

### Grammar model
class Grammar(models.Model):
	'''
	This is generated automatically to narrow the results of the recogniser.
	It belongs to an end client and is part of a project: Project.generate_grammar()
	'''

	### Connections
	project = models.ForeignKey(Project, related_name='grammars')
	batch = models.ForeignKey(Batch, related_name='grammars')

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	name = models.CharField(max_length=255)
	date_created = models.DateTimeField(auto_now_add=True)
	metadata = models.TextField(default='')
	file = models.FileField(upload_to='grammars')

	### Methods
	# data
	def data(self, path, permission):
		data = {
			'date_created': str(self.date_created),
			'metadata': self.metadata,
			'filename': self.file.url,
		}

		return data
