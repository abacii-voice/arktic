
# django
from django.conf import settings

# util
from os.path import join
import json

def get_faq():
	faq = []
	with open(join(settings.SITE_ROOT, './faq.json')) as open_faq:
		faq = json.loads(open_faq.read())

	return faq

def get_rules():
	rules = []
	with open(join(settings.SITE_ROOT, './rules.json')) as open_rules:
		rules = json.loads(open_rules.read())

	return rules

def get_shortcuts():
	shortcuts = []
	with open(join(settings.SITE_ROOT, './shortcuts.json')) as open_shortcuts:
		shortcuts = json.loads(open_shortcuts.read())

	return shortcuts
