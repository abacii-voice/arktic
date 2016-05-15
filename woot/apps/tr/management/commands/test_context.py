# django
from django.core.management.base import BaseCommand, CommandError

# local
from apps.tr.access import access, Permission
from apps.users.models import User

# util
import json

### Command: create default user
class Command(BaseCommand):

	def handle(self, *args, **options):
		# path
		client_id = '6f56a306-cfa9-4557-bec9-f65bd2de67e0'
		role_type = 'admin'
		path = 'clients'

		# request data using path
		user = User.objects.get(email='n@a.com')
		permission = Permission(user, role=user.get_role(client_id, role_type))

		data = access(path, permission)
		print(json.dumps(data, indent=2, sort_keys=True))
