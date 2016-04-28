# django
from django.db import models

# local
from apps.tr.models.transcription.dictionary import Dictionary, UserDictionary
from apps.tr.models.transcription.caption import Caption

### Token classes
class Token(models.Model):

	### Connections
	dictionary = models.ForeignKey(Dictionary, related_name='tokens')
	user_dictionary = models.ForeignKey(UserDictionary, related_name='tokens', null=True) # for exclusion purposes

	### Properties
	is_tag = models.BooleanField(default=False)
	content = models.CharField(max_length=255)

class TokenInstance(models.Model):

	### Connections
	parent = models.ForeignKey(Token, related_name='instances')
	caption = models.ForeignKey(Caption, related_name='tokens')

	### Properties
	index = models.IntegerField(default=0)
