# django
from django.core.management.base import BaseCommand, CommandError

# local
from apps.tr.models.client.client import Client
from apps.users.models import User

### Command: create default user
class Command(BaseCommand):

	def handle(self, *args, **options):
		# create clients
		production_client, production_client_created = Client.objects.get_or_create(name='TestProductionClient', is_production=True)
		contract_client, contract_client_created = Client.objects.get_or_create(name='TestContractClient', is_production=False)

		# user details
		user_email = 'n@a.com'
		user_first_name = 'Nicholas'
		user_last_name = 'Piano'
		user_password = 'mach'

		# create user
		user, user_created = User.objects.get_or_create(email=user_email, first_name=user_first_name, last_name=user_last_name)
		user.set_password(user_password)

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

		# 
