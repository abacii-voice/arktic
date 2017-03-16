# django
from django.db import transaction
from django.core.files import File
from django.core.management.base import BaseCommand, CommandError

# local
from apps.tr.access import access, Permission
from apps.tr.models import Client, Project, Utterance
from util import isValidUUID

# util
import os
import sys
from os.path import join, exists, isdir, basename, split
import json
from terminaltables import AsciiTable
import argparse
from argparse import RawTextHelpFormatter

### Command: create default user
# class CustomCommand(BaseCommand):

class Command(BaseCommand):

	help = '\n'.join([
		'IMPORT: imports audio files and relfiles from a specified path.',
		'',
		'1. To import; client, project, and batch ids must be provided, along with a name.',
		'   If the name is omitted, the name of the folder will be used.',
		'',
		'2. The path will first be checked for duplicates, missing captions, and other errors.',
		'   Import can be cancelled at this point.',
		'',
		'3. Choose to continue to import the selected files.',
		'',
		'A header line is expected in every relfile.'
	])

	def create_parser(self, *args, **kwargs):
		parser = super(Command, self).create_parser(*args, **kwargs)
		parser.formatter_class = RawTextHelpFormatter
		return parser

	def add_arguments(self, parser):
		# Path
		parser.add_argument('--path',
			action='store',
			dest='path',
			default='',
			help='Import path (Can only be a directory)',
		)

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

		# Grammar
		parser.add_argument('--grammar',
			action='store',
			dest='grammar',
			default='',
			help='Grammar id or name of new grammar',
		)

		# Batch
		parser.add_argument('--batch',
			action='store',
			dest='batch',
			default='',
			help='Batch id or name of new batch',
		)

		# Name
		parser.add_argument('--name',
			action='store',
			dest='name',
			default='',
			help='Name of the upload (Name of folder if omitted)',
		)

		# Production Client
		parser.add_argument('--production-client',
			action='store',
			dest='production_client',
			default='Abacii',
			help='Client id or name of the production client',
		)

	def route_input(self, data_type, manager, value, kwargs={}):
		obj = None
		created = False
		if value:
			if isValidUUID(value) and manager.filter(id=value).exists():
				obj = manager.get(id=value)
			elif manager.filter(name=value).exists():
				obj = manager.get(name=value)
			else:
				continue_creating = input('Creating {} {}, continue (y/n)? '.format(data_type, value))
				if continue_creating == 'y':
					kwargs['name'] = value
					obj = manager.create(**kwargs)
					created = True
				else:
					self.stdout.write('Cancelled import.')
					sys.exit(0)
		else:
			self.stdout.write('Please enter a valid {} name or id.'.format(data_type))
			sys.exit(0)

		return obj, created

	def handle(self, *args, **options):

		# args
		path = options['path']
		client_id_or_name = options['client']
		project_id_or_name = options['project']
		grammar_id_or_name = options['grammar']
		batch_id_or_name = options['batch']
		name = options['name']
		production_client_id_or_name = options['production_client']

		if path and exists(path) and isdir(path):
			# variables
			production_client, production_client_created = self.route_input('production client', Client.objects, production_client_id_or_name, {'is_production': True})
			client, client_created = self.route_input('client', Client.objects, client_id_or_name, {'is_production': False})
			production_client.contract_clients.add(client)
			project, project_created = self.route_input('project', client.contract_projects, project_id_or_name, {'description': '', 'production_client': production_client})
			grammar, grammar_created = self.route_input('grammar', client.grammars, grammar_id_or_name)
			dictionary, dictionary_created = grammar.dictionaries.get_or_create(project=project)
			batch, batch_created = self.route_input('batch', project.batches, batch_id_or_name, {'description': ''})
			upload_name = name if name else split(path)[1] # uses name of folder if blank
			upload, upload_created = self.route_input('upload', batch.uploads, upload_name)

			# 1. using path specified, walk directory and get relfile(s) and audio files
			all_files = []
			for directory, subs, files in os.walk(path):
				all_files.extend([join(directory, f) for f in files])

			# 2. Open each relfile and add lines to registry
			registry = {}
			relfile_duplicates = []
			for relfile in filter(lambda f: '.csv' in f, all_files):
				with open(relfile) as open_relfile:
					lines = open_relfile.readlines()
					for line in lines[1:]: # omit header
						filename, caption = tuple(line.strip().split(','))
						filename = basename(filename)
						if filename in registry and filename not in relfile_duplicates:
							relfile_duplicates.append(filename)
						else:
							registry[filename] = {
								'caption': caption,
							}

			# 3. For each entry, find the corresponding audio file
			audio_registry = {}
			no_caption = []
			audio_duplicates = []
			for audio in filter(lambda f: '.wav' in f, all_files):
				filename = basename(audio)
				if filename in registry:
					if filename in audio_registry and filename not in audio_duplicates:
						audio_duplicates.append(filename)
					else:
						audio_registry[filename] = registry[filename]
						audio_registry[filename]['path'] = audio
				else:
					no_caption.append(filename)

			no_audio = []
			for filename in registry.keys():
				if filename not in audio_registry:
					no_audio.append(filename)

			# 4. Make lists:
				# a. Duplicate audio file names
				# b. Duplicate relfile entries
				# c. Audio files with no corresponding relfile lines
				# d. Relfile lines with no corresponding audio file

			table_data = [['Relfile Duplicates', 'No Relfile Entry', 'Audio Duplicates', 'No Audio']]
			for i in range(max([len(relfile_duplicates), len(no_caption), len(audio_duplicates), len(no_audio)])):
				table_data.append([
					relfile_duplicates[i] if i < len(relfile_duplicates) else '',
					no_caption[i] if i < len(no_caption) else '',
					audio_duplicates[i] if i < len(audio_duplicates) else '',
					no_audio[i] if i < len(no_audio) else '',
				])

			table = AsciiTable(table_data)

			# 5. display lists in an orderly manner and prompt to continue (ignoring problems), or exit.
			self.stdout.write('\n{} correctly matched audio files\n\n'.format(len(audio_registry.keys())))

			continue_upload = 'n'
			if relfile_duplicates or no_caption or audio_duplicates:
				self.stdout.write('Errors: \n\n')
				self.stdout.write(table.table)
				continue_upload = input('\nContinue despite errors (y/n)? ')
			else:
				continue_upload = input('Continue (y/n)? ')

			# 6. If continue, import the files.
			if continue_upload == 'y':
				with transaction.atomic():
					length = len(audio_registry.keys())
					for i, (filename, data) in enumerate(audio_registry.items()):
						self.stdout.write('\rImporting {}/{}: {} => {}'.format(i+1, length, filename, data['caption']), ending='\033[K' if i < length - 1 else '\033[K\n')
						fragment = upload.fragments.create(filename=data['path'])
						phrase, phrase_created = dictionary.create_phrase(content=data['caption'])
						transcription = batch.transcriptions.create(project=project, grammar=grammar, filename=fragment.filename, content=phrase)

						with open(data['path'], 'rb') as audio_origin:
							utterance = Utterance.objects.create(transcription=transcription, file=File(audio_origin), original_filename=data['path'])



			else:
				self.stdout.write('Cancelled import.')
		else:
			self.stdout.write('Please enter a valid PATH to search.\n - Must be a directory.\n - Must exist.')
