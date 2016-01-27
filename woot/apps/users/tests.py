# django
from django.test import TestCase

# local
from apps.client.models.client import Client
from apps.users.models.superadmin import Superadmin
from apps.users.models.admin import Admin
from apps.users.models.moderator import Moderator
from apps.users.models.user import User

# Create your tests here.
class BasicUserTestCase(TestCase):
	def setUp(self):
		# client
		client = Client.objects.create(name='test_client', is_production=True)

	def test_basic_user_relationships(self):
		# get
		pass
