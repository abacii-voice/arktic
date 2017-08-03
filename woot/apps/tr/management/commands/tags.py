# django
from django.core.management.base import BaseCommand, CommandError, CommandParser

# local
from util import isValidUUID
from apps.tr.models import Client, Project, Token

# util
import sys
from terminaltables import AsciiTable
import argparse
from argparse import RawTextHelpFormatter
import json

class Command(BaseCommand):

	help = '\n'.join([
		'TAGS: Add, list, or disable tags to be used with a project',
		'',
		'Example commands: ',
		'List: dm tags --client=Client1 --project=Project1 --is_enabled=True',
		'Add: dm tags add --client=Client1 --project=Project1 --name=TagName --shortcut=Shortcut',
		'Add: dm tags add --client=Client1 --project=Project1 --file=FilePath',
		'Disable: dm tags --tag=tag_id --enable=False',
		'Disable: dm tags --client=Client1 --project=Project1 --tag=TagName --enable=False',
	])

	def create_parser(self, *args, **kwargs):
		parser = super(Command, self).create_parser(*args, **kwargs)
		parser.formatter_class = RawTextHelpFormatter
		return parser

	def add_arguments(self, parser):
		cmd = self

		# general
		parser.add_argument('--tag',
			action='store',
			dest='tag_id_or_name',
			default='',
			help='Name or id of a single tag.',
		)
		parser.add_argument('--client',
			action='store',
			dest='client_id_or_name',
			default='',
			help='Name or id of client used to filter tags.',
		)
		parser.add_argument('--project',
			action='store',
			dest='project_id_or_name',
			default='',
			help='Name or id of project used to filter tags.',
		)
		parser.add_argument('--enable',
			action='store_true',
			dest='enable',
			default=True,
			help='Flag to enable or disable a tag.',
		)
		parser.add_argument('--is_enabled',
			action='store',
			dest='is_enabled',
			default='',
			help='Will filter list by enabled or disabled.',
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
			help='Name of new tag.',
		)
		add_parser.add_argument('--shortcut',
			action='store',
			dest='shortcut',
			default='',
			help='The keyboard shortcut text.',
		)
		add_parser.add_argument('--file',
			action='store',
			dest='file',
			default='',
			help='The file path of the tag input file.',
		)
		add_parser.add_argument('--client',
			action='store',
			dest='client_id_or_name',
			default='',
			help='Name or id of client.',
		)
		add_parser.add_argument('--project',
			action='store',
			dest='project_id_or_name',
			default='',
			help='Name or id of project.',
		)

	def handle(self, *args, **options):
		if options['command'] == 'add':
			# vars
			tag_name = options['name']
			tag_shortcut = options['shortcut']
			tag_file = options['file']
			client_id_or_name = options['client_id_or_name']
			project_id_or_name = options['project_id_or_name']

			# client
			client = None
			if isValidUUID(client_id_or_name) and Client.objects.filter(id=client_id_or_name, is_production=False).exists():
				client = Client.objects.get(id=client_id_or_name)
			elif Client.objects.filter(name=client_id_or_name, is_production=False).exists():
				client = Client.objects.get(name=client_id_or_name, is_production=False)
			else:
				self.stdout.write('No such client.')
				sys.exit(0)

			# project
			project = None
			if client is not None:
				if isValidUUID(project_id_or_name) and client.contract_projects.filter(id=project_id_or_name).exists():
					project = client.contract_projects.get(id=project_id_or_name)
				elif client.contract_projects.filter(name=project_id_or_name).exists():
					project = client.contract_projects.get(name=project_id_or_name)
				else:
					self.stdout.write('No such project.')
					sys.exit(0)

			# create tag or import from file
			if tag_file:
				with open(tag_file, 'r') as open_tag_file:
					data = json.loads(open_tag_file.read())
					for tag_name, details in data.items():
						tag, tag_created = project.dictionary.tokens.get_or_create(type='tag', content=tag_name)
						tag.shortcuts.get_or_create(combo=details['shortcut'])
						tag.save()

						if tag_created:
							self.stdout.write('Creating tag [{}] for {}:{}'.format(tag.content, client.name, project.name))
						else:
							self.stdout.write('Tag [{}] already exists for {}:{}'.format(tag.content, client.name, project.name))

			else:
				tag, tag_created = project.dictionary.tokens.get_or_create(type='tag', content=tag_name)
				tag.shortcuts.get_or_create(combo=tag_shortcut)
				tag.save()

				if tag_created:
					self.stdout.write('Creating tag [{}] for {}:{}'.format(tag.content, client.name, project.name))
				else:
					self.stdout.write('Tag [{}] already exists for {}:{}'.format(tag.content, client.name, project.name))

		else:
			tag_id_or_name = options['tag_id_or_name']
			client_id_or_name = options['client_id_or_name']
			project_id_or_name = options['project_id_or_name']
			enable = options['enable']
			filter_enabled = options['is_enabled']

			# client
			client = None
			if isValidUUID(client_id_or_name) and Client.objects.filter(id=client_id_or_name, is_production=False).exists():
				client = Client.objects.get(id=client_id_or_name)
			elif Client.objects.filter(name=client_id_or_name, is_production=False).exists():
				client = Client.objects.get(name=client_id_or_name, is_production=False)

			# project
			project = None
			project_manager = client.contract_projects if client is not None else Project.objects
			if isValidUUID(project_id_or_name) and project_manager.filter(id=project_id_or_name).exists():
				project = project_manager.get(id=project_id_or_name)
			elif client is not None and project_manager.filter(name=project_id_or_name).exists():
				project = project_manager.get(name=project_id_or_name)

			# tag
			tag = None
			tag_manager = project.dictionary.tokens if project is not None else Token.objects
			if isValidUUID(tag_id_or_name) and tag_manager.filter(id=tag_id_or_name, type='tag').exists():
				tag = tag_manager.get(id=tag_id_or_name, type='tag')
			elif tag_manager.filter(content=tag_id_or_name, type='tag').exists() and tag_manager.filter(content=tag_id_or_name, type='tag').count() == 1:
				tag = tag_manager.get(content=tag_id_or_name, type='tag')

			# enable or disable
			if tag is not None and tag.is_enabled != enable:
				tag.is_enabled = enable
				tag.save()
				message = 'Enabling' if enable else 'Disabling'
				self.stdout.write('{} tag {} for {}:{}'.format(message, tag.content, tag.dictionary.project.contract_client.name, tag.dictionary.project.name))

			# display
			if Client.objects.filter(is_production=False).exists():
				tag_list_data = [['Client', 'Project', 'ID', 'Name', 'Enabled?', 'Shortcut']]
				clients = [client] if client is not None else Client.objects.filter(is_production=False) # account for single client
				clients = [project.contract_client] if project is not None else clients # account for single project
				clients = [tag.dictionary.project.contract_client] if tag is not None else clients
				for i, client in enumerate(clients):
					projects = [project] if project is not None else client.contract_projects.all() # account for single project
					projects = [tag.dictionary.project] if tag is not None else projects # account for single tag
					for j, project in enumerate(projects):
						tags = [tag] if tag is not None else project.dictionary.tokens.filter(type='tag') # account for single tag
						if filter_enabled and tag is None:
							filter_enabled = filter_enabled == 'True'
							tags = tags.filter(is_enabled=bool(filter_enabled))
						for k, tag in enumerate(tags):
							tag_list_data.append([
								client.name if j==0 and k==0 else '',
								project.name if k==0 else '',
								tag.id,
								tag.content,
								tag.is_enabled,
								tag.shortcuts.latest().combo,
							])

				tag_table = AsciiTable(tag_list_data)
				self.stdout.write(tag_table.table)

			else:
				self.stdout.write('No clients.')
