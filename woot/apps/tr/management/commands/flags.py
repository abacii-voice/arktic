# django
from django.core.management.base import BaseCommand, CommandError, CommandParser

# local
from util import isValidUUID
from apps.tr.models import Client, Flag

# util
import sys
from terminaltables import AsciiTable
import argparse
from argparse import RawTextHelpFormatter

class Command(BaseCommand):

	help = '\n'.join([
		'FLAGS: Add, list, or disable flags to be used with for a client',
		'',
		'Example commands: ',
		'List: dm flags --client=Client1 --is_enabled=True',
		'Add: dm flags add --client=Client1 --name=FlagName --description="flag description"',
		'Disable: dm flags --flag=flag_id --enable=False',
		'Disable: dm flags --client=Client1 --flag=FlagName --enable=False',
	])

	def create_parser(self, *args, **kwargs):
		parser = super(Command, self).create_parser(*args, **kwargs)
		parser.formatter_class = RawTextHelpFormatter
		return parser

	def add_arguments(self, parser):
		cmd = self

		# general
		parser.add_argument('--flag',
			action='store',
			dest='flag_id_or_name',
			default='',
			help='Name or id of a single flag.',
		)
		parser.add_argument('--client',
			action='store',
			dest='client_id_or_name',
			default='',
			help='Name or id of client used to filter flags.',
		)
		parser.add_argument('--enable',
			action='store_true',
			dest='enable',
			default=True,
			help='Enable or disable a flag.',
		)
		parser.add_argument('--is_enabled',
			action='store',
			dest='is_enabled',
			default='',
			help='Filter by enabled or disabled flags.',
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
			dest='name',
			default='',
			help='Name of new flag.',
		)
		add_parser.add_argument('--description',
			action='store',
			dest='description',
			default='',
			help='A short description.',
		)
		add_parser.add_argument('--client',
			action='store',
			dest='client_id_or_name',
			default='',
			help='Name or id of client.',
		)

	def handle(self, *args, **options):
		if options['command'] == 'add':
			# vars
			flag_name = options['name']
			flag_description = options['description']
			client_id_or_name = options['client_id_or_name']

			# client
			client = None
			if isValidUUID(client_id_or_name) and Client.objects.filter(id=client_id_or_name, is_production=False).exists():
				client = Client.objects.get(id=client_id_or_name)
			elif Client.objects.filter(name=client_id_or_name, is_production=False).exists():
				client = Client.objects.get(name=client_id_or_name, is_production=False)
			else:
				self.stdout.write('No such client.')
				sys.exit(0)

			# create flag
			flag, flag_created = client.flags.get_or_create(name=flag_name, description=flag_description)
			if flag_created:
				self.stdout.write('Creating flag [{}] for {}'.format(flag.name, client.name))
			else:
				self.stdout.write('Flag [{}] already exists for {}:{}'.format(flag.name, client.name))

		else:
			flag_id_or_name = options['flag_id_or_name']
			client_id_or_name = options['client_id_or_name']
			enable = options['enable']
			filter_enabled = options['is_enabled']

			# client
			client = None
			if isValidUUID(client_id_or_name) and Client.objects.filter(id=client_id_or_name, is_production=False).exists():
				client = Client.objects.get(id=client_id_or_name)
			elif Client.objects.filter(name=client_id_or_name, is_production=False).exists():
				client = Client.objects.get(name=client_id_or_name, is_production=False)

			# flag
			flag = None
			flag_manager = client.flags if client is not None else Flag.objects
			if isValidUUID(flag_id_or_name) and flag_manager.filter(id=flag_id_or_name).exists():
				flag = flag_manager.get(id=flag_id_or_name)
			elif flag_manager.filter(name=flag_id_or_name).exists() and flag_manager.filter(name=flag_id_or_name).count() == 1:
				flag = flag_manager.get(name=flag_id_or_name)

			# enable or disable
			if flag is not None and flag.is_enabled != enable:
				flag.is_enabled = enable
				flag.save()
				message = 'Enabling' if enable else 'Disabling'
				self.stdout.write('{} flag {} for {}:{}'.format(message, flag.name, flag.client.name))

			# display
			if Client.objects.filter(is_production=False).exists():
				flag_list_data = [['Client', 'ID', 'Name', 'Enabled?', 'Description']]
				clients = [client] if client is not None else Client.objects.filter(is_production=False) # account for single client
				clients = [flag.client] if flag is not None else clients
				for i, client in enumerate(clients):
					flags = [flag] if flag is not None else client.flags.all()
					if filter_enabled and flag is None:
						filter_enabled = filter_enabled == 'True'
						flags = flags.filter(is_enabled=bool(filter_enabled))
					for j, flag in enumerate(flags):
						flag_list_data.append([
							client.name if j==0 else '',
							flag.id,
							flag.name,
							flag.is_enabled,
							flag.description,
						])

				flag_table = AsciiTable(flag_list_data)
				self.stdout.write(flag_table.table)

			else:
				self.stdout.write('No clients.')
