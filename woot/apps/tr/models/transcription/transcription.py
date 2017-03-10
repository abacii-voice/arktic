# django
from django.db import models

# local
from apps.tr.idgen import idgen
from datetime import datetime

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
		if self.fragments.count() != self.transcription_limit and self.is_active:
			for i in range(self.transcription_limit):
				transcription = self.project.get_transcription()
				if transcription is not None:
					self.fragments.create(parent=transcription, session=self.role.user.active_session(), index=i)
					transcription.is_available = False
					transcription.save()

			# change projects if no transcriptions have been added
			if self.fragments.count() == 0:
				self.project = self.project.production_client.oldest_active_project()
				self.get_transcriptions()

	def update(self):
		if self.fragments.filter(is_reconciled=True) == self.transcription_limit:
			self.is_active = False
			self.save()

	def data(self, path, permission):
		data = {}
		if permission.check_user(self.role.user):
			data.update({
				'id': str(self.id),
				'date_created': str(self.date_created),
				'transcriptions': {transcription.id: transcription.data(path, permission) for transcription in self.transcriptions.filter(**path.get_filter('transcriptions'))},
				'remaining': self.project.transcriptions.filter(is_available=True).count(),
			})

			if path.check('fragments'):
				data.update({
					'fragments': {fragment.id: fragment.data(path.down('fragments'), permission) for fragment in self.fragments.filter(**path.get_filter('fragments'))},
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
	content = models.ForeignKey('tr.Phrase', related_name='transcriptions')

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
				'requests': str(self.requests),
				'request_allowance': str(self.request_allowance),
				'date_last_requested': str(self.date_last_requested),
			})

		if permission.is_admin:
			data.update({
				'utterance': self.utterance.data(),
				'filename': self.filename,
				'content': self.content.data(path, permission),
			})

		if path.check('fragments') and (permission.is_moderator or permission.is_productionadmin):
			data.update({
				'fragments': {fragment.id: fragment.data(path.down('fragments'), permission) for fragment in self.fragments.filter(**path.get_filter('fragments'))},
			})

		if path.check('instances') and (permission.is_moderator or permission.is_productionadmin):
			data.update({
				'instances': {instance.id: instance.data(path.down('instances'), permission) for instance in self.instances.filter(**path.get_filter('instances'))},
			})

		return data

class TranscriptionFragment(models.Model):

	### Connections
	parent = models.ForeignKey('tr.Transcription', related_name='fragments')
	token = models.ForeignKey('tr.TranscriptionToken', related_name='fragments')
	session = models.ForeignKey('users.Session', related_name='transcription_fragments')

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	index = models.PositiveIntegerField(default=0)
	date_created = models.DateTimeField(auto_now_add=True)
	date_reconciled = models.DateTimeField(auto_now_add=True)
	is_reconciled = models.BooleanField(default=False)
	is_released = models.BooleanField(default=False)
	was_released_by_session = models.BooleanField(default=False)

	# methods
	def data(self, path, permission):
		data = {
			'date_created': str(self.date_created),
			'is_reconciled': str(self.is_reconciled),
			'is_released': str(self.is_reconciled),
			'was_released_by_session': str(self.was_released_by_session),
			'phrase': self.parent.content.data(path, permission),
			'index': str(self.index),
			'parent': self.parent.id,
		}

		return data

	def release(self, by_session=False):
		if not self.is_released:
			self.is_released = True
			self.was_released_by_session = by_session
			self.parent.is_available = True
			self.parent.save()
			self.save()

	def reconcile(self, revision):
		# filter by key to avoid creating another object when the same revision is sent again.
		if self.transcriptions.filter(key=revision['key']).count() == 0:
			# create components
			date_created = datetime.strptime(revision['time'], '%a %b %d %Y %H:%M:%S %Z%z (GMT)')
			phrase, phrase_created = self.parent.project.dictionary.create_phrase(tokens=revision['tokens'])
			phrase_instance = phrase.instances.create(role=self.token.role)

			# get or create transcription
			transcription, transcription_created = self.transcriptions.get_or_create(key=revision['key'], parent=self.parent, token=self.token, date_created=date_created, phrase=phrase_instance)
			if transcription_created:
				for flag_name in revision['flags']:
					transcription.flags.create(parent=self.parent.project.production_client.flags.get(name=flag_name), role=self.token.role)

			# set properties
			self.is_reconciled = revision['isComplete']
			self.parent.is_available = not revision['isComplete']
			self.parent.is_active = not revision['isComplete']
			self.parent.save()
			self.save()

class TranscriptionInstance(models.Model):

	### Connections
	parent = models.ForeignKey('tr.Transcription', related_name='instances')
	fragment = models.ForeignKey('tr.TranscriptionFragment', related_name='transcriptions')
	token = models.ForeignKey('tr.TranscriptionToken', related_name='transcriptions')
	phrase = models.OneToOneField('tr.PhraseInstance', related_name='transcription')

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	key = models.CharField(max_length=8)
	date_created = models.DateTimeField(auto_now_add=True)

	# methods
	def data(self, path, permission):
		data = {
			'date_created': str(self.date_created),
			'fragment': self.fragment.id,
		}

		if True:
			data.update({
				'phrase': self.phrase.data(path, permission),
			})

		if path.check('flags') and (permission.is_moderator or permission.is_productionadmin):
			data.update({
				'flags': {flag.id: flag.data(path.down('flags'), permission) for flag in self.flags.filter(**path.get_filter('flags'))},
			})

		return data
