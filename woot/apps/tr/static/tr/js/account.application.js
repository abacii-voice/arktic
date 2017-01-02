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

	]).then(function (components) {
		// unpack components
		var [
			base,
			controlInterface,
			transcriptionInterface,
		] = components;

		// ASSOCIATE
		// key bindings and other
		// TRANSCRIPTION INTERFACE
		controlInterface.name = 'controlInterface';
		transcriptionInterface.name = 'transcriptionInterface';

		// complete promises
		return Promise.all([

		]).then(function () {
			// base children
			return base.setChildren([
				controlInterface,
				transcriptionInterface,
			]);
		}).then(function () {
			return base;
		});
	});
}
