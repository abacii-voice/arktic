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

		# superadmin
		superadmin = Superadmin.objects.create(email='superadmin@test.com', first_name='superadmin_first', last_name='superadmin_last')
		superadmin.set_password('superadmin_password')

		# superadmin surrogate user
		# superadmin_surrogate_user = 

		# admin
		admin = Admin.objects.create(client=client, email='admin@test.com', first_name='admin_first', last_name='admin_last')
		admin.set_password('admin_password')

		# moderator
		moderator = Moderator.objects.create(client=client, email='moderator@test.com', first_name='moderator_first', last_name='moderator_last')
		moderator.set_password('moderator_password')

		# user
		user = User.objects.create(client=client, user_moderator=moderator, email='user@test.com', first_name='user_first', last_name='user_last')
		user.set_password('user_password')

	def test_basic_user_relationships(self):
		# get
		client = Client.objects.get(name='test_client')
		superadmin = Superadmin.objects.get(email='superadmin@test.com')
		admin = Admin.objects.get(email='admin@test.com')
		moderator = Moderator.objects.get(email='moderator@test.com')
		user = User.objects.get(email='user@test.com')

		# test OneToOneField relationship
		self.assertEqual(superadmin.email, superadmin.base.email) # can access parent class object via OneToOneField
		self.assertEqual(admin.email, admin.base.email)
		self.assertEqual(moderator.email, moderator.base.email)
		self.assertEqual(user.email, user.base.email)

		# test surrogates
