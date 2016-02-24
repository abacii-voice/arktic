// 0. Open websocket connection
// really use only for transcription / moderation / settings change, but not file upload.
// don't have to use for loading context either. Ajax is fine for that.

// 1. Load Context
Context.setFn(ajax('user_context', {}, function (data) {
	Context.store = data;

	if (Context.get('one_client')) {
		if (Context.get('one_role')) {
			UI.changeState('control-state');
		} else {
			UI.changeState('role-state');
		}
	}
}));

Context.update(); // load data

// 2. Define global states
UI.createGlobalStates('client-state', [
	'role-state',
	'control-state',
	'interface-state-transcription',
	'interface-state-moderation',
	'upload-state',
	'message-state',
	'billing-state',
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
	UI.createComponent('control-panel', {
		template: UI.templates.contentPanel,
		children: [
			// UI.createComponent(),
			// UI.createComponent(),
			// UI.createComponent(),
			// UI.createComponent(),
		],
	}),
	// UI.createComponent('work-interface', {
	//
	// }),
	// UI.createComponent('upload-interface', {
	//
	// }),
	// UI.createComponent('message-interface', {
	//
	// }),
	// UI.createComponent('billing-interface', {
	//
	// }),
	UI.createComponent('client-sidebar', {
		template: UI.templates.sidebar,
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
				{name: 'control-state', args: {
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
				// 'data' is a list of client names

				// remove loading button
				var loadingIcon = UI.getComponent('cs-loading-icon');
				loadingIcon.model().fadeOut();

				// map data to new buttons
				data.map(function (clientName) {
					var child = UI.createComponent('cs-{name}-button'.format({name: clientName}), {
						root: _this.id,
						template: UI.templates.button,
						appearance: {
							style: {
								'opacity': '0.0',
							},
							html: '{name}'.format({name: clientName}),
						},
						state: {
							svitches: [
								{stateName: 'role-state', fn: function (_this) {
									Context.store['current_client'] = clientName;
								}},
							],
							stateMap: {
								'client-state': 'role-state',
							},
						},
						bindings: [
							{name: 'click', fn: function (_this) {
								UI.changeState(_this.mapState(UI.globalState), _this);
							}}
						],
					});

					_this.children.push(child);
					child.render();

					// make buttons visible
					child.model().animate({'opacity': '1.0'});
				});
			}
		},
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
					fn: function (_this) {
						// 1. remove current children
						_this.children.map(function (child) {
							UI.removeComponent(child.id);
						});

						_this.children = [];

						// 2. map data from context to new children and render
						var data = Context.get('roles', 'clients', Context.get('current_client'), 'roles');
						data.map(function (roleName) {
							var child = UI.createComponent('rs-{name}-button'.format({name: roleName}), {
								root: _this.id,
								template: UI.templates.button,
								appearance: {
									style: {
										'opacity': '0.0',
									},
									html: Context.get('role_display', roleName),
								},
								state: {
									svitches: [
										{stateName: 'control-state', fn: function (_this) {
											Context.store['current_role'] = roleName;
										}}
									],
									stateMap: {
										'role-state': 'control-state',
									}
								},
								bindings: [
									{name: 'click', fn: function (_this) {
										UI.changeState(_this.mapState(UI.globalState), _this);
									}}
								],
							});

							_this.children.push(child);
							child.render();

							// make buttons visible
							child.model().animate({'opacity': '1.0'});
						});
					}
				}},
				{name: 'control-state', args: {
					style: {
						'left': '-300px',
					},
				}},
			],
		},
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
				{name: 'control-state', args: {
					style: {
						'left': '-50px',
					},
					fn: function (_this) {
						_this.model().animate({'left': '0px'}, 200);
					},
				}},
			],
		},
		children: [
			UI.createComponent('bs-back-button', {
				template: UI.templates.button,
				appearance: {
					html: '<span class="glyphicon glyphicon-chevron-left"></span>'
				},
				state: {
					stateMap: {
						'role-state': 'client-state',
						'control-state': 'role-state',
					}
				},
				bindings: [
					{name: 'click', fn: function (_this) {
						UI.changeState(_this.mapState(UI.globalState), _this);
					}},
				],
			}),
		],
	}),

]);

// 4. Render app
UI.renderApp();
