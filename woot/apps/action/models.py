# django
from django.db import models

# local
from apps.users.models.user import User
from apps.users.models.role import Role

### Action classes
class Action(models.Model):

	### Properties
	name = models.CharField(max_length=255)
	category = models.CharField(max_length=255)

class ActionInstance(models.Model):

	### Connections
	parent = models.ForeignKey(Action, related_name='instances')
	user = models.ForeignKey(User, related_name='actions')
	role = models.ForeignKey(Role, related_name='actions')

	### Properties
	date_created = models.DateTimeField(auto_now_add=True)
