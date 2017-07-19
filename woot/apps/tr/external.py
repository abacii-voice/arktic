
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
