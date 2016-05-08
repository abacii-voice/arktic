import json

class JS():
	def __init__(self, object):
		object = json.loads(object) if isinstance(object, str) else object
		for key, value in object.items():
			setattr(self, key, JS(value) if isinstance(value, dict) else value)

js = JS({
	'help': True,
	'hello': 'Hi, my name is Bob.',
	'more': {
		'hi': 'Hi, my name is...',
	},
})

js2 = JS('''{
	"help": "True",
	"hello": "Hi, my name is Bob.",
	"more": {
		"hi": "Hi, my name is..."
	}
}''')

print(js.more.hi)

print(js.__dict__)
