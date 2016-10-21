var AccountInterfaces = {
	moderationInterface: function (id, args) {

	},
	transcriptionInterface: function (id, args) {

		return Promise.all([
			// base
			UI.createComponent('transcription-base', {
				template: UI.template('div', 'ie abs'),
				appearance: {
					style: {
						'height': '70%',
						'left': '60px',
						'width': 'calc(100% - 70px)',
					},
					classes: ['centred-vertically'],
				},
			}),

			// control panel
			UI.createComponent('tb-button-panel', {

			}),
			UI.createComponent('tb-bp-confirm-button'),
			UI.createComponent('tb-bp-previous-button'),
			UI.createComponent('tb-bp-next-button'),

			// counter panel
			UI.createComponent('tb-counter-panel', {

			}),
			AccountComponents.counter('tb-cp-counter', {
				appearance: {
					style: {
						'width': '100px',
						'height': '100%',
						'float': 'left',
						'margin-right': '{}px'.format(args.interface.margin),
					}
				},
			}),

			// audio caption panel
			UI.createComponent('tb-audio-caption-panel', {
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'width': '400px',
						'height': '100%',
						'float': 'left',
						'margin-right': '{}px'.format(args.interface.margin),
					},
				},
			}),
			AccountComponents.audio('tb-cp-audio', {
				appearance: {
					style: {
						'height': '60px',
					},
				},
				state: {
					states: {
						'transcription-state': {
							preFn: function (_this) {
								_this.canvas.start();
								return _this.update();
							},
						},
					},
				},
			}),

			AccountComponents.testCaptionField('tb-cp-caption', {
				appearance: {
					style: {
						'height': '400px',
						'width': '100%',
						'border': '1px solid #ccc',
					},
				},
			}),

			// autocomplete panel
			UI.createComponent('tb-autocomplete-panel', {
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'width': '300px',
						'height': '100%',
						'float': 'left',
						'margin-right': '{}px'.format(args.interface.margin),
					},
				},
			}),
			Components.searchableList('tb-ap-autocomplete', {
				appearance: {
					style: {
						'height': '100%',
						'width': '100%',
					},
				},
			}),

		]).then(function (components) {

			// unpack components
			var [
				base,
				buttonPanel,
				confirmButton,
				previousButton,
				nextButton,
				counterPanel,
				counter,
				audioCaptionPanel,
				audio,
				caption,
				autocompletePanel,
				autocomplete,
			] = components;

			// bindings
			// Audio
			audio.threshold = 4;
			audio.path = function () {
				return Promise.all([
					Active.get('client'),
					Promise.all([
						Active.get('client'),
						Permission.get(),
					]).then(function (results) {
						var [client_id, role_id] = results;
						return Context.get('user.clients.{client_id}.roles.{role_id}.project'.format({client_id: client_id, role_id: role_id}));
					}),
				]).then(function (results) {
					// unpack variables
					var [client_id, project_id] = results;

					// return path
					return 'clients.{client_id}.projects.{project_id}.transcriptions'.format({client_id: client_id, project_id: project_id});
				});
			}
			audio.token = function () {
				return Promise.all([
					Active.get('client'),
					Permission.get(),
				]).then(function (results) {
					// unpack variable
					var [client_id, role_id] = results;

					// return path
					return 'user.clients.{client_id}.roles.{role_id}.active_transcription_token'.format({client_id: client_id, role_id: role_id});
				});
			}

			// Autocomplete
			// KEYBINDINGS
			Mousetrap.bind('up', function (event) {
				event.preventDefault();
				Promise.all([
					autocomplete.behaviours.up(),
					caption.behaviours.up(),
				]);
			});

			Mousetrap.bind('down', function (event) {
				event.preventDefault();
				Promise.all([
					autocomplete.behaviours.down(),
					caption.behaviours.down(),
				]);
			});

			Mousetrap.bind('left', function (event) {
				Promise.all([
					autocomplete.behaviours.left(),
					caption.behaviours.left(),
				]);
			});

			Mousetrap.bind('right', function (event) {
				Promise.all([
					autocomplete.behaviours.right(),
					caption.behaviours.right(),
				]);
			});

			Mousetrap.bind(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], function (event) {
				event.preventDefault();
				var char = String.fromCharCode(event.which);
				Promise.all([
					autocomplete.behaviours.number(char),
					caption.behaviours.number(char),
				]);
			});

			Mousetrap.bind('enter', function (event) {
				event.preventDefault();
				Promise.all([
					autocomplete.behaviours.enter(),
					caption.behaviours.enter(),
				]);
			});

			Mousetrap.bind('backspace', function (event) {
				Promise.all([
					autocomplete.behaviours.backspace(),
					caption.behaviours.backspace(),
				]);
			});

			Mousetrap.bind('alt+backspace', function (event) {
				Promise.all([
					caption.behaviours.altbackspace(),
				]);
			});

			Mousetrap.bind('space', function (event) {
				// event.preventDefault();
				Promise.all([
					caption.behaviours.space(),
				]);
			});

			Mousetrap.bind('alt+right', function (event) {
				caption.behaviours.altright();
			});

			Mousetrap.bind('alt+left', function (event) {
				caption.behaviours.altleft();
			});

			// LIST
			autocomplete.onInput = function () {

			}
			autocomplete.components.search.onComplete = function () {

			}
			autocomplete.targets = [
				{
					name: 'tokens',
					path: function () {
						return Promise.all([
							Active.get('client'),
							Active.get('project'),
						]).then(function (results) {
							return 'clients.{client_id}.projects.{project_id}.dictionaries.5fcb33bc-39d2-4b96-b8eb-81deeec5a204.tokens'.format({client_id: results[0], project_id: results[1]});
						});
					},
					process: function (data) {
						return new Promise(function(resolve, reject) {
							var results = Object.keys(data).map(function (key) {
								var token = data[key];
								return {
									id: key,
									main: token.content,
									rule: 'tokens',
								}
							});

							resolve(results);
						});
					},
					setStyle: function () {
						return new Promise(function(resolve, reject) {
							jss.set('#{id} .tokens'.format({id: autocomplete.id}), {
								'background-color': 'rgba(255,255,255,0.05)'
							});
							jss.set('#{id} .tokens.active'.format({id: autocomplete.id}), {
								'background-color': 'rgba(255,255,255,0.1)'
							});
							resolve();
						});
					},
					filter: {
						default: true,
						char: '/',
						key: 'forwardslash',
						display: 'Client',
						button: 'Clients',
						rule: 'client',
					},
				},
				{
					name: 'clients',
					path: function () {
						return new Promise(function(resolve, reject) {
							resolve('clients');
						});
					},
					setStyle: function () {
						return new Promise(function(resolve, reject) {
							jss.set('#{id} .clients'.format({id: autocomplete.id}), {
								'background-color': 'rgba(255,255,0,0.05)'
							});
							jss.set('#{id} .clients.active'.format({id: autocomplete.id}), {
								'background-color': 'rgba(255,255,0,0.1)'
							});
							resolve();
						});
					},
					process: function (data) {
						return new Promise(function(resolve, reject) {
							var results = Object.keys(data).map(function (key) {
								var client = data[key];
								return {
									id: key,
									main: client.name,
									rule: 'clients',
								}
							});

							resolve(results);
						});
					},
				},
			]
			autocomplete.baseUnitStyle = function () {
				return new Promise(function(resolve, reject) {
					// base class
					jss.set('#{id} .base'.format({id: base.id}), {
						'height': '30px',
						'width': '100%',
						'padding': '0px',
						'padding-left': '10px',
						'text-align': 'left',
						'border-bottom': '1px solid #ccc',
					});
					jss.set('#{id} .base.active'.format({id: base.id}), {
						'background-color': 'rgba(255,255,255,0.1)'
					});
					resolve();
				});
			}
			autocomplete.sort = function (d1, d2) {
				// sort by usage
				if (d1.usage && d2.usage) {
					if (d1.usage > d2.usage) {
						return 1;
					} else if (d1.usage < d2.usage) {
						return -1;
					}
				}

				// then alphabetically
				if (d1.main.toLowerCase() > d2.main.toLowerCase()) {
					return 1;
				} else {
					return -1;
				}
			}
			autocomplete.unit = function (datum, query, index) {
				query = (query || '');
				var base = autocomplete.data.idgen(index);
				return Promise.all([
					// base component
					UI.createComponent(base, {
						template: UI.template('div', 'ie button base'),
						appearance: {
							classes: [datum.rule],
						}
					}),

					// main wrapper
					UI.createComponent('{base}-main-wrapper'.format({base: base}), {
						template: UI.template('div', 'ie centred-vertically'),
						appearance: {
							style: {
								'left': '0px',
							},
						},
					}),

					// main
					UI.createComponent('{base}-main-head'.format({base: base}), {
						template: UI.template('span', 'ie'),
						appearance: {
							style: {
								'color': '#eee',
								'display': 'inline-block',
								'position': 'absolute',
							},
							html: datum.main.substring(0, query.length),
						},
					}),
					UI.createComponent('{base}-main-tail'.format({base: base}), {
						template: UI.template('span', 'ie'),
						appearance: {
							style: {
								'display': 'inline-block',
							},
							html: datum.main,
						},
					}),

					// index
					UI.createComponent('{base}-index'.format({base: base}), {
						template: UI.template('div', 'ie abs centred-vertically'),
						appearance: {
							style: {
								'right': '5px',
							},
							html: index,
						},
					}),

				]).then(function (unitComponents) {
					var [
						unitBase,
						unitMainWrapper,
						unitMainHead,
						unitMainTail,
						unitIndex,
					] = unitComponents;

					unitBase.activate = function () {
						return unitBase.setAppearance({classes: {add: ['active']}});
					}
					unitBase.deactivate = function () {
						return unitBase.setAppearance({classes: {remove: ['active']}});
					}
					unitBase.hide = function () {
						unitBase.isHidden = true;
						return unitBase.setAppearance({classes: {add: 'hidden'}});
					}
					unitBase.show = function () {
						unitBase.isHidden = false;
						return unitBase.setAppearance({classes: {remove: 'hidden'}});
					}
					unitBase.updateMetadata = function (ndatum, query) {
						// if there are changes, do stuff.
						return ((!unitBase.datum || ndatum.id !== unitBase.datum.id) ? unitBase.updateDatum : Util.ep)(ndatum).then(function () {
							return (query !== unitBase.query ? unitBase.updateQuery : Util.ep)(query);
						}).then(function () {
							return (unitBase.isHidden ? unitBase.show : Util.ep)();
						});
					}
					unitBase.updateDatum = function (ndatum) {
						return unitBase.setAppearance({classes: {add: ndatum.rule, remove: (unitBase.datum || datum).rule}}).then(function () {
							unitBase.datum = ndatum;
							return Util.ep();
						});
					}
					unitBase.updateQuery = function (query) {
						unitBase.query = query;
						return Promise.all([
							unitMainHead.setAppearance({html: (unitBase.datum || datum).main.substring(0, query.length)}),
							unitMainTail.setAppearance({html: (unitBase.datum || datum).main}),
						]);
					}

					// complete promises.
					return Promise.all([
						unitMainWrapper.setChildren([
							unitMainHead,
							unitMainTail,
						]),
					]).then(function () {
						return unitBase.setChildren([
							unitMainWrapper,
							unitIndex,
						]);
					}).then(function () {
						return unitBase;
					});
				});
			}

			// CAPTION
			caption.link = autocomplete;

			// connect
			return Promise.all([
				base.setAppearance({
					classes: ['hidden'],
				}),
				base.setState({
					defaultState: {fn: UI.functions.hide},
					states: {
						'transcription-state': {
							fn: UI.functions.show,
						},
						'client-state': 'default',
						'role-state': 'default',
						'control-state': 'default',
					},
				}),

				// buttonPanel

				// audioCaptionPanel
				audioCaptionPanel.setChildren([
					audio,
					caption,
				]),

				// autocompletePanel
				autocompletePanel.setChildren([
					autocomplete,
				]),

				// autocomplete
				autocomplete.setSearch({mode: 'on', limit: 10, autocomplete: true}),
				autocomplete.setStyle(),
				autocomplete.setState({
					states: {
						'transcription-state': {
							preFn: function (_this) {
								return _this.setup();
							},
							fn: function () {
								return autocomplete.search.clear();
							},
						},
						'control-state': {
							preFn: function (_this) {
								return _this.stop();
							}
						}
					},
				}),

			]).then(function () {
				base.components = {

				}
				return base.setChildren([
					buttonPanel,
					counter,
					audioCaptionPanel,
					autocompletePanel,
				]);
			}).then(function () {
				return base;
			});
		});
	},
	controlInterface: function (id, args) {
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

			// sidebars
			Components.sidebar('client-sidebar', {
				position: {
					main: {
						on: '0px',
						off: '-300px',
					},
					back: {
						on: '0px',
						off: '-200px',
					},
				},
				state: {
					primary: 'client-state',
					secondary: 'role-state',
					deactivate: 'control-state',
				},
			}),
			Components.searchableList('cs-client-list', {
				appearance: {

				},
			}),
			Components.sidebar('role-sidebar',{
				position: {
					main: {
						on: '50px',
						off: '-300px',
					},
					back: {
						on: '0px',
						off: '-200px',
					},
				},
				state: {
					primary: 'role-state',
					secondary: 'control-state',
					deactivate: ['client-state', 'transcription-state'],
				},
			}),
			Components.searchableList('cs-role-list', {
				appearance: {

				},
			}),
			Components.sidebar('control-sidebar', {
				position: {
					main: {
						on: '50px',
						off: '-300px',
					},
					back: {
						on: '0px',
						off: '-200px',
					},
				},
				state: {
					primary: 'control-state',
					secondary: ['transcription-state'],
					deactivate: ['client-state', 'role-state'],
				},
			}),
			Components.searchableList('cs-control-list', {
				appearance: {

				},
			}),
			UI.createComponent('cs-cl-transcription-button', {
				template: UI.template('div', 'ie button'),
				appearance: {
					style: {
						'left': '0px',
						'width': '100%',
						'border': '0px',
						'height': '60px',
						'padding-top': '8px',
						'background-color': 'rgba(255,255,255,0.1)',
						'border-radius': '0px',
						'border-bottom': '1px solid #00869B',
					},
					html: 'Transcription',
				},
				state: {
					stateMap: 'transcription-state',
				},
				bindings: {
					'click': function (_this) {
						return _this.triggerState();
					},
				},
			}),
			UI.createComponent('cs-cl-moderation-button', {
				template: UI.template('div', 'ie button'),
				appearance: {
					style: {
						'left': '0px',
						'width': '100%',
						'border': '0px',
						'height': '60px',
						'padding-top': '8px',
						'background-color': 'rgba(255,255,255,0.1)',
						'border-radius': '0px',
						'border-bottom': '1px solid #00869B',
					},
					html: 'Moderation',
				},
			}),
			UI.createComponent('cs-cl-upload-button', {
				template: UI.template('div', 'ie button'),
				appearance: {
					style: {
						'left': '0px',
						'width': '100%',
						'border': '0px',
						'height': '60px',
						'padding-top': '8px',
						'background-color': 'rgba(255,255,255,0.1)',
						'border-radius': '0px',
						'border-bottom': '1px solid #00869B',
					},
					html: 'Upload',
				},
			}),

		]).then(function (components) {
			// unpack components
			var [
				base,
				clientSidebar,
				clientList,
				roleSidebar,
				roleList,
				controlSidebar,
				controlList,
				transcriptionButton,
				moderationButton,
				uploadButton,
			] = components;

			// ASSOCIATE
			// key bindings and other
			// TRANSCRIPTION INTERFACE

			// CLIENT SIDEBAR
			clientList.autocomplete = false;
			clientList.targets = [
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
									rule: 'clients',
								}
							});

							resolve(results);
						});
					},
				},
			]
			clientList.sort = Util.sort.alpha('main');
			clientList.unit = function (datum, query, index) {
				query = (query || '');
				var base = clientList.data.idgen(index);
				return Promise.all([
					// base component
					UI.createComponent(base, {
						template: UI.template('div', 'ie button base'),
						appearance: {
							classes: [datum.rule],
						},
						state: {
							stateMap: 'role-state',
						},
					}),

					// main wrapper
					UI.createComponent('{base}-main-wrapper'.format({base: base}), {
						template: UI.template('div', 'ie centred-vertically'),
						appearance: {
							style: {
								'display': 'inline-block',
							},
						},
					}),

					// main
					UI.createComponent('{base}-main-head'.format({base: base}), {
						template: UI.template('span', 'ie'),
						appearance: {
							style: {
								'color': '#eee',
								'display': 'inline-block',
								'position': 'absolute',
							},
							html: datum.main.substring(0, query.length),
						},
					}),
					UI.createComponent('{base}-main-tail'.format({base: base}), {
						template: UI.template('span', 'ie'),
						appearance: {
							style: {
								'display': 'inline-block',
							},
							html: datum.main,
						},
					}),

				]).then(function (unitComponents) {
					var [
						unitBase,
						unitMainWrapper,
						unitMainHead,
						unitMainTail,
					] = unitComponents;

					unitBase.activate = function () {
						return unitBase.setAppearance({classes: {add: ['active']}});
					}
					unitBase.deactivate = function () {
						return unitBase.setAppearance({classes: {remove: ['active']}});
					}
					unitBase.hide = function () {
						unitBase.isHidden = true;
						return unitBase.setAppearance({classes: {add: 'hidden'}});
					}
					unitBase.show = function () {
						unitBase.isHidden = false;
						return unitBase.setAppearance({classes: {remove: 'hidden'}});
					}
					unitBase.updateMetadata = function (ndatum, query) {
						// if there are changes, do stuff.
						return ((!unitBase.datum || ndatum.id !== unitBase.datum.id) ? unitBase.updateDatum : Util.ep)(ndatum).then(function () {
							return (query !== unitBase.query ? unitBase.updateQuery : Util.ep)(query);
						}).then(function () {
							return (unitBase.isHidden ? unitBase.show : Util.ep)();
						});
					}
					unitBase.updateDatum = function (ndatum) {
						return unitBase.setAppearance({classes: {add: ndatum.rule, remove: (unitBase.datum || datum).rule}}).then(function () {
							unitBase.datum = ndatum;
							return Util.ep();
						});
					}
					unitBase.updateQuery = function (query) {
						unitBase.query = query;
						return Promise.all([
							unitMainHead.setAppearance({html: (unitBase.datum || datum).main.substring(0, query.length)}),
							unitMainTail.setAppearance({html: (unitBase.datum || datum).main}),
						]);
					}

					// complete promises.
					return Promise.all([
						unitBase.setBindings({
							'click': function (_this) {
								Active.set('client', datum.id).then(function () {
									return _this.triggerState();
								});
							},
						}),
						unitMainWrapper.setChildren([
							unitMainHead,
							unitMainTail,
						]),
					]).then(function () {
						return unitBase.setChildren([
							unitMainWrapper,
						]);
					}).then(function () {
						return unitBase;
					});
				});
			}

			// ROLE SIDEBAR
			roleList.autocomplete = false;
			roleList.targets = [
				{
					name: 'roles',
					path: function () {
						return Active.get('client').then(function (clientId) {
							return new Promise(function(resolve, reject) {
								resolve('user.clients.{client_id}.roles'.format({client_id: clientId}));
							});
						});
					},
					process: function (data) {
						return new Promise(function(resolve, reject) {
							var results = Object.keys(data).map(function (key) {
								var role = data[key];
								return {
									id: key,
									main: role.type,
									rule: 'roles',
								}
							});

							resolve(results);
						});
					},
				},
			]
			roleList.sort = Util.sort.alpha('main');
			roleList.unit = function (datum, query, index) {
				query = (query || '');
				var base = roleList.data.idgen(index);
				return Promise.all([
					// base component
					UI.createComponent(base, {
						template: UI.template('div', 'ie button base'),
						appearance: {
							classes: [datum.rule],
						},
						state: {
							stateMap: 'control-state',
						},
					}),

					// main wrapper
					UI.createComponent('{base}-main-wrapper'.format({base: base}), {
						template: UI.template('div', 'ie centred-vertically'),
						appearance: {
							style: {
								'display': 'inline-block',
							},
						},
					}),

					// main
					UI.createComponent('{base}-main-head'.format({base: base}), {
						template: UI.template('span', 'ie'),
						appearance: {
							style: {
								'color': '#eee',
								'display': 'inline-block',
								'position': 'absolute',
							},
							html: datum.main.substring(0, query.length),
						},
					}),
					UI.createComponent('{base}-main-tail'.format({base: base}), {
						template: UI.template('span', 'ie'),
						appearance: {
							style: {
								'display': 'inline-block',
							},
							html: datum.main,
						},
					}),

				]).then(function (unitComponents) {
					var [
						unitBase,
						unitMainWrapper,
						unitMainHead,
						unitMainTail,
					] = unitComponents;

					unitBase.activate = function () {
						return unitBase.setAppearance({classes: {add: ['active']}});
					}
					unitBase.deactivate = function () {
						return unitBase.setAppearance({classes: {remove: ['active']}});
					}
					unitBase.hide = function () {
						unitBase.isHidden = true;
						return unitBase.setAppearance({classes: {add: 'hidden'}});
					}
					unitBase.show = function () {
						unitBase.isHidden = false;
						return unitBase.setAppearance({classes: {remove: 'hidden'}});
					}
					unitBase.updateMetadata = function (ndatum, query) {
						// if there are changes, do stuff.
						return ((!unitBase.datum || ndatum.id !== unitBase.datum.id) ? unitBase.updateDatum : Util.ep)(ndatum).then(function () {
							return (query !== unitBase.query ? unitBase.updateQuery : Util.ep)(query);
						}).then(function () {
							return (unitBase.isHidden ? unitBase.show : Util.ep)();
						});
					}
					unitBase.updateDatum = function (ndatum) {
						return unitBase.setAppearance({classes: {add: ndatum.rule, remove: (unitBase.datum || datum).rule}}).then(function () {
							unitBase.datum = ndatum;
							return Util.ep();
						});
					}
					unitBase.updateQuery = function (query) {
						unitBase.query = query;
						return Promise.all([
							unitMainHead.setAppearance({html: (unitBase.datum || datum).main.substring(0, query.length)}),
							unitMainTail.setAppearance({html: (unitBase.datum || datum).main}),
						]);
					}

					// complete promises.
					return Promise.all([
						unitBase.setBindings({
							'click': function (_this) {
								return Active.get('client').then(function (client_id) {
									return Context.get('user.clients.{client_id}.roles.{role_id}.project'.format({client_id: client_id, role_id: datum.id}));
								}).then(function (project_id) {
									return Promise.all([
										Active.set('project', project_id),
										Active.set('role', datum.id),
										Permission.set(datum.id),
									]);
								}).then(function () {
									return _this.triggerState();
								});
							},
						}),
						unitMainWrapper.setChildren([
							unitMainHead,
							unitMainTail,
						]),
					]).then(function () {
						return unitBase.setChildren([
							unitMainWrapper,
						]);
					}).then(function () {
						return unitBase;
					});
				});
			}

			// CONTROL SIDEBAR


			// complete promises
			return Promise.all([

				// CLIENT SIDEBAR
				clientList.setStyle(),
				clientList.search.setAppearance({
					style: {
						'left': '0px',
						'width': '100%',
						'border': '0px',
						'height': '30px',
						'padding-top': '8px',
						'background-color': 'rgba(255,255,255,0.1)',
						'border-radius': '0px',
						'border-bottom': '1px solid #00869B',
					},
				}),
				clientSidebar.components.main.setChildren([
					clientList,
				]),
				clientList.setState({
					states: {
						'client-state': {
							preFn: function (_this) {
								return _this.setup();
							},
							fn: function () {
								return clientList.search.clear();
							},
						},
						'role-state': {
							preFn: function (_this) {
								return _this.stop();
							}
						}
					},
				}),
				clientList.setTitle({text: 'Clients', centre: true}),
				clientList.setSearch({mode: 'off', placeholder: 'Search clients...'}),

				// ROLE SIDEBAR
				roleList.setStyle(),
				roleList.search.setAppearance({
					style: {
						'left': '0px',
						'width': '100%',
						'border': '0px',
						'height': '30px',
						'padding-top': '8px',
						'background-color': 'rgba(255,255,255,0.1)',
						'border-radius': '0px',
						'border-bottom': '1px solid #00869B',
					},
				}),
				roleSidebar.components.main.setChildren([
					roleList,
				]),
				roleList.setState({
					states: {
						'client-state': {
							preFn: function (_this) {
								return _this.stop();
							}
						},
						'role-state': {
							preFn: function (_this) {
								return _this.setup();
							},
							fn: function () {
								return roleList.search.clear();
							},
						},
						'control-state': {
							preFn: function (_this) {
								return _this.stop();
							}
						},
					}
				}),
				roleList.setTitle({text: 'Roles', centre: true}),
				roleList.setSearch({mode: 'off', placeholder: 'Search roles...'}),

				// CONTROL SIDEBAR
				controlSidebar.components.main.setChildren([
					controlList,
				]),
				controlList.setTitle({text: 'Menu', centre: true}),
				controlList.setSearch({mode: 'off', placeholder: ''}),
				controlList.setState({
					states: {
						'control-state': {
							preFn: function (_this) {
								return Promise.all([
									Active.get('client'),
									Active.get('role'),
								]).then(function (results) {
									var [clientId, roleId] = results;
									return Context.get('user.clients.{client_id}.roles.{role_id}'.format({client_id: clientId, role_id: roleId}));
								}).then(function (role) {
									if (role.type === 'worker') {
										// worker
										return Promise.all([
											transcriptionButton.setAppearance({classes: {remove: 'hidden'}}),
											moderationButton.setAppearance({classes: {add: 'hidden'}}),
											uploadButton.setAppearance({classes: {add: 'hidden'}}),
										]);
									} else if (role.type === 'moderator') {
										// moderator
										return Promise.all([
											transcriptionButton.setAppearance({classes: {add: 'hidden'}}),
											moderationButton.setAppearance({classes: {remove: 'hidden'}}),
											uploadButton.setAppearance({classes: {add: 'hidden'}}),
										]);
									} else if (role.type === 'admin') {
										// admin
										return Promise.all([
											transcriptionButton.setAppearance({classes: {add: 'hidden'}}),
											moderationButton.setAppearance({classes: {add: 'hidden'}}),
											uploadButton.setAppearance({classes: {remove: 'hidden'}}),
										]);
									}
								});
							},
						},
					},
				}),
				controlList.list.setChildren([
					transcriptionButton,
					moderationButton,
					uploadButton,
				]),

			]).then(function () {
				// base children
				base.components = {
					sidebars: {
						client: clientSidebar,
						role: roleSidebar,
						control: controlSidebar,
					},
				}
				return base.setChildren([
					clientSidebar,
					roleSidebar,
					controlSidebar,
				]);
			}).then(function () {
				return base;
			});
		});
	},
	projectInterface: function (id, args) {

	},
	adminInterface: function (id, args) {

	},
	moderatorInterface: function (id, args) {

	},
	workerInterface: function (id, args) {

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

			// control interface
			AccountInterfaces.controlInterface('control-interface', {
				interface: args.interface,
			}),

			// transcription interface
			AccountInterfaces.transcriptionInterface('transcription-interface', {
				interface: args.interface,
			}),

		]).then(function (components) {
			// unpack components
			var [
				base,
				controlInterface,
				transcriptionInterface,
			] = components;

			// ASSOCIATE
			// key bindings and other
			// TRANSCRIPTION INTERFACE

			// complete promises
			return Promise.all([

			]).then(function () {
				// base children
				base.components = {
					controlInterface: controlInterface,
					transcriptionInterface: transcriptionInterface,
				}
				return base.setChildren([
					controlInterface,
					transcriptionInterface,
				]);
			}).then(function () {
				return base;
			});
		});
	},
	testInterfaces: {
		captionField: function (id, args) {
			// config

			// set up components
			return Promise.all([
				// base component
				UI.createComponent('{id}-base'.format({id: id}), {
					template: UI.template('div', 'ie'),
					appearance: args.appearance,
				}),

				// test caption
				AccountComponents.captionField('{id}-caption-field-test'.format({id: id}), {
					appearance: {
						style: {
							'top': '100px',
							'left': '100px',
							'height': '100px',
							'width': '400px',
							'padding': '8px',
							'padding-left': '16px',
							'padding-right': '0px',
						},
						classes: ['border'],
					},
				}),

				// test input
				Components.searchableList('test-list', {
					appearance: {
						style: {
							'height': '250px',
							'width': '300px',
							'top': '100px',
							'left': '100px',
						}
					},
				}),

			]).then(function (components) {
				// unpack components
				var [
					base,
					caption,
					autocomplete,
				] = components;

				// set up promises to be completed before returning the base.

				// logic, bindings, etc.
				// KEYBINDINGS
				Mousetrap.bind('up', function (event) {
					event.preventDefault();
					Promise.all([
						autocomplete.behaviours.up(),
						caption.behaviours.up(),
					]);
				});

				Mousetrap.bind('down', function (event) {
					event.preventDefault();
					Promise.all([
						autocomplete.behaviours.down(),
						caption.behaviours.down(),
					]);
				});

				Mousetrap.bind('left', function (event) {
					Promise.all([
						autocomplete.behaviours.left(),
						caption.behaviours.left(),
					]);
				});

				Mousetrap.bind('right', function (event) {
					Promise.all([
						autocomplete.behaviours.right(),
						caption.behaviours.right(),
					]);
				});

				Mousetrap.bind(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], function (event) {
					event.preventDefault();
					var char = String.fromCharCode(event.which);
					Promise.all([
						autocomplete.behaviours.number(char),
						caption.behaviours.number(char),
					]);
				});

				Mousetrap.bind('enter', function (event) {
					event.preventDefault();
					Promise.all([
						autocomplete.behaviours.enter(),
						caption.behaviours.enter(),
					]);
				});

				Mousetrap.bind('backspace', function (event) {
					Promise.all([
						autocomplete.behaviours.backspace(),
						caption.behaviours.backspace(),
					]);
				});

				Mousetrap.bind('alt+backspace', function (event) {
					Promise.all([
						caption.behaviours.altbackspace(),
					]);
				});

				Mousetrap.bind('space', function (event) {
					event.preventDefault();
					Promise.all([
						caption.behaviours.space(),
					]);
				});

				Mousetrap.bind('alt+right', function (event) {
					caption.behaviours.altright();
				});

				Mousetrap.bind('alt+left', function (event) {
					caption.behaviours.altleft();
				});

				// CAPTION
				caption.unit = function (text, type) {
					var key = Util.makeid();

					// classes
					jss.set('#{id}-{key}-base'.format({id: caption.id, key: key}), {
						'height': '30px',
						'margin': '0px',
						'display': 'inline-block',
					});
					jss.set('#{id}-{key}-base.tag'.format({id: caption.id, key: key}), {

					});
					jss.set('#{id}-{key}-base.active .head'.format({id: caption.id, key: key}), {
						'color': '#fff',
					});

					// components
					return Promise.all([
						// base
						UI.createComponent('{id}-{key}-base'.format({id: caption.id, key: key}), {
							template: UI.template('div', 'ie'),
						}),

						// autocomplete element
						Components.searchableList('{id}-{key}-autocomplete'.format({id: caption.id, key: key}), {
							appearance: {
								style: {
									'display': 'inline-block',
								},
							},
						}),

					]).then(function (unitComponents) {
						var [
							unitBase,
							unitAutocomplete,
						] = unitComponents;

						// clone page autocomplete
						unitAutocomplete.clone(autocomplete);
						unitAutocomplete.autocomplete = true;
						unitAutocomplete.searchExternal = {
							onFocus: function () {
								return caption.components.wrapper.setActive({index: unitBase.index});
							},
						}

						// methods
						unitBase.focus = function (mode) {
							return unitAutocomplete.search.focus(mode);
						}
						unitBase.activate = function () {
							return unitBase.setAppearance({classes: {add: 'active'}}).then(function () {

							});
						}
						unitBase.deactivate = function () {
							return Promise.all([
								unitBase.setAppearance({classes: {remove: 'active'}}),
								unitAutocomplete.search.components.tail.setAppearance({html: unitAutocomplete.search.components.head.model().text()}),
							]);
						}
						unitBase.isEmpty = function () {
							return unitAutocomplete.search.components.head.model().text().length === 0;
						}

						return Promise.all([
							unitAutocomplete.search.setAppearance({
								style: {
									'height': '30px',
									'padding-left': '0px',
								},
								classes: {
									remove: ['border', 'border-radius'],
								},
							}),
						]).then(function () {
							// children
							unitBase.components = {
								autocomplete: unitAutocomplete,
							}
							return unitBase.setChildren([
								unitAutocomplete,
							]);
						}).then(function () {
							return unitBase;
						});
					});
				}

				// LIST
				autocomplete.onInput = function () {

				}
				autocomplete.components.search.onComplete = function () {

				}
				autocomplete.setSearch('on');
				autocomplete.autocomplete = true;
				autocomplete.targets = [
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
										rule: 'client',
									}
								});

								resolve(results);
							});
						},
						filter: {
							default: true,
							char: '/',
							key: 'forwardslash',
							display: 'Client',
							button: 'Clients',
							rule: 'client',
						},
					},
				]
				autocomplete.unit = function (_this, datum, query, index) {
					query = (query || '');

					// base class
					jss.set('#{id}-{object}-base'.format({id: _this.id, object: datum.id}), {
						'height': '30px',
						'width': '100%',
						'border-bottom': '1px solid #ccc',
						'padding': '0px',
						'padding-left': '10px',
						'text-align': 'left',
					});
					jss.set('#{id}-{object}-base.active'.format({id: _this.id, object: datum.id}), {
						'background-color': 'rgba(255,255,255,0.1)'
					});
					jss.set('#{id}-{object}-base.client'.format({id: _this.id, object: datum.id}), {
						'background-color': 'rgba(255,255,0,0.05)'
					});
					jss.set('#{id}-{object}-base.client.active'.format({id: _this.id, object: datum.id}), {
						'background-color': 'rgba(255,255,0,0.1)'
					});

					return Promise.all([
						// base component
						UI.createComponent('{id}-{object}-base'.format({id: _this.id, object: datum.id}), {
							template: UI.template('div', 'ie button'),
							appearance: {
								classes: [datum.rule],
							}
						}),

						// main wrapper
						UI.createComponent('{id}-{object}-main-wrapper'.format({id: _this.id, object: datum.id}), {
							template: UI.template('div', 'ie centred-vertically'),
							appearance: {
								style: {
									'left': '0px',
								},
							},
						}),

						// main
						UI.createComponent('{id}-{object}-main-head'.format({id: _this.id, object: datum.id}), {
							template: UI.template('span', 'ie'),
							appearance: {
								style: {
									'color': '#eee',
									'display': 'inline-block',
									'position': 'absolute',
								},
								html: datum.main.substring(0, query.length),
							},
						}),
						UI.createComponent('{id}-{object}-main-tail'.format({id: _this.id, object: datum.id}), {
							template: UI.template('span', 'ie'),
							appearance: {
								style: {
									'display': 'inline-block',
								},
								html: datum.main,
							},
						}),

						// index
						UI.createComponent('{id}-{object}-index'.format({id: _this.id, object: datum.id}), {
							template: UI.template('div', 'ie abs centred-vertically'),
							appearance: {
								style: {
									'right': '5px',
								},
								html: index,
							},
						}),

					]).then(function (unitComponents) {
						var [
							unitBase,
							unitMainWrapper,
							unitMainHead,
							unitMainTail,
							unitIndex,
						] = unitComponents;

						// set metadata
						datum.metadata = {
							query: query,
							complete: datum.main,
							combined: query + datum.main.substring(query.length),
							type: datum.rule,
						}

						unitBase.activate = function () {
							return unitBase.setAppearance({classes: {add: ['active']}});
						}

						unitBase.deactivate = function () {
							return unitBase.setAppearance({classes: {remove: ['active']}});
						}

						// complete promises.
						return Promise.all([
							unitMainWrapper.setChildren([
								unitMainHead,
								unitMainTail,
							]),
						]).then(function () {
							return unitBase.setChildren([
								unitMainWrapper,
								unitIndex,
							]);
						}).then(function () {
							return unitBase;
						});
					});
				}

				// complete promises
				return Promise.all([
					// caption

					// list
					autocomplete.setState({
						states: {
							'client-state': {
								fn: function (_this) {
									_this.display();
								},
							},
						}
					}),
				]).then(function () {
					base.components = {
						caption: caption,
						autocomplete: autocomplete,
					}
					return base.setChildren([
						caption,
						autocomplete,
					]);
				}).then(function () {
					return base;
				});
			});
		},
		searchableList: function (id, args) {
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
							'height': '250px',
							'width': '300px',
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
				list.setSearch('on');
				list.autocomplete = true;
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
										rule: 'client',
									}
								});

								resolve(results);
							});
						},
						filter: {
							default: true,
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
										rule: 'role',
									}
								});

								resolve(results);
							});
						},
						filter: {
							default: true,
							char: '.',
							key: 'period',
							display: 'Role',
							button: 'Roles',
							rule: 'role',
						},
					},
				]
				list.unit = function (_this, datum, query) {
					query = (query || '');

					return Promise.all([
						// base component
						UI.createComponent('{id}-{object}-base'.format({id: _this.id, object: datum.id}), {
							template: UI.template('div', 'ie button'),
							appearance: {
								style: {
									'height': '30px',
									'width': '100%',
									'border-bottom': '1px solid #ccc',
									'padding': '0px',
								},
							},
						}),

						// main wrapper
						UI.createComponent('{id}-{object}-main-wrapper'.format({id: _this.id, object: datum.id}), {
							template: UI.template('div', 'ie centred'),
							appearance: {
								style: {
									'font-size': '13px',
								},
							},
						}),

						// main
						UI.createComponent('{id}-{object}-main-head'.format({id: _this.id, object: datum.id}), {
							template: UI.template('span', 'ie'),
							appearance: {
								style: {
									'font-size': '14px',
									'color': '#eee',
								},
								html: datum.main.substring(0, query.length),
							},
						}),

						UI.createComponent('{id}-{object}-main-tail'.format({id: _this.id, object: datum.id}), {
							template: UI.template('span', 'ie'),
							appearance: {
								style: {
									'font-size': '14px',
								},
								html: datum.main.substring(query.length),
							},
						}),

					]).then(function (unitComponents) {
						var [
							unitBase,
							unitMainWrapper,
							unitMainHead,
							unitMainTail,
						] = unitComponents;

						// complete promises.
						return Promise.all([
							unitMainWrapper.setChildren([
								unitMainHead,
								unitMainTail,
							]),
						]).then(function () {
							return unitBase.setChildren([
								unitMainWrapper,
							]);
						}).then(function () {
							return unitBase;
						});
					});
				}

				// complete promises.
				return Promise.all([
					list.setState({
						states: {
							'client-state': {
								fn: function (_this) {
									_this.display();
								},
							},
						}
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
	},
}
