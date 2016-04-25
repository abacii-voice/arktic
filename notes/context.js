var Context = {
	store: {
		'user': {}, // basic details
		'clients': { // list of clients
			'clientname': {
				
			},
		},
		'active': { // current "in-scope" variables
			'client': {}, // from "clients"
			'user_profile': {}, // from "clients"
			'transcription': {}, // from "transcriptions"
		},
		'role_display': {},
		'transcriptions': {},
		'moderations': {},
	},
};
