# django
from django.core.management.base import BaseCommand, CommandError

# local
from apps.client.models.client import ProductionClient, ContractClient
from apps.users.models.user import User

### Command: create default user
class Command(BaseCommand):

	def handle(self, *args, **options):
		# create clients
		production_client, production_client_created = ProductionClient.objects.get_or_create(name='TestProductionClient')
		contract_client, contract_client_created = ContractClient.objects.get_or_create(name='TestContractClient')

		# details
		user_email = 'n@a.com'
		user_first_name = 'Nicholas'
		user_last_name = 'Piano'
		user_password = 'mach'

		# create user
		user, user_created = User.objects.get_or_create(email=user_email, first_name=user_first_name, last_name=user_last_name)
		user.set_password(user_password)

		# create roles
		production_admin_role = user.create_productionadmin(production_client)
		contract_admin_role = user.create_contractadmin(contract_client)
		moderator_role = user.create_moderator(production_client)
		worker_role = user.create_worker(production_client, moderator_role)

		# save
		user.save()
