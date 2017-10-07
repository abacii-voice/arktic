// initialise
var AccountComponents = (AccountComponents || {});

// transcription master controller
AccountComponents.projectCompletionBar = function (id, args) {

	// components
	return UI.createComponent(id, {
		template: UI.template('div', 'ie border border-radius'),
		name: 'completion',
		appearance: {
			style: {
				'margin-left': '10px',
				'height': '40px',
				'width': '455px',
				'float': 'left',
				'padding': '10px',
				'font-size': '15px',
				'color': Color.green.normal,
				'border-color': Color.green.normal,
			},
		},
		children: [
			UI.createComponent(`${id}-blurb`, {
				name: 'blurb',
				template: UI.template('span', 'ie'),
				appearance: {
					html: 'Project complete. You completed ',
				},
			}),
			UI.createComponent(`${id}-number`, {
				name: 'number',
				template: UI.template('span', 'ie'),
				appearance: {
					html: 'N transcriptions',
				},
			}),
		],
	}).then(function (base) {
		return Promise.all([

		]).then(function () {
			return base;
		});
	});

}
