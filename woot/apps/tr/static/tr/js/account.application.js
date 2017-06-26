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
			AccountInterfaces.controlInterface('controlInterface'),

			// transcription interface
			AccountInterfaces.transcriptionInterface('transcriptionInterface'),

			// project complete interface
			AccountInterfaces.projectCompleteInterface('projectCompleteInterface'),

			// shortcuts interface
			AccountInterfaces.shortcutInterface('shortcutInterface'),

			// project interface
			AccountInterfaces.projectInterface('projectInterface'),
		],
	}).then(function (base) {

		// complete promises
		return Promise.all([
			base.cc.projectCompleteInterface.cc.returnButton.setState({
				states: {
					'-transcription-project-complete-state': {
						preFn: function (_this) {
							if (!base.cc.transcriptionInterface.cc.transcriptionMasterController.buffer) {
								return _this.setAppearance({classes: {add: ['hidden']}});
							}
						}
					},
				},
			}),
			base.cc.projectCompleteInterface.cc.spiel.setState({
				states: {
					'-transcription-project-complete-state': {
						preFn: function (_this) {
							return Promise.all([
								Active.get('client'),
								Active.get('role'),
							]).then(function (results) {
								var [client_id, role_id] = results;
								return Context.get(`user.clients.${client_id}.roles.${role_id}.project_transcriptions`).then(function (project_transcriptions) {
									return _this.setAppearance({html: `This project has been completed. Thank you. You completed ${project_transcriptions} transcription${project_transcriptions==1 ? '' : 's'}.`});
								});
							});
						}
					},
				},
			}),
		]).then(function () {
			return base;
		});
	});
}
