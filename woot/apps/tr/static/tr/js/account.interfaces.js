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

			AccountComponents.captionField('tb-cp-caption', {
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
						'width': '400px',
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

			// KEYBINDINGS
			Mousetrap.bind('up', function (event) {
				event.preventDefault();
				Promise.all([
					autocomplete.behaviours.up(),

				]);
			});

			Mousetrap.bind('down', function (event) {
				event.preventDefault();
				Promise.all([
					autocomplete.behaviours.down(),

				]);
			});

			Mousetrap.bind('left', function (event) {
				Promise.all([
					autocomplete.behaviours.left(),

				]);
			});

			Mousetrap.bind('right', function (event) {
				Promise.all([
					caption.behaviours.right(),
				]);
			});

			Mousetrap.bind(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], function (event) {
				event.preventDefault();
				var char = String.fromCharCode(event.which);
				Promise.all([
					autocomplete.behaviours.number(char),
				]);
			});

			Mousetrap.bind('enter', function (event) {
				event.preventDefault();
				Promise.all([
					caption.behaviours.enter(),
				]);
			});

			Mousetrap.bind('backspace', function (event) {
				Promise.all([
					autocomplete.behaviours.backspace(),

				]);
			});

			Mousetrap.bind('alt+backspace', function (event) {
				Promise.all([

				]);
			});

			Mousetrap.bind('space', function (event) {
				event.preventDefault();
				Promise.all([
					caption.behaviours.space(),
				]);
			});

			Mousetrap.bind('alt+right', function (event) {

			});

			Mousetrap.bind('alt+left', function (event) {

			});

			// Audio
			audio.threshold = 4;
			audio.path = function () {
				return Promise.all([
					Active.get('client'),
					Permission.get(),
				]).then(function (results) {
					// unpack variable
					var [client_id, role_id] = results;

					// return path
					return 'user.clients.{client_id}.roles.{role_id}.active_transcription_token.fragments'.format({client_id: client_id, role_id: role_id});
				});
			}
			audio.process = function (result) {
				return Promise.all(Object.keys(result).map(function (key) {
					audio.components.track.buffer[key] = {
						content: result[key].phrase.content,
						index: Object.keys(audio.components.track.buffer).length,
						parent: result[key].parent,
						tokens: Object.keys(result[key].phrase.token_instances).sort(function (a,b) {
							return result[key].phrase.token_instances[a].index > result[key].phrase.token_instances[b].index ? 1 : -1;
						}).map(function (tokenKey) {
							return {
								'content': result[key].phrase.token_instances[tokenKey].content,
								'type': result[key].phrase.token_instances[tokenKey].type,
							}
						}),
					}
					return Util.ep();
				}));
			}

			// Autocomplete
			// LIST
			autocomplete.targets = [
				{name: 'words',
					path: function () {
						return Promise.all([
							Active.get('client'),
							Active.get('project'),
						]).then(function (results) {
							return 'clients.{client_id}.projects.{project_id}.dictionary.tokens'.format({client_id: results[0], project_id: results[1]});
						});
					},
					process: function (data) {
						return new Promise(function(resolve, reject) {
							var results = Object.keys(data).filter(function (key) {
								return data[key].type === 'word';
							}).map(function (key) {
								var token = data[key];
								return {
									id: key,
									main: token.content,
									rule: 'words',
								}
							});
							resolve(results);
						});
					},
					filterRequest: function (query) {
						var dict = {};
						dict['tokens'] = {'content__startswith': query, 'type': 'word'};
						return dict;
					},
					filter: {
						default: true,
						char: '/',
						key: 'forwardslash',
						input: 'Words',
						display: 'Word',
						rule: 'words',
						limit: 10,
					},
				},
				{name: 'tags',
					path: function () {
						return Promise.all([
							Active.get('client'),
							Active.get('project'),
						]).then(function (results) {
							return 'clients.{client_id}.projects.{project_id}.dictionary.tokens'.format({client_id: results[0], project_id: results[1]});
						});
					},
					process: function (data) {
						return new Promise(function(resolve, reject) {
							var results = Object.keys(data).filter(function (key) {
								return data[key].type === 'tag';
							}).map(function (key) {
								var token = data[key];
								return {
									id: key,
									main: token.content,
									rule: 'tags',
								}
							});
							resolve(results);
						});
					},
					filterRequest: function (query) {
						var dict = {};
						dict['tokens'] = {'content__startswith': query, 'type': 'tag'};
						return dict;
					},
					setStyle: function () {
						return new Promise(function(resolve, reject) {
							jss.set('#{id} .tags'.format({id: autocomplete.id}), {
								'background-color': 'rgba(255,255,0,0.05)'
							});
							jss.set('#{id} .tags.active'.format({id: autocomplete.id}), {
								'background-color': 'rgba(255,255,0,0.1)'
							});
							resolve();
						});
					},
					filter: {
						default: true,
						char: ':',
						key: 'colon',
						input: 'Tags',
						display: 'Tag',
						rule: 'tags',
						limit: 10,
						autocompleteOverride: true,
					},
				},
				{name: 'phrases',
					path: function () {
						return Promise.all([
							Active.get('client'),
							Active.get('project'),
						]).then(function (results) {
							return 'clients.{client_id}.projects.{project_id}.dictionary.phrases'.format({client_id: results[0], project_id: results[1]});
						});
					},
					process: function (data) {
						return new Promise(function(resolve, reject) {
							var results = Object.keys(data).map(function (key) {
								var phrase = data[key];
								return {
									id: key,
									main: phrase.content,
									rule: 'phrases',
								}
							});
							resolve(results);
						});
					},
					filterRequest: function (query) {
						var dict = {};
						dict['phrases'] = {'content__startswith': query, 'token_count__gt': '1'};
						return dict;
					},
					setStyle: function () {
						return new Promise(function(resolve, reject) {
							jss.set('#{id} .phrases'.format({id: autocomplete.id}), {
								'background-color': 'rgba(255,100,255,0.05)'
							});
							jss.set('#{id} .phrases.active'.format({id: autocomplete.id}), {
								'background-color': 'rgba(255,100,255,0.4)'
							});
							resolve();
						});
					},
					filter: {
						default: true,
						char: '.',
						key: 'dot',
						input: 'Phrases',
						display: 'Phrase',
						rule: 'phrases',
						limit: 10,
					},
				},
			]
			autocomplete.unitStyle.base = function () {
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
					unitBase.show = function () {
						unitBase.isHidden = false;
						return unitBase.setAppearance({classes: {remove: 'hidden'}});
					}
					unitBase.hide = function () {
						unitBase.isHidden = true;
						return unitBase.setAppearance({classes: {add: 'hidden'}});
					}
					unitBase.updateMetadata = function (ndatum, query) {
						// if there are changes, do stuff.
						return unitBase.updateDatum(ndatum).then(function () {
							return unitBase.updateQuery(query);
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
			autocomplete.search.setMetadata = function (metadata) {
				var _this = autocomplete.search;
				metadata = (metadata || {});
				_this.metadata = (_this.metadata || {});
				_this.metadata.query = metadata.query !== undefined ? metadata.query : (_this.metadata.query || '');
				_this.metadata.complete = metadata.complete !== undefined ? metadata.complete : _this.metadata.query;
				_this.metadata.combined = _this.metadata.query + _this.metadata.complete.substring(_this.metadata.query.length);
				return _this.components.tail.setAppearance({html: ((_this.isComplete ? _this.metadata.complete : '') || _this.metadata.combined || _this.metadata.query || _this.filterString || _this.placeholder || '')}).then(function () {
					// reset complete
					if (_this.isComplete && _this.metadata.query !== _this.metadata.complete) {
						_this.isComplete = false;
					}

					// return caption action
					if (caption.isFocussed) {
						return caption.active.setMetadata(metadata);
					} else {
						return Util.ep();
					}
				});
			}
			autocomplete.search.complete = function () {
				var _this = autocomplete.search;
				_this.completeQuery = ((_this.metadata || {}).complete || '');
				_this.isComplete = true;
				return _this.components.tail.setAppearance({html: _this.completeQuery}).then(function () {
					return _this.components.head.setAppearance({html: _this.completeQuery});
				}).then(function () {
					if (!caption.isFocussed) {
						return _this.setCaretPosition('end');
					} else {
						return Util.ep();
					}
				});
			}
			autocomplete.search.behaviours.right = function () {
				return autocomplete.search.isCaretInPosition('end').then(function (inPosition) {
					if ((inPosition && !autocomplete.search.isComplete) || caption.completionOverride) {
						autocomplete.currentIndex = 0;
						caption.completionOverride = false;
						return autocomplete.search.complete().then(function () {
							return autocomplete.search.input();
						});
					} else {
						return Util.ep();
					}
				});
			}
			autocomplete.behaviours.number = function (char) {
				var index = parseInt(char);
				if (index < autocomplete.data.storage.virtual.rendered.length) {
					return autocomplete.control.setActive.main({index: index}).then(function () {
						// don't know what behaviour to have here
						return Promise.all([
							autocomplete.search.behaviours.right(),
							caption.behaviours.right(),
						]);

						// Maybe do this
						// return search.behaviours.enter();
					});
				}
			}

			// CAPTION
			caption.styles = {};
			caption.unit = function (options) {
				var id = caption.data.idgen();
				return Promise.all([
					// base
					Components.search(id, {
						// need custom appearance
						appearance: {
							style: {
								'padding-left': '0px',
								'padding-bottom': '8px',
								'padding-top': '0px',
								'height': 'auto',
								'border': '0px',
								'display': 'inline-block',
							},
						},
					}),
				]).then(function (components) {
					var [
						unitBase,
					] = components;

					// as caption unit
					unitBase.activate = function () {
						return Util.ep();
					}
					unitBase.deactivate = function () {
						return Util.ep();
					}
					unitBase.select = function () {

					}
					unitBase.unSelect = function () {

					}
					unitBase.show = function () {
						unitBase.isHidden = false;
						return unitBase.setAppearance({classes: {remove: 'hidden'}});
					}
					unitBase.hide = function () {
						unitBase.isHidden = true;
						return unitBase.setAppearance({classes: {add: 'hidden'}});
					}
					unitBase.updateUnitMetadata = function (unitDatum) {
						// each datum should contain the type and content of a token
					}


					// as search bar
					unitBase.setMetadata = function (metadata) {
						metadata = (metadata || {});
						unitBase.metadata = (unitBase.metadata || {});
						unitBase.metadata.query = metadata.query !== undefined ? metadata.query : (unitBase.metadata.query || '');
						unitBase.metadata.complete = metadata.complete !== undefined ? metadata.complete : unitBase.metadata.query;
						unitBase.metadata.combined = unitBase.metadata.query + unitBase.metadata.complete.substring(unitBase.metadata.query.length);
						return unitBase.components.tail.setAppearance({html: ((unitBase.isComplete ? unitBase.metadata.complete : '') || unitBase.metadata.combined || unitBase.metadata.query || unitBase.filterString || unitBase.placeholder || '')}).then(function () {
							unitBase.isComplete = false;
							return Util.ep();
						}).then(function () {
							// decide to split based on number of items and space character.
							var noData = autocomplete.data.storage.virtual.list.length === 0;
							var spaceEnd = unitBase.metadata.query.slice(-1) === ' ';
						});
					}
					unitBase.input = function () {
						return unitBase.getContent().then(function (content) {
							return autocomplete.search.setContent({content: content, trigger: true});
						});
					}
					unitBase.focus = function (position) {
						if (!unitBase.isFocussed) {
							caption.isFocussed = true;
							unitBase.isFocussed = true;
							autocomplete.isFocussed = true;
							return caption.control.setActive({index: unitBase.index}).then(function () {
								return unitBase.setCaretPosition(position).then(function () {
									return unitBase.input();
								});
							});
						} else {
							return Util.ep();
						}
					}
					unitBase.blur = function () {
						if (unitBase.isFocussed) {
							unitBase.isFocussed = false;
							if (caption.active.id === unitBase.id) {
								caption.isFocussed = false;
								autocomplete.isFocussed = false;
							}
							return unitBase.getContent().then(function (content) {
								return unitBase.components.tail.setAppearance({html: (content || unitBase.placeholder)});
							});
						} else {
							return Util.ep();
						}
					}

					return Promise.all([
						unitBase.components.head.setBindings({
							'focus': function (_this) {
								return unitBase.focus();
							},
						}),
					]).then(function () {

					}).then(function () {
						return unitBase;
					});
				});
			}
			caption.behaviours.right = function () {
				// Slight modification of original function
				if (caption.isFocussed) {
					return caption.active.isCaretInPosition('end').then(function (inPosition) {
						if (inPosition) {
							caption.completionOverride = true; // introduce a little chaos.
							return Promise.all([
								autocomplete.behaviours.right(),
								caption.active.complete(),
							]);
						} else {
							return autocomplete.behaviours.right();
						}
					});
				} else {
					return autocomplete.behaviours.right();
				}
			}
			caption.behaviours.space = function () {

			}

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

				autocomplete.components.filterButton.setState({
					stateMap: {
						'transcription-state': 'transcription-state-filter',
						'transcription-state-filter': 'transcription-state',
					},
				}),
				autocomplete.list.setState({
					states: {
						'transcription-state': {
							classes: {remove: 'hidden'},
						},
						'transcription-state-filter': {
							classes: {add: 'hidden'},
						},
					},
				}),
				autocomplete.components.filter.setState({
					states: {
						'transcription-state': {
							classes: {add: 'hidden'},
						},
						'transcription-state-filter': {
							classes: {remove: 'hidden'},
						},
					},
				}),
				autocomplete.setSearch({mode: 'on', limit: 10, autocomplete: true}),
				autocomplete.unitStyle.apply(),
				autocomplete.setState({
					states: {
						'transcription-state': {
							preFn: function (_this) {
								return _this.control.setup.main();
							},
						},
						'control-state': {
							fn: function (_this) {
								return _this.control.reset();
							}
						}
					},
				}),

			]).then(function () {
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
					filterRequest: function () {
						return {};
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
					filterRequest: function () {
						return {};
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
				clientList.unitStyle.apply(),
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
								return _this.control.setup.main();
							},
							fn: function () {
								return clientList.search.clear();
							},
						},
						'role-state': {
							preFn: function (_this) {
								return _this.control.reset();
							}
						}
					},
				}),
				clientList.setTitle({text: 'Clients', centre: true}),
				clientList.setSearch({mode: 'off', placeholder: 'Search clients...'}),

				// ROLE SIDEBAR
				roleList.unitStyle.apply(),
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
								return _this.control.reset();
							}
						},
						'role-state': {
							preFn: function (_this) {
								return _this.control.setup.main();
							},
						},
						'control-state': {
							preFn: function (_this) {
								return _this.control.reset();
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
			controlInterface.name = 'controlInterface';
			transcriptionInterface.name = 'transcriptionInterface';

			// complete promises
			return Promise.all([

			]).then(function () {
				// base children
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
