// 0. Open websocket connection
// really use only for transcription / moderation / settings change, but not file upload.
// don't have to use for loading context either. Ajax is fine for that.

// 1. Load Context
Context.setFn(getdata('context', {}, function (data) {
	Context.extend(data);

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
	// 	Context.set('current_role', 'productionadmin')
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
				template: UI.template('div', 'ie panel sub-panel'),
				appearance: {
					style: {
						'height': '100%',
						'width': '200px',
					},
				},
				children: [
					UI.createComponent('user-title', {
						template: UI.template('h4', 'ie panel-title'),
						appearance: {
							html: 'Users',
							style: {
								'text-align': 'left',
								'padding-left': '0px',
							},
						},
					}),
					UI.createComponent('user-list-search-input', {
						template: UI.template('input', 'ie input'),
						appearance: {
							style: {
								'top': '35px',
								'width': '190px',
							},
							properties: {
								placeholder: 'Search or filter...'
							},
						},
					}),
					UI.createComponent('user-list-wrapper', {
						template: UI.template('div', 'ie scroll-wrapper relative'),
						appearance: {
							style: {
								'top': '80px',
								'height': 'calc(100% - 80px)',
							},
						},
						children: [
							UI.createComponent('user-list', {
								template: UI.template('div', 'ie scroll'),
								state: {
									states: [
										{name: 'user-management-state', args: {
											preFn: function (_this) {
												// 1. remove current children
												_this.children.map(function (child) {
													UI.removeComponent(child.id);
												});

												_this.children = [];

												// load and display user buttons
												command('user_list', {'current_client': Context.get('current_client'), 'current_role': Context.get('current_role')}, function (data) {
													// data is a list of user objects with relevant details
													var users = data.users;
													users.map(function (userPrototype) {
														var userId = makeid();
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
																		// get user card objects
																		var nameField = UI.getComponent('uc-name');
																		var emailField = UI.getComponent('uc-email');
																		// var rolesPanel = UI.getComponent('uc-roles-panel');
																		// var statsPanel = UI.getComponent('uc-stats-panel');

																		// update values
																		nameField.model().html('{first_name} {last_name}'.format({first_name: userPrototype.first_name, last_name: userPrototype.last_name}));
																		emailField.model().html(userPrototype.email);
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
												})
											}
										}},
									],
								},
							}),
							UI.createComponent('ul-loading-icon', {
								template: UI.templates.loadingIcon,
								appearance: {
									classes: ['ie centred'],
								}
							}),
						],
					}),
				],
			}),
			UI.createComponent('user-management-interface-right-panel', {
				template: UI.template('div', 'ie panel sub-panel border'),
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
									states: [
										{name: 'user-management-state', args: {
											style: {
												'opacity': '0.0',
											},
											fn: function (_this) {
												_this.model().css({'display': 'none'});
											},
										}},
										{name: 'user-management-user-state', args: {
											preFn: function (_this) {
												_this.model().css({'display': 'block'});
											},
											style: {
												'opacity': '1.0',
											},
										}},
									],
								},
								children: [
									UI.createComponent('uc-name', {
										template: UI.template('span', 'ie'),
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
										template: UI.template('span', 'ie'),
										appearance: {
											style: {
												'color': '#ccc',
												'top': '35px',
												'left': '10px',
											},
										},
									}),
								],
							}),
							UI.createComponent('new-user-button'),
							UI.createComponent('new-user-card'),
							UI.createComponent('new-user-confirmation-card'),
							UI.createComponent('user-title-card'),
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
												var visibleCondition = (role === 'productionadmin' || role === 'moderator');
												if (visibleCondition) {
													_this.model().css('display', 'block');
												} else {
													_this.model().css('display', 'none');
												}
											},
										}},
									],
									stateMap: 'user-management-state',
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
Context.update();
