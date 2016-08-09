var AccountInterfaces = {
	transcriptionInterface: function (id, args) {

		return Promise.all([
			// base component
			UI.createComponent('{id}-base'.format({id: id}), {
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
							return new Promise(function(resolve, reject) {
								_this.model().css({'display': 'none'});
								resolve();
							});
						},
					},
					states: [
						{name: 'transcription-state', args: {
							preFn: function (_this) {
								return new Promise(function(resolve, reject) {
									_this.model().css({'display': 'block'});
									resolve();
								});
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

			// counter must have the following methods:
			// 1. increment
			// 2. decrement
			// 3. clear
			AccountComponents.counter('{id}-counter'.format({id: id}), {
				appearance: {
					style: {
						'height': '100%',
						'width': '{size}px'.format({size: args.interface.size}),
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

			// scroll must have the following methods:
			// 1. an external method placed inside the on-input function of the search input. DONE
			Components.scroll('{id}-search'.format({id: id}), {
				appearance: {
					style: {
						'height': '100%',
						'width': '300px',
						'float': 'left',
						'margin-left': '{margin}px'.format({margin: args.interface.margin}),
					}
				},
				interface: args.interface,

				// modifiers and features
				options: {

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
								return new Promise(function(resolve, reject) {
									resolve('clients');
								});
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

					info: function (id) {
						return UI.createComponent('{id}-info-content'.format({id: id}), {
							template: UI.template('div', 'ie'),
							appearance: {
								style: {
									'height': '100%',
									'width': '100%',
								},
							},
							children: [

							],
						});
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
								});
							}
						},
						filter: function (id, target) {
							var display = target.filter;
							return UI.createComponent('{id}-{key}'.format({id: id, key: display.key}), {
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
						},
					},
				},
			}),

			// This holds tokens, audio, original, and modified
			UI.createComponent('{id}-audio-panel'.format({id: id}), {
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'height': '100%',
						'width': '400px',
						'float': 'left',
						'margin-left': '{margin}px'.format({margin: args.interface.margin}),
					}
				},
			}),

			// audio requires the following methods:
			// 1. play/replay, stop (reset), remove cut
			AccountComponents.audio('{id}-audio'.format({id: id}), {
				appearance: {
					style: {
						'height': '{size}px'.format({size: args.interface.size}),
						'width': '100%',
						'margin-bottom': '{margin}px'.format({margin: args.interface.margin}),
					},
				},
				state: {
					states: [
						{name: 'transcription-state', args: {
							fn: function (_this) {
								return new Promise(function(resolve, reject) {
									_this.canvas.start();
									_this.update();
									resolve();
								});
							},
						}},
					],
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

			// ORIGINAL CAPTION
			// Completely static. Nothing can change it.
			AccountComponents.renderedTextField('{id}-original'.format({id: id}), {
				appearance: {
					style: {
						'width': '100%',
						'overflow': 'hidden',
						'margin-bottom': '{margin}px'.format({margin: args.interface.margin}),
					},
				},
			}),

			// This can be triggered by searching for rules, flags, or tags in the search box
			UI.createComponent('{id}-info-panel'.format({id: id})),

			// This holds the buttons
			UI.createComponent('{id}-control-panel'.format({id: id}), {
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'height': '100%',
						'width': '{width}px'.format({width: args.interface.size}),
						'margin-left': '{margin}px'.format({margin: args.interface.margin}),
						'float': 'left',
					},
				},
			}),

			// previous transcription
			UI.createComponent('{id}-previous-button'.format({id: id}), {
				template: UI.template('div', 'ie button border border-radius'),
				appearance: {
					style: {
						'height': '{height}px'.format({height: args.interface.size}),
						'width': '{width}px'.format({width: args.interface.size}),
						'margin-bottom': '{margin}px'.format({margin: args.interface.margin}),
					},
				},
			}),

			// next transcription
			UI.createComponent('{id}-next-button'.format({id: id}), {
				template: UI.template('div', 'ie button border border-radius'),
				appearance: {
					style: {
						'height': '{height}px'.format({height: args.interface.size}),
						'width': '{width}px'.format({width: args.interface.size}),
						'margin-bottom': '{margin}px'.format({margin: args.interface.margin}),
					},
				},
			}),

			// marks transcription as done
			UI.createComponent('{id}-done-button'.format({id: id}), {
				template: UI.template('div', 'ie button border border-radius'),
				appearance: {
					style: {
						'height': '{height}px'.format({height: args.interface.size}),
						'width': '{width}px'.format({width: args.interface.size}),
						'margin-bottom': '{margin}px'.format({margin: args.interface.margin}),
					},
				},
			}),

			// flags cited
			UI.createComponent('{id}-flags-button'.format({id: id}), {
				template: UI.template('div', 'ie button border border-radius'),
				appearance: {
					style: {
						'height': '{height}px'.format({height: args.interface.size}),
						'width': '{width}px'.format({width: args.interface.size}),
						'margin-bottom': '{margin}px'.format({margin: args.interface.margin}),
					},
				},
			}),

			// rules cited
			UI.createComponent('{id}-rules-button'.format({id: id}), {
				template: UI.template('div', 'ie button border border-radius'),
				appearance: {
					style: {
						'height': '{height}px'.format({height: args.interface.size}),
						'width': '{width}px'.format({width: args.interface.size}),
						'margin-bottom': '{margin}px'.format({margin: args.interface.margin}),
					},
				},
			}),

		]).then(function (components) {

			// unpack components
			var [
				base,
				counter,
				scroll,
				audioPanel,
				audio,
				caption,
				infoPanel,
				controlPanel,
				previousButton,
				nextButton,
				doneButton,
				flagsButton,
				rulesButton,
			] = components;

			// add methods and properties
			scroll.backspace = function (_this) {
				// tokens.removeToken();
			}
			scroll.enter = function (_this) {
				_this.clear();
				_this.input(_this, 'normal', ' ', ' ');
			}
			scroll.space = function (_this) {
				_this.clear();
				_this.input(_this, 'normal', ' ', ' ');
			}
			scroll.input = function (_this, type, query, last) {
				caption.input(type, query, last);
			}
			audio.current = function (current) {
				caption.load(current.original_caption);
			}

			previousButton.setBindings({
				'click': function (_this) {
					audio.previous();
				},
			});
			nextButton.setBindings({
				'click': function (_this) {
					audio.next();
				},
			});

			caption.tokenModifierFunction = function (list) {
				return function (tokenComponents) {
					// unpack
					var [
						token,
						span,
					] = tokenComponents;

					// methods and associations
					return new Promise(function(resolve, reject) {
						token.setBindings({
							'click': function (_this) {
								new Promise(function(resolve, reject) {
									_this.activate();
									_this.setInsert();
									list.switch = false;
									resolve();
								}).then(function () {
									// scroll.addText(token.content);
								});
							},
							'input': function (_this) {
								// console.log(_this.span.model());
							},
						});

						token.activate = function () {
							if (list.activeToken !== undefined && list.activeToken.id !== token.id) {
								list.activeToken.deactivate();
							}
							token.setAppearance({classes: {add: ['active']}});
							list.activeToken = token;
						}

						token.deactivate = function () {
							token.setAppearance({classes: {remove: ['active']}});
						}

						token.setInsert = function () {
							// make a small indicator appear on the bottom right to show
							// that a new word will be created on the right.
							// http://apps.eky.hk/css-triangle-generator/


						}

						token.setInsertLeft = function () {
							// only applies to the first token


						}

						token.span = span;
						token.setChildren([span]);

						// return
						resolve(token);
					});
				}
			}

			// 1. search input to text field transfer
			// 2. connection between modified caption and tokens (scroll to)
			// 3. connection between original caption and modified/tokens (copy)
			// 4. connection between done button and counter (increment)/tokens (export)
			// associate components
			return Promise.all([
				audioPanel.setChildren([
					audio,
					caption,
				]),
				controlPanel.setChildren([
					doneButton,
					previousButton,
					nextButton,
				]),
			]).then(function () {
				base.components = {
					counter: counter,
					audio: audio,
					caption: caption,
					scroll: scroll,
				}
				return base.setChildren([
					counter,
					controlPanel,
					audioPanel,
					infoPanel,
					scroll,
				]);
			}).then(function () {
				return base;
			});
		});
	},
	unifiedInterface: function (id, args) {
		return Promise.all([
			// base
			UI.createComponent('{id}-base'.format({id: id}), {
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'height': '100%',
					},
				},
			}),

			// transcription interface
			AccountInterfaces.transcriptionInterface('transcription-interface', {
				interface: args.interface,
			}),

			// sidebars
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
										});
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
														return Active.get('client');
													}).then(function (clientId) {
														return Context.get('user.clients.{client}.roles.{role}.project'.format({client: clientId, role: display.id}));
													}).then(function (projectId) {
														return Active.set('project', projectId);
													}).then(function () {
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
										return new Promise(function(resolve, reject) {
											resolve('clients');
										});
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
		]).then(function (components) {
			// unpack components
			var [
				base,
				transcriptionInterface,
				controlSidebar,
				roleSidebar,
				clientSidebar,
			] = components;

			// ASSOCIATE
			// key bindings
			Mousetrap.bind('left', function () {
				var tiComponents = base.components.transcriptionInterface.components;
				if (UI.globalState === 'transcription-state') {
					if (tiComponents.scroll.components.searchInput.model().val() === '') {
						tiComponents.caption.previous();
					}
				}
			});
			Mousetrap.bind('right', function () {
				var tiComponents = base.components.transcriptionInterface.components;
				if (UI.globalState === 'transcription-state') {
					if (tiComponents.scroll.components.searchInput.model().val() === '') {
						tiComponents.caption.next();
					}
				}
			});
			Mousetrap.bind('up', function (event) {
				event.preventDefault();
				transcriptionInterface.components.scroll.hideSearch();
			});
			Mousetrap.bind('down', function () {
				transcriptionInterface.components.scroll.showSearch();
			});

			// base children
			base.components = {
				transcriptionInterface: transcriptionInterface,
				controlSidebar: controlSidebar,
				roleSidebar: roleSidebar,
				clientSidebar: clientSidebar,
			}
			return base.setChildren([
				transcriptionInterface,
				controlSidebar,
				roleSidebar,
				clientSidebar,
			]).then(function () {
				return base;
			});
		});
	},
	testInterface: function (id, args) {
		// config

		// set up components
		return Promise.all([
			// base component
			UI.createComponent('{id}-base'.format({id: id}), {
				template: UI.template('div', 'ie'),
				appearance: args.appearance,
			}),

			// test input
			Components.searchableList('test-list', {
				appearance: {
					style: {
						'height': '400px',
						'width': '200px',
						'top': '100px',
						'left': '100px',
					}
				},
			}),

		]).then(function (components) {
			// unpack components
			var [
				base,
				list,
			] = components;

			// set up promises to be completed before returning the base.

			// logic, bindings, etc.
			// LIST
			list.toggleSearch();
			list.setTitle('Clients', true);
			list.targets = [
				{
					name: 'clients',
					path: function () {
						return new Promise(function(resolve, reject) {
							resolve('clients');
						});
					},
					process: function (data) {
						return new Promise(function(resolve, reject) {
							var results = Object.keys(data).map(function (key) {
								var client = data[key];
								return {
									id: key,
									main: client.name,
									type: 'client',
								}
							});

							resolve(results);
						});
					},
					filter: {
						char: '/',
						key: 'forwardslash',
						display: 'Client',
						button: 'Clients',
						rule: 'client',
					},
				},
				{
					name: 'roles',
					path: function () {
						return Active.get('client').then(function (client) {
							return 'user.clients.{active_client}.roles'.format({active_client: client});
						});
					},
					process: function (data) {
						return new Promise(function(resolve, reject) {
							var results = Object.keys(data).map(function (key) {
								var role = data[key];
								return {
									id: key,
									main: role.type,
									type: 'role',
								}
							});

							resolve(results);
						});
					},
					filter: {
						char: '.',
						key: 'period',
						display: 'Role',
						button: 'Roles',
						rule: 'role',
					},
				},
			]
			list.unit = function (_this, datum) {
				return Promise.all([
					// base component
					UI.createComponent('{id}-{object}-base'.format({id: _this.id, object: datum.id}), {

					}),

					//

				]).then(function (unitComponents) {
					var [
						unitBase,
					] = unitComponents;

					// complete promises.
					return Promise.all([

					]).then(function () {
						return unitBase.setChildren([

						]);
					}).then(function () {
						return unitBase;
					});
				});
			}

			// complete promises.
			return Promise.all([
				list.setState({
					states: [
						{name: 'client-state', args: {
							fn: function (_this) {
								_this.display();
							},
						}},
					]
				}),
			]).then(function (results) {
				base.components = {
					list: list,
				}
				return base.setChildren([
					list,
				]);
			}).then(function () {
				return base;
			});
		});
	},
}
