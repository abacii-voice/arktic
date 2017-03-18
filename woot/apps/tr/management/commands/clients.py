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
		cmd = self

		# add global client filter
		parser.add_argument('--client',
			action='store',
			dest='client_id_or_name',
			default='',
			help='Client name or id.',
		)

		# subparser
		class SubParser(CommandParser):
			def __init__(self, **kwargs):
				super(SubParser, self).__init__(cmd, **kwargs)

		subparsers = parser.add_subparsers(title='commands', parser_class=SubParser, dest='command')

		# add
		add_parser = subparsers.add_parser('add')
		add_parser.add_argument('--name',
			action='store',
			dest='client_name',
			default='',
			help='Client name to add.',
		)

	def handle(self, *args, **options):

		# vars
		production_client = Client.objects.get(name='Abacii')

		if options['command'] == 'add':
			client_name = options['client_name']
			if client_name and not Client.objects.filter(name=client_name).exists():
				client = Client.objects.create()

		else:
			# just list the clients, maybe with a filter
