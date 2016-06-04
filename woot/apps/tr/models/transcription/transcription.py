# django
from django.db import models

# local
from apps.tr.models.client.project import Project, Batch
from apps.tr.models.role.role import Role
from apps.tr.idgen import idgen

### Transcription classes
class TranscriptionToken(models.Model):

	'''

	A token keeps track of the transcription objects that have been requested by a user. It has a limit and will deactivate after that limit.

	'''


	### Connections
	project = models.ForeignKey(Project, related_name='transcription_tokens')
	role = models.ForeignKey(Role, related_name='transcription_tokens')

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
				'id': self.id,
				'date_created': str(self.date_created),
			})

		return data


class Transcription(models.Model):
	'''
	The central object of the system. It is the connection between audio utterances and text captions.

	'''

	### Connections
	project = models.ForeignKey(Project, related_name='transcriptions')
	batch = models.ForeignKey(Batch, related_name='transcriptions')
	token = models.ForeignKey(TranscriptionToken, related_name='transcriptions', null=True)

	### Properties
	date_created = models.DateTimeField(auto_now_add=True)
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	original_caption = models.CharField(max_length=255, default='')

	# unique identifier
	filename = models.CharField(max_length=255)

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
				'date_created': str(self.date_created),
				'original_caption': self.original_caption,
				'filename': self.filename,
				'requests': str(self.requests),
				'request_allowance': str(self.request_allowance),
				'date_last_requested': str(self.date_last_requested),
				'utterance': self.utterance.data(),
			})

		if path.check('captions'):
			data.update({
				'captions': {caption.id: caption.data(path.down('captions'), permission) for caption in self.captions.filter(id__startswith=path.get_id())},
			})

		return data
