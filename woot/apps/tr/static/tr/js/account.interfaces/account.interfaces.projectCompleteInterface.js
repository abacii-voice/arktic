var AccountInterfaces = (AccountInterfaces || {});
AccountInterfaces.projectCompleteInterface = function () {
	return Promise.all([
		// base
		UI.createComponent('project-complete-interface', {
			template: UI.template('div', 'ie abs hidden'),
			appearance: {
				style: {
					'height': '100%',
					'left': '100px',
					'width': 'calc(100% - 100px)',
				},
				classes: ['centred-vertically'],
			},
		}),

		// title
		UI.createComponent('pci-title', {
			template: UI.template('h3'),
			appearance: {
				style: {

				},
				html: 'Project completed',
			},
		}),

		// spiel
		UI.createComponent('pci-spiel', {
			template: UI.template('p'),
			appearance: {
				style: {

				},
				html: 'This project has been completed. Please review your billing for this period and keep an eye out for any updates.',
			},
		}),

	]).then(function (components) {

		var [
			base,
			title,
			spiel,
		] = components;

		return Promise.all([
			base.setState({
				defaultState: {preFn: UI.functions.hide},
				states: {
					'-transcription-project-complete-state': {
						fn: UI.functions.show,
					},
					'client-state': 'default',
					'role-state': 'default',
					'control-state': 'default',
					'transcription-state': 'default',
				},
			}),
		]).then(function () {
			return base.setChildren([
				title,
				spiel,
			]);
		}).then(function () {
			return base;
		});
	});
}
