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
			'production_client': self.production_client.id,
			'contract_client': self.contract_client.id,
			'id': self.id,
			'name': self.name,
			'description': self.description,
			'combined_priority_index': str(self.combined_priority_index),
			'completion_percentage': str(self.completion_percentage),
			'redundancy_percentage': str(self.redundancy_percentage),

			# connections
			'assigned_users': [user.id for user in self.assigned_users.all()],
			'dictionaries': {dictionary.id: dictionary.data() for dictionary in self.dictionaries.all()}
			'grammars': {grammar.id, grammar.data() for grammar in self.grammars.all()},
			'rules': {rule.id: rule.data() for rule in self.rules.all()},
			'batches': {batch.id: batch.data() for batch in self.batches.all()},
			'transcriptions': {transcription.id: transcription.data() for transcription in self.transcriptions.all()},
		}

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
			'id': self.id,
			'name': self.name,
			'description': self.description,
			'priority_index': str(self.priority_index),
			'deadline': str(self.deadline),
			'completion_percentage': str(self.completion_percentage),
			'redundancy_percentage': str(self.redundancy_percentage),

			# connections
			'uploads': {upload.id: upload.data() for upload in self.uploads.all()},
		}

		return data

class Upload(models.Model):
	'''

	Allows the upload of files for a batch to be tracked and restarted if necessary.

	'''

	### Connections
	batch = models.ForeignKey(Batch, related_name='uploads')
	# sub: fragment

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
			'id': self.id,
			'archive_name': self.archive_name,
			'relfile_name': self.relfile_name,
			'total_fragments': str(self.total_fragments),
			'completed_fragments': str(self.completed_fragments),
			'completion_percentage': str(self.completion_percentage),
			'is_complete': self.is_complete,

			# connections
			'fragments': {fragment.id: fragment.data() for fragment in self.fragments.all()},
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
			'id': self.id,
			'filename': self.filename,
			'is_reconciled': self.is_reconciled,
		}

		return data
