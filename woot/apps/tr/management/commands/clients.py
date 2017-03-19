# django
from django.db import transaction
from django.core.management.base import BaseCommand, CommandError

# local
from apps.tr.models import Client, Project
from util import isValidUUID

# util
import os
import sys
from terminaltables import AsciiTable
import argparse
from argparse import RawTextHelpFormatter

class Command(BaseCommand):

	help = '\n'.join([
		'',
	])

	def create_parser(self, *args, **kwargs):
		parser = super(Command, self).create_parser(*args, **kwargs)
		parser.formatter_class = RawTextHelpFormatter
		return parser

	def add_arguments(self, parser):

		# add global client filter
		parser.add_argument('--client',
			action='store',
			dest='client',
			default='',
			help='Client name or id.',
		)

	def handle(self, *args, **options):

		# vars
		client_id_or_name = options['client']
		client = None
		if client_id_or_name:
			if isValidUUID(client_id_or_name) and Client.objects.filter(is_production=False, id=client_id_or_name).exists():
				client = Client.objects.get(id=client_id_or_name)
			elif Client.objects.filter(is_production=False, name=client_id_or_name).exists():
				client = Client.objects.get(name=client_id_or_name)
			else:
				self.stdout.write('No such contract client.')
				sys.exit(0)

		# display clients
		self.stdout.write('Clients: \n')
		client_set = [client] if client is not None else Client.objects.filter(is_production=False)

		client_data = [['ID', 'Name', '# Active projects', '# Remaining']]
		for client in client_set:
			client_data.append([
				client.id,
				client.name,
				client.contract_projects.filter(production_client__name='Abacii', is_active=True).count(),
				sum([project.transcriptions_remaining() for project in client.contract_projects.filter(production_client__name='Abacii', is_active=True)]),
			])

		client_table = AsciiTable(client_data)
		self.stdout.write(client_table.table)

		# display projects
		self.stdout.write('\nProjects: \n')
		project_data = [['Client', 'ID', 'Name', '# Batches', '# Total', '# Remaining', '%', '# Workers assigned', 'Worker emails']]
		for client in client_set:
			for i, project in enumerate(client.contract_projects.order_by('-date_created')):
				project_data.append([
					client.name if i==0 else '',
					project.id,
					project.name,
					project.batches.count(),
					project.transcriptions.count(),
					project.transcriptions_remaining(),
					project.completion_percentage(),
					project.assigned.count(),
					', '.join([r.user.email for r in project.assigned.all()]),
				])

		project_table = AsciiTable(project_data)
		self.stdout.write(project_table.table)
