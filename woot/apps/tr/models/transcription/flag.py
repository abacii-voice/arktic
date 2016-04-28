# django
from django.db import models

# local
from apps.tr.models.transcription.caption import Caption

### Flag classes
class Flag(models.Model):

	### Properties
	name = models.CharField(max_length=255)

class FlagInstance(models.Model):

	### Connections
	parent = models.ForeignKey(Flag, related_name='instances')
	caption = models.ForeignKey(Caption, related_name='flags')
