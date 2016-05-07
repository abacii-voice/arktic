# django
from django.test import TestCase
from django.core.files import File

# local
from apps.users.models import User
from apps.tr.models.client.client import Client
from apps.tr.models.client.project import Project, Batch, Upload, Fragment
from apps.tr.models.role.action import Action
from apps.tr.models.role.role import Role, Threshold
from apps.tr.models.role.stat import Stat, StatInstance
from apps.tr.models.check.check import QualityCheck, QualityCheckInstance
from apps.tr.models.transcription.caption import Caption
from apps.tr.models.transcription.dictionary import Dictionary, UserDictionary
from apps.tr.models.transcription.flag import Flag, FlagInstance
from apps.tr.models.transcription.grammar import Grammar
from apps.tr.models.transcription.moderation import Moderation
from apps.tr.models.transcription.rule import Rule, RuleInstance
from apps.tr.models.transcription.token import Token, TokenInstance
from apps.tr.models.transcription.transcription import Transcription
from apps.tr.models.transcription.utterance import Utterance

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
		worker = production_client.add_worker(user1, moderator)

		worker.add_threshold(project)

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
		token = dictionary.tokens.create(content='test_token')
		token_instance = token.instances.create(caption=caption)

		# flag, flagInstance
		flag = Flag.objects.create(name='unsure')
		flag_instance = flag.instances.create(caption=caption)

		# moderation
		moderation = moderator.moderations.create(caption=caption)

		# rule
		rule = project.rules.create(client=contract_client, name='Capital Letters', description='Use only lower case letters.')
		rule_instance = rule.instances.create(caption=caption, role=moderator)

	def test_context(self):
		production_client = Client.objects.get(name='TestProductionClient')
		print(json.dumps(production_client.data(), indent=2, sort_keys=True))

		# contract_client = Client.objects.get(name='TestContractClient')
		# print(json.dumps(contract_client.data(), indent=2, sort_keys=True))
