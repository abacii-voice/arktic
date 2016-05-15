# django
from django.db import models

# local
from apps.tr.models.client.project import Project, Batch
from apps.tr.idgen import idgen

### Transcription classes
class Transcription(models.Model):
	'''
	The central object of the system. It is the connection between audio data and text utterances.

	'''

	### Connections
	project = models.ForeignKey(Project, related_name='transcriptions')
	batch = models.ForeignKey(Batch, related_name='transcriptions')

	### Properties
	date_created = models.DateTimeField(auto_now_add=True)
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	original_caption = models.CharField(max_length=255, default='')

	# unique identifier
	filename = models.CharField(max_length=255)

	# requests and flags
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
