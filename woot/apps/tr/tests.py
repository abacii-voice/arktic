# django
from django.test import TestCase
from django.core.files import File

# local
from apps.users.models import User
from apps.tr.models.client.client import Client
from apps.tr.models.transcription.utterance import Utterance
from apps.tr.access import Permission, access

# util
import json

# Create your tests here.
class ContextTestCase(TestCase):
	def setUp(self):
		# client
		production_client = Client.objects.create(name='TestProductionClient', is_production=True)
		contract_client = Client.objects.create(name='TestContractClient', is_production=False)

		# project, batch, upload, fragment
		project = production_client.production_projects.create(name='TestProject', contract_client=contract_client)
		batch = project.batches.create(name='TestBatch')
		upload = batch.uploads.create(archive_name='test_archive.zip', relfile_name='test_relfile.csv')
		fragment = upload.fragments.create(filename='test_fragment.wav')

		# role, threshold
		user1 = User.objects.create(email='1@1.com', first_name='first_name_1', last_name='last_name_1')
		user2 = User.objects.create(email='2@2.com', first_name='first_name_2', last_name='last_name_2')

		production_admin = production_client.add_admin(user1)

		moderator = production_client.add_moderator(user1)
		moderator.project = project
		moderator.save()

		worker = production_client.add_worker(user1, moderator)
		worker.add_threshold(project)
		worker.project = project
		worker.save()

		# dictionary, userDictionary
		dictionary = project.dictionaries.create(name='test_dictionary')
		user_dictionary = dictionary.children.create(role=worker)

		# transcription
		transcription = batch.transcriptions.create(project=project, filename=fragment.filename)

		# utterance
		file_name = '/Users/nicholaspiano/code/abacii-voice/arktic/test/selectedAudioFiles/20150806082036x10317.wav'
		with open(file_name, 'rb') as destination:
			# create new utterance using open file
			utterance = Utterance.objects.create(
				transcription=transcription,
				file=File(destination),
			)

			transcription.utterance = utterance
			transcription.save()

		# caption
		caption = worker.captions.create(transcription=transcription)

		# token, tokenInstance
		for i, t in enumerate(['qwe', 'qweqwrl', 'eroii', 'weori', 'powe', 'bsbdw']):
			token = dictionary.tokens.create(content=t)
			token_instance = token.instances.create(caption=caption, index=i)

		# flag, flagInstance
		flag = contract_client.flags.create(name='unsure')
		flag_instance = flag.instances.create(caption=caption)

		# moderation
		moderation = moderator.moderations.create(project=project, caption=caption)

		# quality
		quality_check = production_client.checks.create(name='automatic_capital_check')
		quality_check_instance = quality_check.instances.create(caption=caption)

		# rule
		rule = project.rules.create(client=production_client, name='Capital Letters', description='Use only lower case letters.')
		rule_instance = rule.instances.create(caption=caption, role=moderator)

	def test_context(self):
		# path
		client_id = Client.objects.get(name='TestProductionClient').id
		project_id = Client.objects.get(name='TestProductionClient').production_projects.get().id
		dictionary_id = Client.objects.get(name='TestProductionClient').production_projects.get().dictionaries.get().id
		path = 'clients.{client_id}.production_projects.{project_id}.moderations'.format(client_id=client_id, project_id=project_id, dictionary_id=dictionary_id)
		# path = 'user'
		# path = ''

		# request data using path
		user = User.objects.get(email='1@1.com')
		permission = Permission(user, user.get_role(client_id, 'admin'))

		test_fltr = {'token__id': user.get_role(client_id, 'moderator').active_moderation_token().id}
		data = access(path, permission, fltr=test_fltr)
		print(json.dumps(data, indent=2, sort_keys=True))
