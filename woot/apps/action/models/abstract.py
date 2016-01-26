# django
from django.db import models

# local

### Action classes
class AbstractAction(models.Model):
	class Meta():
		abstract = True

	### Properties
	name = models.CharField(max_length=255)
	date_created = models.DateTimeField(auto_now_add=True)
