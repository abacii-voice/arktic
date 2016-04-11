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
	// 	Context.set('current_role', 'moderator')
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
	'user-management-pending-user-state',
	'user-management-confirm-user-state',
	'user-management-settings-state',

	// projects
	'project-state',
	'project-project-state',
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
										// reset current_user_profile
										Context.set('current_user_profile', {});

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
															if (Context.get('current_user_profile', 'id') !== userId) {
																_this.triggerState();
															}
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
					UI.createComponent('umi-pp-user-info', {
						template: UI.template('div', 'ie show relative border border-radius'),
						appearance: {
							style: {
								'height': '100%',
								'width': 'calc(100% - 210px)',
								'margin-left': '10px',
								'float': 'left',
								'border-style': 'dotted',
							}
						},
						children: [
							UI.createComponent('umi-pp-ui-title', {
								template: UI.template('h3', 'ie show centred'),
								appearance: {
									html: 'User details',
								}
							}),
						],
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
								{name: 'user-management-user-state', args: 'default'},
								{name: 'user-management-settings-state', args: 'default'},
								{name: 'user-management-new-user-state', args: 'default'},
							],
						},
					}),
					UI.createComponent('umi-pp-user-card', {
						template: UI.template('div', 'ie show relative'),
						appearance: {
							style: {
								'height': '100%',
								'width': 'calc(100% - 210px)',
								'margin-left': '10px',
								'float': 'left',
							}
						},
						children: [
							UI.createComponent('umi-pp-uc-control-panel', {
								template: UI.template('div', 'ie show relative'),
								appearance: {
									style: {
										'height': '100%',
										'width': '250px',
										'margin-left': '10px',
										'float': 'left',
									}
								},
								children: [
									UI.createComponent('umi-pp-uc-cp-title', {
										template: UI.template('h3', 'ie show relative'),
										appearance: {
											style: {
												'height': '20px',
											},
										},
										state: {
											states: [
												{name: 'user-management-user-state', args: {
													preFn: function (_this) {
														var userFirstName = Context.get('current_user_profile', 'first_name');
														var userLastName = Context.get('current_user_profile', 'last_name');
														_this.model().html('{first_name} {last_name}'.format({first_name: userFirstName, last_name: userLastName}));
													}
												}}
											],
										},
									}),
									UI.createComponent('umi-pp-uc-cp-subtitle', {
										template: UI.template('span', 'ie show relative'),
										appearance: {
											style: {
												'height': '20px',
											},
										},
										state: {
											states: [
												{name: 'user-management-user-state', args: {
													preFn: function (_this) {
														var userEmail = Context.get('current_user_profile', 'email');
														_this.model().html(userEmail);
													}
												}}
											],
										},
									}),
									UI.createComponent('umi-pp-uc-cp-role-panel', {
										template: UI.template('div', 'ie show relative'),
										appearance: {
											style: {
												'width': '100%',
												'margin-top': '20px',
											},
										},
										children: [
											UI.createComponent('umi-pp-uc-cp-title', {
												template: UI.template('h4', 'ie show relative'),
												appearance: {
													style: {
														'height': '20px',
													},
													html: 'Roles',
												},
											}),
											Components.roleIndicator('umi-pp-uc-cp-rp-admin-role', {
												label: 'admin',
											}),
											Components.roleIndicator('umi-pp-uc-cp-rp-moderator-role', {
												label: 'moderator',
											}),
											Components.roleIndicator('umi-pp-uc-cp-rp-worker-role', {
												label: 'worker',
											}),
										],
										state: {
											states: [
												{name: 'user-management-user-state', args: {
													preFn: function (_this) {
														if (!(Context.get('current_role') === 'admin' && Context.get('clients', Context.get('current_client')).is_production)) {
															_this.model().css({'display': 'none'});
														} else {
															_this.model().css({'display': 'block'});
														}
													},
												}},
											],
										},
									}),
									UI.createComponent('umi-pp-uc-cp-action-panel', {
										template: UI.template('div', 'ie show relative'),
										appearance: {
											style: {
												'width': '100%',
												'margin-top': '20px',
											},
										},
										children: [
											UI.createComponent('umi-pp-uc-cp-title', {
												template: UI.template('h4', 'ie show relative'),
												appearance: {
													style: {
														'height': '20px',
														'margin-bottom': '10px',
													},
													html: 'Actions',
												},
											}),
											UI.createComponent('umi-pp-uc-cp-ap-message-button', {
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
											UI.createComponent('umi-pp-uc-cp-ap-moderation-button', {
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
													UI.createComponent('umi-pp-uc-cp-ap-mb-moderation-title', {
														template: UI.template('span', 'ie show relative'),
														appearance: {
															style: {
																'top': '-5px',
																'width': '100%',
															},
															html: 'Moderation'
														},
													}),
													UI.createComponent('umi-pp-uc-cp-ap-mb-moderation-score', {
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
															UI.createComponent('umi-pp-uc-cp-ap-mb-ms-title', {
																template: UI.template('span', 'ie show relative'),
																appearance: {
																	style: {
																		'float': 'left',
																	},
																	html: 'Score',
																},
															}),
															UI.createComponent('umi-pp-uc-cp-ap-mb-ms-value', {
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
													UI.createComponent('umi-pp-uc-cp-ap-mb-moderation-percentage', {
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
															UI.createComponent('umi-pp-uc-cp-ap-mb-mp-title', {
																template: UI.template('span', 'ie show relative'),
																appearance: {
																	style: {
																		'float': 'left',
																	},
																	html: 'Current redundancy',
																},
															}),
															UI.createComponent('umi-pp-uc-cp-ap-mb-mp-value', {
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
											UI.createComponent('umi-pp-uc-cp-ap-stats-button', {
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
												state: {
													stateMap: 'user-management-user-stats-state',
													states: [
														{name: 'user-management-user-state', args: {
															preFn: function (_this) {
																var isProduction = Context.get('clients', Context.get('current_client')).is_production;
																if (isProduction) {
																	_this.model().css({'display': 'block'});
																} else {
																	_this.model().css({'display': 'none'});
																}
															},
														}},
													],
												},
												children: [
													UI.createComponent('umi-pp-uc-cp-ap-sb-stats-title', {
														template: UI.template('span', 'ie show relative'),
														appearance: {
															style: {
																'top': '-5px',
																'width': '100%',
															},
															html: 'Statistics'
														},
													}),
													UI.createComponent('umi-pp-uc-cp-ap-sb-stats-total', {
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
															UI.createComponent('umi-pp-uc-cp-ap-sb-st-title', {
																template: UI.template('span', 'ie show relative'),
																appearance: {
																	style: {
																		'float': 'left',
																	},
																	html: 'Total',
																},
															}),
															UI.createComponent('umi-pp-uc-cp-ap-sb-st-value', {
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
													UI.createComponent('umi-pp-uc-cp-ap-sb-sw-stats-week', {
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
															UI.createComponent('umi-pp-uc-cp-ap-sb-sw-title', {
																template: UI.template('span', 'ie show relative'),
																appearance: {
																	style: {
																		'float': 'left',
																	},
																	html: 'Since 1/3/2016',
																},
															}),
															UI.createComponent('umi-pp-uc-cp-ap-sb-sw-value', {
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
													UI.createComponent('umi-pp-uc-cp-ap-sb-stats-percentage', {
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
															UI.createComponent('umi-pp-uc-cp-ap-sb-sp-title', {
																template: UI.template('span', 'ie show relative'),
																appearance: {
																	style: {
																		'float': 'left',
																	},
																	html: 'Redundancy',
																},
															}),
															UI.createComponent('umi-pp-uc-cp-ap-sb-sp-value', {
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
											UI.createComponent('umi-pp-uc-cp-ap-settings-button'),
										],
									}),
								],
							}),
							UI.createComponent('umi-pp-uc-message-panel', {
								template: UI.template('div', 'ie relative'),
								appearance: {
									style: {
										'height': '100%',
										'width': 'calc(100% - 270px)',
										'margin-left': '10px',
										'float': 'left',
									}
								},
							}),
							UI.createComponent('umi-pp-uc-moderation-panel', {
								template: UI.template('div', 'ie relative'),
								appearance: {
									style: {
										'height': '100%',
										'width': 'calc(100% - 270px)',
										'margin-left': '10px',
										'float': 'left',
									}
								},
							}),
							UI.createComponent('umi-pp-uc-stats-panel', {
								template: UI.template('div', 'ie relative'),
								appearance: {
									style: {
										'height': '100%',
										'width': 'calc(100% - 270px)',
										'margin-left': '10px',
										'float': 'left',
									}
								},
							}),
							UI.createComponent('umi-pp-uc-settings-panel', {
								template: UI.template('div', 'ie relative'),
								appearance: {
									style: {
										'height': '100%',
										'width': 'calc(100% - 270px)',
										'margin-left': '10px',
										'float': 'left',
									}
								},
							}),
						],
					}),
				],
			}),
			UI.createComponent('umi-new-user-panel', {
				template: UI.template('div', 'ie relative'),
				appearance: {
					style: {
						'width': '275px',
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
										'height': '138px',
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
						state: {
							states: [
								{name: 'user-management-new-user-state', args: {
									preFn: function (_this) {
										if (Context.get('clients', Context.get('current_client'), 'is_contract')) {
											_this.model().css({'display': 'none'});
										} else {
											_this.model().css({'display': 'block'});
										}
									}
								}},
							],
						},
					}),
					UI.createComponent('umi-nup-confirm-button', {
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
									UI.getComponent('umi-nup-roles-admin').update('empty');
									UI.getComponent('umi-nup-roles-moderator').update('empty');
									UI.getComponent('umi-nup-roles-worker').update('empty');

									// change to pending user state
									_this.triggerState();

									// call add_user command
									command('create_user', userData, function (userPrototype) {
										// set user email
										var toEmail = UI.getComponent('umi-uc-to-email');
										toEmail.model().html(userPrototype.email);

										// change to user confirm state
										_this.triggerState();
									});
								}
							}},
						],
						state: {
							stateMap: {
								'user-management-new-user-state': 'user-management-pending-user-state',
								'user-management-pending-user-state': 'user-management-confirm-user-state',
							},
							states: [
								{name: 'user-management-new-user-state', args: {
									fn: UI.functions.activate,
								}},
								{name: 'user-management-pending-user-state', args: {
									fn: UI.functions.deactivate,
								}},
								{name: 'user-management-confirm-user-state', args: {
									fn: UI.functions.deactivate,
								}},
							],
						},
					}),
				],
			}),
			UI.createComponent('umi-user-pending', {
				template: UI.template('div', 'ie relative border border-radius'),
				appearance: {
					style: {
						'width': '375px',
						'height': '100%',
						'margin-left': '10px',
						'float': 'left',
						'border-style': 'dotted',
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
						{name: 'user-management-new-user-state', args: 'default'},
						{name: 'user-management-settings-state', args: 'default'},
						{name: 'user-management-pending-user-state', args: {
							preFn: UI.functions.activate,
							style: {
								'opacity': '1.0',
							},
						}},
						{name: 'user-management-confirm-user-state', args: 'default'},
					],
				},
				children: [
					UI.createComponent('umi-up-loading-icon', {
						template: UI.templates.loadingIcon,
						appearance: {
							classes: ['show'],
						},
					}),
				],
			}),
			UI.createComponent('umi-user-confirmed', {
				template: UI.template('div', 'ie relative border border-radius'),
				appearance: {
					style: {
						'width': '375px',
						'height': '100%',
						'margin-left': '10px',
						'float': 'left',
						'border-style': 'dotted',
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
						{name: 'user-management-new-user-state', args: 'default'},
						{name: 'user-management-settings-state', args: 'default'},
						{name: 'user-management-pending-user-state', args: 'default'},
						{name: 'user-management-confirm-user-state', args: {
							preFn: UI.functions.activate,
							style: {
								'opacity': '1.0',
							},
						}},
					],
				},
				children: [
					UI.createComponent('umi-uc-user-added', {
						template: UI.template('h3', 'ie show centred-horizontally'),
						appearance: {
							style: {
								'top': '100px',
								'font-size': '18px',
							},
							html: `User added`,
						},
					}),
					UI.createComponent('umi-uc-email-sent', {
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
					UI.createComponent('umi-uc-to-email', {
						template: UI.template('span', 'ie show'),
						appearance: {
							style: {
								'top': '200px',
								'left': '50px',
								'font-weight': 'bold',
							},
						},
					}),
					UI.createComponent('umi-uc-role-will-appear-as', {
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
					UI.createComponent('umi-uc-role-pending', {
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
					UI.createComponent('umi-uc-until-confirmation', {
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
					UI.createComponent('umi-uc-role-enabled', {
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
	UI.createComponent('project-interface', {
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
				{name: 'project-state', args: {
					preFn: UI.functions.activate,
					style: {
						'opacity': '1.0',
					}
				}},
			],
		},
		children: [
			UI.createComponent('pi-button-panel', {
				template: UI.template('div', 'ie sub-panel show relative'),
				appearance: {
					style: {
						'height': '100%',
						'width': '40px',
						'float': 'left',
					},
				},
				children: [
					UI.createComponent('pi-project-list-button', {
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
							UI.createComponent('pi-plb-icon', {
								template: UI.template('span', 'glyphicon glyphicon-list'),
							}),
						],
						bindings: [
							{name: 'click', fn: function (_this) {
								_this.triggerState();
							}}
						],
					}),
					UI.createComponent('pi-settings-button', {
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
							UI.createComponent('pi-sb-icon', {
								template: UI.template('span', 'glyphicon glyphicon-cog'),
							}),
						],
						bindings: [
							{name: 'click', fn: function (_this) {
								_this.triggerState();
							}}
						],
					}),
					UI.createComponent('pi-new-project-button', {
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
							UI.createComponent('pi-npb-icon', {
								template: UI.template('span', 'glyphicon glyphicon-plus'),
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
			UI.createComponent('pi-primary-panel', {
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
					Components.scrollList('pi-mp-project-group-list', {
						title: 'Projects',
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
								{name: 'project-state', args: {
									preFn: function (_this) {
										// reset current_project_profile
										Context.set('current_project_profile', {});

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
										$.when(getdata('context_projects', permissionData, function (data) {
											// update Context
											Context.update(data);
										})).done(function () {
											// data is a list of user objects with relevant details
											var projects = Context.get('clients', Context.get('current_client'), 'projects');
											Object.keys(projects).map(function (projectId) {
												var projectPrototype = projects[projectId];
												var projectButton = UI.createComponent('project-button-{id}'.format({id: projectId}), {
													root: _this.id,
													template: UI.templates.button,
													appearance: {
														html: '{name}'.format({name: projectPrototype.name}),
														classes: ['border-bottom'],
														style: {
															'width': '100%',
														},
													},
													bindings: [
														{name: 'click', fn: function (_this) {
															if (Context.get('current_project_profile', 'id') !== projectId) {
																_this.triggerState();
															}
														}},
													],
													state: {
														stateMap: 'project-project-state',
														svitches: [
															{stateName: 'project-project-state', fn: function (_this) {
																Context.set('current_project_profile', projectPrototype);
															}}
														],
													},
												});

												// render
												_this.children[projectButton.id] = projectButton;
												projectButton.render();
											});

											// fade loading icon
											_this.parent().loadingIcon().model().fadeOut();
										});
									}
								}},
							],
						},
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
