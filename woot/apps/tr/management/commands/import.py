# django
from django.core.management.base import BaseCommand, CommandError

# local
from apps.tr.access import access, Permission
from apps.tr.models import Client, Project

# util
import json

### Command: create default user
class Command(BaseCommand):

	def handle(self, *args, **options):
		pass
