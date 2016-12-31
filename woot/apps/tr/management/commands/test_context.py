# django
from django.core.management.base import BaseCommand, CommandError

# local
from apps.tr.models.client import Client
from apps.tr.access import access, Permission
from apps.users.models import User
from apps.tr.models.transcription.phrase import Phrase

# util
import json

### Command: create default user
class Command(BaseCommand):

	def handle(self, *args, **options):

		# user
		user = User.objects.get(email='n@a.com')

		# path and role
		role = user.roles.get(client__name__contains='Production', type='worker')

		client = Client.objects.get(name__contains='Production')
		project = client.production_projects.get()

		fltr = {}
		# path = 'clients.{client}.projects.{project}.transcriptions'.format(client=client.id, project=project.id)
		# fltr = {'tokens': {'content__startswith': 'p'}}
		# path = 'clients.ccdf3456-57ad-43be-8e18-7dd328b251ae.projects.a41ce6b6-d9fa-4ab7-892b-2b629b8e48ac.dictionary.phrases'
		path = 'user.clients.ccdf3456-57ad-43be-8e18-7dd328b251ae.roles.7ecdc5d5-502d-4258-af5c-e5a6ef9e10fb.active_transcription_token.fragments'
		# path = 'clients'

		# request data using path
		permission = Permission(user, role=role)

		data = access(path, permission, fltr)
		print(json.dumps(data, indent=2, sort_keys=True))
