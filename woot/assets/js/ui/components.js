var Components = {
	breadcrumbs: function (id, args) {
		// displays position in heirarchy
		return UI.createComponent(id, args);
	},

	scrollList: function (id, args) {
		// search field toggle
		// scroll toggle
		// infinite scroll loading

		// 1. set search and filter toggles
		var showTitle = args.title !== undefined ? 'show' : '';
		var showSearch = args.search !== undefined ? 'show' : '';
		var scrollHeight = args.search !== undefined ? 'calc(100% - 30px)' : '100%';
		scrollHeight = args.title !== undefined ? 'calc(100% - 60px)' : scrollHeight;

		var scrollOverflow = args.scroll !== undefined ? (args.scroll ? 'scroll' : 'hidden') : 'scroll';
		var showLoadingIcon = args.loadingIcon !== undefined ? (args.loadingIcon ? 'show' : '') : '';

		var container = UI.createComponent(id, {
			template: UI.template('div', 'ie scroll-wrapper show relative'),
			appearance: args.appearance,
			children: [
				UI.createComponent('{id}-title'.format({id: id}), {
					template: UI.template('h4', 'ie sidebar-title'),
					appearance: {
						html: args.title,
						style: {
							'height': '30px',
						},
						classes: ['relative', showTitle],
					},
				}),
				Components.searchFilterField('{id}-search'.format({id: id}), {
					show: showSearch,
				}),
				UI.createComponent('{id}-scroll'.format({id: id}), {
					template: UI.template('div', 'ie scroll show relative'),
					appearance: {
						style: {
							'height': scrollHeight,
							'overflow-y': scrollOverflow,
						},
					},
					state: args.state,
					children: args.content,
					registry: args.registry,
				}),
				UI.createComponent('{id}-filter'.format({id: id}), {
					template: UI.template('div', 'ie scroll relative'),
					appearance: {
						style: {
							'height': 'calc(100% - 30px)',
						},
					},
				}),
				UI.createComponent('{id}-loading-icon'.format({id: id}), {
					template: UI.templates.loadingIcon,
					appearance: {
						classes: [showLoadingIcon],
					},
				}),
			],
		});

		// add methods
		container.loadingIcon = function () {
			return UI.getComponent('{id}-loading-icon'.format({id: id}));
		}

		container.scroll = function () {
			return UI.getComponent('{id}-scroll'.format({id: id}));
		}

		container.filter = function () {
			return UI.getComponent('{id}-filter'.format({id: id}));
		}

		container.searchField = function () {
			return UI.getComponent('{id}-search'.format({id: id}));
		}

		container.getChildren = function () {
			return container.scroll().children;
		}

		// return
		return container;
	},

	searchFilterField: function (id, args) {
		// pop over panel for filter suggestions and search results
		// keywords and functions
			// eg. ".." -> function () {} - search for single words
			// "worker" -> filter by workers
		var show = args.show !== undefined ? args.show : '';

		var container =	UI.createComponent(id, {
			template: UI.template('input', 'ie input relative'),
			appearance: {
				style: {
					'width': '100%',
					'margin-bottom': '10px',
				},
				classes: [show],
				properties: {
					'placeholder': 'Search or filter...',
				},
			},
			bindings: args.bindings,
		});

		return container;
	},

	roleIndicator: function (id, args) {
		// change based on standard conditions
		// dispatch requests for each state
		// vars
		var isBasic = args.basic !== undefined ? args.basic : false;

		// define
		var _this = UI.createComponent(id, {
			template: UI.template('div', 'ie show relative'),
			children: [
				UI.createComponent('{id}-glyph-button'.format({id: id}), {
					template: UI.template('div', 'ie button show relative border border-radius'),
					appearance: {
						style: {
							'height': '40px',
							'width': '40px',
							'padding-top': '10px',
							'margin-top':' 10px',
							'float': 'left',
						},
					},
					children: [
						UI.createComponent('{id}-gb-enabled'.format({id: id}), {
							template: UI.template('span', 'glyphicon glyphicon-ok glyphicon-hidden'),
						}),
						UI.createComponent('{id}-gb-disabled'.format({id: id}), {
							template: UI.template('span', 'glyphicon glyphicon-remove glyphicon-hidden'),
						}),
						UI.createComponent('{id}-gb-pending'.format({id: id}), {
							template: UI.template('span', 'glyphicon glyphicon-option-horizontal glyphicon-hidden'),
						}),
						UI.createComponent('{id}-gb-add'.format({id: id}), {
							template: UI.template('span', 'glyphicon glyphicon-plus glyphicon-hidden'),
						}),
					],
					bindings: args.bindings,
				}),
				UI.createComponent('{id}-name-button'.format({id: id}), {
					template: UI.template('div', 'ie button show relative'),
					appearance: {
						style: {
							'height': '40px',
							'width': '150px',
							'padding-top': '10px',
							'margin-top':' 10px',
							'margin-left':' 10px',
							'float': 'left',
							'text-align': 'left',
						},
					},
					registry: {
						path: function () {
							return ['role_display', args.label];
						},
						fn: function (_this, data) {
							_this.model().html(data); // set button title
						}
					},
					bindings: [
						{name: 'click', fn: function (_this) {
							_this.parent().glyphButton().model().click();
						}}
					],
				}),
			],
		});

		// vars
		_this.glyphButton = function () {
			return UI.getComponent('{id}-glyph-button'.format({id: id}));
		}
		_this.enabledGlyph = function () {
			return UI.getComponent('{id}-gb-enabled'.format({id: id}));
		}
		_this.disabledGlyph = function () {
			return UI.getComponent('{id}-gb-disabled'.format({id: id}));
		}
		_this.pendingGlyph = function () {
			return UI.getComponent('{id}-gb-pending'.format({id: id}));
		}
		_this.addGlyph = function () {
			return UI.getComponent('{id}-gb-add'.format({id: id}));
		}
		_this.nameButton = function () {
			return UI.getComponent('{id}-name-button'.format({id: id}));
		}

		// methods
		_this.isBasic = isBasic;
		_this.status = 'empty';
		_this.click = function () {
			// what happens when clicked is dependent on the mode of the indicator and its current state.
			if (_this.isBasic) {
				// only indicates nothing or enabled.
				if (_this.status == 'enabled') {
					_this.update('empty');
				} else {
					_this.update('enabled');
				}
			} else {
				// has the full range of toggles
				if (_this.status == 'enabled') {
					_this.update('disabled');
				} else if (_this.status === 'new') {
					_this.update('add');
				} else if (_this.status === 'disabled') {
					_this.update('enabled');
				}
			}
		}

		_this.update = function (status) {
			_this.status = status;

			// deactivate everything
			_this.enabledGlyph().model().addClass('glyphicon-hidden');
			_this.disabledGlyph().model().addClass('glyphicon-hidden');
			_this.pendingGlyph().model().addClass('glyphicon-hidden');
			_this.addGlyph().model().addClass('glyphicon-hidden');

			// reactivate certain things
			if (_this.status == 'enabled') {
				_this.enabledGlyph().model().removeClass('glyphicon-hidden');
			} else if (_this.status == 'disabled') {
				_this.disabledGlyph().model().removeClass('glyphicon-hidden');
			} else if (_this.status == 'pending') {
				_this.pendingGlyph().model().removeClass('glyphicon-hidden');
			} else if (_this.status == 'add') {
				_this.addGlyph().model().removeClass('glyphicon-hidden');
			}
		}

		return _this;
	},

	sidebar: function (id, args) {
		// Structure
		// Top: Container
			// a. Primary sidebar
				// i. Title container
					// - Title
				// ii. Content container
			// b. Back sidebar
				// i. Back button

		// The args entered need to be split into several different things:
		// 1. The title is the html of the Title component.
		// 2. The state primitives are split into state definitions for back and primary.
		// 3. The content array is passed to the children of the content component

		// 1. Calculate states for primary and back
		var backStateMap;
		var primaryStates = Object.keys(args.state.states).map(function (stateName) {
			var value = args.state.states[stateName];
			if (value === 'active') {
				backStateMap = stateName;
				return {name: stateName, args: args.state.active};
			} else {
				return {name: stateName, args: 'default'};
			}
		});

		var backStates = Object.keys(args.state.states).map(function (stateName) {
			var value = args.state.states[stateName];
			if (value === 'next') {
				return {name: stateName, args: {
					style: {
						'left': '0px',
					},
				}};
			} else {
				return {name: stateName, args: 'default'};
			}
		});

		// 2. Define components and return
		return UI.createComponent(id, {
			children: [
				UI.createComponent('{id}-primary'.format({id: id}), {
					template: UI.template('div', 'ie sidebar border-right centred-vertically'),
					state: {
						defaultState: {
							style: {
								'left': '-300px',
							},
						},
						states: primaryStates,
					},
					children: [
						UI.createComponent('{id}-title'.format({id: id}), {
							template: UI.template('h4', 'ie sidebar-title centred-horizontally show'),
							appearance: {
								html: args.title,
								style: {
									'height': '30px',
								},
							},
						}),
						UI.createComponent('{id}-content'.format({id: id}), {
							template: UI.template('div', 'ie show'),
							appearance: {
								style: {
									'top': '30px',
									'width': '100%',
									'height': 'calc(100% - 30px)',
								},
							},
							children: args.content,
						}),
					],
				}),
				UI.createComponent('{id}-back'.format({id: id}), {
					template: UI.template('div', 'ie sidebar mini border-right centred-vertically'),
					state: {
						defaultState: {
							style: {
								'left': '-100px',
							},
						},
						states: backStates,
					},
					children: [
						UI.createComponent('{id}-back-button'.format({id: id}), {
							template: UI.templates.button,
							state: {
								stateMap: backStateMap,
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
						})
					],
				}),
			],
		});
	},
}
//
// UI.createComponent('nuc-roles-moderator-wrapper', {
// 	template: UI.template('div', 'ie show'),
// 	appearance: {
// 		style: {
// 			'top': '80px',
// 			'width': '100%',
// 			'height': '40px',
// 		}
// 	},
// 	children: [
// 		UI.createComponent('nrmw-tick-button', {
// 			template: UI.templates.button,
// 			appearance: {
// 				classes: ['border border-radius'],
// 				style: {
// 					'position': 'absolute',
// 					'transform': 'none',
// 					'left': '0px',
// 					'height': '40px',
// 					'width': '40px',
// 					'padding-top': '10px',
// 					'margin-right': '0px',
// 				},
// 			},
// 			children: [
// 				UI.createComponent('nrmw-tb-check', {
// 					template: UI.template('span', 'glyphicon glyphicon-ok glyphicon-hidden'),
// 					state: {
// 						defaultState: {
// 							fn: function (_this) {
// 								_this.model().addClass('glyphicon-hidden');
// 							},
// 						},
// 						states: [
// 							{name: 'user-management-user-state', args: 'default'},
// 							{name: 'control-state', args: 'default'},
// 						],
// 					},
// 				}),
// 			],
// 			bindings: [
// 				{name: 'click', fn: function (_this) {
// 					var check = UI.getComponent('nrmw-tb-check');
// 					check.model().toggleClass('glyphicon-hidden');
// 				}}
// 			],
// 		}),
// 		UI.createComponent('nrmw-name-button', {
// 			template: UI.templates.button,
// 			appearance: {
// 				style: {
// 					'position': 'absolute',
// 					'top': '0px',
// 					'left': '40px',
// 					'transform': 'none',
// 					'height': '40px',
// 					'padding-top': '10px',
// 					'text-align': 'left',
// 					'padding-left': '10px',
// 				},
// 				html: 'Moderator',
// 			},
// 			bindings: [
// 				{name: 'click', fn: function (_this) {
// 					var check = UI.getComponent('nrmw-tb-check');
// 					check.model().toggleClass('glyphicon-hidden');
// 				}}
// 			],
// 		})
// 	],
// }),
//
// UI.createComponent('uc-roles-admin-wrapper', {
// 	template: UI.template('div', 'ie show'),
// 	appearance: {
// 		style: {
// 			'top': '30px',
// 			'width': '150px',
// 		},
// 	},
// 	children: [
// 		UI.createComponent('uc-roles-admin-button', {
// 			template: UI.templates.button,
// 			appearance: {
// 				classes: ['border border-radius relative'],
// 				style: {
// 					'transform': 'none',
// 					'height': '40px',
// 					'width': '40px',
// 					'padding-top': '10px',
// 					'float': 'left',
// 					'left': '0px',
// 				},
// 			},
// 			children: [
// 				UI.createComponent('urab-enabled', {
// 					template: UI.template('span', 'glyphicon glyphicon-ok'),
// 					state: {
// 						states: [
// 							{name: 'user-management-user-state', args: {
// 								preFn: function (_this) {
// 									// get data
// 									var user = Context.get('current_user_profile');
// 									var model = _this.model();
// 									if (user.roles.hasOwnProperty('admin')) {
// 										if (user.roles.admin.is_enabled) {
// 											model.removeClass('glyphicon-hidden').addClass('enabled');
// 										} else {
// 											if (user.roles.admin.is_activated) {
// 												model.addClass('glyphicon-hidden').addClass('enabled');
// 											} else {
// 												model.addClass('glyphicon-hidden').removeClass('enabled');
// 											}
// 										}
// 									} else {
// 										model.addClass('glyphicon-hidden').removeClass('enabled');
// 									}
// 								},
// 							}}
// 						],
// 					},
// 				}),
// 				UI.createComponent('urab-disabled', {
// 					template: UI.template('span', 'glyphicon glyphicon-remove'),
// 					state: {
// 						states: [
// 							{name: 'user-management-user-state', args: {
// 								preFn: function (_this) {
// 									// get data
// 									var user = Context.get('current_user_profile');
// 									var model = _this.model()
// 									if (user.roles.hasOwnProperty('admin')) {
// 										if (user.roles.admin.is_enabled) {
// 											model.addClass('glyphicon-hidden');
// 										} else {
// 											if (user.roles.admin.is_activated) {
// 												model.removeClass('glyphicon-hidden');
// 											} else {
// 												model.addClass('glyphicon-hidden');
// 											}
// 										}
// 									} else {
// 										model.addClass('glyphicon-hidden');
// 									}
// 								},
// 							}}
// 						],
// 					},
// 				}),
// 				UI.createComponent('urab-pending', {
// 					template: UI.template('span', 'glyphicon glyphicon-option-horizontal'),
// 					state: {
// 						states: [
// 							{name: 'user-management-user-state', args: {
// 								preFn: function (_this) {
// 									// get data
// 									var user = Context.get('current_user_profile');
// 									var model = _this.model();
// 									if (user.roles.hasOwnProperty('admin')) {
// 										if (user.roles.admin.is_activated) {
// 											model.addClass('glyphicon-hidden').removeClass('enabled');
// 										} else {
// 											model.removeClass('glyphicon-hidden').addClass('enabled');
// 										}
// 									} else {
// 										model.addClass('glyphicon-hidden').removeClass('enabled');
// 									}
// 								},
// 							}}
// 						],
// 					},
// 				}),
// 				UI.createComponent('urab-add', {
// 					template: UI.template('span', 'glyphicon glyphicon-plus'),
// 					state: {
// 						states: [
// 							{name: 'user-management-user-state', args: {
// 								preFn: function (_this) {
// 									// get data
// 									var user = Context.get('current_user_profile');
// 									var model = _this.model();
// 									if (user.roles.hasOwnProperty('admin')) {
// 										model.addClass('glyphicon-hidden');
// 									} else {
// 										model.removeClass('glyphicon-hidden');
// 									}
// 								},
// 							}}
// 						],
// 					},
// 				}),
// 			],
// 			bindings: [
// 				{name: 'click', fn: function (_this) {
// 					// get elements
// 					var enabled = UI.getComponent('urab-enabled');
// 					var disabled = UI.getComponent('urab-disabled');
// 					var pending = UI.getComponent('urab-pending');
// 					var add = UI.getComponent('urab-add');
//
// 					var roleData = {
// 						'current_client': Context.get('current_client'),
// 						'current_role': Context.get('current_role'),
// 						'user_id': UI.getComponent('uc-name').model().attr('userid'),
// 						'role_type': 'admin',
// 					};
//
// 					// check for status to determine action
// 					if (enabled.model().hasClass('enabled')) {
// 						// role is activated
// 						if (!enabled.model().hasClass('glyphicon-hidden')) {
// 							command('disable_role', roleData, function (data) {});
// 						} else {
// 							command('enable_role', roleData, function (data) {});
// 						}
//
// 						enabled.model().toggleClass('glyphicon-hidden');
// 						disabled.model().toggleClass('glyphicon-hidden');
//
// 					} else {
// 						// role is either pending or non-existent
// 						if (!pending.model().hasClass('enabled')) {
// 							// press add
// 							// 1. send add role
// 							command('add_role_to_user', roleData, function (data) {});
//
// 							// 2. switch to pending button
// 							pending.model().addClass('enabled');
// 							pending.model().toggleClass('glyphicon-hidden');
// 							add.model().toggleClass('glyphicon-hidden');
//
// 							// 3. change data in context
// 							var userProfile = Context.get('current_user_profile');
// 							if (userProfile.roles.admin !== undefined) {
// 								userProfile.roles.admin.is_activated = true;
// 							} else {
// 								userProfile.roles.admin = {
// 									'is_activated': true,
// 									'is_enabled': false,
// 									'is_approved': true,
// 								};
// 							}
// 							Context.set('current_user_profile', userProfile);
// 						}
// 					}
// 				}},
// 			],
// 		}),
// 		UI.createComponent('uc-roles-admin-title', {
// 			template: UI.templates.button,
// 			appearance: {
// 				style: {
// 					'position': 'relative',
// 					'padding-left': '10px',
// 					'padding-top': '12px',
// 					'height': '40px',
// 					'transform': 'none',
// 					'left': '0px',
// 					'width': '100px',
// 					'text-align': 'left',
// 					'float': 'left',
// 				},
// 				html: 'Admin',
// 			},
// 			bindings: [
// 				// click to show stats
// 			],
// 		}),
// 	],
// }),
