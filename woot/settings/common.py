# rowbot.settings.common
'''Common settings and globals.'''

# django

# util
from datetime import timedelta
import os
from os.path import abspath, basename, dirname, join, normpath, expanduser, exists
from sys import path
import json
import string

# util

##################################################################################################
########################################## DJANGO CONFIGURATION
##################################################################################################
### These are parameters that Django requires to run


########## TEST CONFIGURATION
TEST_RUNNER = 'django.test.runner.DiscoverRunner'
########## END TEST CONFIGURATION


########## ALLOWED HOSTS CONFIGURATION
ALLOWED_HOSTS = (
	'localhost',
)
########## END ALLOWED HOSTS CONFIGURATION


########## PATH CONFIGURATION
# Absolute filesystem path to the Django project directory:
DJANGO_ROOT = dirname(dirname(abspath(__file__)))

# Absolute filesystem path to the top-level project folder:
SITE_ROOT = dirname(DJANGO_ROOT)

# Code root
CODE_ROOT = dirname(dirname(SITE_ROOT))

# Site name:
SITE_NAME = basename(dirname(DJANGO_ROOT))

# Add our project to our pythonpath, this way we don't need to type our project
# name in our dotted import paths:
path.append(DJANGO_ROOT)

def get_access():
	path = os.path.join(CODE_ROOT, '.access/{}.json'.format(SITE_NAME))
	data = {}
	with open(path) as access:
		data = json.load(access)

	return data
########## END PATH CONFIGURATION


########## DEBUG CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#debug
DEBUG = False

# See: https://docs.djangoproject.com/en/dev/ref/settings/#template-debug
TEMPLATE_DEBUG = DEBUG
########## END DEBUG CONFIGURATION


########## MANAGER CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#admins
ADMINS = (
	('Your name', 'youremail@domain.com'),
)

# See: https://docs.djangoproject.com/en/dev/ref/settings/#managers
MANAGERS = ADMINS
########## END MANAGER CONFIGURATION


########## GENERAL CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#time-zone
TIME_ZONE = 'Europe/London'

# See: https://docs.djangoproject.com/en/dev/ref/settings/#language-code
LANGUAGE_CODE = 'en-us'

# See: https://docs.djangoproject.com/en/dev/ref/settings/#site-id
SITE_ID = 1

# See: https://docs.djangoproject.com/en/dev/ref/settings/#use-i18n
USE_I18N = True

# See: https://docs.djangoproject.com/en/dev/ref/settings/#use-l10n
USE_L10N = True

# See: https://docs.djangoproject.com/en/dev/ref/settings/#use-tz
USE_TZ = True
########## END GENERAL CONFIGURATION


########## MEDIA CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#media-root
MEDIA_ROOT = normpath(join(DJANGO_ROOT, 'media'))

# See: https://docs.djangoproject.com/en/dev/ref/settings/#media-url
MEDIA_URL = '/media/'
########## END MEDIA CONFIGURATION


########## STATIC FILE CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#static-root
STATIC_ROOT = normpath(join(DJANGO_ROOT, 'static'))

# See: https://docs.djangoproject.com/en/dev/ref/settings/#static-url
STATIC_URL = '/static/'

# See: https://docs.djangoproject.com/en/dev/ref/contrib/staticfiles/#std:setting-STATICFILES_DIRS
STATICFILES_DIRS = (
	normpath(join(DJANGO_ROOT, 'assets')),
)

# See: https://docs.djangoproject.com/en/dev/ref/contrib/staticfiles/#staticfiles-finders
STATICFILES_FINDERS = (
	'django.contrib.staticfiles.finders.FileSystemFinder',
	'django.contrib.staticfiles.finders.AppDirectoriesFinder',
	'pipeline.finders.PipelineFinder',
)

# See: https://django-pipeline.readthedocs.org/en/latest/installation.html
STATICFILES_STORAGE = 'pipeline.storage.PipelineCachedStorage'

# Fix memcached with: pip install --upgrade -e git+https://github.com/linsomniac/python-memcached.git#egg=python-memcached
# 
########## END STATIC FILE CONFIGURATION


########## SECRET CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#secret-key
SECRET_KEY = '#za#m48_9in&i!9rodpp)r6$4_)_94l0sij7+06&mw6t*9f1t9'
########## END SECRET CONFIGURATION


########## FIXTURE CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#std:setting-FIXTURE_DIRS
FIXTURE_DIRS = (
	normpath(join(DJANGO_ROOT, 'fixtures')),
)
########## END FIXTURE CONFIGURATION


########## TEMPLATE CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#template-context-processors
TEMPLATES = [
	{
		'BACKEND': 'django.template.backends.django.DjangoTemplates',
		'APP_DIRS': True,
		'OPTIONS':{
			'debug':False,
			'context_processors':[
				'django.contrib.auth.context_processors.auth',
				'django.template.context_processors.debug',
				'django.template.context_processors.i18n',
				'django.template.context_processors.media',
				'django.template.context_processors.static',
				'django.template.context_processors.tz',
				'django.contrib.messages.context_processors.messages',
				'django.template.context_processors.request',
			],
		},
		'DIRS':[
			normpath(join(DJANGO_ROOT, 'templates')),
		],
	},
]
########## END TEMPLATE CONFIGURATION


