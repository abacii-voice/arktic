# django
from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
from django.utils.crypto import get_random_string
from django.core.mail import send_mail

# local
from util import filterOrAllOnBlank

# util
import uuid

### User classes
class UserManager(BaseUserManager):
	def create_user(self, first_name, last_name, email, password=None):
		user = self.model(first_name=first_name, last_name=last_name, email=self.normalize_email(email))

		user.set_password(password)
		user.activation_key = get_random_string(length=20)
		user.save()
		return user

class User(AbstractBaseUser, PermissionsMixin):

	### Connections
	# sub: role

	### Properties
	# identification
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	email = models.EmailField(max_length=255, unique=True)
	first_name = models.CharField(max_length=255)
	last_name = models.CharField(max_length=255)

	# activation
	is_activated = models.BooleanField(default=False)
	activation_email_sent = models.BooleanField(default=False)
	activation_key = models.CharField(max_length=20) # use utils to generate unique key

	# settings
	billing_date = models.DateTimeField(auto_now_add=True) # this is an instance of datetime.datetime

	# OMG can do this
	# print "We are the {:%d, %b %Y}".format(today)
	# 'We are the 22, Nov 2008'
	# formatting: http://docs.python.org/2/library/datetime.html#strftime-and-strptime-behavior

	# other
	objects = UserManager()
	USERNAME_FIELD = 'email'

	### Methods
	# data
	def data(self, path, permission):
		data = {}

		if path.is_blank:
			data.update({
				'id': self.id,
				'email': self.email,
				'first_name': self.first_name,
				'last_name': self.last_name,
				'is_activated': self.is_activated,
				'billing_date': str(self.billing_date),
				'active_session': self.sessions.get(is_active=True).data() if self.sessions.filter(is_active=True) else 'none',
			})

		return data

	def client_data(self, path, permission):
		data = self.data(path, permission)

		if path.check('clients'):
			data.update({
				'clients': {str(client.id): client.user_data(path.down('clients'), permission) for client in filterOrAllOnBlank(self.clients, id=path.get_id())},
			})

		return data

	def role_data(self, client, path, permission):
		data = self.data(path, permission)

		if path.check('roles'):
			data.update({
				'roles': {str(role.id): role.data(path.down('roles'), permission) for role in filterOrAllOnBlank(self.roles, id=path.get_id(), client=client)}
			})

		return data

	# str
	def __str__(self):
		return '{}, ({}, {})'.format(self.email, self.last_name, self.first_name)

	# verify
	def send_verification_email(self):
		# 1. generate activation key
		self.activation_key = get_random_string()

		# 2. send email with key
		send_mail(
			'Arktic account verification for {}'.format(self.email), # subject
			'Follow the link below to verify your email:', # text message
			'no-reply@arktic.com', # from email: not sure yet
			[self.email], # recipient list
			html_message='Click <a href="http://localhost:8000/verify/{}/{}/">the link</a>'.format(self.id, self.activation_key) # html message: needs rendering and stuff
		)

		# 3. toggle activation_email_sent
		self.activation_email_sent = True
		self.save()

	def verify(self, activation_key):
		if self.activation_key == activation_key and not self.is_activated:
			# reset activation
			self.is_activated = True
			self.activation_key = ''
			self.save()

			# return to confirm
			return True
		else:
			return False # change to False when testing is done

	def active_session(self):
		return self.sessions.get(is_active=True) if self.sessions.filter(is_active=True) else None

class Session(models.Model):

	'''
	This is created when a user loads an application page.

	'''

	### Connections
	user = models.ForeignKey('users.User', related_name='sessions')

	### Properties
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	is_active = models.BooleanField(default=True)
	date_created = models.DateTimeField(auto_now_add=True)
	type = models.CharField(max_length=255)

	### Methods
	# data
	def data(self):
		data = {
			'is_active': str(self.is_active),
			'date_created': str(self.date_created),
			'type': self.type,
		}

		return data

	def deactivate(self):
		self.is_active = False
		self.save()
		# 1. release all active transcription fragments
		if self.user.roles.filter(type='worker'):
			for fragment in self.transcription_fragments.filter(is_reconciled=False):
				fragment.release(by_session=True)

		# 2. release all active moderation fragments
		if self.user.roles.filter(type='moderator'):
			for fragment in self.moderation_fragments.filter(is_reconciled=False):
				fragment.release(by_session=True)
