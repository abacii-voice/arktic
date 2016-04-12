# django
from django.db import models

# local
from apps.client.models.client import Client

# util

### Project model
class ProjectGroup(models.Model):

	### Connections
	production_client = models.ForeignKey(Client, related_name='production_projects')
	contract_client = models.ForeignKey(Client, related_name='contract_projects')

	### Properties
	name = models.CharField(max_length=255)
	description = models.TextField()
	priority_index = models.PositiveIntegerField(default=0)
	combined_priority_index = models.PositiveIntegerField(default=0)

	# Statistics
	due_date = models.DateTimeField(auto_now_add=False)
	completion_percentage = models.FloatField(default=0.0)
	redundancy_percentage = models.FloatField(default=0.0)

	# Methods
	# data
	def data(self, permission):
		pass

class Project(models.Model):

	### Connections
	group = models.ForeignKey(ProjectGroup, related_name='sub_projects')

	### Properties
	# Identification
	name = models.CharField(max_length=255)
	description = models.TextField()
	priority_index = models.PositiveIntegerField(default=0)

	# Statistics
	due_date = models.DateTimeField(auto_now_add=False)
	completion_percentage = models.FloatField(default=0.0)
	redundancy_percentage = models.FloatField(default=0.0)

	### Methods
	# data
	def data(self, permission):
		pass
