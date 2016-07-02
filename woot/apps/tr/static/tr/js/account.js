UI.app('hook', [
	// UI.createComponent('project-interface', {
	//
	// }),
	// UI.createComponent('user-management-interface', {
	//
	// }),
	UI.createComponent('transcription-interface', {
		template: UI.template('div', 'ie abs border centred-vertically'),
		appearance: {
			style: {
				'height': '70%',
				'width': '954px',
				'left': '120px',
				'opacity': '0',
			},
		},
		state: {
			defaultState: {
				style: {
					'opacity': '0',
					'left': '0px',
				},
				fn: function (_this) {
					return function (resolve, reject) {
						_this.model().css({'display': 'none'});
						resolve();
					}
				},
			},
			states: [
				{name: 'transcription-state', args: {
					preFn: function (_this) {
						return function (resolve, reject) {
							_this.model().css({'display': 'block'});
							resolve();
						}
					},
					style: {
						'left': '60px',
						'opacity': '1',
					},
				}},
				{name: 'control-state'},
			],
		},
	}),
	// UI.createComponent('billing-interface', {
	//
	// }),
	// UI.createComponent('search-interface', {
	//
	// }),
	Components.sidebar('control-sidebar', {
		children: [
			Components.scroll('cs-controls', {
				// modifiers and features
				options: {

					// Simple text title
					title: {
						text: 'Actions',
						center: true,
					},
				},

				// children
				children: [
					UI.createComponent('csc-transcription', {
						template: UI.template('div', 'ie button sidebar-button border border-radius'),
						appearance: {
							style: {
								'height': '80px',
								'width': '180px',
							},
						},
						bindings: {
							'click': function (_this) {
								_this.triggerState();
							},
						},
						state: {
							stateMap: 'transcription-state',
						},
					}),
					UI.createComponent('csc-moderation', {
						template: UI.template('div', 'ie button sidebar-button border border-radius'),
						appearance: {
							style: {
								'height': '80px',
								'width': '180px',
							},
						},
					}),
				],
			}),
		],
		state: {
			primary: 'control-state',
			secondary: [
				'transcription-state',
			],
			deactivate: [
				'role-state',
				'client-state',
			],
		},
		position: {
			main: {
				initial: '-300px',
				on: '50px',
				off: '-300px',
			},
			back: {
				initial: '-300px',
				on: '0px',
				off: '-300px',
			},
		},
	}),
	Components.sidebar('role-sidebar', {
		children: [
			Components.scroll('rs-roles', {
				// modifiers and features
				options: {

					// Simple text title
					title: {
						text: 'Roles',
						center: true,
					},

					// If the data is to be sorted.
					sort: true,

					// This defines what is being searched for, i.e. paths in context.
					// This is the source of the data for the list.
					targets: {
						'roles': {
							// default targets are always displayed if no filter is applied
							default: true,

							// path in Context
							path: function () {
								return Active.get('client').then(function (client) {
									return 'user.clients.{client}.roles'.format({client: client});
								})
							},

							// filter to apply to request
							fltr: function () {
								return {};
							},

							// process search results from the path.
							process: function (data) {
								// expects structure like:
								// unit: {
								// 	id: 'id',
								// 	main: 'text',
								// 	tag: 'text',
								// 	index: '0',
								// },

								return new Promise(function(resolve, reject) {
									var results = Object.keys(data).map(function (key, index) {
										var role = data[key];
										return {
											id: key,
											main: role.type,
											index: index,
										}
									});

									resolve(results);
								});
							},
						},
					},

					// Define a way of display individual list items
					display: {
						list: function (_this, query) {
							return function (display) {
								// set main display
								var main = query !== undefined ? '{main}'.format({main: '{head}<span style="color:#fff;">{query}</span>{tail}'.format({
									head: display.main.substring(0, display.main.indexOf(query)),
									query: display.main.substr(display.main.indexOf(query), query.length),
									tail: display.main.substr(display.main.indexOf(query) + query.length),
								})}) : display.main;

								// 'data' is a single unit of the full dataset to be included.
								return UI.createComponent('{id}-{key}'.format({id: _this.id, key: display.id}), {
									root: _this.id,
									template: UI.template('div', 'ie button'),
									appearance: {
										style: {
											'width': '100%',
											'height': '50px',
											'padding-top': '20px',
										},
									},
									bindings: {
										'click': function (_this) {
											Permission.set(display.id).then(function () {
												return _this.triggerState();
											});
										},
									},
									state: {
										stateMap: 'control-state',
									},
									children: [
										UI.createComponent('{id}-{key}-main'.format({id: _this.id, key: display.id}), {
											template: UI.template('span', 'ie'),
											appearance: {
												style: {

												},
												html: main,
											},
										}),
									],
								}).then(function (unit) {
									return unit.render();
								});
							}
						},
					},

					// States to reset
					reset: 'role-state',
				},
			}),
		],
		state: {
			primary: 'role-state',
			secondary: 'control-state',
			deactivate: [
				'client-state',
				'transcription-state',
			],
		},
		position: {
			main: {
				initial: '-300px',
				on: '50px',
				off: '-300px',
			},
			back: {
				initial: '-300px',
				on: '0px',
				off: '-300px',
			},
		},
	}),
	Components.sidebar('client-sidebar', {
		children: [
			Components.scroll('cs-clients', {
				// modifiers and features
				options: {

					// Simple text title
					title: {
						text: 'Clients',
						center: true,
					},

					// If the data is to be sorted.
					sort: true,

					// This defines what is being searched for, i.e. paths in context.
					// This is the source of the data for the list.
					targets: {
						'clients': {
							// default targets are always displayed if no filter is applied
							default: true,

							// path in Context
							path: function () {
								return 'clients';
							},

							// filter to apply to request
							fltr: function () {
								return {};
							},

							// process search results from the path.
							process: function (data) {
								// expects structure like:
								// unit: {
								// 	id: 'id',
								// 	main: 'text',
								// 	tag: 'text',
								// 	index: '0',
								// },

								return new Promise(function(resolve, reject) {
									var results = Object.keys(data).map(function (key, index) {
										var client = data[key];
										return {
											id: key,
											main: client.name,
											index: index,
										}
									});

									resolve(results);
								});
							},
						},
					},

					// Define a way of display individual list items
					display: {
						list: function (_this, query) {
							return function (display) {
								// set main display
								var main = query !== undefined ? '{main}'.format({main: '{head}<span style="color:#fff;">{query}</span>{tail}'.format({
									head: display.main.substring(0, display.main.indexOf(query)),
									query: display.main.substr(display.main.indexOf(query), query.length),
									tail: display.main.substr(display.main.indexOf(query) + query.length),
								})}) : display.main;

								// 'data' is a single unit of the full dataset to be included.
								return UI.createComponent('{id}-{key}'.format({id: _this.id, key: display.id}), {
									root: _this.id,
									template: UI.template('div', 'ie button'),
									appearance: {
										style: {
											'width': '100%',
											'height': '50px',
											'padding-top': '20px',
										},
									},
									bindings: {
										'click': function (_this) {
											Active.set('client', display.id).then(function () {
												return _this.triggerState();
											});
										},
									},
									state: {
										stateMap: 'role-state',
									},
									children: [
										UI.createComponent('{id}-{key}-main'.format({id: _this.id, key: display.id}), {
											template: UI.template('span', 'ie'),
											appearance: {
												style: {

												},
												html: main,
											},
										}),
									],
								}).then(function (unit) {
									return unit.render();
								});
							}
						},
					},

					// States to reset
					reset: 'client-state',
				},
			}),
		],
		state: {
			primary: 'client-state',
			secondary: 'role-state',
			deactivate: 'control-state',
		},
		position: {
			main: {
				initial: '0px',
				on: '0px',
				off: '-300px',
			},
			back: {
				initial: '-300px',
				on: '0px',
				off: '-300px',
			},
		},
	}),
]).then (function (app) {
	return app.render();
}).then(function () {
	return UI.changeState('client-state');
});
