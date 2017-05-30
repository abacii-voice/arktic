# django
from django.core.management.base import BaseCommand, CommandError, CommandParser

# local
from util import isValidUUID
from apps.tr.models import Client, Project
from apps.users.models import User

# util
import sys
from terminaltables import AsciiTable
import argparse
from argparse import RawTextHelpFormatter

class Command(BaseCommand):

	help = '\n'.join([
		'USERS: Add, list, reassign, or disable users.',
		'',
		'Example commands: ',
		'Add: dm users add --first_name=FirstName --last_name=LastName --email=email@site.com --admin --moderator --worker',
		'Add: dm users add --first_name=FirstName --last_name=LastName --email=email@site.com -a -m -w',
		'List: dm users --user=UserId',
		'List: dm users --is_enabled=False',
		'Disable: dm users --user=EmailFragment --enable=False',
		'Reassign: sm users assign --user=UserId --client=Client1 --project=Project1',
		'Resend: dm users resend_verification_email --user=UserId',
	])

	def create_parser(self, *args, **kwargs):
		parser = super(Command, self).create_parser(*args, **kwargs)
		parser.formatter_class = RawTextHelpFormatter
		return parser

	def add_arguments(self, parser):
		cmd = self

		# general
		parser.add_argument('--user',
			action='store',
			dest='user',
			default='',
			help='Email or id of single user. (email fragment can be used)',
		)
		parser.add_argument('--enable',
			action='store_true',
			dest='enable',
			default=True,
			help='Enable or disable a user.',
		)
		parser.add_argument('--is_enabled',
			action='store',
			dest='is_enabled',
			default='',
			help='Filter list of users by enabled or disabled',
		)

		# subparser
		class SubParser(CommandParser):
			def __init__(self, **kwargs):
				super(SubParser, self).__init__(cmd, **kwargs)

		subparsers = parser.add_subparsers(title='commands', parser_class=SubParser, dest='command')

		# add
		add_parser = subparsers.add_parser('add')
		add_parser.add_argument('--first_name',
			action='store',
			dest='first_name',
			default='',
			help='User first name.',
		)
		add_parser.add_argument('--last_name',
			action='store',
			dest='last_name',
			default='',
			help='User last name.',
		)
		add_parser.add_argument('--email',
			action='store',
			dest='email',
			default='',
			help='User email.',
		)
		add_parser.add_argument('-a', '--admin',
			action='store_true',
			dest='is_admin',
			default=False,
			help='User admin flag',
		)
		add_parser.add_argument('-m', '--moderator',
			action='store_true',
			dest='is_moderator',
			default=False,
			help='User moderator flag',
		)
		add_parser.add_argument('-w', '--worker',
			action='store_true',
			dest='is_worker',
			default=True,
			help='User worker flag',
		)
		add_parser.add_argument('--password',
			action='store',
			dest='password',
			default='',
			help='User password',
		)

		# assign
		assign_parser = subparsers.add_parser('assign')
		assign_parser.add_argument('--user',
			action='store',
			dest='user',
			default='',
			help='Email or id of single user. (email fragment can be used)',
		)
		assign_parser.add_argument('--client',
			action='store',
			dest='client',
			default='',
			help='Client id or name.',
		)
		assign_parser.add_argument('--project',
			action='store',
			dest='project',
			default='',
			help='Project id or name. (name requires client)',
		)

		# resend
		resend_parser = subparsers.add_parser('resend_verification_email')
		resend_parser.add_argument('--user',
			action='store',
			dest='user',
			default='',
			help='Email or id of single user. (email fragment can be used)',
		)

	def display_users(self, user_filter=None, filter_enabled=''):
		user_email = user_filter.email if user_filter is not None else ''

		# user list
		user_list_data = [['Email', 'ID', 'Name', 'Activated?', 'Enabled?', 'Project', 'Total', 'Project total']]
		users = User.objects.filter(email__contains=user_email)
		if filter_enabled:
			filter_enabled = filter_enabled == 'True'
			users = users.filter(is_enabled=filter_enabled)
		for user in users:
			role = None
			project = None

			if Client.objects.filter(name='Abacii').exists():
				client = Client.objects.get(name='Abacii')
				if client.roles.filter(user=user, type='worker').exists():
					role = client.roles.get(user=user, type='worker')
					project = role.project

			user_list_data.append([
				user.email,
				user.id,
				'{} {}'.format(user.first_name, user.last_name),
				'Yes' if user.is_activated else 'No',
				'Yes' if user.is_enabled else 'No',
				'{}: {}'.format(project.contract_client.name, project.name) if project is not None else 'Not assigned',
				role.total_transcriptions(),
				role.total_transcriptions(project=project),
			])

		user_table = AsciiTable(user_list_data)
		self.stdout.write(user_table.table)

	def handle(self, *args, **options):
		if options['command'] == 'add':
			# vars
			user_first_name = options['first_name']
			user_last_name = options['last_name']
			user_email = options['email']
			is_admin = options['is_admin']
			is_moderator = options['is_moderator']
			is_worker = options['is_worker']
			password = options['password']

			# client
			if Client.objects.filter(name='Abacii').exists():
				client = Client.objects.get(name='Abacii')
			else:
				continue_creating_client = input('Creating client Abacii, continue (y/n)? ')
				if continue_creating_client in ['', 'y']:
					client = Client.objects.create(name='Abacii', is_production=True)
				else:
					self.stdout.write('Cancelling operation.')
					sys.exit(0)

			# add a user
			if User.objects.filter(email=user_email).exists():
				user = User.objects.get(email=user_email)
			else:
				continue_creating_user = input('Creating user {}, continue (y/n)? '.format(user_email))
				if continue_creating_user in ['', 'y']:
					user = User.objects.create(email=user_email, first_name=user_first_name, last_name=user_last_name)
					if password:
						user.set_password(password)
						user.is_activated = True
						user.save()
					else:
						user.send_verification_email()

				else:
					self.stdout.write('Cancelling operation.')
					sys.exit(0)

			# roles
			if not user.roles.filter(client=client, type='admin').exists() and is_admin:
				client.add_admin(user)

			if not user.roles.filter(client=client, type='moderator').exists() and is_moderator:
				client.add_moderator(user)

			if not user.roles.filter(client=client, type='worker').exists() and is_worker:
				client.add_worker(user)

		elif options['command'] == 'assign':
			# assign a user to a project
			user_email_or_id = options['user']
			client_id_or_name = options['client']
			project_id_or_name = options['project']

			# get user
			if isValidUUID(user_email_or_id) and User.objects.filter(id=user_email_or_id).exists():
				user = User.objects.get(id=user_email_or_id)
			elif User.objects.filter(email__contains=user_email_or_id).exists():
				if User.objects.filter(email__contains=user_email_or_id).count() == 1:
					user = User.objects.get(email__contains=user_email_or_id)
				else:
					self.stdout.write('Multiple users match this email address: ')
					for user in User.objects.filter(email__contains=user_email_or_id):
						self.stdout.write('<User> {} {}: {}'.format(user.first_name, user.last_name, user.email))
						sys.exit(0)
			else:
				self.stdout.write('No such user exists.')
				sys.exit(0)

			# assign project to role
			# assume client is Abacii
			# assume role is worker
			if Client.objects.filter(name='Abacii').exists():
				production_client = Client.objects.get(name='Abacii')
				if user.roles.filter(client=production_client, type='worker').exists():
					role = user.roles.get(client=production_client, type='worker')

					# get contract client
					client = None
					if client_id_or_name:
						if isValidUUID(client_id_or_name) and Client.objects.filter(id=client_id_or_name).exists():
							client = Client.objects.get(id=client_id_or_name)
						elif Client.objects.filter(name=client_id_or_name):
							client = Client.objects.get(name=client_id_or_name)
						else:
							self.stdout.write('No such client.')
							sys.exit(0)

					# get contract project
					project_manager = Project.objects if client is None else client.contract_projects
					if isValidUUID(project_id_or_name) and project_manager.filter(id=project_id_or_name).exists():
						project = project_manager.get(id=project_id_or_name)
					elif project_manager.filter(name=project_id_or_name).exists():
						project = project_manager.get(name=project_id_or_name)
					else:
						self.stdout.write('No such project.')
						sys.exit(0)

					self.stdout.write('Assigning <User> {} {}: {} to project {}:{}'.format(user.first_name, user.last_name, user.email, project.contract_client.name, project.name))
					role.assign_project(project)
				else:
					self.stdout.write('<User> {} {}: {} has no worker role with Abacii.'.format(user.first_name, user.last_name, user.email))
					sys.exit(0)
			else:
				self.stdout.write('No production client set up (import some data).')
				sys.exit(0)

		elif options['command'] == 'resend_verification_email':
			user_email_or_id = options['user']

			user = None
			if user_email_or_id:
				if isValidUUID(user_email_or_id) and User.objects.filter(id=user_email_or_id).exists():
					user = User.objects.get(id=user_email_or_id)
				elif User.objects.filter(email__contains=user_email_or_id).exists():
					if User.objects.filter(email__contains=user_email_or_id).count() == 1:
						user = User.objects.get(email__contains=user_email_or_id)
					else:
						self.stdout.write('Multiple users match this email address: ')
						for user in User.objects.filter(email__contains=user_email_or_id):
							self.stdout.write('<User> {} {}: {}'.format(user.first_name, user.last_name, user.email))
							sys.exit(0)
				else:
					self.stdout.write('No such user exists.')
					sys.exit(0)

			if user is not None:
				self.stdout.write('Resending verification email for user {} {}: {}. This will override previous emails.'.format(user.first_name, user.last_name, user.email))
				user.send_verification_email()
			else:
				self.stdout.write('No user.')

		else:
			# list users and their attributes
			user_email_or_id = options['user']
			enable = options['enable']
			filter_enabled = options['is_enabled']

			# get user
			user = None
			if user_email_or_id:
				if isValidUUID(user_email_or_id) and User.objects.filter(id=user_email_or_id).exists():
					user = User.objects.get(id=user_email_or_id)
				elif User.objects.filter(email__contains=user_email_or_id).exists():
					if User.objects.filter(email__contains=user_email_or_id).count() == 1:
						user = User.objects.get(email__contains=user_email_or_id)
					else:
						self.stdout.write('Multiple users match this email address: ')
						for user in User.objects.filter(email__contains=user_email_or_id):
							self.stdout.write('<User> {} {}: {}'.format(user.first_name, user.last_name, user.email))
							sys.exit(0)
				else:
					self.stdout.write('No such user exists.')
					sys.exit(0)

			if user is not None:
				if user.is_enabled != enable:
					user.is_enabled = enable
					user.save()
					message = 'Enabling' if enable else 'Disabling'
					self.stdout.write('{} user {} {}: {}'.format(message, user.first_name, user.last_name, user.email))

			# display the users incorporating the filter
			self.display_users(user_filter=user, filter_enabled=filter_enabled)
