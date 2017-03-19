# django
from django.db import transaction
from django.core.management.base import BaseCommand, CommandError

# local
from apps.tr.models import Client, Project, Batch
from util import isValidUUID

# util
import os
from os import mkdir, makedirs
from os.path import join, exists, isdir
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
		parser.add_argument('--project',
			action='store',
			dest='project',
			default='',
			help='Project name or id. (name needs client)',
		)
		parser.add_argument('--batch',
			action='store',
			dest='batch',
			default='',
			help='Batch name or id. (name needs client and project)',
		)

	def handle(self, *args, **options):

		client_id_or_name = options['client']
		project_id_or_name = options['project']
		batch_id_or_name = options['batch']

		# find batch if specified
		client = None
		project = None
		batch = None
		if batch_id_or_name:
			if project_id_or_name:
				if client_id_or_name:
					if isValidUUID(client_id_or_name) and Client.objects.filter(id=client_id_or_name, is_production=False).exists():
						client = Client.objects.get(id=client_id_or_name)
					elif Client.objects.filter(name=client_id_or_name, is_production=False).exists():
						client = Client.objects.get(name=client_id_or_name, is_production=False)
					else:
						self.stdout.write('No such client.')
						sys.exit(0)

				if isValidUUID(project_id_or_name) and Project.objects.filter(id=project_id_or_name).exists():
					project = Project.objects.get(id=project_id_or_name)
				elif client is not None and client.contract_projects.filter(name=project_id_or_name).exists():
					project = client.contract_projects.get(name=project_id_or_name)
				else:
					self.stdout.write('No such project.')
					sys.exit(0)

			if isValidUUID(batch_id_or_name) and Batch.objects.filter(id=batch_id_or_name).exists():
				batch = Batch.objects.get(id=batch_id_or_name)
			elif project is not None and project.batches.filter(name=batch_id_or_name).exists():
				batch = project.batches.get(name=batch_id_or_name)
			else:
				self.stdout.write('No such batch.')
				sys.exit(0)

		# display list
		project_name = ''
		batch_name = ''
		if batch is not None:
			batch_name = batch.name
			project_name = project.name if project is not None else batch.project.name
			client = client if client is not None else batch.project.contract_client

		client_set = [client] if client is not None else Client.objects.filter(is_production=False)
		self.stdout.write('\nBatches: \n')
		batch_data = [['Client', 'Project', 'ID', 'Name', '# Total', '# Completed', '# Not exported', '%']]
		for client in client_set:
			for i, project in enumerate(client.contract_projects.filter(name__contains=project_name).order_by('-date_created')):
				for j, batch in enumerate(project.batches.filter(name__contains=batch_name).order_by('-date_created')):
					batch_data.append([
						client.name if i==0 else '',
						project.name if j==0 else '',
						batch.id,
						batch.name,
						batch.transcriptions.count(),
						batch.transcriptions_completed(),
						batch.transcriptions_not_exported(),
						batch.completion_percentage(),
					])

		batch_table = AsciiTable(batch_data)
		self.stdout.write(batch_table.table)

		# prompt for export
		if batch_id_or_name:
			self.stdout.write('\nThis batch has: \n')
			self.stdout.write('[y or blank] {} completed transcriptions that have not been exported.'.format(batch.transcriptions_not_exported()))
			self.stdout.write('[force] {} completed transcriptions in total.'.format(batch.transcriptions_completed()))

			choice = input('Do you want to continue with the export (y/n/force)? ')
			if choice in ['y', '', 'force']:
				force = choice == 'force'
				filename, number_of_transcriptions = batch.export(force=force)
				self.stdout.write('Exported {} transcriptions to {}'.format(number_of_transcriptions, filename))
				sys.exit(0)

			else:
				self.stdout.write('Cancelling export.')
				sys.exit(0)
