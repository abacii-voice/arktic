# django
from django.db import models

# local
from apps.tr.idgen import idgen

### Project model
class Project(models.Model):

	### Connections
	production_client = models.ForeignKey('tr.Client', related_name='production_projects')
	contract_client = models.ForeignKey('tr.Client', related_name='contract_projects')

	### Properties
	# Identification
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	name = models.CharField(max_length=255)
	date_created = models.DateTimeField(auto_now_add=True)
	description = models.TextField(default='')
	combined_priority_index = models.PositiveIntegerField(default=0)

	# Statistics
	completion_percentage = models.FloatField(default=0.0)
	redundancy_percentage = models.FloatField(default=0.0)

	class Meta():
		get_latest_by = 'date_created'

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

		if path.check('dictionary') and hasattr(self, 'dictionary') and permission.check_client(path.get_key('client')):
			data.update({
				'dictionary': self.dictionary.data(path.down('dictionary'), permission),
			})

		if path.check('batches') and permission.is_admin:
			data.update({
				'batches': {batch.id: batch.data(path.down('batches'), permission) for batch in self.batches.filter(id__startswith=path.get_id())},
			})

		if path.check('transcriptions', blank=False):
			data.update({
				'transcriptions': {transcription.id: transcription.data(path.down('transcriptions'), permission) for transcription in self.transcriptions.filter(id__startswith=path.get_id()).filter(**path.get_filter('transcriptions')).order_by('content')},
			})

		return data

	def get_transcription(self):
		'''
		Select a single transcription based on several criteria.

		'''
		transcriptions = self.transcriptions.filter(is_active=True, is_available=True).order_by('content__content', 'date_created')
		if transcriptions.count() > 0:
			transcription = transcriptions[0]
			transcription.update_availability()
			transcription.save()

			return transcription
		else:
			return None

	def get_moderation(self):
		'''
		Select a single moderation based on several criteria.

		'''
		moderations = self.moderations.filter(is_active=True, is_available=True).order_by('transcription__content__content', 'date_created')
		if moderations.count() > 0:
			moderation = moderations[0]
			moderation.update_availability()
			moderation.save()

			return moderation
		else:
			return None

class Batch(models.Model):

	### Connections
	project = models.ForeignKey('tr.Project', related_name='batches')

	### Properties
	# Identification
	date_created = models.DateTimeField(auto_now_add=True)
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	name = models.CharField(max_length=255)
	description = models.TextField(default='')

	# Statistics
	completion_percentage = models.FloatField(default=0.0)
	redundancy_percentage = models.FloatField(default=0.0)

	# Variables
	deadline = models.DateTimeField(auto_now_add=True)
	priority_index = models.PositiveIntegerField(default=0)

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
	batch = models.ForeignKey('tr.Batch', related_name='uploads')

	### Properties
	date_created = models.DateTimeField(auto_now_add=True)
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	archive_name = models.CharField(max_length=255, default='')
	is_complete = models.BooleanField(default=False)

	### Methods
	# stats
	def completed(self):
		total = self.fragments.count()
		completed = self.fragments.filter(is_reconciled=True).count()
		completion_percentage = completed / total

		return total, completed, completion_percentage

	# data
	def data(self, path, permission):
		data = {}
		total_fragments, completed_fragments, completion_percentage = self.completed()

		if path.is_blank:
			data.update({
				'date_created': str(self.date_created),
				'archive_name': self.archive_name,
				'total_fragments': str(total_fragments),
				'completed_fragments': str(completed_fragments),
				'completion_percentage': str(completion_percentage),
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
	upload = models.ForeignKey('tr.Upload', related_name='fragments')

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
