
# On Phrases:
# I want Phrases to be another way of storing tokens. Not locked down to a caption.
# That way, users can store phrases that they see a lot.

# On Ghost Units:
# I think the caption units need to be rendered in a very similar manner to searchableList.
# A predetermined number (10) of units will be rendered with nothing in them.
# Then, they can be updated, but never removed.
# Three types:
# 1. Word
# 2. Tag
# 3. Ghost

# Ghost units are dimmed out

# django
from django.db import models

# local
from apps.tr.idgen import idgen

class Phrase(models.Model):
	### Connections
	dictionary = models.ForeignKey('tr.Dictionary', related_name='phrases')

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	content = models.TextField(default='')

	# methods
	def data(self, path, permission):
		data = {

		}

		return data

class PhraseInstance(models.Model):
	### Connections
	parent = models.ForeignKey('tr.Phrase', related_name='instances')
	role = models.ForeignKey('tr.Role', related_name='phrases')

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	date_created = models.DateTimeField(auto_now_add=True)
	metadata = models.TextField(default='')

	# methods
	def data(self, path, permission):
		data = {

		}

		return data

class PhraseBlock(models.Model):
	'''
	Prevents phrase from being displayed to a user.
	Can be imposed by the user and removed by re-entering the phrase, or in the editor.
	'''

	### Connections
	parent = models.ForeignKey('tr.Phrase', related_name='blocks')
	role = models.ForeignKey('tr.Role', related_name='phrase_blocks')

	### Properties
	id = models.CharField(primary_key=True, default=idgen, editable=False, max_length=32)
	date_created = models.DateTimeField(auto_now_add=True)
	date_last_activated = models.DateTimeField(auto_now_add=True)
	is_active = models.BooleanField(default=True)
	metadata = models.TextField(default='')

	# methods
	def data(self, path, permission):
		data = {
			
		}

		return data
