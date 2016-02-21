// 1. Load Context
Context.setFn(function () {
	// ajax
	ajax('user_context', {}, function (data) {
		Context.store = data;
		console.log(Context.store);
	});
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
// 	template: UI.templates.*,
// 	appearance: {
// 		html: '',
// 		classes: [],
// 		style: {},
// 	},
// 	state: {
// 		states: [],
// 		svtiches: [],
// 		stateMap: {},
// 	},
// 	registry: {
// 		path: [],
// 		fn: function () {},
// 	},
// 	properties: {},
// 	bindings: [
// 		{
// 			name: 'click',
// 			fn: function () {},
// 		}
// 	],
// 	children: [],
// })

UI.createApp('hook', [
	UI.createComponent('client-sidebar', {
		template: UI.templates.sidebar,
		appearance: {
			html: '',
			classes: [],
			style: {},
		},
		state: {
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
		},
		registry: {
			path: ['clients'],
			fn: function (_this, data) {
				// create buttons from Context and remove loading icon
			}
		}
		children: [
			UI.createComponent('cs-loading-icon', {
				template: UI.templates.loadingIcon,
			}),
		],
	}),
	UI.createComponent('role-sidebar', {
		root: '',
		template: UI.templates.*,
		appearance: {
			html: '',
			classes: [],
			style: {},
		},
		state: {
			states: [],
			svtiches: [],
			stateMap: {},
		},
		registry: {
			path: [],
			fn: function () {},
		}
		children: [],
		properties: {},
		bindings: [
			{
				name: 'click',
				fn: function () {},
			}
		],
	}),
	UI.createComponent('back-sidebar', {
		root: '',
		template: UI.templates.*,
		appearance: {
			html: '',
			classes: [],
			style: {},
		},
		state: {
			states: [],
			svtiches: [],
			stateMap: {},
		},
		registry: {
			path: [],
			fn: function () {},
		}
		children: [],
		properties: {},
		bindings: [
			{
				name: 'click',
				fn: function () {},
			}
		],
	}),
]);

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

// 4. Render app
UI.renderApp();
