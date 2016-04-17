# django
from django.db import models

# local
from apps.client.models.client import Client

# util

### Project model
class Project(models.Model):

	### Connections
	production_client = models.ForeignKey(Client, related_name='production_projects')
	contract_client = models.ForeignKey(Client, related_name='contract_projects')

	### Properties
	name = models.CharField(max_length=255)
	description = models.TextField(default='')
	combined_priority_index = models.PositiveIntegerField(default=0)

	# Statistics
	completion_percentage = models.FloatField(default=0.0)
	redundancy_percentage = models.FloatField(default=0.0)

	# Methods
	# data
	def data(self, permission):
		pass

class Batch(models.Model):

	### Connections
	project = models.ForeignKey(Project, related_name='batches')

	### Properties
	# Identification
	name = models.CharField(max_length=255)
	description = models.TextField(default='')
	priority_index = models.PositiveIntegerField(default=0)

	# Statistics
	due_date = models.DateTimeField(auto_now_add=True)
	completion_percentage = models.FloatField(default=0.0)
	redundancy_percentage = models.FloatField(default=0.0)

	### Methods
	# data
	def data(self, permission):
		pass

class Upload(models.Model):
	'''

	Allows the upload of files for a batch to be tracked and restarted if necessary.

	'''

	### Connections
	project = models.ForeignKey(Project, related_name='uploads')
	batch = models.ForeignKey(Batch, related_name='uploads')

	### Properties
	archive_name = models.CharField(max_length=255, default='')
	relfile_name = models.CharField(max_length=255, default='')
	date_created = models.DateTimeField(auto_now_add=True)
	total_shards = models.PositiveIntegerField(default=0)
	completed_shards = models.PositiveIntegerField(default=0)
	completion_percentage = models.FloatField(default=0.0)
	is_complete = models.BooleanField(default=False)

	### Methods
	def update():
		self.completed_shards += 1
		self.completion_percentage = float(self.completed_shards) / float(self.total_shards)

		if self.completed_shards == self.total_shards:
			self.is_complete = True

		self.save()

class Shard(models.Model):
	'''

	Represents and unuploaded file. Shards are reconciled upon upload.

	'''

	### Connections
	project = models.ForeignKey(Project, related_name='shards')
	batch = models.ForeignKey(Batch, related_name='shards')
	upload = models.ForeignKey(Upload, related_name='shards')

	### Properties
	filename = models.CharField(max_length=255)
	is_reconciled = models.BooleanField(default=False)

	### Methods
	def reconcile(self):
		self.is_reconciled = True
		self.upload.update()
		self.save()
