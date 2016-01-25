# django
from django.test import TestCase

# local
from apps.client.models.client import Client
from apps.users.models.admin import Admin
from apps.users.models.moderator import Moderator
from apps.users.models.user import User

# Create your tests here.
class BasicUserTestCase(TestCase):
	def setup(self):
		client = Client.objects.create(name='test_client', is_production=True)
		admin = Admin.objects.create(client=client, email='admin@test.com', first_name='admin_first', last_name='admin_last')

	def test_basic_user_relationships(self):
		pass
