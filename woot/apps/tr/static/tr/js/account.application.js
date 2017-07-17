var AccountApplication = function (id, args) {
	return UI.createComponent('{id}-base'.format({id: id}), {
		name: 'base',
		template: UI.template('div', 'ie'),
		appearance: {
			style: {
				'height': '100%',
			},
		},
		children: [
			// control interface
			// AccountInterfaces.controlInterface('controlInterface'),

			// transcription interface
			AccountInterfaces.transcriptionInterface('transcriptionInterface'),

			// shortcuts interface
			AccountInterfaces.shortcutInterface('shortcutInterface'),

			// project interface
			AccountInterfaces.projectInterface('projectInterface'),
		],
	}).then(function (base) {

		// complete promises
		return Promise.all([

		]).then(function () {
			return base;
		});
	});
}
