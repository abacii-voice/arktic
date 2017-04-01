// LIST OF CHANGES

// ##### version 1
// 1. Add color and ui measurements to _ variable
// 2.

var AccountApplication = function () {
	return UI.createComponent('accountApplication', {
		ui: {
			template: 'div.ie',
			styles: {
				'.border': {
					'border': `1px solid ${_.color.grey.normal}`,
				},
				'.border-radius': {
					'border-radius': `${_.ui.dimensions.corner}`,
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
