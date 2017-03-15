var AccountInterfaces = (AccountInterfaces || {});
AccountInterfaces.projectCompleteInterface = function () {
	return UI.createComponent('project-complete-interface', {
		name: 'projectCompleteInterface',
		template: UI.template('div', 'ie abs hidden'),
		appearance: {
			style: {
				'height': '100%',
				'left': '100px',
				'width': 'calc(100% - 100px)',
			},
			classes: ['centred-vertically'],
		},
		children: [
			// title
			UI.createComponent('pci-title', {
				name: 'title',
				template: UI.template('h3'),
				appearance: {
					style: {

					},
					html: 'Project completed',
				},
			}),

			// spiel
			UI.createComponent('pci-spiel', {
				name: 'spiel',
				template: UI.template('p'),
				appearance: {
					style: {

					},
					html: 'This project has been completed. Please review your billing for this period and keep an eye out for any updates.',
				},
			}),
		],
	}).then(function (base) {
		return Promise.all([
			base.setState({
				defaultState: {preFn: UI.functions.hide()},
				states: {
					'-transcription-project-complete-state': {
						fn: UI.functions.show(),
					},
					'client-state': 'default',
					'role-state': 'default',
					'control-state': 'default',
					'transcription-state': 'default',
				},
			}),
		]).then(function () {
			return base;
		});
	});
}
