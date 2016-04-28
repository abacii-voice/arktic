# django
from django.db import models

# local
from apps.tr.models.client.project import Project

### Grammar model
class Grammar(models.Model):
	'''
	This is generated automatically to narrow the results of the recogniser.
	It belongs to an end client and is part of a project: Project.generate_grammar()
	'''

	### Connections
	project = models.ForeignKey(Project, related_name='grammars')

	### Properties
	metadata = models.TextField(default='')
	date_created = models.DateTimeField(auto_now_add=True)
	file = models.FileField(upload_to='grammars')
