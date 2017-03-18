# django
from django.core.management.base import BaseCommand, CommandError
from django.core.files import File
from django.conf import settings

# local
from apps.tr.models.client.client import Client
from apps.users.models import User

# util
import os
from os.path import join, exists, isdir

### Command: create default user
class Command(BaseCommand):

	def handle(self, *args, **options):

		### CLIENTS, USERS, ROLES

		# create clients
		production_client, production_client_created = Client.objects.get_or_create(name='Abacii', is_production=True)

		# create user
		user, user_created = User.objects.get_or_create(email='n@a.com', first_name='Nicholas', last_name='Piano')
		user.set_password('mach')

		# create roles
		production_admin_role = production_client.add_admin(user)
		moderator_role = production_client.add_moderator(user)
		worker_role = production_client.add_worker(user)

		# save
		user.save()
