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
		UI.createComponent('client-sidebar', {
			args: {
				template: UI.templates.sidebar,
				classes: [''],
				style: {},
				fn: function (component) {
					// make ajax call to get client data
					ajax('user_roles', {}, function (data) {
						var clients = data['clients'];
						Object.keys(clients).map(function (client) {
							component.children.push(UI.createComponent('cs-{name}-button'.format({name: client}), {
								args: {
									template: UI.templates.button,
									classes: ['button'],
									style: {},
									html: 'Client: {name}'.format({name: client}),
									click: function (model) {

									},
									states: [],
									svitch: {
										'client-state':'role-state',
									},
								}
							}));
						});
					});
				},
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
						html: 'Test client',
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
					{name: 'content-state', args: {
						style: {
							'left': '-300px',
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
						html: 'Test role',
						click: function (model) {

						},
						states: [],
						svitch: {
							'role-state':'content-state',
						},
					},
					children: [],
				}),
			],
		}),
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
						html: '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>',
						click: function (model) {

						},
						states: [
							{name: 'client-state', args: {}},
							{name: 'content-state', args: {}},
						],
						svitch: {
							'role-state':'client-state',
							'content-state':'role-state',
						},
					},
					children: [],
				}),
			],
		}),
		UI.createComponent('content-panel', {
			args: {
				template: UI.templates.contentPanel,
				classes: [],
				style: {
					'opacity': '0.0',
				},
				html:'<h1>Hello</h1>',
				states: [
					{name: 'client-state', args: {
						style: {
							'opacity': '0.0',
						}
					}},
					{name: 'role-state', args: {
						style: {
							'opacity': '0.0',
						}
					}},
					{name: 'content-state', args: {
						style: {
							'opacity': '1.0',
						}
					}},
				],
			},
			children: [],
		}),
	],
});

// Render to start
UI.getComponent('app').render();
