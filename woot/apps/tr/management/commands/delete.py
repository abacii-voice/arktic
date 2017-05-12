# django
from django.db import transaction
from django.core.files import File
from django.core.management.base import BaseCommand, CommandError

# local
from apps.tr.access import access, Permission
from apps.tr.models import Client, Project, Batch, Upload
from util import isValidUUID

# util
import os
import sys
from os.path import join, exists, isdir, basename, split
import json
from terminaltables import AsciiTable
import argparse
from argparse import RawTextHelpFormatter

class Command(BaseCommand):

	help = '\n'.join([
		'DELETE: deletes a client, project, batch, or upload.',
		'',
		'Deletes the lowest level object it can find, in the order Client > Project > Batch > Upload'
		'Example commands: ',
		'dm delete --client=Client1 --project=Project1 --Batch=Batch1',
		'dm delete --project=123123123-2349823948-2348234n20342-234',
	])

	def create_parser(self, *args, **kwargs):
		parser = super(Command, self).create_parser(*args, **kwargs)
		parser.formatter_class = RawTextHelpFormatter
		return parser

	def add_arguments(self, parser):
		# Client
		parser.add_argument('--client',
			action='store',
			dest='client',
			default='',
			help='Client id or name of new contract client',
		)

		# Project
		parser.add_argument('--project',
			action='store',
			dest='project',
			default='',
			help='Project id or name of new project',
		)

		# Batch
		parser.add_argument('--batch',
			action='store',
			dest='batch',
			default='',
			help='Batch id or name of new batch',
		)

		# Name
		parser.add_argument('--upload',
			action='store',
			dest='upload',
			default='',
			help='Upload id or name',
		)

	def get_object_or_none(manager, id_or_name):
		if isValidUUID(id_or_name) and manager.filter(id=id_or_name).exists():
			return manager.get(id=id_or_name)
		elif manager.filter(name=id_or_name).exists():
			return manager.filter(name=id_or_name)
		else:
			return None

	def handle(self, *args, **options):

		# args
		client_id_or_name = options['client']
		project_id_or_name = options['project']
		batch_id_or_name = options['batch']
		upload_id_or_name = options['upload']

		# variables
		client = get_object_or_none(Client.objects, client_id_or_name)
		project = get_object_or_none(client.contract_projects if client is not None else Project.objects, project_id_or_name)
		batch = get_object_or_none(project.batches if project is not None else Batch.objects)
		upload = get_object_or_none(batch.uploads if batch is not None else Upload.objects)

		if upload is not None and (batch is not None or (client is None and project is None and batch is None)):
			self.stdout.write('Removing upload {} > {} > {} > {}: {}'.format(upload.batch.project.contract_client.name, upload.batch.project.name, upload.batch.name, upload.id, upload.name))
			upload.delete()
		elif batch is not None and (project is not None or (project is None and client is None)):
			self.stdout.write('Removing batch {} > {} > {}: {}'.format(batch.project.contract_client.name, batch.project.name, batch.id, batch.name))
			batch.delete()
		elif project is not None:
			self.stdout.write('Removing project {} > {}: {}'.format(project.contract_client.name, project.id, project.name))
			project.delete()
		elif client is not None:
			self.stdout.write('Removing client {}: {}'.format(client.id, client.name))
			client.delete()