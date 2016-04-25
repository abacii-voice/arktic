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
		Context.set('current_role', 'worker');
	})).done(function () {
		UI.changeState('transcription-state');
	});
}));

// 2. Define global states
UI.createGlobalStates('client-state', [
	'role-state',

	// control panel
	'control-state',

	// work interface states
	'transcription-state',

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
	'project-new-project-state',
	'project-upload-state',
	'project-upload-relfile-state',
	'project-upload-relfile-reset-state',
	'project-upload-audio-state',
	'project-upload-audio-reset-state',
	'project-upload-progress-state',
	'project-settings-state',
	'project-project-settings-state',

	// upload
	'upload-state',
	'upload-state-audio',
	'upload-date-state',
	'upload-relfile-drop-state',
	'upload-audio-drop-state',
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
				{name: 'transcription-state', args: {
					preFn: UI.functions.activate,
					style: {
						'opacity': '1.0',
					}
				}},
			]
		},
		children: [
			UI.createComponent('ti-count-panel', {
				template: UI.template('div', 'ie show relative'),
				appearance: {
					style: {
						'width': '100px',
						'height': '100%',
						'float': 'left',
					},
				},
				children: [
					UI.createComponent('ti-cp-count-button', {
						template: UI.templates.button,
						appearance: {
							style: {
								'height': '90px',
								'width': '90px',
								'transform': 'none',
								'left': '0px',
								'margin-bottom': '10px',
							},
							classes: ['border border-radius relative'],
						},
					}),
					UI.createComponent('ti-cp-count-list-left', {
						template: UI.template('div', 'ie show relative'),
						appearance: {
							style: {
								'width': 'calc(50% - 5px)',
								'height': 'calc(100% - 100px)',
								'float': 'left',
							},
						},
					}),
					UI.createComponent('ti-cp-count-list-right', {
						template: UI.template('div', 'ie show relative'),
						appearance: {
							style: {
								'width': 'calc(50% - 5px)',
								'height': 'calc(100% - 100px)',
								'float': 'left',
							},
						},
					}),
				],
			}),
			UI.createComponent('ti-control-panel', {
				template: UI.template('div', 'ie show relative'),
				appearance: {
					style: {
						'width': '50px',
						'height': '100%',
						'float': 'left',
					},
				},
				children: [
					UI.createComponent('ti-cp-back-button', {
						template: UI.templates.button,
						appearance: {
							style: {
								'width': '40px',
								'height': '40px',
								'transform': 'none',
								'left': '0px',
								'margin-bottom': '10px',
							},
							classes: ['border border-radius relative'],
						},
					}),
					UI.createComponent('ti-cp-forward-button', {
						template: UI.templates.button,
						appearance: {
							style: {
								'width': '40px',
								'height': '40px',
								'transform': 'none',
								'left': '0px',
								'margin-bottom': '10px',
							},
							classes: ['border border-radius relative'],
						},
					}),
					UI.createComponent('ti-cp-done-button', {
						template: UI.templates.button,
						appearance: {
							style: {
								'width': '40px',
								'height': '40px',
								'transform': 'none',
								'left': '0px',
							},
							classes: ['border border-radius relative'],
						},
					}),
				],
			}),
			UI.createComponent('ti-search-panel', {
				template: UI.template('div', 'ie show relative'),
				appearance: {
					style: {
						'width': '300px',
						'height': '100%',
						'float': 'left',
					},
				},
				children: [
					Components.scrollList('ti-sp-search-field', {
						search: {},
						appearance: {
							style: {
								'width': '290px',
							},
						},
					}),
				],
			}),
			UI.createComponent('ti-interface-panel', {
				template: UI.template('div', 'ie show relative'),
				appearance: {
					style: {
						'width': 'calc(100% - 450px)',
						'height': '100%',
						'float': 'left',
					},
				},
				children: [
					UI.createComponent('ti-ip-top-panel', {
						template: UI.template('div', 'ie show relative'),
						appearance: {
							style: {
								'width': '100%',
								'height': '150px',
							},
						},
						children: [
							UI.createComponent('ti-ip-tp-tokens-wrapper', {
								// This is basically a horizontal scroll-wrapper for the tokens
								template: UI.template('div', 'ie show relative border border-radius'),
								appearance: {
									style: {
										'width': '100%',
										'height': '40px',
										'margin-bottom': '10px',
										'overflow': 'hidden',
									},
								},
								children: [
									UI.createComponent('ti-ip-tp-tw-scroll', {
										template: UI.template('div', 'ie show'),
										appearance: {
											style: {
												'height': 'calc(100% + 20px)',
												'width': '100%',
												'overflow-x': 'scroll',
											},
										},
										children: [
											UI.createComponent('ti-ip-tp-tws-tokens', {
												template: UI.template('div', 'ie show'),
												appearance: {
													style: {
														'height': '100%',
														'white-space': 'nowrap',
														'padding-top': '10px',
														'padding-left': '10px',
														'padding-right': '10px',
													},
												},
											}),
										],
									}),
								],
							}),
							Components.audioPlayer('ti-ip-tp-player', {

							}),
						],
					}),
					UI.createComponent('ti-ip-bottom-panel', {
						template: UI.template('div', 'ie show relative'),
						appearance: {
							style: {
								'width': '100%',
								'height': 'calc(100% - 150px)',
							},
						},
						children: [
							UI.createComponent('ti-cp-bp-original-caption-container', {

							}),
							UI.createComponent('ti-cp-bp-modified-caption'),
							UI.createComponent('ti-cp-bp-flags'),
						],
					}),
					UI.createComponent('ti-cp-audio-bank', {
						template: UI.template('div', 'ie'),
						state: {
							states: [
								{name: 'transcription-state', args: {
									preFn: function (_this) {
										// load
										var audioData = {
											'current_client': Context.get('current_client'),
											'current_role': Context.get('current_role'),
											'number': '10',
										};
										// command('load_audio_data', audioData, function (data) {
										// 	// returns a dictionary of transcription ids
										// 	Context.set('transcriptions', data);
										//
										// 	Object.keys(data).forEach(function (transcriptionId) {
										// 		var transcriptionPrototype = data[transcriptionId];
										//
										// 		// create new audio element
										// 		var audioElement = UI.createComponent('ti-cp-ab-audio-element-{id}'.format({id: transcriptionId}), {
										// 			root: _this.id,
										// 			template: UI.template('audio'),
										// 			appearance: {
										// 				properties: {
										// 					'src': transcriptionPrototype.source,
										// 				},
										// 			},
										// 		});
										// 		_this.children[audioElement.id] = audioElement;
										// 		audioElement.render();
										//
										// 	});
										// });
									},
								}},
							],
						},
					}),
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
											var users = Context.get('clients.{client}.users'.format({client: Context.get('current_client')}));
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
						state: {
							states: [
								// TODO
							],
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
														var userFirstName = Context.get('current_user_profile.first_name');
														var userLastName = Context.get('current_user_profile.last_name');
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
														var userEmail = Context.get('current_user_profile.email');
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
														if (!(Context.get('current_role') === 'admin' && Context.get('clients.{client}.is_production'.format({client: Context.get('current_client')})))) {
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
																var isProduction = Context.get('clients.{client}.is_production'.format({client: Context.get('current_client')}));
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
										if (Context.get('clients.{client}.is_contract'.format({client: Context.get('current_client')}))) {
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
			UI.createComponent('umi-user-settings-panel', {
				// TODO
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
						state: {
							stateMap: 'project-state',
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
						state: {
							stateMap: 'project-settings-state',
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
						state: {
							stateMap: 'project-new-project-state',
							states: [
								{name: 'project-state', args: {
									preFn: function (_this) {
										var isContract = Context.get('clients.{client}.is_contract'.format({client: Context.get('current_client')}));
										if (isContract) {
											_this.model().css({'display': 'block'});
										} else {
											_this.model().css({'display': 'none'});
										}
									}
								}},
							],
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
						{name: 'project-state', args: {
							preFn: UI.functions.activate,
							style: {
								'opacity': '1.0',
							},
						}},
						{name: 'project-new-project-state', args: 'default'},
						{name: 'project-upload-state', args: 'default'},
						{name: 'project-settings-state', args: 'default'},
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
										$.when(getdata('context', permissionData, function (data) {
											// update Context
											Context.update(data);
										})).done(function () {
											// data is a list of user objects with relevant details
											var projects = Context.get('clients.{client}.projects'.format({client: Context.get('current_client')}));
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
															if (Context.get('current_project_profile.id') !== projectId) {
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
					UI.createComponent('pi-mp-project-info', {
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
									html: 'Project details',
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
								{name: 'project-state', args: {
									preFn: UI.functions.activate,
									style: {
										'opacity': '1.0',
									},
								}},
								{name: 'project-project-state', args: 'default'},
								{name: 'project-settings-state', args: 'default'},
								{name: 'project-new-project-state', args: 'default'},
							],
						},
					}),
					UI.createComponent('pi-mp-project-card'),
				],
			}),
			UI.createComponent('pi-project-settings-panel'),
			UI.createComponent('pi-new-project-panel', {
				template: UI.template('div', 'ie relative'),
				appearance: {
					style: {
						'width': '240px',
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
						{name: 'project-state', args: 'default'},
						{name: 'project-new-project-state', args: {
							preFn: UI.functions.activate,
							style: {
								'opacity': '1.0',
							},
						}},
						{name: 'project-settings-state', args: 'default'},
						{name: 'project-upload-state', args: 'default'},
					],
				},
				children: [
					UI.createComponent('pi-npp-title', {
						template: UI.template('h3', 'ie show relative'),
						appearance: {
							style: {
								'height': '30px',
							},
							html: `New upload`,
						},
					}),
					UI.createComponent('pi-npp-client-subtitle', {
						template: UI.template('span', 'ie show relative'),
						appearance: {
							style: {
								'font-size': '14px',
								'margin-bottom': '15px',
							},
						},
						state: {
							states: [
								{name: 'project-new-project-state', args: {
									preFn: function (_this) {
										_this.model().html(Context.get('current_client'));
									}
								}}
							],
						},
					}),
					Components.searchFilterField('pi-npp-project-search', {
						show: 'show',
						placeholder: 'Project name',
						state: {
							states: [
								{name: 'project-new-project-state', args: {
									preFn: function (_this) {
										_this.model().val('');
									}
								}},
							],
						},
					}),
					Components.searchFilterField('pi-npp-project-batch-search', {
						show: 'show',
						placeholder: 'Batch name',
						state: {
							states: [
								{name: 'project-new-project-state', args: {
									preFn: function (_this) {
										_this.model().val('');
									}
								}},
							],
						},
					}),
					Components.searchFilterField('pi-npp-batch-deadline', {
						show: 'show',
						placeholder: 'Batch deadline',
						state: {
							states: [
								{name: 'project-new-project-state', args: {
									preFn: function (_this) {
										_this.model().val('');
									}
								}},
							],
						},
					}),
					UI.createComponent('pi-npp-confirm-button', {
						template: UI.templates.button,
						appearance: {
							classes: ['border border-radius'],
							style: {
								'transform': 'none',
								'left': '0px',
								'height': '40px',
								'padding-top': '10px',
							},
							html: 'Continue',
						},
						state: {
							stateMap: 'project-upload-state',
						},
						bindings: [
							{name: 'click', fn: function (_this) {
								// check for errors
								var noProblems = true;

								var projectNameField = UI.getComponent('pi-npp-project-search');
								var projectName = projectNameField.model().val();
								if (projectName !== '') {
									projectNameField.model().removeClass('error');
								} else {
									projectNameField.model().addClass('error');
									noProblems = false;
								}

								var batchDeadlineField = UI.getComponent('pi-npp-batch-deadline');
								batchDeadline = batchDeadlineField.model().val();
								if (batchDeadline !== '') {
									// TODO: validate with moment.
									batchDeadlineField.model().removeClass('error');
								} else {
									batchDeadlineField.model().addClass('error');
									noProblems = false;
								}

								var batchNameField = UI.getComponent('pi-npp-project-batch-search');
								var batchName = batchNameField.model().val();
								if (batchName !== '') {
									batchNameField.model().removeClass('error');
								} else {
									batchNameField.model().addClass('error');
									noProblems = false;
								}

								if (noProblems) {
									var projectPrototype = {
										name: projectName,
										batch_deadline: batchDeadline,
										batch_name: batchName,
									}

									var projectData = {
										name: projectName,
										batch_deadline: batchDeadline,
										batch_name: batchName,
										current_client: Context.get('current_client'),
										current_role: Context.get('current_role'),
									}

									command('create_project', projectData, function (data) {});

									Context.set('current_upload.project', projectPrototype);
									_this.triggerState();
								}
							}}
						],
					}),
				],
			}),
			UI.createComponent('pi-incomplete-upload-panel', {
				template: UI.template('div', 'ie relative'),
				appearance: {
					style: {
						'width': '400px',
						'height': '100%',
						'margin-left': '10px',
						'float': 'left',
					},
				},
				state: {
					defaultState: {
						fn: UI.functions.deactivate,
					},
					states: [
						{name: 'project-state', args: 'default'},
						{name: 'project-new-project-state', args: {
							preFn: function (_this) {
								// 1. find incomplete uploads. if they exist, show this panel.
								var projects = 'clients.{client}.projects'.format({
									client: Context.get('current_client'),
								});
								var contextProjects = Context.get(projects);
								if (contextProjects !== '') {
									var active = false;
									Object.keys(contextProjects).forEach(function (projectName) {
										var batches = '{projects}.{project}.batches'.format({
											projects: projects,
											project: projectName,
										});
										var contextBatches = Context.get(batches);
										if (contextBatches !== '') {
											Context.get(batches).forEach(function (batch) {
												if (batch.uploads.length !== 0) {
													active = true;
												}
											});
										}
									});

									if (active) {
										_this.model().css({'display': 'block'});
									} else {
										_this.model().css({'display': 'none'});
									}

								} else {
									_this.model().css({'display': 'none'});
								}
							},
						}},
						{name: 'project-settings-state', args: 'default'},
						{name: 'project-upload-state', args: 'default'},
					],
				},
				children: [
					Components.scrollList('pi-iup-upload-list', {
						title: 'Incomplete uploads',
						state: {
							states: [
								{name: 'project-new-project-state', args: {
									preFn: function (_this) {
										// remove previous children
										Object.keys(_this.children).forEach(function (childId) {
											UI.removeComponent(childId);
										});

										_this.children = {};

										// get new children
										var projects = 'clients.{client}.projects'.format({
											client: Context.get('current_client'),
										});
										var contextProjects = Context.get(projects);
										var incompleteUploads = [];
										if (contextProjects !== '') {
											Object.keys(contextProjects).forEach(function (projectName) {
												var batches = '{projects}.{project}.batches'.format({
													projects: projects,
													project: projectName,
												});
												var contextBatches = Context.get(batches);
												if (contextBatches !== '') {
													Context.get(batches).forEach(function (batch) {
														batch.uploads.forEach(function (upload) {
															upload.project = projectName;
															upload.deadline = batch.deadline;
															upload.name = batch.name;
															incompleteUploads.push(upload);
														});
													});
												}
											});
										}

										incompleteUploads.forEach(function (incompleteUpload, index) {
											var incompleteUploadButton = UI.createComponent('pi-iup-ul-button-{index}'.format({index: index}), {
												root: _this.id,
												template: UI.templates.button,
												appearance: {
													style: {
														'width': '100%',
														'height': '80px',
													},
													classes: ['border', 'border-radius'],
												},
												state: {
													stateMap: 'project-upload-state',
												},
												children: [
													UI.createComponent('pi-iup-ul-b{index}-relfile-name'.format({index: index}), {
														template: UI.template('span', 'ie show'),
														appearance: {
															style: {
																'left': '10px',
																'top': '12px',
																'font-size': '15px',
															},
															html: 'Relfile name: {name}'.format({name: incompleteUpload.relfile_name}),
														},
													}),
													UI.createComponent('pi-iup-ul-b{index}-archive-name'.format({index: index}), {
														template: UI.template('span', 'ie show'),
														appearance: {
															style: {
																'left': '10px',
																'bottom': '12px',
																'font-size': '15px',
															},
															html: 'Archive name: {name}'.format({name: incompleteUpload.archive_name}),
														},
													}),
													UI.createComponent('pi-iup-ul-b{index}-percentage'.format({index: index}), {
														template: UI.template('span', 'ie show centred-vertically'),
														appearance: {
															style: {
																'right': '20px',
																'font-size': '18px',
															},
															html: '{percentage}%'.format({percentage: incompleteUpload.completion_percentage}),
														},
													}),
												],
												bindings: [
													{name: 'click', fn: function (_this) {
														// set current upload details to match those of incompleteUpload
														Context.set('current_upload', {
															progress: '{percentage}'.format({percentage: incompleteUpload.completion_percentage}),
															remaining_fragments: incompleteUpload.remaining_fragments,
															project: {
																name: incompleteUpload.project,
																batch_deadline: incompleteUpload.deadline,
																batch_name: incompleteUpload.name,
															},
														});

														// trigger state
														_this.triggerState();
													}},
												],
											});

											_this.children[incompleteUploadButton.id] = incompleteUploadButton;
											incompleteUploadButton.render();
										});
									}
								}},
							],
						},
					}),
				],
			}),
			UI.createComponent('pi-project-upload-panel', {
				template: UI.template('div', 'ie relative show'),
				appearance: {
					style: {
						'width': 'calc(100% - 60px)',
						'height': '100%',
						'margin-left': '10px',
						'float': 'left',
					},
				},
				state: {
					defaultState: {
						fn: UI.functions.deactivate,
					},
					states: [
						{name: 'project-state', args: 'default'},
						{name: 'project-upload-state', args: {
							preFn: UI.functions.activate,
						}},
						{name: 'project-settings-state', args: 'default'},
						{name: 'project-new-project-state', args: 'default'},
					],
				},
				children: [
					UI.createComponent('pi-pup-left-panel', {
						template: UI.template('div', 'ie relative show'),
						appearance: {
							style: {
								'width': 'calc(50% - 5px)',
								'height': '100%',
								'float': 'left',
							},
						},
						children: [
							UI.createComponent('pi-pup-lp-summary', {
								template: UI.template('div', 'ie relative show'),
								appearance: {
									style: {
										'width': '100%',
										'height': '130px',
									},
								},
								children: [
									UI.createComponent('pi-pup-lp-s-name', {
										template: UI.template('h3', 'ie show relative'),
										appearance: {
											style: {
												'height': '30px',
											},
										},
										state: {
											states: [
												{name: 'project-upload-state', args: {
													preFn: function (_this) {
														var projectPrototypeName = Context.get('current_upload.project.name');
														_this.model().html('New upload: {name}'.format({name: projectPrototypeName}));
													},
												}}
											],
										},
									}),
									UI.createComponent('pi-pup-lp-s-client', {
										template: UI.template('span', 'ie show relative'),
										appearance: {
											style: {
												'font-size': '14px',
												'margin-bottom': '15px',
											},
										},
										state: {
											states: [
												{name: 'project-upload-state', args: {
													preFn: function (_this) {
														_this.model().html(Context.get('current_client'));
													}
												}}
											],
										},
									}),
									UI.createComponent('pi-pup-lp-s-deadline-batch-caption', {
										template: UI.template('div', 'ie show relative border border-radius'),
										appearance: {
											style: {
												'height': '60px',
												'width': 'calc(100% - 70px)',
												'float': 'left',
											},
										},
										children: [
											UI.createComponent('pi-pup-lp-s-dpc-deadline', {
												template: UI.template('div', 'ie show relative border-right'),
												appearance: {
													style: {
														'height': '100%',
														'width': '100px',
														'float': 'left',
													},
												},
												children: [
													UI.createComponent('pi-pup-lp-s-dpc-d-title', {
														template: UI.template('h3', 'ie show centred-horizontally'),
														appearance: {
															html: 'Deadline',
															style: {
																'margin-top': '5px',
															},
														},
													}),
													UI.createComponent('pi-pup-lp-s-dpc-d-content', {
														template: UI.template('span', 'ie show centred-horizontally'),
														appearance: {
															style: {
																'margin-top': '30px',
																'font-size': '14px',
															},
														},
														state: {
															states: [
																{name: 'project-upload-state', args: {
																	preFn: function (_this) {
																		var deadline = Context.get('current_upload.project.batch_deadline');
																		_this.model().html(deadline);
																	},
																}},
															],
														},
													}),
												],
											}),
											UI.createComponent('pi-pup-lp-s-dpc-batch', {
												template: UI.template('div', 'ie show relative border-right'),
												appearance: {
													style: {
														'height': '100%',
														'width': '100px',
														'float': 'left',
													},
												},
												children: [
													UI.createComponent('pi-pup-lp-s-dpc-p-title', {
														template: UI.template('h3', 'ie show centred-horizontally'),
														appearance: {
															html: 'Batch',
															style: {
																'margin-top': '5px',
															},
														},
													}),
													UI.createComponent('pi-pup-lp-s-dpc-p-content', {
														template: UI.template('span', 'ie show centred-horizontally'),
														appearance: {
															style: {
																'margin-top': '30px',
																'font-size': '14px',
															},
														},
														state: {
															states: [
																{name: 'project-upload-state', args: {
																	preFn: function (_this) {
																		var batchName = Context.get('current_upload.project.batch_name');
																		_this.model().html(batchName);
																	},
																}},
															],
														},
													}),
												],
											}),
											UI.createComponent('pi-pup-lp-s-dpc-caption', {
												template: UI.template('div', 'ie show relative'),
												appearance: {
													style: {
														'height': '100%',
														'width': 'calc(100% - 200px)',
														'float': 'left',
													},
												},
												children: [
													UI.createComponent('pi-pup-lp-s-dpc-c-title', {
														template: UI.template('p', 'ie show centred-horizontally'),
														appearance: {
															html: 'Duplicate audio files and captions will be overwritten.',
															style: {
																'margin-top': '5px',
																'font-size': '13px',
																'width': '90%',
															},
														},
													}),
												],
											}),
										],
									}),
									UI.createComponent('pi-pup-lp-s-edit-button', {
										template: UI.templates.button,
										appearance: {
											style: {
												'height': '60px',
												'width': '60px',
												'transform': 'none',
												'left': '0px',
												'float': 'left',
												'margin-left': '10px',
												'padding-top': '18px',
											},
											classes: ['relative border border-radius'],
											html: 'Edit',
										},
										state: {
											stateMap: 'project-new-project-state',
											states: [
												{name: 'project-upload-progress-state', args: {
													fn: UI.functions.deactivate,
												}},
											],
										},
										bindings: [
											{name: 'click', fn: function (_this) {

												_this.triggerState();

												// a bit of a hack.
												UI.getComponent('pi-npp-project-search').model().val(Context.get('current_upload.project.name'));
												UI.getComponent('pi-npp-batch-deadline').model().val(Context.get('current_upload.project.batch_deadline'));
												UI.getComponent('pi-npp-project-batch-search').model().val(Context.get('current_upload.project.batch_name'));
											}},
										],
									}),
								],
							}),
							UI.createComponent('pi-pup-lp-upload-progress', {
								template: UI.template('div', 'ie show relative'),
								appearance: {
									style: {
										'width': 'calc(100% - 70px)',
										'height': '40px',
									},
								},
								state: {
									states: [
										{name: 'project-upload-state', args: {
											fn: UI.functions.deactivate,
										}},
										{name: 'project-upload-progress-state', args: {
											preFn: UI.functions.activate,
										}},
									],
								},
								children: [
									UI.createComponent('pi-pup-lp-up-progress-bar', {
										template: UI.template('div', 'ie show relative'),
										appearance: {
											style: {
												'width': 'calc(100%)',
												'height': '40px',
											},
										},
										children: [
											UI.createComponent('pi-pup-lp-up-pb-bar', {
												template: UI.template('div', 'ie show relative border border-radius'),
												appearance: {
													style: {
														'width': 'calc(100% - 90px)',
														'height': '40px',
														'float': 'left',
													},
												},
												children: [
													UI.createComponent('pi-pup-lp-up-pbb-background', {
														template: UI.template('div', 'ie show relative'),
														appearance: {
															style: {
																'width': '0px',
																'height': '40px',
																'background-color': '#ccc',
															},
														},
													}),
												],
											}),
											UI.createComponent('pi-pup-lp-up-pb-counter', {
												template: UI.template('div', 'ie show relative border border-radius'),
												appearance: {
													style: {
														'width': '80px',
														'height': '40px',
														'float': 'left',
														'margin-left': '10px',
														'padding-top': '10px',
													},
												},
												children: [
													UI.createComponent('pi-pup-lp-up-pbc-span', {
														template: UI.template('span', 'ie show centred-horizontally'),
													})
												],
											}),
										],
									}),
								],
							}),
							UI.createComponent('pi-pup-lp-relfile-wrapper', {
								template: UI.template('div', 'ie show relative'),
								appearance: {
									style: {
										'width': '100%',
										'height': 'calc(100% - 130px)',
									},
								},
								children: [
									UI.createComponent('pi-pup-lp-rw-dropzone', {
										template: UI.template('div', 'ie relative border border-radius dz-wrapper'),
										appearance: {
											style: {
												'height': '100%',
												'width': '100%',
												'border-style': 'dotted',
												'user-select': 'none',
											},
										},
										state: {
											stateMap: 'project-upload-relfile-state',
											defaultState: {
												preFn: function (_this) {
													if (Context.get('current_upload.relfile.lines') === '') {
														// make visible
														_this.model().css({'display': 'block'});

														// make dropzone
														_this.model().dropzone({
															url: '/upload-relfile',
															maxFiles: 1,
															acceptedFiles: '.csv',
															paramName: 'relfile-input',
															createImageThumbnails: false,
															accept: function (file, done) {
																// try reading file
																var reader = new FileReader();
																reader.onload = function(e) {
																	var contents = e.target.result;
																	// contents is a string. I can do what I want.
																	// 1. parse contents of file and display in rel-file-filelist
																	var lines = contents.split('\n');
																	var headerLine = lines.shift();

																	// 2. add lines to Context
																	var relfileLineObjects = lines.map(function (line) {
																		var keys = line.split(',');
																		return {filename: basename(keys[0]), caption: keys[1]}
																	}).filter(function (relfileLineObject) {
																		return relfileLineObject.filename !== ''; //filter directories
																	});

																	// 1. find number of unique audio file names
																	var audioSet = {};
																	relfileLineObjects.forEach(function (line) {
																		if (audioSet.hasOwnProperty(line.filename)) {
																			audioSet[line.filename]++;
																		} else {
																			audioSet[line.filename] = 1;
																		}
																	});

																	var total = relfileLineObjects.length;
																	var unique = Object.keys(audioSet).length;
																	var duplicates = 0;
																	Object.keys(audioSet).forEach(function (key) {
																		var matchingLines = relfileLineObjects.filter(function (line) {
																			return line.filename === key;
																		});
																		if (audioSet[key] > 1) {
																			duplicates += audioSet[key] - 1;
																			matchingLines.forEach(function (line, index) {
																				if (index === 0) {
																					line.is_duplicate = false;
																				} else {
																					line.is_duplicate = true;
																				}
																			})
																		} else {
																			matchingLines.forEach(function (line) {
																				line.is_duplicate = false;
																			})
																		}
																	});

																	Context.set('current_upload.relfile', {
																		name: file.name,
																		lines: relfileLineObjects,
																		total: total,
																		unique: unique,
																		duplicates: duplicates,
																	});

																	if (Context.get('current_upload.progress') === '100' || Context.get('current_upload.progress') === '') {
																		Context.set('current_upload.progress', '0');
																	}

																	// create upload object
																	var uploadData = {
																		'current_client': Context.get('current_client'),
																		'current_role': Context.get('current_role'),
																		'project_name': Context.get('current_upload.project.name'),
																		'batch_name': Context.get('current_upload.project.batch_name'),
																		'archive_name': Context.get('current_upload.audio.name'),
																		'relfile_name': file.name,
																		'fragments': relfileLineObjects.map(function (line) {
																			return line.filename;
																		}),
																	};

																	command('create_upload', uploadData, function (data) {});

																	// 3. trigger
																	_this.triggerState();
																};
																reader.readAsText(file);
															},
														});
													} else {
														_this.model().css({'display': 'none'});
													}
												},
											},
											states: [
												{name: 'project-upload-state', args: 'default'},
												{name: 'project-upload-relfile-state', args: {
													fn: UI.functions.deactivate,
												}},
												{name: 'project-upload-relfile-reset-state', args: 'default'},
											],
										},
										children: [
											UI.createComponent('pi-pup-lp-rw-dz-relfile', {
												template: UI.template('h3', 'ie show centred-horizontally'),
												appearance: {
													html: 'Relfile',
													style: {
														'width': '100%',
														'top': '40px',
														'user-select': 'none',
														'pointer-events': 'none',
													},
												},
											}),
											UI.createComponent('pi-pup-lp-rw-dz-drag', {
												template: UI.template('span', 'ie show centred-horizontally'),
												appearance: {
													html: 'Drag and drop or click to upload',
													style: {
														'width': '100%',
														'top': '70px',
														'user-select': 'none',
														'pointer-events': 'none',
													},
												},
											}),
											UI.createComponent('pi-pup-lp-rw-dz-csv', {
												template: UI.template('span', 'ie show centred-horizontally'),
												appearance: {
													html: '.csv file of the form:',
													style: {
														'width': '100%',
														'top': '95px',
														'user-select': 'none',
														'pointer-events': 'none',
													},
												},
											}),
											UI.createComponent('pi-pup-lp-rw-dz-table', {
												template: UI.template('table'),
												appearance: {
													style: {
														'position': 'relative',
														'top': '140px',
														'width': '80%',
														'text-align': 'left',
														'left': '50%',
														'transform': 'translateX(-50%)',
														'border-spacing': '10px',
														'border-collapse': 'collapse',
														'pointer-events': 'none',
													},
												},
												children: [
													UI.createComponent('pi-pup-lp-rw-dz-table-head', {
														template: UI.template('thead'),
														children: [
															UI.createComponent('pi-pup-lp-rw-dz-t-header', {
																template: UI.template('tr'),
																appearance: {
																	style: {
																		'border-bottom': '1px solid #ccc',
																		'height': '40px',
																	},
																},
																children: [
																	UI.createComponent('pi-pup-lp-rw-dz-th-file-name', {
																		template: UI.template('th'),
																		appearance: {
																			html: 'filename',
																			style: {
																				'width': '50%',
																			},
																		},
																	}),
																	UI.createComponent('pi-pup-lp-rw-dz-t-h-caption', {
																		template: UI.template('th'),
																		appearance: {
																			html: 'caption',
																			style: {
																				'width': '50%',
																			},
																		},
																	}),
																],
															}),
														],
													}),
													UI.createComponent('pi-pup-lp-rw-dz-table-body', {
														template: UI.template('tbody'),
														children: [
															UI.createComponent('pi-pup-lp-rw-dz-tb-row1', {
																template: UI.template('tr'),
																appearance: {
																	style: {
																		'border-bottom': '1px solid #ccc',
																		'height': '40px',
																	},
																},
																children: [
																	UI.createComponent('pi-pup-lp-rw-dz-tb-r1-file-name', {
																		template: UI.template('td'),
																		appearance: {
																			html: 'demo-file_1.wav',
																			style: {
																				'width': '50%',
																			},
																		},
																	}),
																	UI.createComponent('pi-pup-lp-rw-dz-tb-r1-caption', {
																		template: UI.template('td'),
																		appearance: {
																			html: `I'd like to speak to...`,
																			style: {
																				'width': '50%',
																			},
																		},
																	}),
																],
															}),
															UI.createComponent('pi-pup-lp-rw-dz-tb-row2', {
																template: UI.template('tr'),
																appearance: {
																	style: {
																		'border-bottom': '1px solid #ccc',
																		'height': '40px',
																	},
																},
																children: [
																	UI.createComponent('pi-pup-lp-rw-dz-tb-r2-file-name', {
																		template: UI.template('td'),
																		appearance: {
																			html: 'demo-file_2.wav',
																			style: {
																				'width': '50%',
																			},
																		},
																	}),
																	UI.createComponent('pi-pup-lp-rw-dz-tb-r2-caption', {
																		template: UI.template('td'),
																		appearance: {
																			html: 'advisor',
																			style: {
																				'width': '50%',
																			},
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
									Components.scrollList('pi-pup-lp-rw-file-list', {
										state: {
											defaultState: {
												fn: UI.functions.deactivate,
											},
											states: [
												{name: 'project-upload-state', args: {
													preFn: function (_this) {
														if (Context.get('current_upload.relfile') !== '') {
															_this.model().css({'display': 'block'});
														} else {
															_this.model().css({'display': 'none'});
														}
													}
												}},
												{name: 'project-upload-relfile-state', args: {
													preFn: UI.functions.activate,
												}},
												{name: 'project-upload-relfile-reset-state', args: 'default'},
												{name: 'project-upload-progress-state', args: {
													fn: UI.functions.deactivate,
												}},
											],
										},
										content: [
											UI.createComponent('pi-pup-lp-rw-fl-summary', {
												template: UI.template('div', 'ie show relative border border-radius'),
												appearance: {
													style: {
														'width': 'calc(100% - 90px)',
														'height': '40px',
														'padding-top': '10px',
														'padding-left': '10px',
														'float': 'left',
													},
												},
												children: [
													UI.createComponent('pi-pup-lp-rw-fl-summary-display', {
														template: UI.template('span', 'ie show'),
														state: {
															states: [
																{name: 'project-upload-relfile-state', args: {
																	preFn: function (_this) {
																		// get relfile data
																		var total = Context.get('current_upload.relfile.total');
																		var unique = Context.get('current_upload.relfile.unique');
																		var duplicates = Context.get('current_upload.relfile.duplicates');

																		_this.model().html('{total} total, {unique} unique, {duplicates} duplicates'.format({total: total, unique: unique, duplicates: duplicates}));
																	}
																}},
															],
														},
													}),
												],
											}),
											UI.createComponent('pi-pup-lp-rw-fl-reset-button', {
												template: UI.templates.button,
												appearance: {
													classes: ['border', 'border-radius', 'relative'],
													style: {
														'height': '40px',
														'width': '80px',
														'padding-top': '10px',
														'float': 'left',
														'margin-left': '10px',
														'transform': 'none',
														'left': '0px',
													},
													html: 'Reset',
												},
												state: {
													stateMap: 'project-upload-relfile-reset-state',
												},
												bindings: [
													{name: 'click', fn: function (_this) {
														// remove context variables
														Context.set('current_upload.relfile', {});
														_this.parent().parent().parent().model().find('.dz-error-message').css({'display': 'none'});
														_this.triggerState();
													}},
												],
											}),
											UI.createComponent('pi-pup-lp-rw-fl-list', {
												template: UI.template('table'),
												appearance: {
													style: {
														'width': '100%',
														'position': 'relative',
														'top': '10px',
														'text-align': 'left',
													},
												},
												children: [
													UI.createComponent('pi-pup-lp-rw-fl-list-header', {
														template: UI.template('thead'),
														children: [
															UI.createComponent('pi-pup-lp-rw-fl-list-header-row', {
																template: UI.template('tr'),
																children: [
																	UI.createComponent('pi-pup-lp-rw-fl-lhr-index', {
																		template: UI.template('th'),
																		appearance: {
																			html: '#',
																			style: {
																				'width': '10%',
																				'height': '40px',
																				'border-bottom': '1px solid #ccc',
																			},
																		},
																	}),
																	UI.createComponent('pi-pup-lp-rw-fl-lhr-file-name', {
																		template: UI.template('th'),
																		appearance: {
																			html: 'Audio file name',
																			style: {
																				'width': '40%',
																				'height': '40px',
																				'border-bottom': '1px solid #ccc',
																			},
																		},
																	}),
																	UI.createComponent('pi-pup-lp-rw-fl-lhr-caption', {
																		template: UI.template('th'),
																		appearance: {
																			html: 'Caption',
																			style: {
																				'width': '40%',
																				'height': '40px',
																				'border-bottom': '1px solid #ccc',
																			},
																		},
																	}),
																],
															}),
														],
													}),
													UI.createComponent('pi-pup-lp-rw-fl-list-body', {
														template: UI.template('tbody'),
														state: {
															states: [
																{name: 'project-upload-relfile-state', args: {
																	preFn: function (_this) {
																		// remove old lines
																		Object.keys(_this.children).forEach(function (childId) {
																			UI.removeComponent(childId);
																		});

																		// clear children
																		_this.children = {};

																		// add data as lines
																		var audioLines = Context.get('current_upload.audio.lines');
																		Context.get('current_upload.relfile.lines').forEach(function (line, index) {

																			var filename = line.filename.length > 20 ? line.filename.substr(0,15).concat('... .wav') : line.filename;
																			var caption = line.caption.length > 20 ? line.caption.substr(0,20).concat('...') : line.caption;
																			line.index = index;

																			var presentInAudio = true; // true even if there is no relfile
																			if (audioLines.length !== 0) {
																				presentInAudio = audioLines.filter(function (audioLine) {
																					return line.filename === audioLine.filename;
																				}).length > 0;
																			}
																			line.found = presentInAudio;

																			// define styling
																			var style = {};
																			if (line.is_duplicate) {
																				style['color'] = '#AA9F39';
																			}

																			if (!presentInAudio) {
																				style['color'] = '#AA5039';
																			}

																			// create row object
																			var row = UI.createComponent('pi-pup-lp-rw-fl-lb-row-{index}'.format({index: index}), {
																				root: _this.id,
																				template: UI.template('tr'),
																				appearance: {
																					style: style,
																					properties: {
																						'index': index,
																					},
																				},
																				children: [
																					UI.createComponent('pi-pup-lp-rw-fl-lb-row-{index}-index'.format({index: index}), {
																						template: UI.template('td'),
																						appearance: {
																							html: index,
																							style: {
																								'width': '10%',
																								'height': '40px',
																								'border-bottom': '1px solid #ccc',
																							},
																						},
																					}),
																					UI.createComponent('pi-pup-lp-rw-fl-lb-row-{index}-file-name'.format({index: index}), {
																						template: UI.template('td'),
																						appearance: {
																							html: filename,
																							style: {
																								'width': '40%',
																								'height': '40px',
																								'border-bottom': '1px solid #ccc',
																							},
																							properties: {
																								'title': line.filename !== filename ? line.filename : '',
																							},
																						},
																					}),
																					UI.createComponent('pi-pup-lp-rw-fl-lb-row-{index}-caption'.format({index: index}), {
																						template: UI.template('td'),
																						appearance: {
																							html: caption,
																							style: {
																								'width': '40%',
																								'height': '40px',
																								'border-bottom': '1px solid #ccc',
																							},
																							properties: {
																								'title': line.caption !== caption ? line.caption : '',
																							},
																						},
																					}),
																				],
																			});

																			_this.children[row.id] = row;
																			row.render();
																		});
																	},
																}},
																{name: 'project-upload-audio-state', args: {
																	preFn: function (_this) {
																		// reconcile list of audio files in Context.
																		var audioFileList = Context.get('current_upload.audio.lines');
																		var relfileFileList = Context.get('current_upload.relfile.lines');

																		// the priority here is updating the 'color' property of each row based on it's batchicipation in each list.
																		relfileFileList.forEach(function (line) {
																			// if line.filename is not in audioFileList, change color to red
																			if (audioFileList.filter(function (audioLine) {
																				return audioLine.filename === line.filename;
																			}).length === 0) {
																				_this.model().children('[index={index}]'.format({index: line.index})).css({'color': '#AA5039'});
																			}
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
								],
							}),
						]
					}),
					UI.createComponent('pi-pup-right-panel', {
						template: UI.template('div', 'ie relative show'),
						appearance: {
							style: {
								'width': 'calc(50% - 5px)',
								'height': '100%',
								'float': 'left',
								'margin-left': '10px',
							},
						},
						children: [
							UI.createComponent('pi-pup-rp-audio-wrapper', {
								template: UI.template('div', 'ie show relative'),
								appearance: {
									style: {
										'width': '100%',
										'height': 'calc(100% - 50px)',
									},
								},
								children: [
									UI.createComponent('pi-pup-rp-aw-dropzone', {
										template: UI.template('div', 'ie show relative border border-radius dz-wrapper'),
										appearance: {
											style: {
												'height': '100%',
												'width': '100%',
												'border-style': 'dotted',
											},
										},
										state: {
											stateMap: 'project-upload-audio-state',
											defaultState: {
												preFn: function (_this) {
													if (Context.get('current_upload.audio.lines') === '') {
														// make visible
														_this.model().css({'display': 'block'});

														// make dropzone
														_this.model().dropzone({
															url: '/upload-audio',
															maxFiles: 1,
															acceptedFiles: '.zip',
															paramName: 'audio-input',
															createImageThumbnails: false,
															accept: function (file, done) {
																// try reading file
																var reader = new FileReader();
																var zip = new JSZip();
																reader.onload = function(e) {
																	var contents = e.target.result;
																	zip.load(contents);

																	// extract list of files and cut off directory name
																	var filenames = [];
																	var dirname;
																	Object.keys(zip.files).forEach(function (key) {
																		if (!zip.files[key].dir) {
																			filenames.push(basename(key));
																		} else {
																			if (dirname === undefined) {
																				dirname = key;
																			}
																		}
																	});

																	// find number of unique audio file names
																	var audioSet = {};
																	filenames.forEach(function (filename) {
																		if (audioSet.hasOwnProperty(filename)) {
																			audioSet[filename]++;
																		} else {
																			audioSet[filename] = 1;
																		}
																	});

																	// count numbers and assign duplicates
																	var audioObjects = filenames.map(function (filename) {
																		return {filename: filename};
																	});
																	var total = filenames.length;
																	var unique = Object.keys(audioSet).length;
																	var duplicates = 0;
																	Object.keys(audioSet).forEach(function (key) {
																		var matchingLines = audioObjects.filter(function (audioObject) {
																			return audioObject.filename === key;
																		});
																		if (audioSet[key] > 1) {
																			duplicates += audioSet[key] - 1;
																			matchingLines.forEach(function (line, index) {
																				if (index === 0) {
																					line.is_duplicate = false;
																				} else {
																					line.is_duplicate = true;
																				}
																			})
																		} else {
																			matchingLines.forEach(function (line) {
																				line.is_duplicate = false;
																			})
																		}
																	});

																	Context.set('current_upload.audio', {
																		name: file.name,
																		files: zip.files,
																		lines: audioObjects,
																		total: total,
																		unique: unique,
																		duplicates: duplicates,
																		dir: dirname,
																	});

																	if (Context.get('current_upload.progress') === '100' || Context.get('current_upload.progress') === '') {
																		Context.set('current_upload.progress', '0');
																	}

																	// create upload object
																	var uploadData = {
																		'current_client': Context.get('current_client'),
																		'current_role': Context.get('current_role'),
																		'project_name': Context.get('current_upload.project.name'),
																		'batch_name': Context.get('current_upload.project.batch_name'),
																		'archive_name': file.name,
																		'relfile_name': Context.get('current_upload.relfile.name'),
																		'fragments': audioObjects.map(function (line) {
																			return line.filename;
																		}),
																	};

																	command('create_upload', uploadData, function (data) {});

																	_this.triggerState();
																}

																reader.readAsBinaryString(file);
															},
														});
													} else {
														_this.model().css({'display': 'none'});
													}
												},
											},
											states: [
												{name: 'project-upload-state', args: 'default'},
												{name: 'project-upload-audio-state', args: {
													fn: UI.functions.deactivate,
												}},
												{name: 'project-upload-audio-reset-state', args: 'default'},
											],
										},
										children: [
											UI.createComponent('pi-pup-rp-aw-dz-audio', {
												template: UI.template('h3', 'ie show centred-horizontally'),
												appearance: {
													html: 'Audio zip archive',
													style: {
														'width': '100%',
														'top': '40px',
														'user-select': 'none',
														'pointer-events': 'none',
													},
												},
											}),
											UI.createComponent('pi-pup-rp-aw-dz-drag', {
												template: UI.template('span', 'ie show centred-horizontally'),
												appearance: {
													html: 'Drag and drop or click to upload',
													style: {
														'width': '100%',
														'top': '70px',
														'user-select': 'none',
														'pointer-events': 'none',
													},
												},
											}),
											UI.createComponent('pi-pup-rp-aw-dz-archive', {
												template: UI.template('span', 'ie show centred-horizontally'),
												appearance: {
													html: '.zip file of the form:',
													style: {
														'width': '100%',
														'top': '95px',
														'user-select': 'none',
														'pointer-events': 'none',
													},
												},
											}),
											UI.createComponent('pi-pup-rp-aw-dz-img', {
												template: UI.template('img'),
												appearance: {
													properties: {
														'src': '/static/img/folder-icon-comp.png',
													},
													style: {
														'position': 'absolute',
														'width': '120px',
														'height': '160px',
														'top': '140px',
														'left': '150px',
														'pointer-events': 'none',
													},
												},
											}),
											UI.createComponent('pi-pup-rp-aw-dz-file1', {
												template: UI.template('span', 'ie show'),
												appearance: {
													html: 'demo-file_1.wav',
													style: {
														'top': '201px',
														'left': '210px',
													},
												},
											}),
											UI.createComponent('pi-pup-rp-aw-dz-file2', {
												template: UI.template('span', 'ie show'),
												appearance: {
													html: 'demo-file_2.wav',
													style: {
														'top': '233px',
														'left': '210px',
													},
												},
											}),
										],
									}),
									Components.scrollList('pi-pup-rp-aw-audio-file-list', {
										state: {
											defaultState: {
												fn: UI.functions.deactivate,
											},
											states: [
												{name: 'project-upload-state', args: {
													preFn: function (_this) {
														if (Context.get('current_upload.audio') !== '') {
															_this.model().css({'display': 'block'});
														} else {
															_this.model().css({'display': 'none'});
														}
													}
												}},
												{name: 'project-upload-audio-state', args: {
													preFn: UI.functions.activate,
												}},
												{name: 'project-upload-audio-reset-state', args: 'default'},
												{name: 'project-upload-progress-state', args: {
													fn: UI.functions.deactivate,
												}},
											],
										},
										content: [
											UI.createComponent('pi-pup-rp-aw-afl-summary', {
												template: UI.template('div', 'ie show relative border border-radius'),
												appearance: {
													style: {
														'width': 'calc(100% - 90px)',
														'height': '40px',
														'padding-top': '10px',
														'padding-left': '10px',
														'float': 'left',
													},
												},
												children: [
													UI.createComponent('pi-pup-rp-aw-afl-summary-display', {
														template: UI.template('span', 'ie show'),
														state: {
															states: [
																{name: 'project-upload-audio-state', args: {
																	preFn: function (_this) {
																		// get relfile data
																		var total = Context.get('current_upload.audio.total');
																		var unique = Context.get('current_upload.audio.unique');
																		var duplicates = Context.get('current_upload.audio.duplicates');

																		_this.model().html('{total} total, {unique} unique, {duplicates} duplicates'.format({total: total, unique: unique, duplicates: duplicates}));
																	}
																}},
															],
														},
													}),
												],
											}),
											UI.createComponent('pi-pup-rp-aw-afl-reset-button', {
												template: UI.templates.button,
												appearance: {
													classes: ['border', 'border-radius', 'relative'],
													style: {
														'height': '40px',
														'width': '80px',
														'padding-top': '10px',
														'float': 'left',
														'margin-left': '10px',
														'transform': 'none',
														'left': '0px',
													},
													html: 'Reset',
												},
												state: {
													stateMap: 'project-upload-audio-reset-state',
												},
												bindings: [
													{name: 'click', fn: function (_this) {
														// remove context variables
														Context.set('current_upload.audio', {});

														// omg hack because I do not control the dropzone package.
														_this.parent().parent().parent().model().find('.dz-error-message').css({'display': 'none'});
														_this.triggerState();
													}},
												],
											}),
											UI.createComponent('pi-pup-rp-aw-afl-list', {
												template: UI.template('table'),
												appearance: {
													style: {
														'width': '100%',
														'position': 'relative',
														'top': '10px',
														'text-align': 'left',
													},
												},
												children: [
													UI.createComponent('pi-pup-rp-aw-afl-list-header', {
														template: UI.template('thead'),
														children: [
															UI.createComponent('pi-pup-rp-aw-afl-list-header-row', {
																template: UI.template('tr'),
																children: [
																	UI.createComponent('pi-pup-rp-aw-afl-lhr-index', {
																		template: UI.template('th'),
																		appearance: {
																			html: '#',
																			style: {
																				'width': '10%',
																				'height': '40px',
																				'border-bottom': '1px solid #ccc',
																			},
																		},
																	}),
																	UI.createComponent('pi-pup-rp-aw-afl-lhr-file-name', {
																		template: UI.template('th'),
																		appearance: {
																			html: 'Audio file name',
																			style: {
																				'width': '90%',
																				'height': '40px',
																				'border-bottom': '1px solid #ccc',
																			},
																		},
																	}),
																],
															}),
														],
													}),
													UI.createComponent('pi-pup-rp-aw-afl-list-body', {
														template: UI.template('tbody'),
														state: {
															states: [
																{name: 'project-upload-audio-state', args: {
																	preFn: function (_this) {
																		// remove old lines
																		Object.keys(_this.children).forEach(function (childId) {
																			UI.removeComponent(childId);
																		});

																		// clear children
																		_this.children = {};

																		// add data as lines
																		var relfileLines = Context.get('current_upload.relfile.lines');
																		Context.get('current_upload.audio.lines').forEach(function (line, index) {

																			// determine properties
																			var filename = line.filename.length > 40 ? line.filename.substr(0,15).concat('... .wav') : line.filename;
																			line.index = index;

																			var presentInRelfile = true; // true even if there is no relfile
																			if (relfileLines.length !== 0) {
																				presentInRelfile = relfileLines.filter(function (relfileLine) {
																					return line.filename === relfileLine.filename;
																				}).length > 0;
																			}
																			line.found = presentInRelfile;

																			// define styling
																			var style = {};
																			if (line.is_duplicate) {
																				style['color'] = '#AA9F39';
																			}

																			if (!presentInRelfile) {
																				style['color'] = '#AA5039';
																			}

																			// create row object
																			var row = UI.createComponent('pi-pup-rp-aw-afl-lb-row-{index}'.format({index: index}), {
																				root: _this.id,
																				template: UI.template('tr'),
																				appearance: {
																					style: style,
																					properties: {
																						'index': index,
																					},
																				},
																				children: [
																					UI.createComponent('pi-pup-rp-aw-afl-lb-row-{index}-index'.format({index: index}), {
																						template: UI.template('td'),
																						appearance: {
																							html: index,
																							style: {
																								'width': '10%',
																								'height': '40px',
																								'border-bottom': '1px solid #ccc',
																							},
																						},
																					}),
																					UI.createComponent('pi-pup-rp-aw-afl-lb-row-{index}-file-name'.format({index: index}), {
																						template: UI.template('td'),
																						appearance: {
																							html: filename,
																							style: {
																								'width': '90%',
																								'height': '40px',
																								'border-bottom': '1px solid #ccc',
																							},
																							properties: {
																								'title': line.filename !== filename ? line.filename : '',
																							},
																						},
																					}),
																				],
																			});

																			_this.children[row.id] = row;
																			row.render();
																		});
																	},
																}},
																{name: 'project-upload-relfile-state', args: {
																	preFn: function (_this) {
																		// reconcile list of audio files in Context.
																		var audioFileList = Context.get('current_upload.audio.lines');
																		var relfileFileList = Context.get('current_upload.relfile.lines');

																		// the priority here is updating the 'color' property of each row based on it's batchicipation in each list.
																		audioFileList.forEach(function (line) {
																			// if line.filename is not in audioFileList, change color to red
																			if (relfileFileList.filter(function (relfileLine) {
																				return relfileLine.filename === line.filename;
																			}).length === 0) {
																				_this.model().children('[index={index}]'.format({index: line.index})).css({'color': '#AA5039'});
																			}
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
								],
							}),
							UI.createComponent('pi-pup-rp-confirm-button', {
								template: UI.templates.button,
								appearance: {
									classes: ['border border-radius'],
									style: {
										'width': '100%',
										'height': '40px',
										'padding-top': '10px',
										'margin-top': '10px',
									},
									html: 'Confirm and upload',
								},
								state: {
									stateMap: 'project-upload-progress-state',
									states: [
										{name: 'project-upload-progress-state', args: {
											fn: UI.functions.deactivate,
										}},
									],
								},
								bindings: [
									{name: 'click', fn: function (_this) {
										// get the list of audio files that are "found".
										var foundAudioFiles = Context.get('current_upload.audio.lines').filter(function (line) {
											return line.found;
										});

										// if there is an unfinished upload, filter by the remaining fragments to be uploaded.
										var remainingFragments = Context.get('current_upload.remaining_fragments');
										if (remainingFragments !== '') {
											foundAudioFiles = foundAudioFiles.filter(function (audioFile) {
												return remainingFragments.indexOf(audioFile.filename) !== -1;
											});
										}

										var audioFileList = Context.get('current_upload.audio.files');
										var relfileFileList = Context.get('current_upload.relfile.lines')

										// failure conditions
										var noFoundAudioFiles = foundAudioFiles.length === 0;
										if (!noFoundAudioFiles) {
											// trigger state
											_this.triggerState();

											// upload audio files one by one
											foundAudioFiles.forEach(function (audioFile) {
												// 1. get match from actual list of files
												var filename = Object.keys(audioFileList).filter(function (key) {
													return basename(key) === audioFile.filename;
												})[0];

												var file = audioFileList[filename];
												var arrayBuffer = file.asArrayBuffer();
												var dataView = new DataView(arrayBuffer);
												var blob = new Blob([dataView], {type: 'audio/wav'});

												// 2. get caption from relfile list
												var caption = '';
												if (relfileFileList.length !== 0) {
													caption = relfileFileList.filter(function (line) {
														return line.filename === audioFile.filename;
													})[0].caption;
												}

												// 3. create new formdata object
												formData = new FormData();
												formData.encoding = 'multibatch/form-data';
												formData.append('file', blob);
												formData.append('caption', caption);
												formData.append('filename', audioFile.filename);
												formData.append('current_client', Context.get('current_client'));
												formData.append('current_role', Context.get('current_role'));
												formData.append('project_name', Context.get('current_upload.project.name'));
												formData.append('batch_name', Context.get('current_upload.project.batch_name'));
												formData.append('archive_name', Context.get('current_upload.audio.name'));
												formData.append('relfile_name', Context.get('current_upload.relfile.name'));

												command('upload_audio', formData, function (data) {
													// update progress
													var progress = Context.get('current_upload.progress');
													var current_progress = Math.floor(parseFloat(progress) + 100.0 / foundAudioFiles.length);
													Context.set('current_upload.progress', current_progress);

													// set indicators
													var bar = UI.getComponent('pi-pup-lp-up-pbb-background');
													var span = UI.getComponent('pi-pup-lp-up-pbc-span');
													bar.model().css({'width': '{width}px'.format({width: current_progress * parseInt(bar.parent().model().css('width')) / 100})});
													span.model().html('{percentage}%'.format({percentage: current_progress}));

													// end condition
													if (current_progress === 100) {
														Context.set('current_upload.done', true);
													}
												}, {
													processData: false,
													contentType: false,
												});
											});

										} else {
											// make button red
										}
									}}
								],
							}),
						],
					}),
				],
			}),
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
				'project-state': 'default',
				'transcription-state': 'default',
			},
		},
		content: [
			Components.scrollList('cs-client-list', {
				scroll: false,
				loadingIcon: true,
				registry: {
					path: function () {
						return 'clients';
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
								var data = Context.get('clients.{client}.roles'.format({client: Context.get('current_client')}));
								data.forEach(function (roleName) {
									var child = UI.createComponent('rs-{name}-button'.format({name: roleName}), {
										root: _this.id,
										template: UI.templates.button,
										appearance: {
											style: {
												'opacity': '0.0',
											},
											classes: ['show'],
											html: Context.get('role_display.{role_name}'.format({role_name: roleName})),
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
											}},
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
				'transcription-state': 'next',
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
							stateMap: 'transcription-state',
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
										var client = Context.get('clients.{client}'.format({client: Context.get('current_client')}));
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
									Context.set('clients.{client}.users'.format({client: Context.get('current_client')}), {});
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
