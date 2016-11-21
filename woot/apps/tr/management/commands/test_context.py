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
		# path = 'clients.ef10b3e8-d1b4-4f0b-bc42-2e7688088aee.projects.6bd2a2b4-4799-4a39-b1b9-15114c4460eb.dictionary.tokens'
		path = 'user.clients.30911184-da94-443f-bc7a-a580725c1fdd.roles.551a3ccf-8eb2-49b2-abd5-ef1f0d821880.active_transcription_token.fragments'
		# path = 'clients'

		# request data using path
		permission = Permission(user, role=role)

		data = access(path, permission, fltr)
		print(json.dumps(data, indent=2, sort_keys=True))
