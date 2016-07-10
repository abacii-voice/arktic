var AccountInterfaces = {
	transcriptionInterface: function () {
		var id = 'transcription-interface';

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

			// counter must have the following methods:
			// 1. increment
			// 2. decrement
			// 3. clear
			Components.counter('{id}-counter'.format({id: id}), {
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

			// scroll must have the following methods:
			// 1. an external method placed inside the on-input function of the search input. DONE
			Components.scroll('{id}-search'.format({id: id}), {
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

			// This holds tokens, audio, original, and modified
			UI.createComponent('{id}-transcription-panel'.format({id: id}), {
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'height': '100%',
						'width': '492px',
						'float': 'left',
						'margin-left': '10px',
					}
				},
			}),

			// TOKEN FIELD
			// The token field is one of only two components that are directly affected by the search input
			// tokens are separated by spaces, but spaces are not directly rendered.
			Components.renderedTextField('{id}-tokens'.format({id: id}), {
				appearance: {
					style: {
						'height': '40px',
						'width': '100%',
						'overflow': 'hidden',
						'margin-bottom': '10px',
					},
				},
				options: {

					// horizontal scroll
					horizontal: true,

					// how to display data
					display: function (_this, text) {
						return function (display) {

						}
					},

					style: {
						normal: {

						},
						tag: {

						},
					},
				},
			}),

			// audio requires the following methods:
			// 1. play/replay, stop (reset), remove cut
			Components.audio('{id}-audio'.format({id: id}), {
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

			// ORIGINAL CAPTION
			// Completely static. Nothing can change it.
			Components.renderedTextField('{id}-original'.format({id: id}), {
				appearance: {
					style: {
						'height': '40px',
						'width': '100%',
						'overflow': 'hidden',
						'margin-bottom': '10px',
					},
				},
				options: {

					// horizontal scroll
					horizontal: true,

					// how to display data
					display: function (_this, text) {
						return function (display) {

						}
					},
				},
			}),

			// MODIFIED CAPTION
			// Reacts to changes in the search bar.
			Components.renderedTextField('{id}-modified'.format({id: id}), {
				appearance: {
					style: {
						'height': '40px',
						'width': '100%',
						'overflow': 'hidden',
						'margin-bottom': '10px',
					},
				},
				options: {

					// horizontal scroll
					horizontal: true,

					// how to display data
					display: function (_this, text) {
						return function (display) {

						}
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
						'width': '50px',
						'float': 'left',
						'margin-left': '10px',
					},
				},
			}),

			// previous transcription
			UI.createComponent('{id}-previous-button'.format({id: id}), {
				template: UI.template('div', 'ie button border border-radius'),
				appearance: {
					style: {
						'height': '40px',
						'width': '40px',
						'margin-bottom': '10px',
					},
				},
			}),

			// next transcription
			UI.createComponent('{id}-next-button'.format({id: id}), {
				template: UI.template('div', 'ie button border border-radius'),
				appearance: {
					style: {
						'height': '40px',
						'width': '40px',
						'margin-bottom': '10px',
					},
				},
			}),

			// marks transcription as done
			UI.createComponent('{id}-done-button'.format({id: id}), {
				template: UI.template('div', 'ie button border border-radius'),
				appearance: {
					style: {
						'height': '40px',
						'width': '40px',
						'margin-bottom': '10px',
					},
				},
			}),

			// shows flags assigned to the transcription
			UI.createComponent('{id}-flags-button'.format({id: id}), {
				template: UI.template('div', 'ie button border border-radius'),
				appearance: {
					style: {
						'height': '40px',
						'width': '40px',
						'margin-bottom': '10px',
					},
				},
			}),
		]).then(function (components) {

			// unpack components
			var base = components[0];
			var counter = components[1];
			var scroll = components[2];
			var transcriptionPanel = components[3];
			var tokens = components[4];
			var audio = components[5];
			var originalCaption = components[6];
			var modifiedCaption = components[7];
			var infoPanel = components[8];
			var controlPanel = components[9];
			var previousButton = components[10];
			var nextButton = components[11];
			var doneButton = components[12];
			var flagsButton = components[13];

			// add methods and properties
			// 1. search input to text field transfer
			// 2. connection between modified caption and tokens (scroll to)
			// 3. connection between original caption and modified/tokens (copy)
			// 4. connection between done button and counter (increment)/tokens (export)
			scroll.input.external = function (_this, query, type) {
				var isTag = (type === 'tag');

				// 1. add token to token field
				tokens.list.addToken(query, isTag);

				// 2. add token to modified field
				modifiedCaption.list.addToken(query, isTag);
			}

			// associate components
			transcriptionPanel.setChildren([
				tokens,
				audio,
				originalCaption,
				modifiedCaption,
			]);

			controlPanel.setChildren([
				previousButton,
				nextButton,
				doneButton,
				flagsButton,
			]);

			base.setChildren([
				counter,
				scroll,
				transcriptionPanel,
				infoPanel,
				controlPanel,
			]);

			// return base
			return base;
		});
	},
}
