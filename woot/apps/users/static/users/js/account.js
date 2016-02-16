// Define global states
UI.createGlobalStates('client-state', [
	'role-state',
	'content-state'
]);

// Contains a definition of the components in the Account app
UI.createComponent('app', {
	root: 'hook',
	args: {
		template: UI.templates.div,
	},
	children: [
		UI.createComponent('back-sidebar', {
			args: {
				template: UI.templates.sidebar,
				classes: ['mini'],
				style: {
					'left': '-100px',
				},
				states: [
					{name: 'client-state', args: {
						style: {
							'left': '-100px',
						},
					}},
					{name: 'role-state', args: {
						style: {
							'left': '0px',
						},
					}},
				],
			},
			children: [
				UI.createComponent('bs-back-button', {
					args: {
						template: UI.templates.button,
						classes: ['button'],
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
						classes: ['button'],
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
		}),
		UI.createComponent('client-sidebar', {
			args: {
				template: UI.templates.sidebar,
				classes: [''],
				style: {},
				states: [
					{name: 'client-state', args: {
						style: {
							'left': '0px',
						},
					}},
					{name: 'role-state', args: {
						style: {
							'left': '-300px',
						},
					}},
				]
			},
			children: [
				UI.createComponent('cs-test-client-button', {
					args: {
						template: UI.templates.button,
						classes: ['button'],
						style: {},
						html: 'Test button',
						click: function (model) {

						},
						states: [],
						svitch: {
							'client-state':'role-state',
							'role-state':'client-state',
						},
					},
					children: [],
				}),
			],
		}),
		UI.createComponent('role-sidebar', {
			args: {
				template: UI.templates.sidebar,
				classes: [''],
				style: {
					'left':'-300px',
				},
				states: [
					{name: 'client-state', args: {
						style: {
							'left': '-300px',
						},
					}},
					{name: 'role-state', args: {
						style: {
							'left': '50px',
						},
					}},
				]
			},
			children: [
				UI.createComponent('cs-test-role-button', {
					args: {
						template: UI.templates.button,
						classes: ['button'],
						style: {},
						html: 'Test button',
						click: function (model) {

						},
						states: [],
						svitch: {
							'client-state':'role-state',
							'role-state':'client-state',
						},
					},
					children: [],
				}),
			],
		}),
	],
})

// Render to start
UI.getComponent('app').render();
