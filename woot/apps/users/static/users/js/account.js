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
	$.when(new Promise (function (resolve, reject) {
		Context.set('current_client', 'TestContractClient');
		Context.set('current_role', 'admin')
	})).done(function () {
		UI.changeState('user-management-state');
	});
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
	'user-management-settings-state',

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
		template: UI.template('div', 'ie panel centred-vertically'),
		appearance: {
			style: {
				'left': '60px',
				'overflow': 'hidden',
			},
		},
		state: {
			defaultState: {
				style: {
					'opacity': '0.0',
				},
				fn: UI.functions.deactivate,
			},
			states: [
				{name: 'role-state', args: 'default'},
				{name: 'upload-state', args: 'default'},
				{name: 'control-state', args: 'default'},
				{name: 'user-management-state', args: {
					preFn: UI.functions.activate,
					style: {
						'opacity': '1.0',
					}
				}},
			],
		},
		children: [
			UI.createComponent('umi-button-panel', {
				template: UI.template('div', 'ie sub-panel show relative'),
				appearance: {
					style: {
						'height': '100%',
						'width': '40px',
						'float': 'left',
					},
				},
				children: [
					UI.createComponent('umi-list-button', {
						template: UI.templates.button,
						appearance: {
							classes: ['border border-radius relative'],
							style: {
								'margin-bottom': '10px',
								'width': '40px',
								'height': '40px',
								'padding-top': '10px',
							},
						},
						children: [
							UI.createComponent('nub-span', {
								template: UI.template('span', 'glyphicon glyphicon-list'),
							}),
						],
						bindings: [
							{name: 'click', fn: function (_this) {
								_this.triggerState();
							}}
						],
						state: {
							stateMap: 'user-management-state',
						},
					}),
					UI.createComponent('umi-settings-button', {
						template: UI.templates.button,
						appearance: {
							classes: ['border border-radius relative'],
							style: {
								'margin-bottom': '10px',
								'width': '40px',
								'height': '40px',
								'padding-top': '10px',
							},
						},
						children: [
							UI.createComponent('nub-span', {
								template: UI.template('span', 'glyphicon glyphicon-cog'),
							}),
						],
						bindings: [
							{name: 'click', fn: function (_this) {
								_this.triggerState();
							}}
						],
						state: {
							stateMap: 'user-management-settings-state',
						},
					}),
					UI.createComponent('umi-new-user-button', {
						template: UI.templates.button,
						appearance: {
							classes: ['border border-radius relative'],
							style: {
								'margin-bottom': '10px',
								'width': '40px',
								'height': '40px',
								'padding-top': '10px',
							},
						},
						children: [
							UI.createComponent('nub-span', {
								template: UI.template('span', 'glyphicon glyphicon-plus'),
							}),
						],
						bindings: [
							{name: 'click', fn: function (_this) {
								_this.triggerState();
							}}
						],
						state: {
							stateMap: 'user-management-new-user-state',
							defaultState: {
								preFn: function (_this) {
									var isAdmin = Context.get('current_role') === 'admin';
									if (isAdmin) {
										_this.model().css({'display': 'block'});
									} else {
										_this.model().css({'display': 'none'});
									}
								},
							},
							states: [
								{name: 'user-management-state', args: 'default'},
							],
						},
					}),
				],
			}),
			UI.createComponent('umi-primary-panel', {
				template: UI.template('div', 'ie sub-panel show relative'),
				appearance: {
					style: {
						'height': '100%',
						'width': 'calc(100% - 50px)',
						'float': 'left',
						'margin-left': '10px',
					},
				},
				state: {
					defaultState: {
						style: {
							'opacity': '0.0',
						},
						fn: UI.functions.deactivate,
					},
					states: [
						{name: 'user-management-state', args: {
							preFn: UI.functions.activate,
							style: {
								'opacity': '1.0',
							},
						}},
						{name: 'user-management-new-user-state', args: 'default'},
						{name: 'user-management-settings-state', args: 'default'},
					],
				},
				children: [
					Components.scrollList('umi-pp-user-list', {
						title: 'Users',
						search: {

						},
						appearance: {
							style: {
								'width': '200px',
								'float': 'left',
							},
						},
						state: {
							states: [
								{name: 'user-management-state', args: {
									preFn: function (_this) {
										// activate
										_this.model().css({
											'display': 'block',
											'opacity': '1.0',
										});

										// 1. remove current children
										Object.keys(_this.children).forEach(function (childId) {
											UI.removeComponent(childId);
										});

										_this.children = {};

										// promise to fetch data and update Context
										var permissionData = {
											current_client: Context.get('current_client'),
											current_role: Context.get('current_role'),
										};
										$.when(getdata('context', permissionData, function (data) {
											// update Context
											Context.update(data);
										})).done(function () {
											// data is a list of user objects with relevant details
											var users = Context.get('clients', Context.get('current_client'), 'users');
											Object.keys(users).map(function (userId) {
												var userPrototype = users[userId];
												var userButton = UI.createComponent('user-button-{id}'.format({id: userId}), {
													root: _this.id,
													template: UI.templates.button,
													appearance: {
														html: '{last_name}, {first_name}'.format({first_name: userPrototype.first_name, last_name: userPrototype.last_name}),
														classes: ['border-bottom'],
														style: {
															'width': '100%',
														},
													},
													bindings: [
														{name: 'click', fn: function (_this) {
															_this.triggerState();
														}},
													],
													state: {
														stateMap: 'user-management-user-state',
														svitches: [
															{stateName: 'user-management-user-state', fn: function (_this) {
																Context.set('current_user_profile', userPrototype);
															}}
														],
													},
												});

												// render
												_this.children[userButton.id] = userButton;
												userButton.render();
											});

											// fade loading icon
											_this.parent().loadingIcon().model().fadeOut();
										});
									}
								}},
							],
						},
					}),
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
			UI.createComponent('umi-new-user-panel', {
				template: UI.template('div', 'ie relative'),
				appearance: {
					style: {
						'width': '300px',
						'height': '100%',
						'margin-left': '10px',
						'float': 'left',
					},
				},
				state: {
					defaultState: {
						style: {
							'opacity': '0.0',
						},
						fn: UI.functions.deactivate,
					},
					states: [
						{name: 'user-management-state', args: 'default'},
						{name: 'user-management-new-user-state', args: {
							preFn: UI.functions.activate,
							style: {
								'opacity': '1.0',
							},
						}},
						{name: 'user-management-settings-state', args: 'default'},
					],
				},
				children: [
					UI.createComponent('umi-nup-title', {
						template: UI.template('h3', 'ie show relative'),
						appearance: {
							style: {
								'height': '30px',
							},
							html: `New user`,
						},
					}),
					UI.createComponent('umi-nup-client-subtitle', {
						template: UI.template('span', 'ie show relative'),
						appearance: {
							style: {
								'font-size': '14px',
								'margin-bottom': '15px',
							},
						},
						state: {
							states: [
								{name: 'user-management-new-user-state', args: {
									preFn: function (_this) {
										_this.model().html(Context.get('current_client'));
									}
								}}
							],
						},
					}),
					UI.createComponent('umi-nup-first-name', {
						template: UI.template('input', 'ie input show relative'),
						appearance: {
							style: {
								'margin-bottom': '10px',
								'width': '225px',
							},
							properties: {
								'placeholder': 'First name',
							},
						},
						state: {
							defaultState: {
								fn: function (_this) {
									_this.model().val('');
									_this.model().removeClass('error');
								},
							},
							states: [
								{name: 'user-management-new-user-state', args: 'default'},
								{name: 'control-state', args: 'default'},
							],
						},
					}),
					UI.createComponent('umi-nup-last-name', {
						template: UI.template('input', 'ie input show relative'),
						appearance: {
							style: {
								'width': '225px',
								'margin-bottom': '10px',
							},
							properties: {
								'placeholder': 'Last name',
							},
						},
						state: {
							defaultState: {
								fn: function (_this) {
									_this.model().val('');
									_this.model().removeClass('error');
								},
							},
							states: [
								{name: 'user-management-new-user-state', args: 'default'},
								{name: 'control-state', args: 'default'},
							],
						},
					}),
					UI.createComponent('umi-nup-email', {
						template: UI.template('input', 'ie input show relative'),
						appearance: {
							style: {
								'width': '275px',
								'margin-bottom': '10px',
							},
							properties: {
								'placeholder': 'Email',
							},
						},
						state: {
							defaultState: {
								fn: function (_this) {
									_this.model().val('');
									_this.model().removeClass('error');
								},
							},
							states: [
								{name: 'user-management-new-user-state', args: 'default'},
								{name: 'control-state', args: 'default'},
							],
						},
					}),
					UI.createComponent('umi-nup-roles', {
						template: UI.template('div', 'ie show relative'),
						appearance: {
							style: {
								'width': '100%',
								'margin-bottom': '20px',
							}
						},
						children: [
							UI.createComponent('umi-nup-roles-title', {
								template: UI.template('h3', 'ie show relative'),
								appearance: {
									html: 'Roles',
								},
							}),
							Components.roleIndicator('umi-nup-roles-admin', {
								label: 'admin',
								basic: true,
							}),
							Components.roleIndicator('umi-nup-roles-moderator', {
								label: 'moderator',
								basic: true,
							}),
							Components.roleIndicator('umi-nup-roles-worker', {
								label: 'worker',
								basic: true,
							}),
							UI.createComponent('umi-nup-roles-error-box', {
								template: UI.template('div', 'ie border border-radius'),
								appearance: {
									style: {
										'width': '135px',
										'height': '140px',
										'top': '30px',
										'left': '140px',
										'padding-top': '50px',
										'padding-left': '10px',
										'padding-right': '10px',
										'text-align': 'center',
										'color': '#aaa',
										'font-size': '14px',
									},
									html: `Please enter at least one role.`,
								},
								state: {
									defaultState: {
										fn: function (_this) {
											_this.model().removeClass('show error');
										},
									},
									states: [
										{name: 'user-management-new-user-state', args: 'default'},
										{name: 'control-state', args: 'default'},
									],
								},
							}),
						],
					}),
					UI.createComponent('nuc-confirm-button', {
						template: UI.templates.button,
						appearance: {
							classes: ['border border-radius'],
							style: {
								'transform': 'none',
								'left': '0px',
								'height': '40px',
								'padding-top': '10px',
							},
							html: 'Confirm',
						},
						bindings: [
							{name: 'click', fn: function (_this) {
								// perform checks
								var noProblems = true;
								// 1. must have first name
								var firstName = UI.getComponent('umi-nup-first-name');
								if (firstName.model().val() === '') {
									firstName.model().addClass('error');
									noProblems = false;
								} else {
									firstName.model().removeClass('error');
								}

								// 2. must have last name
								var lastName = UI.getComponent('umi-nup-last-name');
								if (lastName.model().val() === '') {
									lastName.model().addClass('error');
									noProblems = false;
								} else {
									lastName.model().removeClass('error');
								}

								// 3. must have email
								var email = UI.getComponent('umi-nup-email');
								if (email.model().val() === '') {
									email.model().addClass('error');
									noProblems = false;
								} else {
									email.model().removeClass('error');
								}

								// 4. must have at least one role
								var adminRole = UI.getComponent('umi-nup-roles-admin').isEnabled();
								var moderatorRole = UI.getComponent('umi-nup-roles-moderator').isEnabled();
								var workerRole = UI.getComponent('umi-nup-roles-worker').isEnabled();
								var roleErrorBox = UI.getComponent('umi-nup-roles-error-box');
								if (!adminRole && !moderatorRole && !workerRole) {
									roleErrorBox.model().addClass('show error');
									noProblems = false;
								} else {
									roleErrorBox.model().removeClass('show error');
								}

								if (noProblems) {
									// submit user
									var userData = {
										'current_client': Context.get('current_client'),
										'current_role': Context.get('current_role'),
										'first_name': firstName.model().val(),
										'last_name': lastName.model().val(),
										'email': email.model().val(),
										'roles_admin': adminRole,
										'roles_moderator': moderatorRole,
										'roles_worker': workerRole,
									};

									// clear inputs
									firstName.model().val('');
									lastName.model().val('');
									email.model().val('');
									UI.getComponent('nraw-tb-check').model().addClass('glyphicon-hidden');
									UI.getComponent('nrmw-tb-check').model().addClass('glyphicon-hidden');
									UI.getComponent('nrww-tb-check').model().addClass('glyphicon-hidden');

									// change to user confirm state
									_this.triggerState();

									// call add_user command
									command('create_user', userData, function (userPrototype) {

									});
								}
							}},
						],
					}),
				],
			}),
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
					Components.scrollList('pi-mp-project-group-list', {

					}),
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
				'control-state': 'default',
				'user-management-state': 'default',
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
				'interface-state': 'next',
				'user-management-state': 'next',
				'project-state': 'next',
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
