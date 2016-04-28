# django
from django.db import models

# local
from apps.tr.models.transcription.caption import Caption

### Correction classes
class QualityTest(models.Model):

	### Properties
	name = models.CharField(max_length=255)
	is_automatic = models.BooleanField(default=True)

class QualityTestInstance(models.Model):

	### Connections
	parent = models.ForeignKey(AutomaticQualityTest, related_name='instances')
	caption = models.ForeignKey(Caption, related_name='automatic_tests')

	### Properties
	is_successful = models.BooleanField(default=True)
	date_created = models.DateTimeField(auto_now_add=True)
