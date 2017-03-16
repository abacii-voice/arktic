# django
from django.core.management.base import BaseCommand, CommandError

# local
from apps.tr.access import access, Permission
from apps.tr.models import Client, Project

# util
import os
from os.path import join, exists, isdir, basename
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
		'   Omitting these will display a list of current items under the top level category.',
		'',
		'2. The path will first be checked for duplicates, missing captions, and other errors.',
		'   Import can be cancelled at this point.',
		'',
		'3. Choose to continue to import the selected files.',
		'',
		'4. Possible arguments are: PATH, CLIENT, PROJECT, BATCH and NAME.',
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
			help='Client id',
		)

		# Project
		parser.add_argument('--project',
			action='store',
			dest='project',
			default='',
			help='Project id',
		)

		# Batch
		parser.add_argument('--batch',
			action='store',
			dest='batch',
			default='',
			help='Batch id',
		)

		# Name
		parser.add_argument('--name',
			action='store',
			dest='name',
			default='',
			help='Name the upload',
		)

	def handle(self, *args, **options):

		# args
		path = options['path']

		if path and exists(path) and isdir(path):
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

			table_data = [['Relfile Duplicates', 'No Caption', 'Audio Duplicates', 'No Audio']]
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

				# get or create client
				# get or create project
				# get or create batch
				# create upload

				self.stdout.write('Uploading...')
			else:
				self.stdout.write('Cancelled upload.')
		else:
			self.stdout.write('Please enter a valid PATH to search.\n - Must be a directory.\n - Must exist.')
