var UserSignupInterface = function () {
	return UI.createComponent('us-interface', {
		name: 'interface',
		template: UI.template('div', 'ie'),
		appearance: {
			style: {
				'width': '100%',
				'height': '100%',
			},
		},
		children: [
			UI.createComponent('container', {
				name: 'container',
				template: UI.template('div', 'ie centred'),
				appearance: {
					style: {
						'width': '700px',
						'height': '500px',
						'border': '1px solid black',
						'padding-left': '20px',
						'padding-right': '20px',
					},
				},
				children: [
					UI.createComponent('warning-message', {
						name: 'warning',
						template: UI.template('h3'),
						appearance: {
							style: {

							},
							html: 'WARNING: This page can only be loaded once.<br/> Do not leave this page until the signup process has been completed.'
						},
					}),
					UI.createComponent(''),
					UI.createComponent('form', {
						name: 'form',
						template: UI.template('div', 'ie'),
						children: [

						],
					}),
				],
			}),
		],
	}).then(function (base) {
		return base;
	});
}
