// 1. Load Context
Context.setFn(function () {
	// ajax
});

Context.update(); // load data

// 2. Define global states
UI.createGlobalStates('client-state', [
	'role-state',
	'content-state'
]);

// 3. Define component tree
// (id, { // <- args variable
// 	root: '',
// 	properties: {
// 		props: {},
// 		template: UI.templates.*,
// 		html: '',
// 		classes: [],
// 		style: {},
// 		states: [],
// 		svitches: [],
// 		stateMap: {},
// 		click: function () {},
// 	},
// 	children: [],
// })

UI.createApp('hook', [
	UI.createComponent('client-sidebar', {
		properties: {
			template: UI.templates.sidebar,
			states: [
				{name: 'client-state', args: {
					style: {
						'left': '0px',
					},
				}},
				{name: 'role-state', args: {
					style: {
						'left': '-300px',
					}
				}},
				{name: 'content-state', args: {
					style: {
						'left': '-300px',
					},
				}},
			],
			svtiches: [],
		},
		children: [
			UI.createComponent('cs-test-button', {
				properties: {
					template: UI.templates.button,
					html: 'Test client',
					stateMap: {
						'client-state': 'role-state',
					},
				},
				click: function (_this) {
					UI.changeState(_this.stateMap[UI.globalState]);
				}
			}),
		],
	}),
	UI.createComponent('role-sidebar', {
		properties: {
			template: UI.templates.sidebar,
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
			],
		},
		children: [
			UI.createComponent('rs-test-button', {
				properties: {
					template: UI.templates.button,
					html: 'Test role',
					stateMap: {
						'role-state': 'content-state',
					},
				},
				click: function (_this) {
					UI.changeState(_this.stateMap[UI.globalState]);
				}
			}),
		],
	}),
	UI.createComponent('back-sidebar', {
		properties: {
			template: UI.templates.sidebar,
			classes: ['mini'],
			states: [
				{name: 'client-state', args: {
					style: {
						'left': '-50px',
					},
				}},
				{name: 'role-state', args: {
					style: {
						'left': '0px',
					},
					fn: function (_this) {
						_this.model().animate({'left': '0px'}, 200);
					}
				}},
				{name: 'content-state', args: {
					style: {
						'left': '-50px',
					},
					fn: function (_this) {
						_this.model().animate({'left': '0px'}, 200);
					}
				}},
			],
		},
		children: [
			UI.createComponent('bs-back-button', {
				properties: {
					template: UI.templates.button,
					html: '<span class="glyphicon glyphicon-chevron-left"></span>',
					stateMap: {
						'role-state': 'client-state',
						'content-state': 'role-state',
					}
				},
				click: function (_this) {
					UI.changeState(_this.stateMap[UI.globalState]);
				}
			}),
		],
	}),
]);

// Need more complex behaviour for classes:
// 1. Adding a class from a state should remove the classes of other states
// 2. Maybe have a stateClass variable that can be changed.

// 4. Render app
UI.renderApp();
