var AccountInterfaces = (AccountInterfaces || {});
AccountInterfaces.ruleInterface = function (id, args) {

	var autocompleteWidth = '350px';
	return UI.createComponent('rule-base', {
		name: 'ruleInterface',
		template: UI.template('div', 'ie abs'),
		appearance: {
			style: {
				'height': '100%',
				'left': '100px',
				'width': 'calc(100% - 100px)',
			},
			classes: ['centred-vertically'],
		},
		children: [

		],
	}).then(function (base) {

		// connect
		return Promise.all([

			// base
			base.setAppearance({
				classes: ['hidden'],
			}),
			base.setState({
				defaultState: {preFn: UI.functions.hide()},
				states: {
					'rule-state': {
						fn: UI.functions.show(),
					},
					'client-state': 'default',
					'role-state': 'default',
					'control-state': 'default',
					'faq-state': 'default',
					'transcription-state': 'default',
				},
			}),

		]).then(function () {
			return base;
		});
	});
}
