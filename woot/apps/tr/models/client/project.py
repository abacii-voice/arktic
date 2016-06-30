# django
from django.db import models

# local
from apps.tr.models.client.client import Client
from apps.tr.idgen import idgen

### Project model
class Project(models.Model):

	### Connections
	production_client = models.ForeignKey(Client, related_name='production_projects')
	contract_client = models.ForeignKey(Client, related_name='contract_projects')

	### Properties
	# Identification
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	name = models.CharField(max_length=255)
	description = models.TextField(default='')
	combined_priority_index = models.PositiveIntegerField(default=0)

	# Statistics
	completion_percentage = models.FloatField(default=0.0)
	redundancy_percentage = models.FloatField(default=0.0)

	### Methods
	# data
	def data(self, path, permission):
		data = {}

		if path.is_blank:
			data.update({
				'production_client': self.production_client.id,
				'contract_client': self.contract_client.id,
				'name': self.name,
				'description': self.description,
				'combined_priority_index': str(self.combined_priority_index),
				'completion_percentage': str(self.completion_percentage),
				'redundancy_percentage': str(self.redundancy_percentage),
			})

		if path.check('assigned_users') and hasattr(self, 'assigned_users') and permission.is_productionadmin and permission.check_client(self.production_client):
			data.update({
				'assigned_users': [user.id for user in self.assigned_users.all()],
			})

		if path.check('dictionaries'):
			data.update({
				'dictionaries': {dictionary.id: dictionary.data(path.down('dictionaries'), permission) for dictionary in self.dictionaries.filter(id__startswith=path.get_id())},
			})

		if path.check('grammars') and permission.is_admin:
			data.update({
				'grammars': {grammar.id: grammar.data(path.down('grammars'), permission) for grammar in self.grammars.filter(id__startswith=path.get_id())},
			})

		if path.check('batches') and permission.is_admin:
			data.update({
				'batches': {batch.id: batch.data(path.down('batches'), permission) for batch in self.batches.filter(id__startswith=path.get_id())},
			})

		if path.check('transcriptions', blank=False):
			data.update({
				'transcriptions': {transcription.id: transcription.data(path.down('transcriptions'), permission) for transcription in self.transcriptions.filter(id__startswith=path.get_id()).filter(**path.get_filter('transcriptions')).order_by('original_caption')},
			})

		if path.check('moderations', blank=False):
			data.update({
				'moderations': {moderation.id: moderation.data(path.down('moderations'), permission) for moderation in self.moderations.filter(id__startswith=path.get_id()).filter(**path.get_filter('moderations'))},
			})

		return data

	def get_transcription(self):

		'''
		Select a single transcription based on several criteria.

		'''

		transcription = self.transcriptions.filter(is_active=True, is_available=True).order_by('original_caption', 'date_created')[0]
		transcription.is_available = False
		transcription.save()

		return transcription

	def get_moderation(self):

		'''
		Select a single transcription based on several criteria.

		'''

		return self.moderations.filter(is_active=True, is_available=True).order_by('date_created')[0]

class Batch(models.Model):

	### Connections
	project = models.ForeignKey(Project, related_name='batches')

	### Properties
	# Identification
	date_created = models.DateTimeField(auto_now_add=True)
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	name = models.CharField(max_length=255)
	description = models.TextField(default='')
	priority_index = models.PositiveIntegerField(default=0)

	# Statistics
	deadline = models.DateTimeField(auto_now_add=True)
	completion_percentage = models.FloatField(default=0.0)
	redundancy_percentage = models.FloatField(default=0.0)

	### Methods
	# data
	def data(self, path, permission):
		data = {}

		if path.is_blank:
			data.update({
				'date_created': str(self.date_created),
				'name': self.name,
				'description': self.description,
				'priority_index': str(self.priority_index),
				'deadline': str(self.deadline),
				'completion_percentage': str(self.completion_percentage),
				'redundancy_percentage': str(self.redundancy_percentage),
			})

		if path.check('uploads'):
			data.update({
				'uploads': {upload.id: upload.data(path.down('uploads'), permission) for upload in self.uploads.filter(id__startswith=path.get_id())},
			})

		return data

class Upload(models.Model):
	'''

	Allows the upload of files for a batch to be tracked and restarted if necessary.

	'''

	### Connections
	batch = models.ForeignKey(Batch, related_name='uploads')

	### Properties
	date_created = models.DateTimeField(auto_now_add=True)
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	archive_name = models.CharField(max_length=255, default='')
	relfile_name = models.CharField(max_length=255, default='')
	total_fragments = models.PositiveIntegerField(default=0)
	completed_fragments = models.PositiveIntegerField(default=0)
	completion_percentage = models.FloatField(default=0.0)
	is_complete = models.BooleanField(default=False)

	### Methods
	# data
	def data(self, path, permission):
		data = {}

		if path.is_blank:
			data.update({
				'date_created': str(self.date_created),
				'archive_name': self.archive_name,
				'relfile_name': self.relfile_name,
				'total_fragments': str(self.total_fragments),
				'completed_fragments': str(self.completed_fragments),
				'completion_percentage': str(self.completion_percentage),
				'is_complete': self.is_complete,
			})

		if path.check('fragments'):
			data.update({
				'fragments': {fragment.id: fragment.data(path.down('fragments'), permission) for fragment in self.fragments.filter(id__startswith=path.get_id())},
			})

		return data

class Fragment(models.Model):
	'''

	Represents and unuploaded file. Fragments are reconciled upon upload.

	'''

	### Connections
	upload = models.ForeignKey(Upload, related_name='fragments')

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	filename = models.CharField(max_length=255)
	is_reconciled = models.BooleanField(default=False)

	### Methods
	# data
	def data(self, path, permission):
		data = {
			'filename': self.filename,
			'is_reconciled': self.is_reconciled,
		}

		return data
