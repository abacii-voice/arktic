var AccountApplication = function (id, args) {
	return Promise.all([
		// base
		UI.createComponent('{id}-base'.format({id: id}), {
			template: UI.template('div', 'ie'),
			appearance: {
				style: {
					'height': '100%',
				},
			},
		}),

		// control interface
		AccountInterfaces.controlInterface('controlInterface'),

		// transcription interface
		AccountInterfaces.transcriptionInterface('transcriptionInterface'),

		// project complete interface
		AccountInterfaces.projectCompleteInterface('projectCompleteInterface'),

		// shortcuts interface
		AccountInterfaces.shortcutInterface('shortcutInterface'),

		// project interface
		AccountInterfaces.projectInterface('projectInterface'),

	]).then(function (components) {
		// unpack components
		var [
			base,
			controlInterface,
			transcriptionInterface,
			projectCompleteInterface,
			shortcutInterface,
			projectInterface,
		] = components;

		// complete promises
		return Promise.all([

		]).then(function () {
			// base children
			return base.setChildren([
				controlInterface,
				transcriptionInterface,
				projectCompleteInterface,
				shortcutInterface,
				projectInterface,
			]);
		}).then(function () {
			return base;
		});
	});
}
