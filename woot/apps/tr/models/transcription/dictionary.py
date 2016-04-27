# django
from django.db import models

# local
from apps.client.models.project import Project
from apps.users.models.role import Role

### Dictionary classes
class Dictionary(models.Model):

	### Connections
	project = models.ForeignKey(Project, related_name='dictionaries')

class UserDictionary(models.Model):

	### Connections
	parent = models.ForeignKey(Dictionary, related_name='children')
	user = models.OneToOneField(Role, related_name='dictionary')

	### Properties
