# django
from django.db import models

# local
from apps.tr.models.role.role import Role

### Cycle objects
class Cycle(models.Model):

	### Connections
	role = models.ForeignKey(Role, related_name='cycles')

	### Properties
	start = models.DateTimeField(auto_now_add=True)
	length = models.PositiveIntegerField(default=7) # a week
	is_active = models.BooleanField(default=True)

	### Methods
	def count(self):
		return sum([day.count for day in self.days.all()])

class Day(models.Model):

	### Connections
	role = models.ForeignKey(Role, related_name='days')
	cycle = models.ForeignKey(Cycle, related_name='days')

	### Properties
	count = models.PositiveIntegerField(default=0)
	is_active = models.BooleanField(default=True)
