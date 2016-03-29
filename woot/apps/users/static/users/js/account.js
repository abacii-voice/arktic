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
	// 	Context.set('current_client', 'TestProductionClient');
	// 	Context.set('current_role', 'admin')
	// })).done(function () {
	// 	UI.changeState('user-management-state');
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
			UI.createComponent('user-management-interface-button-panel', {
				template: UI.template('div', 'ie panel sub-panel show relative'),
				appearance: {
					style: {
						'height': '100%',
						'width': '40px',
						'float': 'left',
					},
				},
				children: [
					UI.createComponent('new-user-button', {
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
					UI.createComponent('user-settings-button', {
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
							UI.createComponent('usb-span', {
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
				],
			}),
			UI.createComponent('user-management-interface-left-panel', {
				template: UI.template('div', 'ie panel sub-panel show relative'),
				appearance: {
					style: {
						'height': '100%',
						'width': '200px',
						'float': 'left',
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
												$.when(new Promise(function (resolve, reject) {
													_this.children.forEach(function (child) {
														UI.removeComponent(child.id);
													});
												})).done(function () {
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
														_this.children = Object.keys(users).map(function (userId) {
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
																			Context.set('current_user_profile', userPrototype);
																		}}
																	],
																},
															});

															// render
															userButton.render();

															// return button
															return userButton;
														});

														// fade loading icon
														UI.getComponent('ul-loading-icon').model().fadeOut();
													});
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
				template: UI.template('div', 'ie panel sub-panel show relative'),
				appearance: {
					style: {
						'height': '100%',
						'width': '654px',
						'float': 'left',
						'overflow': 'visible',
					},
				},
				children: [
					UI.createComponent('user-card-wrapper', {
						appearance: {
							style: {
								'height': '100%',
								'width': '100%',
							},
						},
						children: [
							UI.createComponent('user-card', {
								template: UI.template('div', 'ie show'),
								appearance: {
									style: {
										'height': '100%',
										'width': '100%',
									},
								},
								state: {
									defaultState: {
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
									UI.createComponent('user-card-left-column', {
										template: UI.template('div', 'ie show relative'),
										appearance: {
											style: {
												'width': '200px',
												'height': '100%',
												'float': 'left',
											},
										},
										children: [
											UI.createComponent('uc-header-wrapper', {
												template: UI.template('div', 'ie show relative'),
												appearance: {
													style: {
														'width': '200px',
														'height': '70px',
														'float': 'left',
													},
												},
												children: [
													UI.createComponent('uc-name', {
														template: UI.template('span', 'ie show'),
														appearance: {
															style: {
																'font-size': '18px',
																'color': '#ccc',
															},
														},
														state: {
															states: [
																{name: 'user-management-user-state', args: {
																	preFn: function (_this) {
																		var user = Context.get('current_user_profile');
																		_this.model().html('{first} {last}'.format({first: user.first_name, last: user.last_name}));
																	},
																}}
															],
														},
													}),
													UI.createComponent('uc-email', {
														template: UI.template('span', 'ie show'),
														appearance: {
															style: {
																'font-size': '14px',
																'color': '#ccc',
																'top': '25px',
																'height': '20px',
															},
														},
														state: {
															states: [
																{name: 'user-management-user-state', args: {
																	preFn: function (_this) {
																		var user = Context.get('current_user_profile');
																		_this.model().html(user.email);
																	},
																}}
															],
														},
													}),
												],
											}),
											UI.createComponent('uc-roles', {
												template: UI.template('div', 'ie show relative'),
												appearance: {
													style: {
														'width': '100%',
														'height': '190px',
														'float': 'left',
													},
												},
												state: {
													states: [
														{name: 'user-management-user-state', args: {
															preFn: function (_this) {
																if (Context.get('current_role') === 'admin' && Context.get('clients', Context.get('current_client')).is_production) {
																	_this.model().addClass('show');
																} else {
																	_this.model().removeClass('show');
																}
															}
														}},
													],
												},
												children: [
													UI.createComponent('uc-roles-title', {
														template: UI.template('span', 'ie show'),
														appearance: {
															style: {
																'font-size': '18px',
																'color': '#ccc',
																'top': '0px',
															},
															html: 'Roles',
														},
													}),
													UI.createComponent('uc-roles-admin-wrapper', {
														template: UI.template('div', 'ie show'),
														appearance: {
															style: {
																'top': '30px',
																'width': '150px',
															},
														},
														children: [
															UI.createComponent('uc-roles-admin-button', {
																template: UI.templates.button,
																appearance: {
																	classes: ['border border-radius relative'],
																	style: {
																		'transform': 'none',
																		'height': '40px',
																		'width': '40px',
																		'padding-top': '10px',
																		'float': 'left',
																		'left': '0px',
																	},
																},
																children: [
																	UI.createComponent('urab-enabled', {
																		template: UI.template('span', 'glyphicon glyphicon-ok'),
																		state: {
																			states: [
																				{name: 'user-management-user-state', args: {
																					preFn: function (_this) {
																						// get data
																						var user = Context.get('current_user_profile');
																						var model = _this.model();
																						// {is_approved: false, is_new: true, is_enabled: false}
																						if (user.roles.hasOwnProperty('admin')) {
																							if (user.roles.admin.is_enabled) {
																								model.removeClass('glyphicon-hidden').addClass('enabled');
																							} else {
																								if (user.roles.admin.is_new) {
																									model.addClass('glyphicon-hidden').removeClass('enabled');
																								} else {
																									model.addClass('glyphicon-hidden').addClass('enabled');
																								}
																							}
																						} else {
																							_this.model().addClass('glyphicon-hidden').removeClass('enabled');
																						}
																					},
																				}}
																			],
																		},
																	}),
																	UI.createComponent('urab-disabled', {
																		template: UI.template('span', 'glyphicon glyphicon-remove'),
																		state: {
																			states: [
																				{name: 'user-management-user-state', args: {
																					preFn: function (_this) {
																						// get data
																						var user = Context.get('current_user_profile');
																						if (user.roles.hasOwnProperty('admin')) {
																							if (user.roles.admin.is_enabled) {
																								_this.model().addClass('glyphicon-hidden');
																							} else {
																								if (user.roles.admin.is_new) {
																									_this.model().addClass('glyphicon-hidden');
																								} else {
																									_this.model().removeClass('glyphicon-hidden');
																								}
																							}
																						} else {
																							_this.model().addClass('glyphicon-hidden');
																						}
																					},
																				}}
																			],
																		},
																	}),
																	UI.createComponent('urab-pending', {
																		template: UI.template('span', 'glyphicon glyphicon-option-horizontal'),
																		state: {
																			states: [
																				{name: 'user-management-user-state', args: {
																					preFn: function (_this) {
																						// get data
																						var user = Context.get('current_user_profile');
																						if (user.roles.hasOwnProperty('admin')) {
																							if (user.roles.admin.is_new) {
																								_this.model().removeClass('glyphicon-hidden').addClass('enabled');
																							} else {
																								_this.model().addClass('glyphicon-hidden').removeClass('enabled');
																							}
																						} else {
																							_this.model().addClass('glyphicon-hidden').removeClass('enabled');
																						}
																					},
																				}}
																			],
																		},
																	}),
																	UI.createComponent('urab-add', {
																		template: UI.template('span', 'glyphicon glyphicon-plus'),
																		state: {
																			states: [
																				{name: 'user-management-user-state', args: {
																					preFn: function (_this) {
																						// get data
																						var user = Context.get('current_user_profile');
																						if (user.roles.hasOwnProperty('admin')) {
																							_this.model().addClass('glyphicon-hidden');
																						} else {
																							_this.model().removeClass('glyphicon-hidden');
																						}
																					},
																				}}
																			],
																		},
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
															UI.createComponent('uc-roles-admin-title', {
																template: UI.templates.button,
																appearance: {
																	style: {
																		'position': 'relative',
																		'padding-left': '10px',
																		'padding-top': '12px',
																		'height': '40px',
																		'transform': 'none',
																		'left': '0px',
																		'width': '100px',
																		'text-align': 'left',
																		'float': 'left',
																	},
																	html: 'Admin',
																},
																bindings: [
																	// click to show stats
																],
															}),
														],
													}),
													UI.createComponent('uc-roles-moderator-wrapper', {
														template: UI.template('div', 'ie show'),
														appearance: {
															style: {
																'top': '80px',
																'width': '150px',
															},
														},
														children: [
															UI.createComponent('uc-roles-moderator-button', {
																template: UI.templates.button,
																appearance: {
																	classes: ['border border-radius'],
																	style: {
																		'left': '0px',
																		'transform': 'none',
																		'height': '40px',
																		'width': '40px',
																		'padding-top': '10px',
																		'float': 'left',
																	},
																},
																children: [
																	UI.createComponent('urmb-enabled', {
																		template: UI.template('span', 'glyphicon glyphicon-ok'),
																		state: {
																			states: [
																				{name: 'user-management-user-state', args: {
																					preFn: function (_this) {
																						// get data
																						var user = Context.get('current_user_profile');
																						var model = _this.model();
																						if (user.roles.hasOwnProperty('moderator')) {
																							if (user.roles.admin.is_enabled) {
																								model.removeClass('glyphicon-hidden').addClass('enabled');
																							} else {
																								if (user.roles.admin.is_new) {
																									model.addClass('glyphicon-hidden').removeClass('enabled');
																								} else {
																									model.addClass('glyphicon-hidden').addClass('enabled');
																								}
																							}
																						} else {
																							_this.model().addClass('glyphicon-hidden').removeClass('enabled');
																						}
																					},
																				}}
																			],
																		},
																	}),
																	UI.createComponent('urmb-disabled', {
																		template: UI.template('span', 'glyphicon glyphicon-remove'),
																		state: {
																			states: [
																				{name: 'user-management-user-state', args: {
																					preFn: function (_this) {
																						// get data
																						var user = Context.get('current_user_profile');
																						if (user.roles.hasOwnProperty('moderator')) {
																							if (user.roles.admin.is_enabled) {
																								_this.model().addClass('glyphicon-hidden');
																							} else {
																								if (user.roles.admin.is_new) {
																									_this.model().addClass('glyphicon-hidden');
																								} else {
																									_this.model().removeClass('glyphicon-hidden');
																								}
																							}
																						} else {
																							_this.model().addClass('glyphicon-hidden');
																						}
																					},
																				}}
																			],
																		},
																	}),
																	UI.createComponent('urmb-pending', {
																		template: UI.template('span', 'glyphicon glyphicon-option-horizontal'),
																		state: {
																			states: [
																				{name: 'user-management-user-state', args: {
																					preFn: function (_this) {
																						// get data
																						var user = Context.get('current_user_profile');
																						if (user.roles.hasOwnProperty('moderator')) {
																							if (user.roles.admin.is_new) {
																								_this.model().removeClass('glyphicon-hidden').addClass('enabled');
																							} else {
																								_this.model().addClass('glyphicon-hidden').removeClass('enabled');
																							}
																						} else {
																							_this.model().addClass('glyphicon-hidden').removeClass('enabled');
																						}
																					},
																				}}
																			],
																		},
																	}),
																	UI.createComponent('urmb-add', {
																		template: UI.template('span', 'glyphicon glyphicon-plus'),
																		state: {
																			states: [
																				{name: 'user-management-user-state', args: {
																					preFn: function (_this) {
																						// get data
																						var user = Context.get('current_user_profile');
																						if (user.roles.hasOwnProperty('moderator')) {
																							_this.model().addClass('glyphicon-hidden');
																						} else {
																							_this.model().removeClass('glyphicon-hidden');
																						}
																					},
																				}}
																			],
																		},
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
															UI.createComponent('uc-roles-moderator-title', {
																template: UI.templates.button,
																appearance: {
																	style: {
																		'position': 'relative',
																		'padding-left': '10px',
																		'padding-top': '12px',
																		'height': '40px',
																		'transform': 'none',
																		'left': '0px',
																		'width': '100px',
																		'text-align': 'left',
																	},
																	html: 'Moderator',
																},
																bindings: [
																	// click to show stats
																],
															}),
														],
													}),
													UI.createComponent('uc-roles-worker-wrapper', {
														template: UI.template('div', 'ie show'),
														appearance: {
															style: {
																'top': '130px',
																'width': '150px',
															},
														},
														children: [
															UI.createComponent('uc-roles-worker-button', {
																template: UI.templates.button,
																appearance: {
																	classes: ['border border-radius'],
																	style: {
																		'left': '0px',
																		'transform': 'none',
																		'height': '40px',
																		'width': '40px',
																		'padding-top': '10px',
																		'float': 'left',
																	},
																},
																children: [
																	UI.createComponent('urwb-enabled', {
																		template: UI.template('span', 'glyphicon glyphicon-ok'),
																		state: {
																			states: [
																				{name: 'user-management-user-state', args: {
																					preFn: function (_this) {
																						// get data
																						var user = Context.get('current_user_profile');
																						var model = _this.model();
																						if (user.roles.hasOwnProperty('worker')) {
																							if (user.roles.admin.is_enabled) {
																								model.removeClass('glyphicon-hidden').addClass('enabled');
																							} else {
																								if (user.roles.admin.is_new) {
																									model.addClass('glyphicon-hidden').removeClass('enabled');
																								} else {
																									model.addClass('glyphicon-hidden').addClass('enabled');
																								}
																							}
																						} else {
																							_this.model().addClass('glyphicon-hidden').removeClass('enabled');
																						}
																					},
																				}}
																			],
																		},
																	}),
																	UI.createComponent('urwb-disabled', {
																		template: UI.template('span', 'glyphicon glyphicon-remove'),
																		state: {
																			states: [
																				{name: 'user-management-user-state', args: {
																					preFn: function (_this) {
																						// get data
																						var user = Context.get('current_user_profile');
																						if (user.roles.hasOwnProperty('worker')) {
																							if (user.roles.admin.is_enabled) {
																								_this.model().addClass('glyphicon-hidden');
																							} else {
																								if (user.roles.admin.is_new) {
																									_this.model().addClass('glyphicon-hidden');
																								} else {
																									_this.model().removeClass('glyphicon-hidden');
																								}
																							}
																						} else {
																							_this.model().addClass('glyphicon-hidden');
																						}
																					},
																				}}
																			],
																		},
																	}),
																	UI.createComponent('urwb-pending', {
																		template: UI.template('span', 'glyphicon glyphicon-option-horizontal'),
																		state: {
																			states: [
																				{name: 'user-management-user-state', args: {
																					preFn: function (_this) {
																						// get data
																						var user = Context.get('current_user_profile');
																						if (user.roles.hasOwnProperty('worker')) {
																							if (user.roles.admin.is_new) {
																								_this.model().removeClass('glyphicon-hidden').addClass('enabled');
																							} else {
																								_this.model().addClass('glyphicon-hidden').removeClass('enabled');
																							}
																						} else {
																							_this.model().addClass('glyphicon-hidden').removeClass('enabled');
																						}
																					},
																				}}
																			],
																		},
																	}),
																	UI.createComponent('urwb-add', {
																		template: UI.template('span', 'glyphicon glyphicon-plus'),
																		state: {
																			states: [
																				{name: 'user-management-user-state', args: {
																					preFn: function (_this) {
																						// get data
																						var user = Context.get('current_user_profile');
																						if (user.roles.hasOwnProperty('worker')) {
																							_this.model().addClass('glyphicon-hidden');
																						} else {
																							_this.model().removeClass('glyphicon-hidden');
																						}
																					},
																				}}
																			],
																		},
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
															UI.createComponent('uc-roles-worker-title', {
																template: UI.templates.button,
																appearance: {
																	style: {
																		'position': 'relative',
																		'padding-left': '10px',
																		'padding-top': '12px',
																		'height': '40px',
																		'transform': 'none',
																		'left': '0px',
																		'width': '100px',
																		'text-align': 'left',
																		'float': 'left',
																	},
																	html: 'Transcriber',
																},
																bindings: [
																	// click to show stats
																],
															}),
														],
													}),
												],
											}),
											UI.createComponent('uc-actions', {
												template: UI.template('div', 'ie show relative'),
												appearance: {
													style: {
														'width': '100%',
														'height': '400px',
														'float': 'left',
													},
												},
												children: [
													UI.createComponent('uc-actions-title', {
														template: UI.template('span', 'ie show'),
														appearance: {
															style: {
																'font-size': '18px',
																'color': '#ccc',
																'top': '0px',
															},
															html: 'Actions',
														},
													}),
													UI.createComponent('uc-actions-buttons', {
														template: UI.template('div', 'ie show relative'),
														appearance: {
															style: {
																'top': '30px',
																'height': '100%',
																'width': '100%',
															},
														},
														children: [
															UI.createComponent('uab-message-button', {
																template: UI.templates.button,
																appearance: {
																	style: {
																		'transform': 'none',
																		'left': '0px',
																		'width': '190px',
																		'margin-bottom': '10px',
																		'height': '40px',
																		'padding-top': '10px',
																	},
																	classes: ['border border-radius'],
																	html: 'Message',
																},
															}),
															UI.createComponent('uab-moderate-button', {
																template: UI.templates.button,
																appearance: {
																	style: {
																		'transform': 'none',
																		'left': '0px',
																		'width': '190px',
																		'margin-bottom': '10px',
																		'height': '78px',
																		'padding-top': '10px',
																	},
																	classes: ['border border-radius'],
																},
																state: {
																	stateMap: 'user-management-user-moderation-state',
																	states: [
																		{name: 'user-management-user-state', args: {
																			preFn: function (_this) {
																				var isModerator = Context.get('current_role') === 'moderator';
																				if (isModerator) {
																					_this.model().css({'display': 'block'});
																				} else {
																					_this.model().css({'display': 'none'});
																				}
																			},
																		}},
																	],
																},
																children: [
																	UI.createComponent('uab-moderation-title', {
																		template: UI.template('span', 'ie show relative'),
																		appearance: {
																			style: {
																				'top': '-5px',
																				'width': '100%',
																			},
																			html: 'Moderation'
																		},
																	}),
																	UI.createComponent('uab-moderation-score', {
																		template: UI.template('div', 'ie show relative'),
																		appearance: {
																			style: {
																				'width': '100%',
																				'padding-left': '10px',
																				'padding-right': '10px',
																				'font-size': '12px',
																				'margin-bottom': '4px',
																			},
																		},
																		children: [
																			UI.createComponent('uabms-title', {
																				template: UI.template('span', 'ie show relative'),
																				appearance: {
																					style: {
																						'float': 'left',
																					},
																					html: 'Score',
																				},
																			}),
																			UI.createComponent('uabms-value', {
																				template: UI.template('span', 'ie show relative'),
																				appearance: {
																					style: {
																						'float': 'right',
																					},
																					html: '1000',
																				},
																			}),
																		],
																	}),
																	UI.createComponent('uab-moderation-percentage', {
																		template: UI.template('div', 'ie show relative'),
																		appearance: {
																			style: {
																				'width': '100%',
																				'padding-left': '10px',
																				'padding-right': '10px',
																				'font-size': '12px',
																				'margin-bottom': '4px',
																			},
																		},
																		children: [
																			UI.createComponent('uabmp-title', {
																				template: UI.template('span', 'ie show relative'),
																				appearance: {
																					style: {
																						'float': 'left',
																					},
																					html: 'Current redundancy',
																				},
																			}),
																			UI.createComponent('uabmp-value', {
																				template: UI.template('span', 'ie show relative'),
																				appearance: {
																					style: {
																						'float': 'right',
																					},
																					html: '13%',
																				},
																			}),
																		],
																	}),
																],
																bindings: [
																	{name: 'click', fn: UI.functions.triggerState}
																],
															}),
															UI.createComponent('uab-stats-button', {
																template: UI.templates.button,
																appearance: {
																	style: {
																		'transform': 'none',
																		'left': '0px',
																		'width': '190px',
																		'margin-bottom': '10px',
																		'height': '100px',
																	},
																	classes: ['border border-radius'],
																},
																children: [
																	UI.createComponent('uab-stats-title', {
																		template: UI.template('span', 'ie show relative'),
																		appearance: {
																			style: {
																				'top': '-5px',
																				'width': '100%',
																			},
																			html: 'Statistics'
																		},
																	}),
																	UI.createComponent('uab-stats-total', {
																		template: UI.template('div', 'ie show relative'),
																		appearance: {
																			style: {
																				'width': '100%',
																				'padding-left': '10px',
																				'padding-right': '10px',
																				'font-size': '12px',
																				'margin-bottom': '4px',
																			},
																		},
																		children: [
																			UI.createComponent('uabst-title', {
																				template: UI.template('span', 'ie show relative'),
																				appearance: {
																					style: {
																						'float': 'left',
																					},
																					html: 'Total',
																				},
																			}),
																			UI.createComponent('uabst-value', {
																				template: UI.template('span', 'ie show relative'),
																				appearance: {
																					style: {
																						'float': 'right',
																					},
																					html: '1000',
																				},
																			}),
																		],
																	}),
																	UI.createComponent('uab-stats-week', {
																		template: UI.template('div', 'ie show relative'),
																		appearance: {
																			style: {
																				'width': '100%',
																				'padding-left': '10px',
																				'padding-right': '10px',
																				'font-size': '12px',
																				'margin-bottom': '4px',
																			},
																		},
																		children: [
																			UI.createComponent('uabsw-title', {
																				template: UI.template('span', 'ie show relative'),
																				appearance: {
																					style: {
																						'float': 'left',
																					},
																					html: 'Since 1/3/2016',
																				},
																			}),
																			UI.createComponent('uabsw-value', {
																				template: UI.template('span', 'ie show relative'),
																				appearance: {
																					style: {
																						'float': 'right',
																					},
																					html: '278',
																				},
																			}),
																		],
																	}),
																	UI.createComponent('uab-stats-percentage', {
																		template: UI.template('div', 'ie show relative'),
																		appearance: {
																			style: {
																				'width': '100%',
																				'padding-left': '10px',
																				'padding-right': '10px',
																				'font-size': '12px',
																				'margin-bottom': '4px',
																			},
																		},
																		children: [
																			UI.createComponent('uabsp-title', {
																				template: UI.template('span', 'ie show relative'),
																				appearance: {
																					style: {
																						'float': 'left',
																					},
																					html: 'Redundancy',
																				},
																			}),
																			UI.createComponent('uabsp-value', {
																				template: UI.template('span', 'ie show relative'),
																				appearance: {
																					style: {
																						'float': 'right',
																					},
																					html: '14%',
																				},
																			}),
																		],
																	}),
																],
															}),
															UI.createComponent('uab-settings-button', {
																template: UI.templates.button,
																appearance: {
																	style: {
																		'transform': 'none',
																		'left': '0px',
																		'width': '190px',
																		'margin-bottom': '10px',
																		'height': '40px',
																		'padding-top': '10px',
																	},
																	classes: ['border border-radius'],
																	html: `<span class='glyphicon glyphicon-cog'></span> Settings`,
																},
															}),
														],
													}),
												],
											}),
										],
									}),
									UI.createComponent('user-card-right-column', {
										template: UI.template('div', 'ie show relative'),
										appearance: {
											style: {
												'width': '454px',
												'height': '100%',
												'float': 'left',
											},
										},
										children: [
											UI.createComponent('uc-additional-panel', {
												template: UI.template('div', 'ie show border border-radius'),
												appearance: {
													style: {
														'border-style': 'dotted',
														'height': '100%',
														'width': '100%',
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
														{name: 'user-management-user-state', args: {
															preFn: UI.functions.activate,
															style: {
																'opacity': '1.0',
															},
														}},
														{name: 'user-management-user-moderation-state', args: 'default'},
														{name: 'user-management-user-stats-state', args: 'default'},
														{name: 'user-management-user-message-state', args: 'default'},
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
																<h3>Additional</h3>
																<h3>Details</h3>
															`,
														},
													}),
												],
											}),
											UI.createComponent('uc-stats-panel'),
											UI.createComponent('uc-moderation-panel', {
												template: UI.template('div', 'ie show'),
												appearance: {
													style: {
														'height': '100%',
														'width': '100%',
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
														{name: 'user-management-user-moderation-state', args: {
															preFn: UI.functions.activate,
															style: {
																'opacity': '1.0',
															},
														}},
														{name: 'user-management-user-settings-state', args: 'default'},
														{name: 'user-management-user-message-state', args: 'default'},
														{name: 'user-management-user-stats-state', args: 'default'},
														{name: 'user-management-user-state', args: 'default'},
													],
												},
												children: [
													UI.createComponent('ucmplc-threshold-plot-wrapper', {
														template: UI.template('div', 'ie show relative'),
														appearance: {
															style: {
																'width': '100%',
																'height': '250px',
																'float': 'left',
																'margin-bottom': '10px',
															},
														},
														children: [
															UI.createComponent('ucmplc-plot-field', {
																template: UI.template('div', 'ie show relative border border-radius'),
																appearance: {
																	style: {
																		'width': 'calc(100% - 50px)',
																		'height': '100%',
																		'margin-right': '10px',
																		'float': 'left',
																	},
																},
																children: [
																	UI.createComponent('ucmplc-plot', {
																		template: UI.template('div', 'ie show centred'),
																		appearance: {
																			style: {
																				'height': '95%',
																				'width': '95%',
																			},
																		},
																	}),
																],
															}),
															UI.createComponent('ucmplc-plot-control-wrapper', {
																template: UI.template('div', 'ie show relative'),
																appearance: {
																	style: {
																		'width': '40px',
																		'height': '100%',
																		'float': 'left',
																	},
																},
																children: [

																],
															}),
														],
													}),
													UI.createComponent('ucmplc-lower-wrapper', {
														template: UI.template('div', 'ie show relative'),
														appearance: {
															style: {
																'width': '100%',
																'height': '300px',
																'float': 'left',
															},
														},
														children: [
															UI.createComponent('ucmplc-project-wrapper', {
																template: UI.template('div', 'ie show relative'),
																appearance: {
																	style: {
																		'width': 'calc(100% - 160px)',
																		'height': '300px',
																		'float': 'left',
																		'margin-right': '10px',
																	},
																},
																children: [
																	UI.createComponent('ucmplcpdw-project-title', {
																		template: UI.template('span', 'ie show'),
																		appearance: {
																			style: {
																				'font-size': '18px',
																				'color': '#ccc',
																				'top': '0px',
																			},
																			html: 'Current project',
																		},
																	}),
																	UI.createComponent('ucmplcpdw-project-name'),
																],
															}),
															UI.createComponent('ucmplc-control-wrapper', {
																template: UI.template('div', 'ie show relative'),
																appearance: {
																	style: {
																		'width': '150px',
																		'height': '300px',
																		'float': 'left',
																	},
																},
																children: [
																	UI.createComponent('ucmplccw-title', {
																		template: UI.template('span', 'ie show'),
																		appearance: {
																			style: {
																				'font-size': '18px',
																				'color': '#ccc',
																				'top': '0px',
																			},
																			html: 'Control',
																		},
																	}),
																	UI.createComponent('ucmplccw-buttons', {

																	}),
																],
															}),
														],
													}),
												],
											}),
										],
									}),
								],
							}),
							UI.createComponent('new-user-card', {
								template: UI.template('div', 'ie show'),
								appearance: {
									style: {
										'height': '100%',
										'width': '100%',
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
									UI.createComponent('nuc-left-column', {
										template: UI.template('div', 'ie show relative'),
										appearance: {
											style: {
												'width': '278px',
												'height': '100%',
												'float': 'left',
												'margin-right': '10px',
											},
										},
										children: [
											UI.createComponent('nuc-title', {
												template: UI.template('span', 'ie show'),
												appearance: {
													style: {
														'font-size': '18px',
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
														'top': '25px',
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
											UI.createComponent('nuc-first-name', {
												template: UI.template('input', 'ie input show'),
												appearance: {
													style: {
														'top': '60px',
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
														{name: 'user-management-user-state', args: 'default'},
														{name: 'control-state', args: 'default'},
													],
												},
											}),
											UI.createComponent('nuc-last-name', {
												template: UI.template('input', 'ie input show'),
												appearance: {
													style: {
														'top': '106px',
														'width': '225px',
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
														{name: 'user-management-user-state', args: 'default'},
														{name: 'control-state', args: 'default'},
													],
												},
											}),
											UI.createComponent('nuc-email', {
												template: UI.template('input', 'ie input show'),
												appearance: {
													style: {
														'top': '152px',
														'width': '275px',
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
														{name: 'user-management-user-state', args: 'default'},
														{name: 'control-state', args: 'default'},
													],
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
																		'left': '0px',
																		'height': '40px',
																		'width': '40px',
																		'padding-top': '10px',
																		'margin-right': '0px',
																	},
																},
																children: [
																	UI.createComponent('nraw-tb-check', {
																		template: UI.template('span', 'glyphicon glyphicon-ok glyphicon-hidden'),
																		state: {
																			defaultState: {
																				fn: function (_this) {
																					_this.model().addClass('glyphicon-hidden');
																				},
																			},
																			states: [
																				{name: 'user-management-user-state', args: 'default'},
																				{name: 'control-state', args: 'default'},
																			],
																		},
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
																		'left': '40px',
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
																		'left': '0px',
																		'height': '40px',
																		'width': '40px',
																		'padding-top': '10px',
																		'margin-right': '0px',
																	},
																},
																children: [
																	UI.createComponent('nrmw-tb-check', {
																		template: UI.template('span', 'glyphicon glyphicon-ok glyphicon-hidden'),
																		state: {
																			defaultState: {
																				fn: function (_this) {
																					_this.model().addClass('glyphicon-hidden');
																				},
																			},
																			states: [
																				{name: 'user-management-user-state', args: 'default'},
																				{name: 'control-state', args: 'default'},
																			],
																		},
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
																		'left': '40px',
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
																		'left': '0px',
																		'height': '40px',
																		'width': '40px',
																		'padding-top': '10px',
																		'margin-right': '0px',
																	},
																},
																children: [
																	UI.createComponent('nrww-tb-check', {
																		template: UI.template('span', 'glyphicon glyphicon-ok glyphicon-hidden'),
																		state: {
																			defaultState: {
																				fn: function (_this) {
																					_this.model().addClass('glyphicon-hidden');
																				},
																			},
																			states: [
																				{name: 'user-management-user-state', args: 'default'},
																				{name: 'control-state', args: 'default'},
																			],
																		},
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
																		'left': '40px',
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
																'left': '140px',
																'padding-top': '50px',
																'text-align': 'center',
																'color': '#aaa',
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
																{name: 'user-management-user-state', args: 'default'},
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
														'top': '380px',
													},
													html: 'Confirm',
												},
												state: {
													stateMap: 'user-management-confirm-user-state',
													svitches: [
														{stateName: 'user-management-confirm-user-state', fn: function (_this) {
															var emailTo = UI.getComponent('nucrc-to-email');
															var newUserEmail = Context.get('user_data', 'email');
															emailTo.model().html(newUserEmail);
														}}
													],
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
															// 3. add loading button to list
															var userList = UI.getComponent('user-list');
															var index = '{index}'.format({index: userList.children.length});
															var userButton = UI.createComponent('user-button-{index}'.format({index: index}), {
																root: userList.id,
																template: UI.templates.button,
																appearance: {
																	style: {
																		'width': '100%',
																	},
																	classes: ['border-bottom'],
																	properties: {
																		index: index,
																	},
																},
																children: [
																	UI.createComponent('nuc-lb-loading-icon-{index}'.format({index: index}), {
																		template: UI.templates.loadingIcon,
																		appearance: {
																			style: {
																				'transform': 'translateY(-50%)',
																				'left': '10px',
																			},
																		},
																	}),
																	UI.createComponent('nuc-lb-name-{index}'.format({index: index}), {
																		template: UI.template('span', 'ie show'),
																		appearance: {
																			html: '{last_name}, {first_name}'.format({first_name: firstName.model().val(), last_name: lastName.model().val()}),
																			style: {
																				'width': '100%',
																			},
																		},
																	}),
																],
															});

															userList.children.push(userButton);
															userButton.render();

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

															// change to user confirm state
															_this.triggerState();

															// call add_user command
															command('create_user', userData, function (userPrototype) {
																var id = 'user-button-{id}'.format({id: userPrototype.id});
																var html = '{last_name}, {first_name}'.format({first_name: userPrototype.first_name, last_name: userPrototype.last_name});

																userButton.update({
																	id: id,
																	appearance: {
																		html: html,
																	},
																	state: {
																		stateMap: 'user-management-user-state',
																		svtiches: [
																			{stateName: 'user-management-user-state', fn: function (_this) {
																				Context.set('current_user_profile', userPrototype);
																			}},
																		],
																	},
																	bindings: [
																		{name: 'click', fn: function (_this) {
																			_this.triggerState();
																		}}
																	],
																});
															});
														}
													}},
												],
											}),
										],
									}),
									UI.createComponent('nuc-right-column', {
										template: UI.template('div', 'ie show relative border border-radius'),
										appearance: {
											style: {
												'border-style': 'dotted',
												'width': 'calc(100% - 288px)',
												'height': '100%',
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
												{name: 'user-management-user-state', args: 'default'},
												{name: 'user-management-confirm-user-state', args: {
													preFn: UI.functions.activate,
													style: {
														'opacity': '1.0',
													},
												}},
											],
										},
										children: [
											UI.createComponent('nucrc-user-added', {
												template: UI.template('h3', 'ie show centred-horizontally'),
												appearance: {
													style: {
														'top': '100px',
														'font-size': '18px',
													},
													html: `User added`,
												},
											}),
											UI.createComponent('nucrc-email-sent', {
												template: UI.template('span', 'ie show'),
												appearance: {
													style: {
														'top': '150px',
														'left': '50px',
														'width': '200px',
													},
													html: `A confirmation email as been sent to `,
												},
											}),
											UI.createComponent('nucrc-to-email', {
												template: UI.template('span', 'ie show'),
												appearance: {
													style: {
														'top': '200px',
														'left': '50px',
														'font-weight': 'bold',
													},
												},
											}),
											UI.createComponent('nucrc-role-will-appear-as', {
												template: UI.template('span', 'ie show'),
												appearance: {
													style: {
														'top': '240px',
														'left': '50px',
														'width': '200px',
													},
													html: `The role indicator for this user will appear as `,
												},
											}),
											UI.createComponent('nucrc-role-pending', {
												template: UI.templates.button,
												appearance: {
													classes: ['border border-radius'],
													style: {
														'height': '40px',
														'width': '40px',
														'padding-top': '10px',
														'transform': 'none',
														'left': '50px',
														'top': '290px',
													},
													html: `<span class='glyphicon glyphicon-option-horizontal'></span>`,
												},
											}),
											UI.createComponent('nucrc-until-confirmation', {
												template: UI.template('span', 'ie show'),
												appearance: {
													style: {
														'top': '340px',
														'left': '50px',
														'width': '200px',
													},
													html: `Until the user confirms their roles, when it will appear as `,
												},
											}),
											UI.createComponent('nucrc-role-enabled', {
												template: UI.templates.button,
												appearance: {
													classes: ['border border-radius'],
													style: {
														'height': '40px',
														'width': '40px',
														'padding-top': '10px',
														'transform': 'none',
														'left': '50px',
														'top': '345px',
													},
													html: `<span class='glyphicon glyphicon-ok'></span>`,
												},
											}),
										],
									}),
								],
							}),
							UI.createComponent('user-title-card', {
								template: UI.template('div', 'ie border border-radius'),
								appearance: {
									style: {
										'border-style': 'dotted',
										'height': '100%',
										'width': '100%',
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
				{name: 'user-management-state', args: 'default'},
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
				{name: 'user-management-state', args: {
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
										Object.keys(_this.children).forEach(function (childId) {
											UI.removeComponent(childId);
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
				{name: 'user-management-state', args: 'default'},
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
				{name: 'user-management-state', args: 'default'},
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

									_this.children[child.id] = child;
									child.render();

									// make buttons visible
									child.model().css({'opacity': '1.0'});
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
