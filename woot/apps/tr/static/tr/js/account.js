
// 1. define component tree
UI.createApp('hook', [

	// COMPONENT TESTING
	// autocomplete field
	UI.createComponent('test-autocomplete-wrapper', {
		template: UI.template('div', ''),
		appearance: {
			style: {
				'position': 'relative',
				'height': '600px',
				'width': '300px',
				'border': '2px solid #ccc',
				'left': '50%',
				'top': '50%',
				'transform': 'translate(-50%, -50%)',
			},
		},
		children: [
			Components.scroll('test-scroll', {

			}),
		],
	}),
]);

UI.renderApp('client-state');
