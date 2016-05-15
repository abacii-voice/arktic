# django
from django.core.management.base import BaseCommand, CommandError

# local
from apps.tr.access import access, Permission, Path
from apps.users.models import User

# util
import json

### Command: create default user
class Command(BaseCommand):

	def handle(self, *args, **options):
		# path
		client_id = '6f56a306-cfa9-4557-bec9-f65bd2de67e0'
		role_type = 'admin'
		original_path = 'clients.23098.sfsdf.23423'

		path = Path(original_path)
		print('clients' in path.locations)
