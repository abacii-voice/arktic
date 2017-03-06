
// initialise
var Components = (Components || {});

Components.dropzone = function (id, args) {
	return Promise.all([
		// base
		UI.createComponent(id, {
			template: UI.template('div', 'ie abs centred'),
			appearance: {
				style: {
					'height': '100%',
					'width': '100%',
				},
			},
		}),

		// box
		// title

	]).then(function (components) {
		var [
			base
		] = components;

		return Promise.all([

		]).then(function () {
			return base.setChildren([]);
		}).then(function () {
			return base;
		});
	});
}

// uploadController.upload.accept
