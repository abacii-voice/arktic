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
		AccountInterfaces.controlInterface('control-interface', {
			interface: args.interface,
		}),

		// transcription interface
		AccountInterfaces.transcriptionInterface('transcription-interface', {
			interface: args.interface,
		}),

		// project complete interface
		AccountInterfaces.projectCompleteInterface('project-complete-interface', {
			interface: args.interface,
		}),

		// shortcuts interface
		AccountInterfaces.shortcutInterface(),

	]).then(function (components) {
		// unpack components
		var [
			base,
			controlInterface,
			transcriptionInterface,
			projectCompleteInterface,
			shortcutInterface,
		] = components;

		// ASSOCIATE
		// key bindings and other

		// complete promises
		return Promise.all([

		]).then(function () {
			// base children
			return base.setChildren([
				controlInterface,
				transcriptionInterface,
				projectCompleteInterface,
				shortcutInterface,
			]);
		}).then(function () {
			return base;
		});
	});
}
