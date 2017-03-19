# django
from django.db import models

# local
from util import truncate, filterOrAllOnBlank
import uuid

### Project model
class Project(models.Model):

	### Connections
	production_client = models.ForeignKey('tr.Client', related_name='production_projects')
	contract_client = models.ForeignKey('tr.Client', related_name='contract_projects')

	### Properties
	# Identification
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	name = models.CharField(max_length=255)
	date_created = models.DateTimeField(auto_now_add=True)
	description = models.TextField(default='')
	combined_priority_index = models.PositiveIntegerField(default=0)
	is_active = models.BooleanField(default=True)

	class Meta():
		get_latest_by = 'date_created'

	### Methods
	# data
	def data(self, path, permission):
		data = {}

		if path.is_blank:
			data.update({
				'name': self.name,
				'description': self.description,
				'is_transcription_complete': self.is_transcription_complete(),
				'transcriptions_remaining': self.transcriptions_remaining(),
			})

		if permission.is_productionadmin and permission.check_client(self.production_client):
			data.update({
				'contract_client': self.contract_client.id,
			})

		if permission.is_contractadmin and permission.check_client(self.contract_client):
			data.update({
				'production_client': self.production_client.id,
			})

		if permission.is_moderator or permission.is_productionadmin and permission.check_client(self.production_client):
			data.update({
				'completion_percentage': self.completion_percentage(),
				'combined_priority_index': self.combined_priority_index,
				'is_moderation_complete': self.is_moderation_complete(),
				'moderations_remaining': self.moderations_remaining(),
				'redundancy_percentage': self.redundancy_percentage(),
			})

		if path.check('assigned') and hasattr(self, 'assigned') and permission.is_productionadmin and permission.check_client(self.production_client):
			data.update({
				'assigned': [role.id for role in self.assigned.all()],
			})

		if path.check('dictionary') and hasattr(self, 'dictionary') and permission.check_client(path.get_key('client')):
			data.update({
				'dictionary': self.dictionary.data(path.down('dictionary'), permission),
			})

		if path.check('batches') and permission.is_admin:
			data.update({
				'batches': {str(batch.id): batch.data(path.down('batches'), permission) for batch in self.batches.filter(id__contains=path.get_id())},
			})

		if path.check('transcriptions', blank=False):
			data.update({
				'transcriptions': {str(transcription.id): transcription.data(path.down('transcriptions'), permission) for transcription in filterOrAllOnBlank(self.transcriptions, id=path.get_id()).filter(**path.get_filter('transcriptions')).order_by('content')},
			})

		return data

	def contract_client_data(self, path, permission):
		data = {}
		if permission.is_productionadmin and permission.check_client(self.production_client):
			data.update({
				'name': self.name,
				'description': self.description,
				'is_transcription_complete': self.is_transcription_complete(),
				'transcriptions_remaining': self.transcriptions_remaining(),
				'transcriptions_completed': self.transcriptions_completed(),
				'completion_percentage': self.completion_percentage(),
				'combined_priority_index': self.combined_priority_index,
				'is_moderation_complete': self.is_moderation_complete(),
				'moderations_remaining': self.moderations_remaining(),
				'redundancy_percentage': self.redundancy_percentage(),
				'workers_assigned': self.assigned.filter(type='worker').count(),
				'total_transcriptions': self.transcriptions.count(),
			})

		return data

	def get_transcription(self):
		'''
		Select a single transcription based on several criteria.

		'''
		transcriptions = self.transcriptions.filter(is_active=True, is_available=True).order_by('content__content', 'date_created')
		if transcriptions.count() > 0:
			return transcriptions[0]
		else:
			self.is_transcription_complete = True
			self.save()
			return None

	def get_moderation(self):
		'''
		Select a single moderation based on several criteria.

		'''
		moderations = self.moderations.filter(is_active=True, is_available=True).order_by('transcription__content__content', 'date_created')
		if moderations.count() > 0:
			return moderations[0]
		else:
			self.is_moderation_complete = True
			self.save()
			return None

	# stats
	def is_transcription_complete(self):
		self.is_active = self.transcriptions.filter(is_active=True).count() == 0
		self.save()
		return self.is_active

	def is_moderation_complete(self):
		return self.moderations.filter(is_active=True).count() == 0

	def transcriptions_remaining(self):
		return self.transcriptions.filter(is_active=True).count()

	def transcriptions_completed(self):
		return self.transcriptions.filter(is_active=False).count()

	def moderations_remaining(self):
		return self.moderations.filter(is_active=True).count()

	def completion_percentage(self):
		return truncate(((self.transcriptions.count() + self.moderations.count()) - (self.transcriptions_remaining() + self.moderations_remaining())) / (self.transcriptions.count() + self.moderations.count()) * 100.0, 2)

	def redundancy_percentage(self):
		return self.moderations.count() / self.transcriptions.count()

class Batch(models.Model):

	### Connections
	project = models.ForeignKey('tr.Project', related_name='batches')

	### Properties
	# Identification
	date_created = models.DateTimeField(auto_now_add=True)
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
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
				'uploads': {str(upload.id): upload.data(path.down('uploads'), permission) for upload in filterOrAllOnBlank(self.uploads, id=path.get_id())},
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
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	name = models.CharField(max_length=255, default='')
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
				'name': self.name,
				'archive_name': self.archive_name,
				'total_fragments': str(total_fragments),
				'completed_fragments': str(completed_fragments),
				'completion_percentage': str(completion_percentage),
				'is_complete': self.is_complete,
			})

		if path.check('fragments'):
			data.update({
				'fragments': {str(fragment.id): fragment.data(path.down('fragments'), permission) for fragment in filterOrAllOnBlank(self.fragments, id=path.get_id())},
			})

		return data

class Fragment(models.Model):
	'''

	Represents and unuploaded file. Fragments are reconciled upon upload.

	'''

	### Connections
	upload = models.ForeignKey('tr.Upload', related_name='fragments')

	### Properties
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
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

	def reconcile(self):
		self.is_reconciled = True
		self.save()
