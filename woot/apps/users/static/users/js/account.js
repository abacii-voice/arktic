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
			path: function () {
				return ['clients']
			},
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
		template: UI.templates.sidebar,
		state: {
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
		registry: {
			path: function () {
				return [Context.get('current-client'), 'roles']
			},
			fn: function (_this, data) {
				// create role buttons and remove loading icon
			},
		},
		children: [
			UI.createComponent('rs-loading-icon', {
				template: UI.templates.loadingIcon,
			});
		],
	}),
	UI.createComponent('back-sidebar', {
		template: UI.templates.sidebar,
		appearance: {
			classes: ['mini'],
		},
		state: {
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
				template: UI.templates.button,
				appearance: {
					html: '<span class="glyphicon glyphicon-chevron-left"></span>'
				},
				states: {
					stateMap: {
						'role-state': 'client-state',
						'content-state': 'role-state',
					}
				},
				bindings: [
					{
						name: 'click',
						fn: function (_this) {
							UI.changeState(_this.stateMap[UI.globalState]);
						},
					}
				],
			});
		],
	}),
]);

// 4. Render app
UI.renderApp();
