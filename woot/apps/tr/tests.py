# django
from django.test import TestCase

# local
from apps.tr.models.client.client import Client
from apps.tr.models.client.project import Project, Batch, Upload, Fragment
from apps.tr.models.role.action import Action
from apps.tr.models.role.role import Role, Threshold
from apps.tr.models.role.stat import Stat, StatInstance
from apps.tr.models.test.test import QualityTest, QualityTestInstance
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
	def setup(self):
		# client
		production_client = Client.objects.create(name='TestProductionClient', is_production=True)
		contract_client = Client.objects.create(name='TestContractClient', is_production=False)

		# project, batch, upload, fragment
		project = production_client.production_projects.create(name='TestProject', contract_client=contract_client)
		batch = project.batches.create(name='TestBatch')

		# action
		# role, threshold
		# stat, statInstance
		# qualityTest, qualityTestInstance
		# caption
		# dictionary, userDictionary
		# flag, flagInstance
		# grammar
		# moderation
		# rule, ruleInstance
		# token, tokenInstance
		# transcription
		# utterance
