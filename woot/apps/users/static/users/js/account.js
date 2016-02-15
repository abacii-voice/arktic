// Define global states
UI.createGlobalState('client-state');
UI.createGlobalState('role-state');
UI.createGlobalState('content-state');

// Contains a definition of the components in the Account app
UI.createComponent('back-sidebar', {
	args: {
		template: UI.templates.sidebar,
		classes: ['sidebar'],
		style: {},
		states: [
			{name: 'client-state', args: {}},
			{name: 'role-state', args: {}},
			{name: 'content-state', args: {}},
		],
		switches: {

		},
	}
	components: {
		UI.createComponent('bs-back-button', {
			args: {
				template: UI.templates.button,
				classes: ['button'],
				style: {},
				states: [

				],
				switches: {

				},
			},
			components: {},
		}),
		UI.createComponent('bs-test-button', {
			args: {
				template: UI.templates.button,
				classes: ['button'],
				style: {},
				states: [

				],
				switches: {

				},
			},
			components: {},
		}),
	},
});
