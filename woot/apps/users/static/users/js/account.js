// Define global states
UI.createGlobalStates('client-state', [
	'role-state',
	'content-state'
]);

// Contains a definition of the components in the Account app
UI.createComponent('back-sidebar', {
	root: 'hook',
	args: {
		template: UI.templates.sidebar,
		classes: 'mini',
		style: {},
		html: '',
		states: [
			{name: 'client-state', args: {
				style: {
					width: '200px',
				},
			}},
			{name: 'role-state', args: {
				style: {
					width: '250px',
				},
			}},
			{name: 'content-state', args: {}},
		],
		svitch: {

		},
	},
	children: [
		UI.createComponent('bs-back-button', {
			args: {
				template: UI.templates.button,
				classes: 'button',
				style: {},
				html: 'Back button',
				click: function (model) {
					
				},
				states: [
					{name: 'client-state', args: {}},
					{name: 'content-state', args: {}},
				],
				svitch: {
					'client-state':'role-state',
					'role-state':'client-state',
				},
			},
			children: [],
		}),
		UI.createComponent('bs-test-button', {
			args: {
				template: UI.templates.button,
				classes: 'button',
				style: {},
				html: 'Test button',
				states: [
					{name: 'client-state', args: {}},
					{name: 'content-state', args: {}},
				],
				svitch: {

				},
			},
			children: [],
		}),
	],
});

// Render to start
UI.getComponent('back-sidebar').render();
