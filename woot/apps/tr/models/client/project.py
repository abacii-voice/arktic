# django
from django.db import models

# local
from apps.tr.models.client.client import Client

# util

### Project model
class Project(models.Model):

	### Connections
	production_client = models.ForeignKey(Client, related_name='production_projects')
	contract_client = models.ForeignKey(Client, related_name='contract_projects')

	### Properties
	# Identification
	name = models.CharField(max_length=255)
	description = models.TextField(default='')
	combined_priority_index = models.PositiveIntegerField(default=0)

	# Statistics
	completion_percentage = models.FloatField(default=0.0)
	redundancy_percentage = models.FloatField(default=0.0)

	### Methods
	# data
	def data(self):
		data = {
			'name': self.name,
			'description': self.description,
			'combined_priority_index': str(self.combined_priority_index),
			'completion_percentage': str(self.completion_percentage),
			'redundancy_percentage': str(self.redundancy_percentage),
		}

		return data

class Batch(models.Model):

	### Connections
	project = models.ForeignKey(Project, related_name='batches')

	### Properties
	# Identification
	name = models.CharField(max_length=255)
	description = models.TextField(default='')
	priority_index = models.PositiveIntegerField(default=0)

	# Statistics
	deadline = models.DateTimeField(auto_now_add=True)
	completion_percentage = models.FloatField(default=0.0)
	redundancy_percentage = models.FloatField(default=0.0)

	### Methods
	# data
	def data(self):
		data = {
			'name': self.name,
			'description': self.description,
			'priority_index': str(self.priority_index),
			'deadline': str(self.deadline),
			'completion_percentage': str(self.completion_percentage),
			'redundancy_percentage': str(self.redundancy_percentage),
		}

		return data

class Upload(models.Model):
	'''

	Allows the upload of files for a batch to be tracked and restarted if necessary.

	'''

	### Connections
	batch = models.ForeignKey(Batch, related_name='uploads')

	### Properties
	archive_name = models.CharField(max_length=255, default='')
	relfile_name = models.CharField(max_length=255, default='')
	date_created = models.DateTimeField(auto_now_add=True)
	total_fragments = models.PositiveIntegerField(default=0)
	completed_fragments = models.PositiveIntegerField(default=0)
	completion_percentage = models.FloatField(default=0.0)
	is_complete = models.BooleanField(default=False)

	### Methods
	# data
	def data(self):
		data = {
			'archive_name': self.archive_name,
			'relfile_name': self.relfile_name,
			'date_created': str(self.date_created),
			'total_fragments': str(self.total_fragments),
			'completed_fragments': str(self.completed_fragments),
			'completion_percentage': str(self.completion_percentage),
			'is_complete': self.is_complete,
		}

		return data

class Fragment(models.Model):
	'''

	Represents and unuploaded file. Fragments are reconciled upon upload.

	'''

	### Connections
	project = models.ForeignKey(Project, related_name='fragments')
	batch = models.ForeignKey(Batch, related_name='fragments')
	upload = models.ForeignKey(Upload, related_name='fragments')

	### Properties
	filename = models.CharField(max_length=255)
	is_reconciled = models.BooleanField(default=False)

	### Methods
	# data
	def data(self):
		data = {
			'filename': self.filename,
			'is_reconciled': self.is_reconciled,
		}

		return data