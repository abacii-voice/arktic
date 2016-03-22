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
		Context.set('current_client', 'TestProductionClient');
		Context.set('current_role', 'productionadmin')
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

	// interfaces
	'message-state',
	'billing-state',
	'stats-state',
	'rules-state',
	'user-stats-state',
	'search-state',
	'user-management-state',
	'user-management-user-state',
	'user-management-new-user-state',
	'user-management-confirm-user-state',
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
	UI.createComponent('breadcrumbs', {
		children: [
			UI.createComponent('breadcrumbs-client'),
			UI.createComponent('breadcrumbs-role'),
			UI.createComponent('breadcrumbs-location'),
		],
	}),

	// interfaces
	// now
	UI.createComponent('audio-interface', {

	}),
	UI.createComponent('upload-interface', {
		children: [
			UI.createComponent('upload-interface-left-panel', {
				children: [
					UI.createComponent('new-project-dialogue', {
						children: [
							UI.createComponent('project-title'),
							UI.createComponent('project-name-input'),
							UI.createComponent('project-deadline-date-picker'),
							UI.createComponent('project-description-textarea'),
						],
					}),
					UI.createComponent('rel-file-dropzone-wrapper', {
						children: [
							UI.createComponent('rel-file-title'),
							UI.createComponent('rel-file-dropzone', {
								children: [
									UI.createComponent('rel-file-dropzone-guide', {
										children: [
											UI.createComponent('rel-file-dropzone-guide-title'),
											UI.createComponent('rel-file-dropzone-guide-table'),
										],
									}),
									UI.createComponent('rel-file-dropzone-warning'),
								],
							}),
							UI.createComponent('rel-file-file-list'),
						],
					}),
				],
			}),
			UI.createComponent('upload-interface-right-panel', {
				children: [
					UI.createComponent('audio-title', {

					}),
					UI.createComponent('audio-file-dropzone-wrapper', {
						children: [
							UI.createComponent('audio-file-dropzone'),
							UI.createComponent('audio-file-confirmation-panel'),
						],
					}),
					UI.createComponent('upload-confirmation-button'),
				],
			}),
		],
	}),
	UI.createComponent('user-management-interface', {
		template: UI.template('div', 'ie panel context centred-vertically'),
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
			UI.createComponent('user-management-interface-left-panel', {
				template: UI.template('div', 'ie panel sub-panel show'),
				appearance: {
					style: {
						'height': '100%',
						'width': '200px',
					},
				},
				children: [
					UI.createComponent('user-title', {
						template: UI.template('h4', 'ie panel-title show'),
						appearance: {
							html: 'Users',
							style: {
								'margin-top': '0px',
								'text-align': 'left',
								'padding-left': '0px',
							},
						},
					}),
					UI.createComponent('user-list-search-input', {
						template: UI.template('input', 'ie input show'),
						appearance: {
							style: {
								'top': '25px',
								'width': '200px',
							},
							properties: {
								placeholder: 'Search or filter...'
							},
						},
					}),
					UI.createComponent('user-list-wrapper', {
						template: UI.template('div', 'ie scroll-wrapper relative show'),
						appearance: {
							style: {
								'top': '70px',
								'height': 'calc(100% - 70px)',
							},
						},
						children: [
							UI.createComponent('user-list', {
								template: UI.template('div', 'ie scroll show'),
								state: {
									states: [
										{name: 'user-management-state', args: {
											preFn: function (_this) {
												// 1. remove current children
												_this.children.map(function (child) {
													UI.removeComponent(child.id);
												});

												_this.children = [];

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
																	'width': '190px',
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
																		// get user data
																		var userFirstName = userPrototype.first_name;
																		var userLastName = userPrototype.last_name;

																		var userAdminEnabled = false;
																		var userAdminActivated = false;
																		if (userPrototype.roles.productionadmin !== undefined || userPrototype.roles.contractadmin !== undefined) {
																			if (Context.get('clients', Context.get('current_client')).is_production) {
																				userAdminEnabled = userPrototype.roles.productionadmin.is_enabled;
																				userAdminActivated = !userPrototype.roles.productionadmin.is_new;
																			} else {
																				userAdminEnabled = userPrototype.roles.contractadmin.is_enabled;
																				userAdminActivated = !userPrototype.roles.contractadmin.is_new;
																			}
																		}

																		var userModeratorEnabled = false;
																		var userModeratorActivated = false
																		var userWorkerEnabled = false;
																		var userWorkerActivated = false;

																		if () {

																		}
																		userModeratorEnabled = !userPrototype.roles['moderator'].is_new;
																		userModeratorActivated =
																		userWorkerEnabled =
																		userWorkerActivated =

																		// get user card objects
																		var nameField = UI.getComponent('uc-name');
																		var emailField = UI.getComponent('uc-email');

																		// roles
																		var adminRoleEnabled = UI.getComponent('urab-enabled');
																		var adminRoleDisabled = UI.getComponent('urab-disabled');
																		var adminRolePending = UI.getComponent('urab-pending');
																		var adminRoleAdd = UI.getComponent('urab-add');

																		var moderatorRoleEnabled = UI.getComponent('urmb-enabled');
																		var moderatorRoleDisabled = UI.getComponent('urmb-disabled');
																		var moderatorRolePending = UI.getComponent('urmb-pending');
																		var moderatorRoleAdd = UI.getComponent('urmb-add');

																		var workerRoleEnabled = UI.getComponent('urwb-enabled');
																		var workerRoleDisabled = UI.getComponent('urwb-disabled');
																		var workerRolePending = UI.getComponent('urwb-pending');
																		var workerRoleAdd = UI.getComponent('urwb-add');

																		// update values
																		nameField.model().html('{first_name} {last_name}'.format({first_name: userFirstName, last_name: userLastName}));
																		emailField.model().html(userPrototype.email);


																		adminRoleEnabled.model().
																	}}
																],
															},
														});

														// render
														_this.children.push(userButton);
														userButton.render();
													});

													// fade loading icon
													UI.getComponent('ul-loading-icon').model().fadeOut();
												});
											}
										}},
									],
								},
							}),
							UI.createComponent('ul-loading-icon', {
								template: UI.templates.loadingIcon,
								appearance: {
									classes: ['ie centred show'],
								}
							}),
						],
					}),
				],
			}),
			UI.createComponent('user-management-interface-right-panel', {
				template: UI.template('div', 'ie panel sub-panel border border-radius show'),
				appearance: {
					style: {
						'height': '100%',
						'width': '300px',
						'left': '210px',
					},
				},
				children: [
					UI.createComponent('user-card-wrapper', {
						children: [
							UI.createComponent('user-card', {
								state: {
									defaultState: {
										preFn: function (_this) {

										},
										style: {
											'opacity': '0.0',
										},
										fn: function (_this) {
											_this.model().css({'display': 'none'});

											var nameField = UI.getComponent('uc-name');
											var emailField = UI.getComponent('uc-email');

											// remove content from user card
											nameField.model().html('');
											nameField.model().attr('userid', '');
											emailField.model().html('');
										},
									},
									states: [
										{name: 'role-state', args: 'default'},
										{name: 'control-state', args: 'default'},
										{name: 'user-management-state', args: 'default'},
										{name: 'user-management-user-state', args: {
											preFn: UI.functions.activate,
											style: {
												'opacity': '1.0',
											},
										}},
										{name: 'user-management-new-user-state', args: 'default'},
									],
								},
								children: [
									UI.createComponent('uc-name', {
										template: UI.template('span', 'ie show'),
										appearance: {
											style: {
												'font-size': '18px',
												'top': '10px',
												'left': '10px',
												'color': '#ccc',
											},
										},
									}),
									UI.createComponent('uc-email', {
										template: UI.template('span', 'ie show'),
										appearance: {
											style: {
												'color': '#ccc',
												'top': '35px',
												'left': '10px',
											},
										},
									}),
									UI.createComponent('uc-roles', {
										template: UI.template('div', 'ie show'),
										appearance: {
											style: {
												'top': '61px',
												'width': '100%',
												'height': '200px',
											},
										},
										children: [
											UI.createComponent('uc-roles-title', {
												template: UI.template('span', 'ie show'),
												appearance: {
													style: {
														'font-size': '18px',
														'color': '#ccc',
														'top': '0px',
														'left': '10px',
													},
													html: 'Roles',
												},
											}),
											UI.createComponent('uc-roles-admin-wrapper', {
												template: UI.template('div', 'ie show'),
												appearance: {
													style: {
														'top': '30px',
														'width': '100%',
													},
												},
												children: [
													UI.createComponent('uc-roles-admin-title', {
														template: UI.templates.button,
														appearance: {
															style: {
																'position': 'absolute',
																'padding-left': '10px',
																'padding-top': '12px',
																'height': '40px',
																'transform': 'none',
																'left': '0px',
																'width': '200px',
																'text-align': 'left',
															},
															html: 'Admin',
														},
														bindings: [
															// click to show stats
														],
													}),
													UI.createComponent('uc-roles-admin-button', {
														template: UI.templates.button,
														appearance: {
															classes: ['border border-radius'],
															style: {
																'transform': 'none',
																'left': '246px',
																'height': '40px',
																'width': '40px',
																'padding-top': '10px',
																'margin-right': '0px',
															},
														},
														children: [
															UI.createComponent('urab-enabled', {
																template: UI.template('span', 'glyphicon glyphicon-ok'),
															}),
															UI.createComponent('urab-disabled', {
																template: UI.template('span', 'glyphicon glyphicon-remove'),
															}),
															UI.createComponent('urab-pending', {
																template: UI.template('span', 'glyphicon glyphicon-option-horizontal'),
															}),
															UI.createComponent('urab-add', {
																template: UI.template('span', 'glyphicon glyphicon-plus'),
															}),
														],
														bindings: [
															{name: 'click', fn: function (_this) {
																// get elements
																var enabled = UI.getComponent('urab-enabled');
																var disabled = UI.getComponent('urab-disabled');
																var pending = UI.getComponent('urab-pending');
																var add = UI.getComponent('urab-add');

																var roleData = {
																	'current_client': Context.get('current_client'),
																	'user_id': UI.getComponent('uc-name').model().attr('userid'),
																	'role_type': 'admin',
																};

																// check for status to determine action
																if (enabled.model().hasClass('enabled')) {
																	// role is activated
																	if (!enabled.model().hasClass('glyphicon-hidden')) {
																		command('disable_role', roleData, function (data) {});
																	} else {
																		command('enable_role', roleData, function (data) {});
																	}

																	enabled.model().toggleClass('glyphicon-hidden');
																	disabled.model().toggleClass('glyphicon-hidden');

																} else {
																	// role is either pending or non-existent
																	if (!pending.model().hasClass('enabled')) {
																		// press add
																		// 1. send add role
																		command('add_role_to_user', roleData, function (data) {});

																		// 2. switch to pending button
																		pending.model().addClass('enabled');
																		pending.model().toggleClass('glyphicon-hidden');
																		add.model().toggleClass('glyphicon-hidden');
																	}
																}
															}},
														],
													}),
												],
											}),
											UI.createComponent('uc-roles-moderator-wrapper', {
												template: UI.template('div', 'ie show'),
												appearance: {
													style: {
														'top': '80px',
														'width': '100%',
													},
												},
												children: [
													UI.createComponent('uc-roles-moderator-title', {
														template: UI.templates.button,
														appearance: {
															style: {
																'position': 'absolute',
																'padding-left': '10px',
																'padding-top': '12px',
																'height': '40px',
																'transform': 'none',
																'left': '0px',
																'width': '200px',
																'text-align': 'left',
															},
															html: 'Moderator',
														},
														bindings: [
															// click to show stats
														],
													}),
													UI.createComponent('uc-roles-moderator-button', {
														template: UI.templates.button,
														appearance: {
															classes: ['border border-radius'],
															style: {
																'transform': 'none',
																'left': '246px',
																'height': '40px',
																'width': '40px',
																'padding-top': '10px',
																'margin-right': '0px',
															},
														},
														children: [
															UI.createComponent('urmb-enabled', {
																template: UI.template('span', 'glyphicon glyphicon-ok'),
															}),
															UI.createComponent('urmb-disabled', {
																template: UI.template('span', 'glyphicon glyphicon-remove'),
															}),
															UI.createComponent('urmb-pending', {
																template: UI.template('span', 'glyphicon glyphicon-option-horizontal'),
															}),
															UI.createComponent('urmb-add', {
																template: UI.template('span', 'glyphicon glyphicon-plus'),
															}),
														],
														bindings: [
															{name: 'click', fn: function (_this) {
																// get elements
																var enabled = UI.getComponent('urmb-enabled');
																var disabled = UI.getComponent('urmb-disabled');
																var pending = UI.getComponent('urmb-pending');
																var add = UI.getComponent('urmb-add');

																var roleData = {
																	'current_client': Context.get('current_client'),
																	'user_id': UI.getComponent('uc-name').model().attr('userid'),
																	'role_type': 'moderator',
																};

																// check for status to determine action
																if (enabled.model().hasClass('enabled')) {
																	// role is activated
																	if (!enabled.model().hasClass('glyphicon-hidden')) {
																		command('disable_role', roleData, function (data) {});
																	} else {
																		command('enable_role', roleData, function (data) {});
																	}

																	enabled.model().toggleClass('glyphicon-hidden');
																	disabled.model().toggleClass('glyphicon-hidden');

																} else {
																	// role is either pending or non-existent
																	if (!pending.model().hasClass('enabled')) {
																		// press add
																		// 1. send add role
																		command('add_role_to_user', roleData, function (data) {});

																		// 2. switch to pending button
																		pending.model().addClass('enabled');
																		pending.model().toggleClass('glyphicon-hidden');
																		add.model().toggleClass('glyphicon-hidden');
																	}
																}
															}},
														],
													}),
												],
											}),
											UI.createComponent('uc-roles-worker-wrapper', {
												template: UI.template('div', 'ie show'),
												appearance: {
													style: {
														'top': '130px',
														'width': '100%',
													},
												},
												children: [
													UI.createComponent('uc-roles-worker-title', {
														template: UI.templates.button,
														appearance: {
															style: {
																'position': 'absolute',
																'padding-left': '10px',
																'padding-top': '12px',
																'height': '40px',
																'transform': 'none',
																'left': '0px',
																'width': '200px',
																'text-align': 'left',
															},
															html: 'Transcriber',
														},
														bindings: [
															// click to show stats
														],
													}),
													UI.createComponent('uc-roles-worker-button', {
														template: UI.templates.button,
														appearance: {
															classes: ['border border-radius'],
															style: {
																'transform': 'none',
																'left': '246px',
																'height': '40px',
																'width': '40px',
																'padding-top': '10px',
																'margin-right': '0px',
															},
														},
														children: [
															UI.createComponent('urwb-enabled', {
																template: UI.template('span', 'glyphicon glyphicon-ok'),
															}),
															UI.createComponent('urwb-disabled', {
																template: UI.template('span', 'glyphicon glyphicon-remove'),
															}),
															UI.createComponent('urwb-pending', {
																template: UI.template('span', 'glyphicon glyphicon-option-horizontal'),
															}),
															UI.createComponent('urwb-add', {
																template: UI.template('span', 'glyphicon glyphicon-plus'),
															}),
														],
														bindings: [
															{name: 'click', fn: function (_this) {
																// get elements
																var enabled = UI.getComponent('urwb-enabled');
																var disabled = UI.getComponent('urwb-disabled');
																var pending = UI.getComponent('urwb-pending');
																var add = UI.getComponent('urwb-add');

																var roleData = {
																	'current_client': Context.get('current_client'),
																	'user_id': UI.getComponent('uc-name').model().attr('userid'),
																	'role_type': 'worker',
																};

																// check for status to determine action
																if (enabled.model().hasClass('enabled')) {
																	// role is activated
																	if (!enabled.model().hasClass('glyphicon-hidden')) {
																		command('disable_role', roleData, function (data) {});
																	} else {
																		command('enable_role', roleData, function (data) {});
																	}

																	enabled.model().toggleClass('glyphicon-hidden');
																	disabled.model().toggleClass('glyphicon-hidden');

																} else {
																	// role is either pending or non-existent
																	if (!pending.model().hasClass('enabled')) {
																		// press add
																		// 1. send add role
																		command('add_role_to_user', roleData, function (data) {});

																		// 2. switch to pending button
																		pending.model().addClass('enabled');
																		pending.model().toggleClass('glyphicon-hidden');
																		add.model().toggleClass('glyphicon-hidden');
																	}
																}
															}},
														],
													}),
												],
											}),
										],
									}),
								],
							}),
							UI.createComponent('new-user-button', {
								template: UI.templates.button,
								appearance: {
									classes: ['border border-radius'],
									style: {
										'position': 'absolute',
										'width': '40px',
										'height': '40px',
										'left': 'auto',
										'top': '10px',
										'right': '10px',
										'transform': 'none',
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
								},
							}),
							UI.createComponent('new-user-card', {
								appearance: {
									style: {
										'display': 'none',
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
										{name: 'user-management-user-state', args: 'default'},
										{name: 'user-management-state', args: 'default'},
										{name: 'control-state', args: 'default'},
										{name: 'role-state', args: 'default'},
										{name: 'user-management-new-user-state', args: {
											preFn: UI.functions.activate,
											style: {
												'opacity': '1.0',
											},
										}},
									],
								},
								children: [
									UI.createComponent('nuc-title', {
										template: UI.template('span', 'ie show'),
										appearance: {
											style: {
												'font-size': '18px',
												'top': '10px',
												'left': '10px',
												'color': '#ccc',
											},
											html: `New user`,
										},
									}),
									UI.createComponent('nuc-client-subtitle', {
										template: UI.template('span', 'ie show'),
										appearance: {
											style: {
												'font-size': '14px',
												'color': '#ccc',
												'top': '35px',
												'left': '10px',
											},
											html: '',
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
									UI.createComponent('nuc-first-name', {
										template: UI.template('input', 'ie input show'),
										appearance: {
											style: {
												'top': '60px',
												'left': '10px',
												'width': '225px',
											},
											properties: {
												'placeholder': 'First name',
											},
										},
									}),
									UI.createComponent('nuc-last-name', {
										template: UI.template('input', 'ie input show'),
										appearance: {
											style: {
												'top': '106px',
												'left': '10px',
												'width': '225px',
											},
											properties: {
												'placeholder': 'Last name',
											},
										},
									}),
									UI.createComponent('nuc-email', {
										template: UI.template('input', 'ie input show'),
										appearance: {
											style: {
												'top': '152px',
												'left': '10px',
												'width': '275px',
											},
											properties: {
												'placeholder': 'Email',
											},
										},
									}),
									UI.createComponent('nuc-roles', {
										template: UI.template('div', 'ie show'),
										appearance: {
											style: {
												'top': '200px',
												'width': '100%',
												'height': '200px',
											}
										},
										children: [
											UI.createComponent('nuc-roles-title', {
												template: UI.template('span', 'ie show'),
												appearance: {
													style: {
														'font-size': '18px',
														'color': '#ccc',
														'top': '0px',
														'left': '10px',
													},
													html: 'Roles',
												},
											}),
											UI.createComponent('nuc-roles-admin-wrapper', {
												template: UI.template('div', 'ie show'),
												appearance: {
													style: {
														'top': '30px',
														'width': '100%',
														'height': '40px',
													}
												},
												children: [
													UI.createComponent('nraw-tick-button', {
														template: UI.templates.button,
														appearance: {
															classes: ['border border-radius'],
															style: {
																'position': 'absolute',
																'transform': 'none',
																'left': '10px',
																'height': '40px',
																'width': '40px',
																'padding-top': '10px',
																'margin-right': '0px',
															},
														},
														children: [
															UI.createComponent('nraw-tb-check', {
																template: UI.template('span', 'glyphicon glyphicon-ok glyphicon-hidden'),
															}),
														],
														bindings: [
															{name: 'click', fn: function (_this) {
																var check = UI.getComponent('nraw-tb-check');
																check.model().toggleClass('glyphicon-hidden');
															}}
														],
													}),
													UI.createComponent('nraw-name-button', {
														template: UI.templates.button,
														appearance: {
															style: {
																'position': 'absolute',
																'top': '0px',
																'left': '50px',
																'transform': 'none',
																'height': '40px',
																'padding-top': '10px',
																'text-align': 'left',
																'padding-left': '10px',
															},
															html: 'Admin',
														},
														bindings: [
															{name: 'click', fn: function (_this) {
																var check = UI.getComponent('nraw-tb-check');
																check.model().toggleClass('glyphicon-hidden');
															}}
														],
													})
												],
											}),
											UI.createComponent('nuc-roles-moderator-wrapper', {
												template: UI.template('div', 'ie show'),
												appearance: {
													style: {
														'top': '80px',
														'width': '100%',
														'height': '40px',
													}
												},
												children: [
													UI.createComponent('nrmw-tick-button', {
														template: UI.templates.button,
														appearance: {
															classes: ['border border-radius'],
															style: {
																'position': 'absolute',
																'transform': 'none',
																'left': '10px',
																'height': '40px',
																'width': '40px',
																'padding-top': '10px',
																'margin-right': '0px',
															},
														},
														children: [
															UI.createComponent('nrmw-tb-check', {
																template: UI.template('span', 'glyphicon glyphicon-ok glyphicon-hidden'),
															}),
														],
														bindings: [
															{name: 'click', fn: function (_this) {
																var check = UI.getComponent('nrmw-tb-check');
																check.model().toggleClass('glyphicon-hidden');
															}}
														],
													}),
													UI.createComponent('nrmw-name-button', {
														template: UI.templates.button,
														appearance: {
															style: {
																'position': 'absolute',
																'top': '0px',
																'left': '50px',
																'transform': 'none',
																'height': '40px',
																'padding-top': '10px',
																'text-align': 'left',
																'padding-left': '10px',
															},
															html: 'Moderator',
														},
														bindings: [
															{name: 'click', fn: function (_this) {
																var check = UI.getComponent('nrmw-tb-check');
																check.model().toggleClass('glyphicon-hidden');
															}}
														],
													})
												],
											}),
											UI.createComponent('nuc-roles-worker-wrapper', {
												template: UI.template('div', 'ie show'),
												appearance: {
													style: {
														'top': '130px',
														'width': '100%',
														'height': '40px',
													}
												},
												children: [
													UI.createComponent('nrww-tick-button', {
														template: UI.templates.button,
														appearance: {
															classes: ['border border-radius'],
															style: {
																'position': 'absolute',
																'transform': 'none',
																'left': '10px',
																'height': '40px',
																'width': '40px',
																'padding-top': '10px',
																'margin-right': '0px',
															},
														},
														children: [
															UI.createComponent('nrww-tb-check', {
																template: UI.template('span', 'glyphicon glyphicon-ok glyphicon-hidden'),
															}),
														],
														bindings: [
															{name: 'click', fn: function (_this) {
																var check = UI.getComponent('nrww-tb-check');
																check.model().toggleClass('glyphicon-hidden');
															}}
														],
													}),
													UI.createComponent('nrww-name-button', {
														template: UI.templates.button,
														appearance: {
															style: {
																'position': 'absolute',
																'top': '0px',
																'left': '50px',
																'transform': 'none',
																'height': '40px',
																'padding-top': '10px',
																'text-align': 'left',
																'padding-left': '10px',
															},
															html: 'Transcriber',
														},
														bindings: [
															{name: 'click', fn: function (_this) {
																var check = UI.getComponent('nrww-tb-check');
																check.model().toggleClass('glyphicon-hidden');
															}}
														],
													})
												],
											}),
											UI.createComponent('nuc-roles-error-box', {
												template: UI.template('div', 'ie border border-radius'),
												appearance: {
													style: {
														'width': '135px',
														'height': '140px',
														'top': '30px',
														'left': '150px',
														'padding-top': '50px',
														'text-align': 'center',
														'color': '#aaa',
													},
													html: `Please enter at least one role.`,
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
												'left': '10px',
												'top': '380px',
											},
											html: 'Confirm',
										},
										bindings: [
											{name: 'click', fn: function (_this) {
												// perform checks
												var noProblems = true;
												// 1. must have first name
												var firstName = UI.getComponent('nuc-first-name');
												if (firstName.model().val() === '') {
													firstName.model().addClass('error');
													noProblems = false;
												} else {
													firstName.model().removeClass('error');
												}

												// 2. must have last name
												var lastName = UI.getComponent('nuc-last-name');
												if (lastName.model().val() === '') {
													lastName.model().addClass('error');
													noProblems = false;
												} else {
													lastName.model().removeClass('error');
												}

												// 3. must have email
												var email = UI.getComponent('nuc-email');
												if (email.model().val() === '') {
													email.model().addClass('error');
													noProblems = false;
												} else {
													email.model().removeClass('error');
												}

												// 4. must have at least one role
												var adminRole = !UI.getComponent('nraw-tb-check').model().hasClass('glyphicon-hidden');
												var moderatorRole = !UI.getComponent('nrmw-tb-check').model().hasClass('glyphicon-hidden');
												var workerRole = !UI.getComponent('nrww-tb-check').model().hasClass('glyphicon-hidden');
												var roleErrorBox = UI.getComponent('nuc-roles-error-box');
												if (!adminRole && !moderatorRole && !workerRole) {
													roleErrorBox.model().addClass('show error');
													noProblems = false;
												} else {
													roleErrorBox.model().removeClass('show error');
												}

												if (noProblems) {
													// submit user
													// 1. unset all error classes

													// 2. call add_user command
													var userData = {
														'current_client': Context.get('current_client'),
														'first_name': firstName.model().val(),
														'last_name': lastName.model().val(),
														'email': email.model().val(),
														'roles_admin': adminRole,
														'roles_moderator': moderatorRole,
														'roles_worker': workerRole,
													};

													// 3. add loading button to list
													var loadingButton = UI.createComponent('nuc-loading-button', {
														template: UI.templates.button,
														children: [
															UI.createComponent('nuc-lb-loading-icon', {
																template: UI.template.loadingIcon,
															}),
														],
													});

													command('create_user', userData, function (data) {
														// 4. add user button to list when done
														// 5. remove loading button
														// 6. show new user confirmation panel
													});
												}
											}},
										],
									}),
								],
							}),
							UI.createComponent('user-title-card', {
								state: {
									defaultState: {
										style: {
											'opacity': '0.0',
										},
										fn: UI.functions.deactivate,
									},
									states: [
										{name: 'user-management-user-state', args: 'default'},
										{name: 'user-management-new-user-state', args: 'default'},
										{name: 'user-management-state', args: {
											preFn: UI.functions.activate,
											style: {
												'opacity': '1.0',
											},
										}},
									],
								},
								children: [
									UI.createComponent('utc-title', {
										template: UI.template('div', 'ie show centred'),
										appearance: {
											style: {
												'text-align': 'center',
											},
											html: `
												<h3>User</h3>
												<h3>Details</h3>
											`,
										},
									}),
								],
							}),
						],
					}),
				],
			}),
		],
	}),
	UI.createComponent('project-interface', {
		children: [
			UI.createComponent('project-interface-left-panel', {
				children: [
					UI.createComponent('project-list'),
				],
			}),
			UI.createComponent('project-interface-right-panel', {
				children: [
					UI.createComponent('project-card-wrapper', {
						children: [
							UI.createComponent('project-card'),
							UI.createComponent('new-project-button'),
						],
					}),
				],
			}),
		],
	}),
	UI.createComponent('billing-interface', {
		children: [
			UI.createComponent('billing-interface-left-panel', {
				children: [
					UI.createComponent('billing-user-search'),
					UI.createComponent('billing-confirmed-filter'),
					UI.createComponent('billing-date-list'),
				],
			}),
			UI.createComponent('billing-interface-right-panel', {
				children: [
					UI.createComponent('billing-card-wrapper', {
						children: [
							UI.createComponent('billing-card'),
							UI.createComponent('billing-card-confirm-button'),
						],
					}),
				],
			}),
		],
	}),
	UI.createComponent('rule-interface', {
		children: [
			UI.createComponent('rule-interface-left-panel', {
				children: [
					UI.createComponent('rule-search'),
					UI.createComponent('rule-list'),
				],
			}),
			UI.createComponent('rule-interface-right-panel', {
				children: [
					UI.createComponent('rule-card-wrapper', {
						children: [
							UI.createComponent('rule-card'),
							UI.createComponent('new-rule-button'),
							UI.createComponent('new-rule-card'),
						],
					}),
				],
			}),
		],
	}),

	// later
	UI.createComponent('search-interface', {
		children: [
			UI.createComponent('search-bar'),
			UI.createComponent('search-results'),
		],
	}),
	UI.createComponent('message-interface', {

	}),
	UI.createComponent('stats-interface', {

	}),

	// sidebars
	UI.createComponent('control-sidebar', {
		template: UI.template('div', 'ie sidebar centred-vertically'),
		state: {
			defaultState: {
				style: {
					'left': '-300px',
				},
			},
			states: [
				{name: 'client-state', args: 'default'},
				{name: 'role-state', args: 'default'},
				{name: 'control-state', args: {
					style: {
						'left': '50px',
					},
				}},
				{name: 'interface-state', args: 'default'},
				{name: 'upload-state', args: 'default'},
			],
		},
		children: [
			UI.createComponent('cns-scroll-wrapper', {
				template: UI.template('div', 'ie scroll-wrapper show'),
				appearance: {
					style: {
						'height': '100%',
					},
				},
				children: [
					UI.createComponent('cns-scroll', {
						template: UI.template('div', 'ie scroll show'),
						children: [
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
												var role = Context.get('current_role');
												var visibleCondition = (role === 'contractadmin');
												if (visibleCondition) {
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
												var visibleCondition = (role === 'contractadmin' || role === 'productionadmin');
												if (visibleCondition) {
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
												var visibleCondition = (role === 'productionadmin' || role === 'moderator' || role === 'contractadmin');
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
		],
	}),
	UI.createComponent('control-back-sidebar', {
		template: UI.template('div', 'ie sidebar mini border-right centred-vertically'),
		state: {
			defaultState: {
				style: {
					'left': '-50px',
				}
			},
			states: [
				{name: 'client-state', args: 'default'},
				{name: 'role-state', args: 'default'},
				{name: 'control-state', args: 'default'},
				{name: 'interface-state', args: {
					style: {
						'left': '0px',
					},
				}},
				{name: 'upload-state', args: {
					style: {
						'left': '0px',
					},
				}},
			],
		},
		children: [
			UI.createComponent('cnbs-back-button', {
				template: UI.templates.button,
				state: {
					stateMap: 'control-state',
				},
				children: [
					UI.createComponent('cnbs-bb-span', {
						template: UI.template('span', 'glyphicon glyphicon-chevron-left'),
					}),
				],
				bindings: [
					{name: 'click', fn: function (_this) {
						_this.triggerState();
					}}
				],
			}),
		],
	}),
	UI.createComponent('role-sidebar', {
		template: UI.template('div', 'ie sidebar border-right centred-vertically show'),
		state: {
			defaultState: {
				style: {
					'left': '-300px',
				},
			},
			states: [
				{name: 'client-state', args: 'default'},
				{name: 'role-state', args: {
					style: {
						'left': '50px',
					},
				}},
				{name: 'control-state', args: 'default'},
			],
		},
		children: [
			UI.createComponent('rs-title', {
				template: UI.template('h4', 'ie sidebar-title centred-horizontally show'),
				appearance: {
					html: 'Roles',
					style: {
						'height': '40px',
					},
				},
			}),
			UI.createComponent('rs-role-list-wrapper', {
				template: UI.template('div', 'ie scroll-wrapper show'),
				appearance: {
					style: {
						'position': 'relative',
						'top': '40px',
						'height': 'calc(100% - 40px)',
					},
				},
				children: [
					UI.createComponent('rs-role-list', {
						template: UI.template('div', 'ie scroll show'),
						state: {
							states: [
								{name: 'role-state', args: {
									preFn: function (_this) {
										// 1. remove current children
										_this.children.map(function (child) {
											UI.removeComponent(child.id);
										});

										_this.children = [];

										// 2. map data from context to new children and render
										var data = Context.get('clients', Context.get('current_client'), 'roles');
										data.map(function (roleName) {
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

											_this.children.push(child);
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
		],
	}),
	UI.createComponent('role-back-sidebar', {
		template: UI.template('div', 'ie sidebar mini border-right centred-vertically show'),
		state: {
			defaultState: {
				style: {
					'left': '-100px',
				}
			},
			states: [
				{name: 'client-state', args: 'default'},
				{name: 'role-state', args: 'default'},
				{name: 'control-state', args: {
					style: {
						'left': '0px',
					},
				}},
				{name: 'interface-state', args: 'default'},
				{name: 'upload-state', args: 'default'},
			],
		},
		children: [
			UI.createComponent('rbs-back-button', {
				template: UI.templates.button,
				state: {
					stateMap: 'role-state',
				},
				children: [
					UI.createComponent('rbs-bb-span', {
						template: UI.template('span', 'glyphicon glyphicon-chevron-left'),
					}),
				],
				bindings: [
					{name: 'click', fn: function (_this) {
						_this.triggerState();
					}}
				],
			}),
		],
	}),
	UI.createComponent('client-sidebar', {
		template: UI.template('div', 'ie sidebar border-right centred-vertically'),
		state: {
			defaultState: {
				style: {
					'left': '-300px',
					'display': 'none',
				},
			},
			states: [
				{name: 'client-state', args: {
					style: {
						'left': '0px',
						'display': 'block',
					},
				}},
				{name: 'role-state', args: 'default'},
			],
		},
		children: [
			UI.createComponent('cs-title', {
				template: UI.template('h4', 'ie sidebar-title centred-horizontally show'),
				appearance: {
					html: 'Clients',
					style: {
						'height': '40px',
					},
				},
			}),
			UI.createComponent('cs-client-list-wrapper', {
				template: UI.template('div', 'ie scroll-wrapper show'),
				appearance: {
					style: {
						'position': 'relative',
						'top': '40px',
						'height': 'calc(100% - 40px)',
					},
				},
				children: [
					UI.createComponent('cs-client-list', {
						template: UI.template('div', 'ie scroll show'),
						registry: {
							path: function () {
								return ['clients'];
							},
							fn: function (_this, data) {
								// create buttons from Context and remove loading icon
								// 'data' is a list of client names

								// remove loading button
								var loadingIcon = UI.getComponent('cs-loading-icon');
								loadingIcon.model().fadeOut();

								var clientList = Object.keys(data);

								// map data to new buttons
								clientList.map(function (clientName) {
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

									_this.children.push(child);
									child.render();

									// make buttons visible
									child.model().animate({'opacity': '1.0'});
								});
							}
						},
					}),
					UI.createComponent('cs-loading-icon', {
						template: UI.templates.loadingIcon,
						appearance: {
							classes: ['ie centred show'],
						},
					}),
				],
			}),
		],
	}),
	UI.createComponent('client-back-sidebar', {
		template: UI.template('div', 'ie sidebar mini border-right centred-vertically'),
		state: {
			defaultState: {
				style: {
					'left': '-100px',
				}
			},
			states: [
				{name: 'client-state', args: 'default'},
				{name: 'role-state', args: {
					style: {
						'left': '0px',
					},
				}},
				{name: 'control-state', args: 'default'},
			],
		},
		children: [
			UI.createComponent('cbs-back-button', {
				template: UI.templates.button,
				state: {
					stateMap: 'client-state',
				},
				children: [
					UI.createComponent('cbs-bb-span', {
						template: UI.template('span', 'glyphicon glyphicon-chevron-left'),
					}),
				],
				bindings: [
					{name: 'click', fn: function (_this) {
						_this.triggerState();
					}}
				],
			}),
		],
	}),
]);

// 4. Render app
UI.renderApp();

// 5. Load data
Context.load();
