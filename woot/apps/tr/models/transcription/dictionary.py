# django
from django.db import models

# local
from apps.tr.models.client.project import Project
from apps.tr.models.role.role import Role

### Dictionary classes
class Dictionary(models.Model):

	### Connections
	project = models.ForeignKey(Project, related_name='dictionaries')

class UserDictionary(models.Model):

	### Connections
	parent = models.ForeignKey(Dictionary, related_name='children')
	role = models.ForeignKey(Role, related_name='dictionaries')

	### Properties
