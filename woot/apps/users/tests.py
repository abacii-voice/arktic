# django
from django.test import TestCase

# local
from apps.client.models.client import Client
from apps.users.models.user import User

# util
import json

# Create your tests here.
class BasicUserTestCase(TestCase):
	def setUp(self):
		### CLIENTS
		production_client = Client.objects.create(name='test_production_client', is_production=True)
		contract_client = Client.objects.create(name='test_contract_client', is_contract=True)

		### USERS
		# moderator
		moderator_user = User.objects.create(email='moderator@production_client.com', first_name='moderator_user_first_name', last_name='moderator_user_last_name')
		moderator_user.create_moderator(production_client)

		# contract admin
		contractadmin_user = User.objects.create(email='admin@contract_client.com', first_name='contractadmin_user_first_name', last_name='contractadmin_user_last_name')
		contractadmin_user.create_contractadmin(contract_client)

		# production admin
		productionadmin_user = User.objects.create(email='admin@production_client.com', first_name='productionadmin_user_first_name', last_name='productionadmin_user_last_name')
		productionadmin_user.create_productionadmin(production_client)
		productionadmin_user.create_worker(production_client, moderator_user.roles.get(type='moderator'))

		# worker
		worker_user = User.objects.create(email='worker@production_client.com', first_name='worker_user_first_name', last_name='worker_user_last_name')
		worker_user.create_worker(production_client, moderator_user.roles.get(type='moderator'))

	def test_basic_user(self):
		### GET DATA
		production_client = Client.objects.get(name='test_production_client')
		moderator_user = User.objects.get(email='moderator@production_client.com')
		productionadmin_user = User.objects.get(email='admin@production_client.com')

		### TESTS
		print(json.dumps(moderator_user.client_data(moderator_user.get_permission(production_client.name, role_type='moderator')), indent=2, sort_keys=True))
		print(json.dumps(productionadmin_user.client_data(productionadmin_user.get_permission(production_client.name, role_type='productionadmin')), indent=2, sort_keys=True))
