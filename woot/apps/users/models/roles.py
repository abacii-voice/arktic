# django
from django.db import models

# local
from apps.client.models.client import ProductionClient, ContractClient
from apps.users.models.user import User

### Role classes
class AbstractRole(models.Model):
	class Meta():
		abstract = True

	'''
	A role that a user can take on. A user can have multiple roles.
	'''

	### Connections
	user = models.ForeignKey(User, related_name='%(app_label)s_%(class)s_roles')

class Superadmin(AbstractRole):
	'''
	The free spirit of the system. They can access any interface from the point of view of any user.
	'''

class ProductionAdmin(AbstractRole):
	'''
	Head of an organisation. Has access to the admin inteface.
	'''

	### Connections
	client = models.ForeignKey(ProductionClient, related_name='admins')

class ContractAdmin(AbstractRole):
	'''
	Head of an organisation. Has access to the admin inteface.
	'''

	### Connections
	client = models.ForeignKey(ContractClient, related_name='admins')

class Moderator(AbstractRole):
	'''
	One level above the grunt work. Their job is to have the final say on any confusion.
	'''

	### Connections
	client = models.ForeignKey(ProductionClient, related_name='moderators')

	### Properties
	is_approved = models.BooleanField(default=False)

class Worker(AbstractRole):
	'''
	The grunt work. Every utterance is connected to one of these. They belong to an organisation and
	report to a moderator.
	'''

	### Connections
	client = models.ForeignKey(ProductionClient, related_name='workers')
	moderator = models.ForeignKey(Moderator, related_name='workers')

	### Properties
	is_approved = models.BooleanField(default=False)
