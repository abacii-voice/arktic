# django
from django.core.management.base import BaseCommand, CommandError
from django.core.files import File
from django.conf import settings

# local
from apps.tr.models.client.client import Client
from apps.users.models import User
from apps.tr.models.transcription.utterance import Utterance
from apps.tr.models.transcription.dictionary import Dictionary

# util
import os
from os.path import join, exists, isdir

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
		contract_admin_role = contract_client.add_admin(user)
		moderator_role = production_client.add_moderator(user)
		worker_role = production_client.add_worker(user)

		# save
		user.save()

		# second user
		user2, user2_created = User.objects.get_or_create(email='s@a.com', first_name='StJohn', last_name='Piano')
		user2.set_password('mach')

		# create roles
		worker_role2 = production_client.add_worker(user2)

		# save
		user2.save()

		### UPLOADS AND TRANSCRIPTIONS

		# basic upload
		production_client.contract_clients.add(contract_client)
		project = production_client.production_projects.create(name='TestProject', contract_client=contract_client)
		grammar = contract_client.grammars.create(name='TestGrammar')
		batch = project.batches.create(name='TestBatch')
		upload = batch.uploads.create(archive_name='test_archive.zip')

		worker_role.project = project
		worker_role.save()
		worker_role2.project = project
		worker_role2.save()

		# dictionary data
		dictionary = Dictionary.objects.create(project=project, grammar=grammar)

		# create tokens
		dictionary.tokens.create(type='tag', content='unintelligible')
		dictionary.tokens.create(type='tag', content='dtmf')
		dictionary.tokens.create(type='tag', content='noise')
		test_tag = dictionary.tokens.create(type='tag', content='breath-noise')

		# create shortcuts
		test_tag.shortcuts.create(role=worker_role, combo='ctrl+b')

		# flags
		production_client.flags.create(name='unsure')
		test_flag = production_client.flags.create(name='no-speech')
		test_flag.shortcuts.create(role=worker_role, combo='ctrl+n')

		# fragment list
		base = join(settings.SITE_ROOT, 'test/')
		fragment_list = [f for f in os.listdir(join(base, 'selectedAudioFiles')) if ('.DS' not in f and not isdir(join(base, 'selectedAudioFiles', f)))]
		relfile_data = {}
		with open(join(base, 'relfile.csv'), 'r') as open_relfile:
			relfile_data = {line.split(',')[0]:line.split(',')[1].rstrip() for line in list(open_relfile.readlines())[1:]}

		for file_name in fragment_list:
			# 1. create fragment
			fragment = upload.fragments.create(filename=os.path.join(base, file_name))

			# 2. create caption
			content = relfile_data[file_name] if relfile_data[file_name] else ''
			phrase, phrase_created = dictionary.create_phrase(content=content)

			# 2. create transcription
			transcription = batch.transcriptions.create(project=project, grammar=grammar, filename=fragment.filename, content=phrase)

			# 3. create utterance
			with open(os.path.join(base, 'selectedAudioFiles', file_name), 'rb') as destination:
				# create new utterance using open file
				utterance = Utterance.objects.create(transcription=transcription, file=File(destination), original_filename=file_name)
