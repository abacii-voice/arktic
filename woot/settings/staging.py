# temp.settings.staging

# django
# local
from woot.settings.common import *

# util
from os import environ

########## DEBUG CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#debug
DEBUG = True
SITE = 'http://staging.arkticvoice.com'
SITE_TYPE = 'STAGING'
########## END DEBUG CONFIGURATION


########## CACHE CONFIGURATION
CACHES = {
	'default': {
		'BACKEND': 'django.core.cache.backends.memcached.MemcachedCache',
		'LOCATION': '127.0.0.1:11211',
	}
}
########## END CACHE CONFIGURATION


########## SECRET CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#secret-key
SECRET_KEY = 'x08ig!20zeo%q46l6dnc8eqzb5g+h&(t4o18e#!yex&g&7sn=n'
########## END SECRET CONFIGURATION


########## DATABASE CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#databases
DATABASES = {
	'default': {
		'ENGINE': 'django.db.backends.postgresql_psycopg2',
		'NAME': 'arktic_db_staging',
		'HOST': 'NicholasPiano-358.postgres.pythonanywhere-services.com',
		'USER': 'super',
		'PASSWORD': 'uqnhs77f',
		'PORT': '10358',
	}
}
########## END DATABASE CONFIGURATION


########## EMAIL SERVER CONFIGURATION
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 465
EMAIL_HOST_USER = 'arkticvoice.noreply@gmail.com'
EMAIL_HOST_PASSWORD = 'uqnhs77f'
SERVER_EMAIL = EMAIL_HOST_USER
########## END EMAIL SERVER CONFIGURATION
