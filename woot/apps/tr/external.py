
import json

def get_faq():
	faq = []
	with open('./faq.json') as open_faq:
		faq = json.loads(open_faq.read())

	return faq

def get_rules():
	rules = []
	with open('./rules.json') as open_rules:
		rules = json.loads(open_rules.read())

	return rules

def get_shortcuts():
	shortcuts = []
	with open('./shortcuts.json') as open_shortcuts:
		shortcuts = json.loads(open_shortcuts.read())

	return shortcuts
