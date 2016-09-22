# django
from django.core.management.base import BaseCommand, CommandError
from django.core.files import File

# local
from apps.tr.models.client.client import Client
from apps.users.models import User
from apps.tr.models.transcription.utterance import Utterance

# util
import os

### Command: create default user
class Command(BaseCommand):

	def handle(self, *args, **options):

		### CLIENTS, USERS, ROLES

		# create clients
		production_client, production_client_created = Client.objects.get_or_create(name='TestProductionClient', is_production=True)
		contract_client, contract_client_created = Client.objects.get_or_create(name='TestContractClient', is_production=False)

		# create user
		user, user_created = User.objects.get_or_create(email='n@a.com', first_name='Nicholas', last_name='Piano')
		user.set_password('mach')

		# create roles
		production_admin_role = production_client.add_admin(user)
		production_admin_role.status = 'enabled'
		production_admin_role.save()

		contract_admin_role = contract_client.add_admin(user)
		contract_admin_role.status = 'enabled'
		contract_admin_role.save()

		moderator_role = production_client.add_moderator(user)
		moderator_role.status = 'enabled'
		moderator_role.save()

		worker_role = production_client.add_worker(user, moderator_role)
		worker_role.status = 'enabled'
		worker_role.save()

		# save
		user.save()

		# second user
		user2, user2_created = User.objects.get_or_create(email='s@a.com', first_name='StJohn', last_name='Piano')
		user2.set_password('mach')

		# create roles
		worker_role2 = production_client.add_worker(user2, moderator_role)
		worker_role2.status = 'enabled'
		worker_role2.save()

		# save
		user2.save()

		### UPLOADS AND TRANSCRIPTIONS

		# basic upload
		project = production_client.production_projects.create(name='TestProject', contract_client=contract_client)
		batch = project.batches.create(name='TestBatch')
		upload = batch.uploads.create(archive_name='test_archive.zip', relfile_name='test_relfile.csv')

		dictionary = project.dictionaries.create(name='test_dictionary')
		user_dictionary = dictionary.children.create(role=worker_role)
		user_dictionary2 = dictionary.children.create(role=worker_role2)

		worker_role.project = project
		worker_role.save()
		worker_role2.project = project
		worker_role2.save()

		# fragment list
		base = '/Users/nicholaspiano/code/abacii-voice/arktic/test/selectedAudioFiles/'
		fragment_list = [f for f in os.listdir(base) if ('.DS' not in f and not os.path.isdir(os.path.join(base, f)))]

		for file_name in fragment_list:
			# 1. create fragment
			fragment = upload.fragments.create(filename=os.path.join(base, file_name))

			# 2. create transcription
			transcription = batch.transcriptions.create(project=project, filename=fragment.filename)

			# 3. create utterance
			with open(os.path.join(base, file_name), 'rb') as destination:
				# create new utterance using open file
				utterance = Utterance.objects.create(transcription=transcription, file=File(destination))

		# dictionary data
		dictionary = project.dictionaries.create()
		user_dictionary = worker_role.dictionaries.create(parent=dictionary)
		
