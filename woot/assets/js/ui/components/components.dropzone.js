
// initialise
var Components = (Components || {});

Components.dropzone = function (id, args) {
	return UI.createComponent(id, {
		name: args.name,
		template: UI.template('div', 'ie abs centred'),
		appearance: {
			style: {
				'height': '100%',
				'width': '100%',
			},
		},
	}).then(function (base) {

		return Promise.all([

		]).then(function () {
			return base;
		});
	});
}

// uploadController.upload.accept
