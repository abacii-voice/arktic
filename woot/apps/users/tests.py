# django
from django.test import TestCase

# local
from apps.client.models.client import ProductionClient, ContractClient
from apps.users.models.user import User
from apps.users.models.roles import Superadmin, Admin, Moderator, Worker

# Create your tests here.
class BasicUserTestCase(TestCase):
	def setUp(self):
		# client
		client = ProductionClient.objects.create(name='test_client')
		client2 = ProductionClient.objects.create(name='test_client2')

		# make user with worker + moderator
		moderator_user = User.objects.create(email='moderator@test.com', first_name='moderator_first', last_name='moderator_last')
		moderator_user_moderator = moderator_user.create_moderator(client)
		moderator_user.create_worker(client, moderator_user_moderator)

		# make user with worker token
		worker_user = User.objects.create(email='worker@test.com', first_name='worker_first', last_name='worker_last')
		worker_user.create_worker(client, moderator_user_moderator)

		# make user with worker + moderator + admin
		admin_user = User.objects.create(email='admin@test.com', first_name='admin_first', last_name='admin_last')
		admin_user_admin = admin_user.create_admin(client)
		admin_user_moderator = admin_user.create_moderator(client)
		admin_user_worker = admin_user.create_worker(client, admin_user_moderator)

		# make user with superadmin, multiple admins, multiple moderators, multiple workers
		superadmin_user = User.objects.create(email='superadmin@test.com', first_name='superadmin_first', last_name='superadmin_last')
		superadmin_user_superadmin = superadmin_user.create_superadmin()
		superadmin_user_admin = superadmin_user.create_admin(client)
		superadmin_user_moderator2 = superadmin_user.create_moderator(client2)
		superadmin_user_moderator = superadmin_user.create_moderator(client)

	def test_basic_user_relationships(self):
		# 1. test creating worker with a moderator from a different client fails
		superadmin_user = User.objects.get(email='superadmin@test.com')
		superadmin_user_superadmin = superadmin_user.users_superadmin_roles.get()
		superadmin_user_admin = superadmin_user.users_admin_roles.get()
		superadmin_user_moderator2 = superadmin_user.users_moderator_roles.get()
		self.assertEqual(superadmin_user.create_worker(superadmin_user_admin.client, superadmin_user_moderator2), None)

		# 2. test only one superadmin created per user
		self.assertEqual(superadmin_user_superadmin, superadmin_user.create_superadmin())

		# 3. test only one worker created per user per client
		worker_user = User.objects.get(email='worker@test.com')
		worker_user_worker = worker_user.users_worker_roles.get()
		self.assertEqual(worker_user_worker, worker_user.create_worker(worker_user_worker.client, worker_user_worker.moderator))
