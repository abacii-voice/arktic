UI.app('hook', [
	// UI.createComponent('project-interface', {
	//
	// }),
	// UI.createComponent('user-management-interface', {
	//
	// }),
	UI.createComponent('transcription-interface', {
		template: UI.template('div', 'ie abs centred-vertically'),
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
		children: [
			Components.counter('transcription-counter', {
				appearance: {
					style: {
						'height': '100%',
						'width': '80px',
						'float': 'left',
					},
				},
				registry: {
					'transcription-state': {
						path: 'user.clients',
						fn: function (_this) {
							_this.load();
						}
					},
				},
				options: {
					source: {
						daily: function () {
							return Promise.all([
								Active.get('client'),
								Context.get('user').then(function (user) {
									return user.id;
								}),
								Permission.get(),
							]).then(function (results) {
								// unpack variable
								var client = results[0];
								var user_id = results[1];
								var role_id = results[2];

								return 'user.clients.{client}.roles.{role_id}.daily_count'.format({client: client, role_id: role_id});
							});
						},
						cycle: function () {
							return Promise.all([
								Active.get('client'),
								Context.get('user').then(function (user) {
									return user.id;
								}),
								Permission.get(),
							]).then(function (results) {
								// unpack variable
								var client = results[0];
								var user_id = results[1];
								var role_id = results[2];

								return 'user.clients.{client}.roles.{role_id}.cycle_count'.format({client: client, role_id: role_id});
							});
						},
					},
				},
			}),
			Components.scroll('test-scroll', {
				appearance: {
					style: {
						'height': '100%',
						'width': '300px',
						'float': 'left',
						'margin-left': '10px',
					}
				},

				// modifiers and features
				options: {

					// Simple text title
					title: 'Title',

					// If the data is to be sorted.
					sort: true,

					// This defines what is being searched for, i.e. paths in context.
					// This is the source of the data for the list.
					targets: {
						'clients': {
							// default targets are always displayed if no filter is applied
							default: false,

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

							// filter
							filter: {
								char: '/',
								key: 'forwardslash',
								display: 'Clients',
								button: 'Clients',
								rule: 'client',
							},
						},
					},

					// Defines the search bar.
					search: {
						// Autocomplete tells the filter panel (if present) to be shown first, else show nothing until a query is submitted.
						autocomplete: true,

						// Filter tells the element what structure to give to the filter panel, buttons, etc.
						filter: true,
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
									template: UI.template('div', 'ie button border-bottom'),
									appearance: {
										style: {
											'width': '100%',
											'height': '80px',
										},
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
										UI.createComponent('{id}-{key}-index'.format({id: _this.id, key: display.id}), {
											template: UI.template('span', 'ie'),
											appearance: {
												style: {

												},
												html: '{index}'.format({index: display.index}),
											},
										}),
									],
								}).then(function (unit) {
									return unit.render();
								});
							}
						},
						filter: function (id) {
							return function (target, index) {
								var display = target.filter;
								return UI.createComponent('{id}-{key}'.format({id: id, key: display.key}), {
									index: index,
									root: id,
									template: UI.template('div', 'ie button border-bottom'),
									appearance: {
										style: {
											'width': '100%',
											'height': '60px',
											'padding-top': '20px',
										},
									},
									bindings: {
										// 'click' occurs on mouseup, so any blur will happen before it.
										// 'mousedown' occurs before 'blur'.
										'mousedown': function (_this) {
											_this.parent().then(function (parent) {
												parent.set(target);
											});
										},
									},
									children: [
										UI.createComponent('{id}-{key}-text'.format({id: id, key: display.key}), {
											template: UI.template('span'),
											appearance: {
												html: '"{char}" : {main}'.format({char: display.char, main: display.display}),
											},
										}),
									],
								});
							}
						},
					},

				},
			}),
			UI.createComponent('audio-caption-wrapper', {
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'height': '100%',
						'width': '492px',
						'float': 'left',
						'margin-left': '10px',
					}
				},
				children: [
					Components.tokenTextField('transcription-caption-tokens', {
						template: UI.template('div', 'ie border'),
						appearance: {
							style: {
								'height': '40px',
								'width': '100%',
								'overflow': 'hidden',
								'margin-bottom': '10px',
							},
						},
					}),
					Components.audio('transcription-audio', {
						appearance: {
							style: {
								'height': '50px',
								'width': '100%',
								'margin-bottom': '10px',
							},
						},
						registry: {
							'transcription-state': {
								path: 'clients',
								fn: function (_this) {
									_this.canvas.start();
									_this.update();
								}
							},
						},
						options: {

							// number of loads either side of current
							threshold: 4,

							// where to gather references
							source: {

								// adaptive location in Context to fetch audio references
								path: function () {
									return Promise.all([
										Active.get('client'),
										Active.get('project'),
									]).then(function (results) {
										// unpack variables
										var client = results[0];
										var project = results[1];

										// return path
										return 'clients.{client}.projects.{project}.transcriptions'.format({client: client, project: project});
									});
								},

								// fetch active token to filter transcription references
								token: function () {
									return Promise.all([
										Active.get('client'),
										Context.get('user').then(function (user) {
											return user.id;
										}),
										Permission.get(),
									]).then(function (results) {
										// unpack variable
										var client = results[0];
										var user_id = results[1];
										var role_id = results[2];

										return 'user.clients.{client}.roles.{role_id}.active_transcription_token'.format({client: client, role_id: role_id});
									});
								},
							},
						},
					}),
					Components.renderedTextField('transcription-original-caption', {
						appearance: {
							style: {
								'min-height': '40px',
								'width': '100%',
								'margin-bottom': '10px',
							},
						},
					}),
					Components.renderedTextField('transcription-modified-caption', {
						appearance: {
							style: {
								'min-height': '40px',
								'width': '100%',
								'margin-bottom': '10px',
							},
						},
					}),
				],
			}),
			UI.createComponent('info-wrapper', {
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'height': '100%',
						'width': '492px',
						'float': 'left',
						'margin-left': '10px',
						'opacity': '0',
						'display': 'none',
					}
				},
				children: [

				],
			}),
			UI.createComponent('control-panel-wrapper', {
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'height': '100%',
						'width': '50px',
						'float': 'left',
						'margin-left': '10px',
					},
				},
				children: [
					UI.createComponent('previous-button', {
						template: UI.template('div', 'ie button border border-radius'),
						appearance: {
							style: {
								'height': '40px',
								'width': '40px',
								'margin-bottom': '10px',
							},
						},
					}),
					UI.createComponent('next-button', {
						template: UI.template('div', 'ie button border border-radius'),
						appearance: {
							style: {
								'height': '40px',
								'width': '40px',
								'margin-bottom': '10px',
							},
						},
					}),
					UI.createComponent('done-indicator', {
						template: UI.template('div', 'ie button border border-radius'),
						appearance: {
							style: {
								'height': '40px',
								'width': '40px',
								'margin-bottom': '10px',
							},
						},
					}),
					UI.createComponent('flag-button', {
						template: UI.template('div', 'ie button border border-radius'),
						appearance: {
							style: {
								'height': '40px',
								'width': '40px',
								'margin-bottom': '10px',
							},
						},
					}),
				],
			}),
		],
	}),
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
			deactivate: [
				'control-state',
				'transcription-state',
			],
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
	return Promise.all([
		Context.get('clients').then(function (clients) {
			var productionClient = Object.keys(clients).filter(function (key) {
				return clients[key].is_production;
			})[0];
			var project = Object.keys(clients[productionClient].projects)[0];
			return Promise.all([
				Active.set('client', productionClient),
				Active.set('project', project),
				Context.get('user').then(function (user) {
					var workerRole = Object.keys(user.clients[productionClient].roles).filter(function (key) {
						return user.clients[productionClient].roles[key].type === 'worker';
					})[0];
					return Permission.set(workerRole);
				}),
			]);
		}),
	]);
}).then(function () {
	return UI.changeState('transcription-state');
}).catch(function (error) {
	console.log(error);
});
