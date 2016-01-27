# django
from django.db import models

# local
from apps.tr.models.utterance import Utterance
from apps.users.models.roles import Worker
from apps.tr.models.rule import Rule

### Overwatch classes
class Overwatch(models.Model):

	### Connections
	utterance = models.ForeignKey(Utterance, related_name='overwatches')
	worker = models.ForeignKey(Worker, related_name='overwatches')
	rules_cited = models.ManyToManyField(Rule, related_name='overwatches')

	### Properties
	score = models.BooleanField(default=True)
	reason = models.TextField()
