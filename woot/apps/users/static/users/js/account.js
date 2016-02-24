// 0. Open websocket connection
// really use only for transcription / moderation / settings change, but not file upload.
// don't have to use for loading context either. Ajax is fine for that.

// 1. Load Context
Context.setFn(ajax('user_context', {}, function (data) {
	Context.store = data;

	if (Context.get('one_client')) {
		if (Context.get('one_role')) {
			UI.changeState('summary-state');
		} else {
			UI.changeState('role-state');
		}
	}
}));

Context.update(); // load data

// 2. Define global states
UI.createGlobalStates('client-state', [
	'role-state',
	'summary-state',
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
	UI.createComponent('summary-panel', {
		template: UI.templates.contentPanel,
		children: [
			// MAIN INTERFACE ELEMENTS

			// Action widget
			// Contains a start button for the task at hand (transcription / moderation / upload)
			// ####
			UI.createComponent('action-widget', {
				template: UI.templates.subPanel,
				appearance: {
					style: {
						'height': '200px',
					},
				},
				state: {
					states: [
						{name: 'client-state', args: {
							style: {
								'left': '5px',
								'opacity': '0.0',
							},
						}},
						{name: 'role-state', args: {
							style: {
								'left': '5px',
								'opacity': '0.0',
							},
						}},
						{name: 'summary-state', args: {
							style: {
								'left': '0px',
								'opacity': '1.0',
							},
						}},
					],
				},
				children: [
					// Start button - link to app (transcription / moderation / upload)
					UI.createComponent('start-button', {
						template: UI.templates.button,
						appearance: {
							html: 'Start',
							classes: ['round'],
							style: {
								'position': 'absolute',
								'background': '#aaa',
								'top': '40px',
								'left': '40px',
								'height': '120px',
								'width': '120px',
								'padding-top': '44px',
								'font-size': '1.5em',
							}
						},
						state: {
							stateMap: {},
						},
					}),

					// Activity - see active projects and users
					UI.createComponent('activity-monitor', {
						template: UI.templates.div,
						appearance: {
							html: `
								<h3>Activity</h3>
							`,
							style: {
								'position': 'absolute',
								'top': '0px',
								'left': '240px',
								'height': '200px',
								'width': '200px',
							}
						}
					}),

					// Billing - see the current billing cycle its billable activity
					UI.createComponent('billing-monitor', {
						template: UI.templates.div,
						appearance: {
							html: `
								<h3>Billing cycle</h3>
							`,
							style: {
								'position': 'absolute',
								'top': '0px',
								'left': '440px',
								'height': '200px',
								'width': '200px',
							}
						}
					}),
				],
			}),
			// ####

			UI.createComponent('cp-spacer-1', {template: UI.templates.spacer}),

			// Message widget
			// Contains a list of recent messages and a link to the messenger app.
			// ####
			// UI.createComponent('messages-widget', {
			// 	template: UI.templates.subPanel,
			// 	appearance: {
			// 		style: {
			// 			'height': '500px',
			// 		},
			// 	},
			// 	state: {
			// 		states: [
			// 			{name: 'client-state', args: {
			// 				style: {
			// 					'left': '5px',
			// 					'opacity': '0.0',
			// 				},
			// 			}},
			// 			{name: 'role-state', args: {
			// 				style: {
			// 					'left': '5px',
			// 					'opacity': '0.0',
			// 				},
			// 			}},
			// 			{name: 'summary-state', args: {
			// 				style: {
			// 					'left': '0px',
			// 					'opacity': '1.0',
			// 				},
			// 			}},
			// 		],
			// 	},
			// 	children: [
			// 		// Contains links for new messages and filters
			// 		UI.createComponent('message-header', {
			// 			children: [
			// 				UI.createComponent('message-header-new-message-button', {
			//
			// 				}),
			// 				UI.createComponent('new-message-button', {
			//
			// 				}),
			// 				UI.createComponent('search-input-field', {
			//
			// 				}),
			// 			],
			// 		}),
			//
			// 		// Message list
			// 		UI.createComponent('message-list', {
			// 			children: [
			// 				// message objects displayed here
			// 			]
			// 		});
			// 	],
			// }),
			// ####

			// Stats widget
			// A summary of relevant stats
			// ####
			// UI.createComponent('stats-widget', {
			// 	children: [
			// 		// Contains a table showing all-time and billing-cycle numbers
			// 		UI.createComponent('totals-table', {}),
			//
			// 		// XY graph of activity vs. time.
			// 		UI.createComponent('billing-cycle-performance-graph', {}),
			//
			// 		// Pixel map of activity in this billing cycle and the last.
			// 		UI.createComponent('billing-cycle-map', {}),
			// 	],
			// }),
			// ####
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
				{name: 'summary-state', args: {
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
						// console.log(_this.children, Context.get('current_client'));

						// 2. map data from context to new children and render
						var data = Context.get(['roles', 'clients', Context.get('current_client'), 'roles']);
						data.map(function (roleName) {
							var child = UI.createComponent('rs-{name}-button'.format({name: roleName}), {
								root: _this.id,
								template: UI.templates.button,
								appearance: {
									style: {
										'opacity': '0.0',
									},
									html: Context.get(['role_display', roleName]),
								},
								state: {
									svitches: [
										{stateName: 'summary-state', fn: function (_this) {
											Context.store['current_role'] = roleName;
										}}
									],
									stateMap: {
										'role-state': 'summary-state',
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
				{name: 'summary-state', args: {
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
				{name: 'summary-state', args: {
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
						'summary-state': 'role-state',
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
