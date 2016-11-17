# django
from django.db import models

# local
from apps.tr.idgen import idgen

### Transcription classes
class TranscriptionToken(models.Model):

	'''

	A token keeps track of the transcription objects that have been requested by a user. It has a limit and will deactivate after that limit.

	'''


	### Connections
	project = models.ForeignKey('tr.Project', related_name='transcription_tokens')
	role = models.ForeignKey('tr.Role', related_name='transcription_tokens')

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	date_created = models.DateTimeField(auto_now_add=True)
	transcription_limit = models.PositiveIntegerField(default=5)
	is_active = models.BooleanField(default=True)

	### Methods
	def get_transcriptions(self):
		if self.transcriptions.count() != self.transcription_limit and self.is_active:
			for i in range(self.transcription_limit):
				transcription = self.project.get_transcription()
				if transcription is not None:
					transcription.is_available = False
					self.transcriptions.add(transcription)
					self.save()

	def update(self):
		if self.transcriptions.filter(is_active=False) == self.transcription_limit:
			self.is_active = False
			self.save()

	def data(self, path, permission):
		data = {}
		if permission.check_user(self.role.user):
			data.update({
				'date_created': str(self.date_created),
			})

		return data


class Transcription(models.Model):
	'''
	The central object of the system. It is the connection between audio utterances and text captions.

	'''

	### Connections
	project = models.ForeignKey('tr.Project', related_name='transcriptions')
	grammar = models.ForeignKey('tr.Grammar', related_name='transcriptions')
	batch = models.ForeignKey('tr.Batch', related_name='transcriptions')

	### Properties
	date_created = models.DateTimeField(auto_now_add=True)
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)

	# unique identifier
	filename = models.CharField(max_length=255)
	content = models.TextField(default='')

	# requests and flags
	is_active = models.BooleanField(default=True)
	is_available = models.BooleanField(default=True)
	requests = models.PositiveIntegerField(default=0)
	request_allowance = models.PositiveIntegerField(default=1)
	date_last_requested = models.DateTimeField(auto_now=True)

	### Methods
	# data
	def data(self, path, permission):
		data = {}
		if path.is_blank:
			data.update({
				'batch': self.batch.id,
				'caption': self.caption.content if self.caption else '',
				'date_created': str(self.date_created),
				'requests': str(self.requests),
				'request_allowance': str(self.request_allowance),
				'date_last_requested': str(self.date_last_requested),
			})

		if permission.is_admin:
			data.update({
				'utterance': self.utterance.data(),
				'filename': self.filename,
				'content': self.content,
			})

		if path.check('fragments') and (permission.is_moderator or permission.is_productionadmin):
			data.update({
				'fragments': {fragment.id: fragment.data(path.down('fragments'), permission) for fragment in self.fragments.filter(**path.get_filter('fragments'))},
			})

		if path.check('fragments') and (permission.is_moderator or permission.is_productionadmin):
			data.update({
				'instances': {instance.id: instance.data(path.down('instances'), permission) for instance in self.instances.filter(**path.get_filter('instances'))},
			})

		return data


class TranscriptionFragment(models.Model):

	### Connections
	parent = models.ForeignKey('tr.Transcription', related_name='fragments')
	token = models.ForeignKey('tr.TranscriptionToken', related_name='fragments')

	### Properties
	date_created = models.DateTimeField(auto_now_add=True)
	is_reconciled = models.BooleanField(default=False)

	# methods
	def data(self, path, permission):
		data = {
			'date_created': str(self.date_created),
			'is_reconciled': str(self.is_reconciled),
		}

		return data

class TranscriptionInstance(models.Model):

	### Connections
	parent = models.ForeignKey('tr.Transcription', related_name='instances')
	fragment = models.OneToOneField('tr.TranscriptionFragment', related_name='transcription')
	token = models.ForeignKey('tr.TranscriptionToken', related_name='transcriptions')
	phrase = models.OneToOneField('tr.PhraseInstance', related_name='transcription')

	### Properties
	date_created = models.DateTimeField(auto_now_add=True)

	# methods
	def data(self, path, permission):
		data = {
			'date_created': str(self.date_created),
			'fragment': self.fragment.id,
			'phrase': self.phrase.data(path, permission),
		}

		return data
