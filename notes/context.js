var json = require('./context.json');

var get = function (store, path) {
	path = path.split('.');
	sub = store;
	for (i=0; i<path.length; i++) {
		sub = sub[path[i]];
		if (sub === undefined) {
			break;
		}
	}
	return sub !== undefined ? sub : '';
}

console.log(get(json, 'production_projects.79e4b11f-a7ef-45cd-897e-cd0fe81fa42d.batches.7914f9e1-61c9-444d-9195-d26354c913f0'));

var tr = ajax({
	url: '/context/',
	path: 'new_transcription',
});

tr = {
	'id': 'sdflksjdflskdfj',
	'caption': '',
};
