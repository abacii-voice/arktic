// Define global states
UI.createGlobalStates([
	'client-state',
	'role-state',
	'content-state'
]);

// Contains a definition of the components in the Account app
UI.createComponent('back-sidebar', {
	root: 'hook',
	args: {
		template: UI.templates.sidebar,
		classes: ['mini'],
		style: {},
		html: '',
		states: [
			{name: 'client-state', args: {}},
			{name: 'role-state', args: {}},
			{name: 'content-state', args: {}},
		],
		svitches: [

		],
	},
	children: [
		UI.createComponent('bs-back-button', {
			args: {
				template: UI.templates.button,
				classes: ['button'],
				style: {},
				html: 'Back button',
				states: [
					{name: 'client-state', args: {}},
					{name: 'role-state', args: {}},
					{name: 'content-state', args: {}},
				],
				svitches: [

				],
			},
			children: [],
		}),
		UI.createComponent('bs-test-button', {
			args: {
				template: UI.templates.button,
				classes: ['button'],
				style: {},
				html: 'Test button',
				states: [
					{name: 'client-state', args: {}},
					{name: 'role-state', args: {}},
					{name: 'content-state', args: {}},
				],
				svitches: [

				],
			},
			children: [],
		}),
	],
});

// Render to start
UI.getComponent('back-sidebar').render();
