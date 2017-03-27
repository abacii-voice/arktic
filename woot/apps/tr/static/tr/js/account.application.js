var AccountApplication = function () {
	return UI.createComponent('account-application', {
		ui: {
			template: UI.template('div', 'ie'),
			appearance: {
				style: {
					'height': '100%',
				},
			},
			styles: {
				'.border': {
					'border': `1px solid ${AccountConstants.color.grey.normal}`,
				},
				'.border-radius': {
					'border-radius': `${AccountConstants.ui.dimensions.corner}`,
				},
			},
		},
		children: [
			AccountInterfaces.controlInterface(),
			AccountInterfaces.transcriptionInterface(),
			AccountInterfaces.projectCompleteInterface(),
			AccountInterfaces.shortcutInterface(),
			AccountInterfaces.projectInterface(),
		],
	});
}
