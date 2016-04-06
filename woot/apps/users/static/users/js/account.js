// 0. Open websocket connection
// really use only for transcription / moderation / settings change, but not file upload.
// don't have to use for loading context either. Ajax is fine for that.

// 1. Load Context
Context.setFn(getdata('context', {}, function (data) {
	Context.update(data);

	if (Context.get('one_client')) {
		if (Context.get('one_role')) {
			UI.changeState('control-state');
		} else {
			UI.changeState('role-state');
		}
	}

	// debug and construction
	// $.when(new Promise (function (resolve, reject) {
	// 	Context.set('current_client', 'TestContractClient');
	// 	Context.set('current_role', 'admin')
	// })).done(function () {
	// 	UI.changeState('control-state');
	// });
}));

// 2. Define global states
UI.createGlobalStates('client-state', [
	'role-state',

	// control panel
	'control-state',

	// work interface states
	'interface-state',
	'upload-state',
	'upload-state-audio',
	'upload-date-state',
	'upload-relfile-drop-state',
	'upload-audio-drop-state',

	// ### interfaces
	'message-state',
	'billing-state',
	'stats-state',
	'rules-state',
	'user-stats-state',
	'search-state',

	// user management
	'user-management-state',
	'user-management-user-state',
	'user-management-user-stats-state',
	'user-management-user-message-state',
	'user-management-user-moderation-state',
	'user-management-user-settings-state',
	'user-management-new-user-state',
	'user-management-confirm-user-state',

	// projects
	'project-state',
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
	// breadcrumbs
	// Components.breadcrumbs(),

	// interfaces
	UI.createComponent('transcription-interface', {
		children: [

		],
	}),
	UI.createComponent('user-management-interface', {
		children: [
			UI.createComponent('umi-button-panel', {
				children: [
					UI.createComponent('umi-list-button'),
					UI.createComponent('umi-new-user-button'),
					UI.createComponent('umi-settings-button'),
				],
			}),
			UI.createComponent('umi-primary-panel', {
				children: [
					// Components.scrollList('umi-pp-user-list', {
					//
					// }),
					UI.createComponent('umi-pp-user-info'),
					UI.createComponent('umi-pp-user-confirmed'),
					UI.createComponent('umi-pp-user-card', {
						children: [
							UI.createComponent('umi-pp-uc-control-panel', {
								children: [
									UI.createComponent('umi-pp-uc-cp-title'),
									UI.createComponent('umi-pp-uc-cp-subtitle'),
									UI.createComponent('umi-pp-uc-cp-role-panel', {
										children: [
											// Components.roleIndicator('umi-pp-uc-cp-rp-admin-role'),
											// Components.roleIndicator('umi-pp-uc-cp-rp-moderator-role'),
											// Components.roleIndicator('umi-pp-uc-cp-rp-worker-role'),
										],
									}),
									UI.createComponent('umi-pp-uc-cp-admin-enabled-panel'), // for contract
									UI.createComponent('umi-pp-uc-cp-worker-enabled-panel'), // for mods
									UI.createComponent('umi-pp-uc-cp-action-panel', {
										children: [
											UI.createComponent('umi-pp-uc-cp-ap-message-button'),
											UI.createComponent('umi-pp-uc-cp-ap-moderation-button'),
											UI.createComponent('umi-pp-uc-cp-ap-stats-button'),
											UI.createComponent('umi-pp-uc-cp-ap-settings-button'),
										],
									}),
								],
							}),
							UI.createComponent('umi-pp-uc-message-panel'),
							UI.createComponent('umi-pp-uc-moderation-panel'),
							UI.createComponent('umi-pp-uc-stats-panel'),
							UI.createComponent('umi-pp-uc-settings-panel'),
						],
					}),
				],
			}),
			UI.createComponent('umi-new-user-panel'),
			UI.createComponent('umi-user-confirmed'),
		],
	}),
	UI.createComponent('project-interface', {
		children: [
			UI.createComponent('pi-button-panel', {
				children: [
					UI.createComponent('pi-project-list-button'),
					UI.createComponent('pi-new-project-button'),
					UI.createComponent('pi-settings-button'),
				],
			}),
			UI.createComponent('pi-primary-panel', {
				children: [
					// Components.scrollList('pi-mp-project-group-list', {
					//
					// }),
					UI.createComponent('pi-mp-project-info'),
					UI.createComponent('pi-mp-project-card'),
				],
			}),
			UI.createComponent('pi-mp-project-settings-panel'),
			UI.createComponent('pi-mp-new-project-panel'),
		],
	}),
	UI.createComponent('rule-interface', {
		children: [

		],
	}),
	UI.createComponent('billing-interface', {
		children: [

		],
	}),

	// sidebars
	Components.sidebar('client-sidebar', {
		title: 'Clients',
		state: {
			active: {
				style: {
					'left': '0px',
				},
			},
			states: {
				'client-state': 'active',
				'role-state': 'next',
			},
		},
		content: [
			Components.scrollList('cs-client-list', {
				scroll: false,
				loadingIcon: true,
				registry: {
					path: function () {
						return ['clients'];
					},
					fn: function (_this, data) {
						// create buttons from Context and remove loading icon
						// 'data' is a list of client names

						// remove loading button
						var loadingIcon = _this.parent().loadingIcon();
						loadingIcon.model().fadeOut();

						var clientList = Object.keys(data);

						// map data to new buttons
						clientList.sort(alphaSort()).forEach(function (clientName) {
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
											Context.set('current_client', clientName);
										}},
									],
									stateMap: {
										'client-state': 'role-state',
									},
								},
								bindings: [
									{name: 'click', fn: function (_this) {
										_this.triggerState();
									}}
								],
							});

							_this.children[child.id] = child;
							child.render();

							// make buttons visible
							child.model().css({'opacity': '1.0'});
						});
					}
				},
			}),
		],
	}),
	Components.sidebar('role-sidebar', {
		title: 'Roles',
		state: {
			active: {
				style: {
					'left': '50px',
				},
			},
			states: {
				'client-state': 'default',
				'role-state': 'active',
				'control-state': 'next',
			},
		},
		content: [
			Components.scrollList('rs-role-list', {
				state: {
					states: [
						{name: 'role-state', args: {
							preFn: function (_this) {
								// 1. remove current children
								Object.keys(_this.children).forEach(function (childId) {
									UI.removeComponent(childId);
								});

								_this.children = {};
								_this.parent().loadingIcon().model().fadeOut();

								// 2. map data from context to new children and render
								var data = Context.get('clients', Context.get('current_client'), 'roles');
								data.forEach(function (roleName) {
									var child = UI.createComponent('rs-{name}-button'.format({name: roleName}), {
										root: _this.id,
										template: UI.templates.button,
										appearance: {
											style: {
												'opacity': '0.0',
											},
											classes: ['show'],
											html: Context.get('role_display', roleName),
										},
										state: {
											svitches: [
												{stateName: 'control-state', fn: function (_this) {
													Context.set('current_role', roleName);
												}}
											],
											stateMap: 'control-state',
										},
										bindings: [
											{name: 'click', fn: function (_this) {
												_this.triggerState();
											}}
										],
									});

									_this.children[child.id] = child;
									child.render();

									// make buttons visible
									child.model().css({'opacity': '1.0'});
								});
							},
						}},
					],
				},
			}),
		],
	}),
	Components.sidebar('control-sidebar', {
		title: 'Actions',
		state: {
			active: {
				style: {
					'left': '50px',
				},
			},
			states: {
				'client-state': 'default',
				'role-state': 'default',
				'control-state': 'active',
			},
		},
		content: [
			Components.scrollList('cs-action-list', {
				content: [
					UI.createComponent('cns-start-button', {
						template: UI.templates.button,
						appearance: {
							html: 'Start',
							classes: ['border start-button'],
						},
						state: {
							states: [
								{name: 'control-state', args: {
									preFn: function (_this) {
										var role = Context.get('current_role');
										var visibleCondition = (role === 'worker' || role === 'moderator');
										if (visibleCondition) {
											_this.model().css('display', 'block');
										} else {
											_this.model().css('display', 'none');
										}
									},
								}},
							],
							stateMap: 'interface-state',
						},
						bindings: [
							{name: 'click', fn: function (_this) {
								_this.triggerState();
							}},
						],
					}),
					UI.createComponent('cns-upload-button', {
						template: UI.templates.button,
						appearance: {
							html: 'Upload',
							classes: ['border start-button'],
						},
						state: {
							states: [
								{name: 'control-state', args: {
									preFn: function (_this) {
										var client = Context.get('clients', Context.get('current_client'));
										var role = Context.get('current_role');
										if (role === 'admin' && client.is_contract) {
											_this.model().css('display', 'block');
										} else {
											_this.model().css('display', 'none');
										}
									},
								}},
							],
							stateMap: 'upload-state',
						},
						bindings: [
							{name: 'click', fn: function (_this) {
								_this.triggerState();
							}},
						],
					}),
					UI.createComponent('cns-projects-button', {
						template: UI.templates.button,
						appearance: {
							html: 'Projects',
							classes: ['border'],
						},
						state: {
							states: [
								{name: 'control-state', args: {
									preFn: function (_this) {
										var role = Context.get('current_role');
										if (role === 'admin') {
											_this.model().css('display', 'block');
										} else {
											_this.model().css('display', 'none');
										}
									},
								}},
							],
							stateMap: 'project-state',
						},
						bindings: [
							{name: 'click', fn: function (_this) {
								_this.triggerState();
							}},
						],
					}),
					UI.createComponent('cns-user-management-button', {
						template: UI.templates.button,
						appearance: {
							html: 'User management',
							classes: ['border'],
						},
						state: {
							states: [
								{name: 'control-state', args: {
									preFn: function (_this) {
										var role = Context.get('current_role');
										var visibleCondition = (role === 'admin' || role === 'moderator');
										if (visibleCondition) {
											_this.model().css('display', 'block');
										} else {
											_this.model().css('display', 'none');
										}
									},
								}},
							],
							stateMap: 'user-management-state',
							svitches: [
								{stateName: 'user-management-state', fn: function (_this) {
									// clear users
									Context.store['clients'][Context.get('current_client')]['users'] = {};
								}}
							],
						},
						bindings: [
							{name: 'click', fn: function (_this) {
								_this.triggerState();
							}},
						],
					}),
					UI.createComponent('cns-rules-button', {
						template: UI.templates.button,
						appearance: {
							html: 'Rules',
							classes: ['border'],
						},
						state: {
							states: [
								{name: 'control-state', args: {
									preFn: function (_this) {
										var role = Context.get('current_role');
										var visibleCondition = true;
										if (visibleCondition) {
											_this.model().css('display', 'block');
										} else {
											_this.model().css('display', 'none');
										}
									},
								}},
							],
							stateMap: 'rules-state',
						},
						bindings: [
							{name: 'click', fn: function (_this) {
								_this.triggerState();
							}},
						],
					}),
					UI.createComponent('cns-billing-button', {
						template: UI.templates.button,
						appearance: {
							html: 'Billing',
							classes: ['border'],
						},
						state: {
							states: [
								{name: 'control-state', args: {
									preFn: function (_this) {
										var visibleCondition = true;
										if (visibleCondition) {
											_this.model().css('display', 'block');
										} else {
											_this.model().css('display', 'none');
										}
									},
								}},
							],
							stateMap: 'billing-state',
						},
						bindings: [
							{name: 'click', fn: function (_this) {
								_this.triggerState();
							}},
						],
					}),
					UI.createComponent('cns-stats-button', {
						template: UI.templates.button,
						appearance: {
							html: 'Stats',
							classes: ['border'],
						},
						state: {
							states: [
								{name: 'control-state', args: {
									preFn: function (_this) {
										var visibleCondition = true;
										if (visibleCondition) {
											_this.model().css('display', 'block');
										} else {
											_this.model().css('display', 'none');
										}
									},
								}},
							],
							stateMap: 'stats-state',
						},
						bindings: [
							{name: 'click', fn: function (_this) {
								_this.triggerState();
							}},
						],
					}),
					UI.createComponent('cns-search-button', {
						template: UI.templates.button,
						appearance: {
							html: `<span class='glyphicon glyphicon-search'></span> Search`,
							classes: ['border'],
						},
						state: {
							states: [
								{name: 'control-state', args: {
									preFn: function (_this) {
										var visibleCondition = true;
										if (visibleCondition) {
											_this.model().css('display', 'block');
										} else {
											_this.model().css('display', 'none');
										}
									},
								}},
							],
							stateMap: 'search-state',
						},
						bindings: [
							{name: 'click', fn: function (_this) {
								_this.triggerState();
							}},
						],
					}),
				],
			}),
		],
	}),
]);

// 4. Render app
UI.renderApp();

// 5. Load data
Context.load();