########## MIDDLEWARE CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#middleware-classes
MIDDLEWARE_CLASSES = (
	# Use GZip compression to reduce bandwidth.
	'django.middleware.gzip.GZipMiddleware',

	# Django debug toolbar
	'debug_toolbar.middleware.DebugToolbarMiddleware',

	# Default Django middleware.
	'django.middleware.common.CommonMiddleware',
	'django.contrib.sessions.middleware.SessionMiddleware',
	'django.middleware.csrf.CsrfViewMiddleware',
	'django.contrib.auth.middleware.AuthenticationMiddleware',
	'django.contrib.messages.middleware.MessageMiddleware',
)
########## END MIDDLEWARE CONFIGURATION


########## URL CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#root-urlconf
ROOT_URLCONF = 'woot.urls'
########## END URL CONFIGURATION


########## WSGI CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#wsgi-application
WSGI_APPLICATION = 'wsgi.application'
########## END WSGI CONFIGURATION


########## DJANGO APP CONFIGURATION
DJANGO_APPS = (
	# Default Django apps:
	'django.contrib.auth',
	'django.contrib.contenttypes',
	'django.contrib.sessions',
	'django.contrib.sites',
	'django.contrib.messages',
	'django.contrib.staticfiles',

	# Useful template tags:
	'django.contrib.humanize',

	# Admin panel and documentation:
	'django.contrib.admin',
	'django.contrib.admindocs',

	# flatpages for static pages
	'django.contrib.flatpages',
)
########## END DJANGO APP CONFIGURATION


########## FILE UPLOAD CONFIGURATION
FILE_UPLOAD_HANDLERS = (
	'django.core.files.uploadhandler.MemoryFileUploadHandler',
	'django.core.files.uploadhandler.TemporaryFileUploadHandler',
)
########## END FILE UPLOAD CONFIGURATION


########## DATABASE CONFIGURATION
DATABASES = {}
########## END DATABASE CONFIGURATION

##################################################################################################
########################################## END DJANGO CONFIGURATION
##################################################################################################


########## APP CONFIGURATION
THIRD_PARTY_APPS = (
	# Asynchronous task scheduling
	'djcelery',

	# Pipeline compression
	'pipeline',
)

LOCAL_APPS = (
	'apps.tr',
	'apps.users',
	'apps.client',
	'apps.audio',
	'apps.action',
)

# See: https://docs.djangoproject.com/en/dev/ref/settings/#installed-apps
INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS
########## END APP CONFIGURATION


########## AUTH CONFIGURATION
AUTH_USER_MODEL = 'users.User'
########## END AUTH CONFIGURATION


########## LOGGING CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#logging
LOGGING = {
	'version': 1,
	'disable_existing_loggers': False,
	'filters': {
		'require_debug_false': {
			'()': 'django.utils.log.RequireDebugFalse'
		}
	},
	'handlers': {
		'mail_admins': {
			'level': 'ERROR',
			'filters': ['require_debug_false'],
			'class': 'django.utils.log.AdminEmailHandler'
		},
		'console': {
			'level': 'DEBUG',
			'class': 'logging.StreamHandler'
		}
	},
	'loggers': {
		'django.request': {
			'handlers': ['mail_admins', 'console'],
			'level': 'ERROR',
			'propagate': True,
		},
	}
}
########## END LOGGING CONFIGURATION


########## CELERY CONFIGURATION
from djcelery import setup_loader

CELERY_RESULT_BACKEND='djcelery.backends.database:DatabaseBackend'

# : Only add pickle to this list if your broker is secured
# : from unwanted access (see userguide/security.html)
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'

# See: http://celery.readthedocs.org/en/latest/configuration.html#celery-task-result-expires
CELERY_TASK_RESULT_EXPIRES = timedelta(minutes=30)

# See: http://docs.celeryproject.org/en/master/configuration.html#std:setting-CELERY_CHORD_PROPAGATES
CELERY_CHORD_PROPAGATES = True

# See: http://celery.github.com/celery/django/
setup_loader()

# rabbitmq: https://www.rabbitmq.com/man/rabbitmqctl.1.man.html
# celery: https://zapier.com/blog/async-celery-example-why-and-how/
########## END CELERY CONFIGURATION


########## PIPELINE CONFIGURATION
# See: https://django-pipeline.readthedocs.org/en/latest/configuration.html

# Settings
PIPELINE = {
	'PIPELINE_ENABLED': True,
	'JAVASCRIPT': {
		'react': {
			'source_filenames': (
				'js/jquery/2.2.0/jquery.min.js',
				'js/react/0.14.0/react.js',
				'js/react/0.14.0/react-dom.js',
				'js/react/babel-core/5.6.15/browser.js',
			),
			'output_filename': 'js/react.js',
		},
		'browserify': {
			'source_filenames': (
				'js/browserify-entry-point.browserify.js',
			),
			'output_filename': 'js/browserify-entry-point.js',
		}
	},

	# Compilers
	'COMPILERS': ('pipeline_browserify.compiler.BrowserifyCompiler', ),
}

########## END PIPELINE CONFIGURATION
