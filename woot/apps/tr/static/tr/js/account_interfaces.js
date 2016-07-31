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
			Components.counter('{id}-counter'.format({id: id}), {
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
			Components.audio('{id}-audio'.format({id: id}), {
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
		]).then(function (components) {
			// unpack components
			var [
				base,
				transcriptionInterface,
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
			}
			return base.setChildren([
				transcriptionInterface,
			]).then(function () {
				return base;
			});
		});
	},
}
