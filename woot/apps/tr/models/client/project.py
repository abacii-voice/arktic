# django
from django.db import models

# local
from apps.tr.models.client.client import Client

# util
import uuid

### Project model
class Project(models.Model):

	### Connections
	production_client = models.ForeignKey(Client, related_name='production_projects')
	contract_client = models.ForeignKey(Client, related_name='contract_projects')

	### Properties
	# Identification
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
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
			# basic
			'production_client': str(self.production_client.id),
			'contract_client': str(self.contract_client.id),
			'name': self.name,
			'description': self.description,
			'combined_priority_index': str(self.combined_priority_index),
			'completion_percentage': str(self.completion_percentage),
			'redundancy_percentage': str(self.redundancy_percentage),

			# connections
			'dictionaries': {str(dictionary.id): dictionary.data() for dictionary in self.dictionaries.all()},
			'grammars': {str(grammar.id): grammar.data() for grammar in self.grammars.all()},
			'batches': {str(batch.id): batch.data() for batch in self.batches.all()},
			'transcriptions': {str(transcription.id): transcription.data() for transcription in self.transcriptions.all()},
		}

		if hasattr(self, 'assigned_users'):
			data.update({
				'assigned_users': [str(user.id) for user in self.assigned_users.all()],
			})

		return data

class Batch(models.Model):

	### Connections
	project = models.ForeignKey(Project, related_name='batches')

	### Properties
	# Identification
	date_created = models.DateTimeField(auto_now_add=True)
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
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
			# basic data
			'date_created': str(self.date_created),
			'name': self.name,
			'description': self.description,
			'priority_index': str(self.priority_index),
			'deadline': str(self.deadline),
			'completion_percentage': str(self.completion_percentage),
			'redundancy_percentage': str(self.redundancy_percentage),

			# connections
			'uploads': {str(upload.id): upload.data() for upload in self.uploads.all()},
		}

		return data

class Upload(models.Model):
	'''

	Allows the upload of files for a batch to be tracked and restarted if necessary.

	'''

	### Connections
	batch = models.ForeignKey(Batch, related_name='uploads')

	### Properties
	date_created = models.DateTimeField(auto_now_add=True)
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	archive_name = models.CharField(max_length=255, default='')
	relfile_name = models.CharField(max_length=255, default='')
	total_fragments = models.PositiveIntegerField(default=0)
	completed_fragments = models.PositiveIntegerField(default=0)
	completion_percentage = models.FloatField(default=0.0)
	is_complete = models.BooleanField(default=False)

	### Methods
	# data
	def data(self):
		data = {
			# basic data
			'date_created': str(self.date_created),
			'archive_name': self.archive_name,
			'relfile_name': self.relfile_name,
			'total_fragments': str(self.total_fragments),
			'completed_fragments': str(self.completed_fragments),
			'completion_percentage': str(self.completion_percentage),
			'is_complete': self.is_complete,

			# connections
			'fragments': {str(fragment.id): fragment.data() for fragment in self.fragments.all()},
		}

		return data

class Fragment(models.Model):
	'''

	Represents and unuploaded file. Fragments are reconciled upon upload.

	'''

	### Connections
	upload = models.ForeignKey(Upload, related_name='fragments')

	### Properties
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
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
