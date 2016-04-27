# django
from django.db import models

# local
from apps.tr.models.caption import Caption

### Correction classes
class AutomaticQualityTest(models.Model):

	### Properties
	name = models.CharField(max_length=255)

class AutomaticQualityTestInstance(models.Model):

	### Connections
	parent = models.ForeignKey(AutomaticQualityTest, related_name='instances')
	caption = models.ForeignKey(Caption, related_name='corrections')

	### Properties
	is_successful = models.BooleanField(default=True)
	date_created = models.DateTimeField(auto_now_add=True)
