var AccountInterfaces = (AccountInterfaces || {});
AccountInterfaces.transcriptionInterface = function (id, args) {

	var autocompleteWidth = '300px';
	return Promise.all([

		// base
		// contains:
		// 1. main panel
		// 2. autocomplete panel
		UI.createComponent('transcription-base', {
			template: UI.template('div', 'ie abs'),
			appearance: {
				style: {
					'height': '100%',
					'left': '60px',
					'width': 'calc(100% - 60px)',
				},
				classes: ['centred-vertically'],
			},
		}),

		// main panel
		// contains:
		// 1. counter
		// 2. audio
		// 3. caption
		// 4. flags
		// 5. button panel
		UI.createComponent('tb-1-main-panel', {
			template: UI.template('div', 'ie'),
			appearance: {
				style: {
					'height': '100%',
					'left': '0px',
					'width': 'calc(100% - {width})'.format({width: autocompleteWidth}),
					'float': 'left',
				},
			},
		}),

		// counter
		AccountComponents.counter('tb-1-mp-1-counter', {
			appearance: {
				style: {
					'margin-top': '10px',
					'height': '68px',
					'width': '400px',
				},
			},
		}),

		// audio
		AccountComponents.audio('tb-1-mp-2-audio', {
			appearance: {
				style: {
					'margin-top': '10px',
					'height': '60px',
					'width': '400px',
				},
			},
		}),

		// caption
		AccountComponents.captionField('tb-1-mp-3-caption', {
			appearance: {
				style: {
					'margin-top': '10px',
					'height': '200px',
					'width': '500px',
					'border': '1px solid #888',
				},
			},
		}),

		// button panel
		// contains:
		// 1. previous button
		// 2. next/confirm button
		UI.createComponent('tb-1-mp-4-button-panel', {
			appearance: {
				style: {
					'height': '100%',
					'width': '70px',
					'float': 'left',
				},
			},
		}),

		// previous button
		UI.createComponent('tb-1-mp-4-bp-1-previous-button'),

		// next/confirm button
		UI.createComponent('tb-1-mp-4-bp-2-next-confirm-button'),

		// autocomplete panel
		// contains:
		// 1. autocomplete
		UI.createComponent('tb-2-autocomplete-panel', {
			template: UI.template('div', 'ie'),
			appearance: {
				style: {
					'height': '100%',
					'width': autocompleteWidth,
					'float': 'left',
				},
				classes: ['centred-vertically'],
			},
		}),

		// autocomplete
		Components.searchableList('tb-2-ap-1-autocomplete', {
			appearance: {
				style: {
					'height': '100%',
					'width': '100%',
				},
			},
		}),

		// Non interface elements
		// transcription master controller
		AccountComponents.transcriptionMasterController(),
		Components.actionMasterController('transcription'),

	]).then(function (components) {

		// unpack components
		var [
			base,
			mainPanel,
			counter,
			audio,
			caption,
			buttonPanel,
			previousButton,
			confirmButton,

			autocompletePanel,
			autocomplete,

			// non interface elements
			transcriptionMasterController,
			amc,
		] = components;

		// KEYBINDINGS
		Mousetrap.bind('up', function (event) {
			amc.addAction({type: 'key.up'});
			event.preventDefault();
			if (autocomplete.isFocussed && caption.isFocussed) {
				Promise.all([
					autocomplete.behaviours.up(),
				]);
			} else {
				Promise.all([
					transcriptionMasterController.behaviours.up(),
				]);
			}
		});
		Mousetrap.bind('down', function (event) {
			event.preventDefault();
			amc.addAction({type: 'key.down'});
			if (autocomplete.isFocussed && caption.isFocussed) {
				Promise.all([
					autocomplete.behaviours.down(),
				]);
			} else {
				Promise.all([
					transcriptionMasterController.behaviours.down(),
				]);
			}
		});
		Mousetrap.bind('left', function (event) {
			amc.addAction({type: 'key.left'});
			Promise.all([
				autocomplete.behaviours.left(),
				caption.behaviours.left(event),
			]);
		});
		Mousetrap.bind('right', function (event) {
			amc.addAction({type: 'key.right'});
			Promise.all([
				caption.behaviours.right(event),
			]);
		});
		Mousetrap.bind(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], function (event) {
			event.preventDefault();
			var char = String.fromCharCode(event.which);
			amc.addAction({type: 'key.number', metadata: {'value': char}});
			Promise.all([
				autocomplete.behaviours.number(char),
			]);
		});
		Mousetrap.bind('enter', function (event) {
			amc.addAction({type: 'key.enter'});
			event.preventDefault();
			Promise.all([
				caption.behaviours.enter(),
			]);
		});
		Mousetrap.bind('backspace', function (event) {
			amc.addAction({type: 'key.backspace'});
			Promise.all([
				autocomplete.behaviours.backspace(),
				caption.behaviours.backspace(event),
			]);
		});
		Mousetrap.bind('alt+backspace', function (event) {
			amc.addAction({type: 'key.alt+backspace'});
			Promise.all([
				caption.behaviours.altbackspace(event),
			]);
		});
		Mousetrap.bind('space', function (event) {
			amc.addAction({type: 'key.space'});
			if (caption.isFocussed) {
				event.preventDefault();
			}
			Promise.all([
				caption.behaviours.space(),
			]);
		});
		Mousetrap.bind('alt+right', function (event) {
			amc.addAction({type: 'key.alt+right'});
			Promise.all([
				caption.behaviours.altright(event),
			]);
		});
		Mousetrap.bind('alt+left', function (event) {
			amc.addAction({type: 'key.alt+left'});
			Promise.all([
				caption.behaviours.altleft(event),
			]);
		});

		// Transcription Master Controller
		transcriptionMasterController.updateThreshold = 4;
		transcriptionMasterController.path = function () {
			return Promise.all([
				Active.get('client'),
				Active.get('role'),
			]).then(function (results) {
				// unpack variable
				var [client_id, role_id] = results;

				// return path
				return 'user.clients.{client_id}.roles.{role_id}.active_transcription_token.fragments'.format({client_id: client_id, role_id: role_id});
			});
		}
		transcriptionMasterController.process = function (result) {
			var _this = transcriptionMasterController;
			return Promise.all(Object.keys(result).sort(function (a,b) {
				return result[a].index > result[b].index ? 1 : -1;
			}).map(function (key) {
				_this.buffer[key] = {
					content: result[key].phrase.content,
					is_available: true,
					index: Object.keys(_this.buffer).length,
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
		transcriptionMasterController.pre.interface = function () {
			var _this = transcriptionMasterController;
			return _this.current().then(function (current) {
				current.is_available = false;

				return Promise.all([
					audio.display(current),
					caption.control.input.newCaption(current),
					// counter.update(current),
				]);
			});
		}
		transcriptionMasterController.setActive = function (options) {
			var _this = transcriptionMasterController;
			options = (options || {});

			audio.controller.isLoaded = false;
			return Promise.all([
				caption.export(),
				audio.stop(),
				audio.components.canvas.removeCut(),
			]).then(function () {

				// change active
				_this.active = (options.index !== undefined ? options.index : undefined || ((_this.active || 0) + (_this.active !== undefined ? (options.increment || 0) : 0)));

				// boundary conditions
				_this.active = _this.active < 0 ? 0 : (_this.active > Object.keys(_this.buffer).length - 1 ? Object.keys(_this.buffer).length : _this.active);

				return _this.update();
			}).then(function () {
				return audio.play();
			});
		}

		// Autocomplete
		autocomplete.targets = [
			{name: 'word',
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
							var word = data[key];
							return {
								id: key,
								main: word.content,
								rule: 'word',
							}
						});
						resolve(results);
					});
				},
				filterRequest: function (query) {
					return {tokens: {'content__startswith': query, 'type': 'word'}};
				},
				filter: {
					default: true,
					char: '/',
					key: 'forwardslash',
					input: 'Words',
					display: 'Word',
					rule: 'word',
					limit: 10,
				},
			},
			{name: 'tag',
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
							var tag = data[key];
							return {
								id: key,
								main: tag.content,
								rule: 'tag',
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
						jss.set('#{id} .tag'.format({id: autocomplete.id}), {
							'background-color': 'rgba(255,255,0,0.05)'
						});
						jss.set('#{id} .tag.active'.format({id: autocomplete.id}), {
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
					rule: 'tag',
					limit: 10,
					autocompleteOverride: true,
				},
			},
			{name: 'phrase',
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

							var sortedTokens = Object.keys(phrase.token_instances).sort(function (a,b) {
								return phrase.token_instances[a].index > phrase.token_instances[b].index ? 1 : -1;
							}).map(function (key) {
								return phrase.token_instances[key];
							}).filter(function (token) {
								return token.type !== 'tag'; // do not include tags
							});

							var main = sortedTokens.reduce(function (whole, part) {
								return '{} {}'.format(whole, part.content);
							}, ''); // set initial value to be empty string

							return {
								id: key,
								main: main.trim(),
								rule: 'phrase',
								tokens: sortedTokens,
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
						jss.set('#{id} .phrase'.format({id: autocomplete.id}), {
							'background-color': 'rgba(255,100,255,0.05)'
						});
						jss.set('#{id} .phrase.active'.format({id: autocomplete.id}), {
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
					rule: 'phrase',
					limit: 10,
				},
			},
		]
		autocomplete.unitStyle.base = function () {
			return new Promise(function(resolve, reject) {
				// base class
				jss.set('#{id} .base'.format({id: autocomplete.id}), {
					'min-height': '30px',
					'width': '100%',
					'padding': '0px',
					'padding-left': '10px',
					'text-align': 'left',
					'border-bottom': '1px solid #ccc',
				});
				jss.set('#{id} .base.active'.format({id: autocomplete.id}), {
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
						style: {
							'height': 'auto',
						},
					}
				}),

				// main container
				UI.createComponent('{base}-main-container'.format({base: base}), {
					template: UI.template('div', 'ie'),
					appearance: {
						style: {
							'left': '0px',
							'padding-top': '11px',
							'padding-bottom': '5px',
							'width': 'calc(100% - 15px)'
						},
					},
				}),

				// main wrapper
				UI.createComponent('{base}-main-wrapper'.format({base: base}), {
					template: UI.template('div', 'ie'),
					appearance: {
						style: {
							'left': '0px',
							'display': 'inline-block',
						},
					},
				}),

				// main
				UI.createComponent('{base}-main-head'.format({base: base}), {
					template: UI.template('span', 'ie'),
					appearance: {
						style: {
							'color': '#ccc',
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
							'max-width': '100%',
						},
						html: datum.main,
					},
				}),

				// index
				UI.createComponent('{base}-index'.format({base: base}), {
					template: UI.template('div', 'ie abs'),
					appearance: {
						style: {
							'width': '10px',
							'right': '5px',
							'top': '11px',
						},
						html: index,
					},
				}),

			]).then(function (unitComponents) {
				var [
					unitBase,
					unitMainContainer,
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
					// console.log(ndatum, query);
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
						unitMainHead.setAppearance({html: unitBase.datum.main.substring(0, query.length)}),
						unitMainTail.setAppearance({html: unitBase.datum.main}),
					]);
				}

				// complete promises.
				return Promise.all([
					unitMainWrapper.setChildren([
						unitMainHead,
						unitMainTail,
					]),
					unitMainContainer.setChildren([
						unitMainWrapper
					]),
				]).then(function () {
					return unitBase.setChildren([
						unitMainContainer,
						unitIndex,
					]);
				}).then(function () {
					return unitBase;
				});
			});
		}
		autocomplete.data.display.render.setMetadata = function () {
			var _this = autocomplete;
			var query = _this.data.query; // query is set no matter the status of virtual

			if (!_this.data.storage.virtual.list.length) {
				_this.currentIndex = undefined;
				return _this.search.setMetadata({query: query, complete: '', type: '', tokens: []});
			} else {
				// console.log(_this.active.datum.main, _this.currentIndex);
				if (_this.currentIndex >= _this.data.storage.virtual.list.length) {
					// console.log('here');
					return _this.control.setActive.main({index: 0}).then(function () {
						// console.log(_this.active.datum.main, _this.currentIndex);
						var _this = (_this.data.storage.virtual.list[_this.currentIndex] || {}).main;
						var type = (_this.data.storage.virtual.list[_this.currentIndex] || {}).rule;
						var tokens = ((_this.data.storage.virtual.list[_this.currentIndex] || {}).tokens || []);
						return _this.search.setMetadata({query: query, complete: complete, type: type, tokens: tokens});
					});
				} else {
					var complete = (_this.data.storage.virtual.list[_this.currentIndex] || {}).main;
					var type = (_this.data.storage.virtual.list[_this.currentIndex] || {}).rule;
					var tokens = ((_this.data.storage.virtual.list[_this.currentIndex] || {}).tokens || []);
					return _this.search.setMetadata({query: query, complete: complete, type: type, tokens: tokens});
				}
			}
		}
		autocomplete.search.setMetadata = function (metadata) {
			var _this = autocomplete.search;
			metadata = (metadata || {});
			_this.metadata = (_this.metadata || {});
			_this.metadata.query = metadata.query !== undefined ? metadata.query : (_this.metadata.query || '');
			_this.metadata.complete = metadata.complete !== undefined ? metadata.complete : _this.metadata.query;
			_this.metadata.combined = _this.metadata.query + _this.metadata.complete.substring(_this.metadata.query.length);
			_this.metadata.tokens = (metadata.tokens || []);
			_this.metadata.type = metadata.type;
			return _this.components.tail.setAppearance({html: ((_this.isComplete ? _this.metadata.complete : '') || _this.metadata.combined || _this.metadata.query || _this.filterString || _this.placeholder || '')}).then(function () {
				// reset complete
				if (_this.isComplete && _this.metadata.query !== _this.metadata.complete) {
					_this.isComplete = false;
				}

				// Should trigger caption set metadata to check for phrase and other expansions.
				// return caption action
				if (caption.isFocussed) {
					_this.metadata.target = autocomplete.target;
					return caption.control.input.editActive(_this.metadata);
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
					return autocomplete.behaviours.right().then(function () {
						// return caption.behaviours.right();
					});
				});
			}
		}

		// Caption
		caption.checks = [
			// check if tag unit matches a valid tag
			function () {
				return Util.ep();
			},

			// check capitals and make lower case
			function () {
				return Util.ep();
			},
		]
		caption.export = function () {
			var i, j, tokens = [];
			for (i=0; i<caption.data.storage.virtual.length; i++) {
				var virtual = caption.data.storage.virtual[i];
				for (j=0; j<virtual.tokens.length; j++) {
					tokens.push(virtual.tokens[j]);
				}
			}
			return transcriptionMasterController.current().then(function (current) {
				current.revisions = (current.revisions || []);
				var revisionAlreadyExists = current.revisions.filter(function (revision) {
					return JSON.stringify(revision.tokens) === JSON.stringify(tokens);
				}).length > 0;
				if (!revisionAlreadyExists) {
					current.revisions.push({
						time: new Date(),
						tokens: tokens,
					});
				}
			});
		}
		caption.styles = function () {
			// word
			jss.set('#{id} .word'.format({id: caption.id}), {
				'color': '#ccc',
			});
			jss.set('#{id} .word.active'.format({id: caption.id}), {
				'color': '#ccc',
			});

			// tag
			jss.set('#{id} .tag'.format({id: caption.id}), {
				'color': 'rgba(255,255,0,0.4)',
			});
			jss.set('#{id} .tag.active'.format({id: caption.id}), {
				'color': '05DA01',
			});

			// phrase
			jss.set('#{id} .phrase'.format({id: caption.id}), {
				'color': '#ccc',
			});
			jss.set('#{id} .phrase.active'.format({id: caption.id}), {
				'color': '#ccc',
			});

			// ghost
			jss.set('#{id} .ghost'.format({id: caption.id}), {
				'opacity': '0.5',
				'pointer-events': 'none', // It's not this, but find out what it is.
			});

			return Util.ep();
		}
		caption.unit = function () {
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

				// caption unit display
				unitBase.activate = function () {
					return unitBase.setAppearance({classes: {add: 'active'}});
				}
				unitBase.deactivate = function () {
					return unitBase.setAppearance({classes: {remove: 'active'}});
				}
				unitBase.select = function () {

				}
				unitBase.unselect = function () {

				}
				unitBase.show = function () {
					unitBase.isHidden = false;
					return unitBase.setAppearance({classes: {remove: 'hidden'}});
				}
				unitBase.hide = function () {
					unitBase.isHidden = true;
					return unitBase.setAppearance({classes: {add: 'hidden'}});
				}

				// caption unit data
				unitBase.updateUnitMetadata = function (metadata) {
					// get changes
					metadata = (metadata || {});
					unitBase.completeChanged = unitBase.complete !== metadata.complete;
					unitBase.queryChanged = unitBase.query !== metadata.query;
					unitBase.typeChanged = unitBase.type !== metadata.type;

					if (unitBase.completeChanged || unitBase.typeChanged || unitBase.queryChanged) {
						// update
						return unitBase.setUnitContent(metadata).then(function () {
							return unitBase.setMetadata(metadata);
						}).then(function () {
							// binding
							if (unitBase.tokenIndex === unitBase.phrase.focus) {
								unitBase.phrase.focusId = unitBase.id;
								return Util.ep();
							} else if (unitBase.tokenIndex > unitBase.phrase.focus) {
								return unitBase.updateBindings();
							} else {
								return Util.ep();
							}
						});
					} else {
						return Util.ep();
					}
				}
				unitBase.setUnitContent = function (metadata) {
					if (!unitBase.isFocussed) {
						return unitBase.setContent(metadata);
					} else {
						if (unitBase.completionOverride && !unitBase.isComplete) {
							unitBase.completionOverride = false;
							return unitBase.complete();
						} else {
							return Util.ep();
						}
					}
				}
				unitBase.setType = function (type) {
					type = (type || unitBase.unitType || 'word');
					return unitBase.setAppearance({classes: {add: type, remove: (unitBase.unitType !== type ? unitBase.unitType : '')}}).then(function () {
						unitBase.unitType = type;
						return Util.ep();
					});
				}
				unitBase.isLastQueryToken = function () {
					var activeUnits = unitBase.phrase.renderedUnits.filter(function (unit) {
						return !unit.isHidden;
					});
					return activeUnits[unitBase.phrase.queryTokens.length - 1].id === unitBase.id;
				}
				unitBase.isLastToken = function () {
					var activeUnits = unitBase.phrase.renderedUnits.filter(function (unit) {
						return !unit.isHidden;
					});
					return activeUnits[activeUnits.length - 1].id === unitBase.id;
				}

				// caption unit export
				unitBase.runChecks = function () {

				}

				// search bar mods
				unitBase.setMetadata = function (metadata) {
					metadata = (metadata || {});
					unitBase.metadata = (unitBase.metadata || {});
					unitBase.metadata.query = metadata.query !== undefined ? metadata.query.trim() : (unitBase.metadata.query || '');
					unitBase.metadata.complete = metadata.complete !== undefined ? metadata.complete : unitBase.metadata.query;
					unitBase.metadata.combined = unitBase.metadata.query + unitBase.metadata.complete.substring(unitBase.metadata.query.length);
					return unitBase.components.tail.setAppearance({html: ((unitBase.isComplete ? unitBase.metadata.complete : '') || unitBase.metadata.combined || unitBase.metadata.query || unitBase.filterString || unitBase.placeholder || '')}).then(function () {
						unitBase.isComplete = unitBase.metadata.query === unitBase.metadata.complete;
						return Util.ep();
					}).then(function () {
						// set type
						return unitBase.setType(metadata.type);
					});
				}
				unitBase.input = function () {
					amc.addAction({type: 'caption.input'});
					if (unitBase.isFocussed) {
						return Promise.all([
							unitBase.getContent().then(function (unitContent) {

								// temporarily update metadata to prepare for completion, even though this might be overwritten by the subsequent search.setContent.
								return unitBase.updateUnitMetadata({query: unitContent, complete: unitBase.metadata.complete}).then(function () {
									return unitBase.phrase.updateQueryFromActive().then(function (updatedQuery) {
										autocomplete.target = unitBase.phrase.id;
										return autocomplete.search.setContent({query: updatedQuery, trigger: true});
									});
								});
							}),
							counter.active.setPending(),
						]);
					} else {
						return Util.ep();
					}
				}
				unitBase.focus = function (position) {
					amc.addAction({type: 'caption.focus'});
					if (!unitBase.isFocussed) {
						caption.isFocussed = true;
						unitBase.isFocussed = true;
						autocomplete.isFocussed = true;
						return caption.control.setActive({unit: unitBase}).then(function () {
							return unitBase.setCaretPosition(position);
						}).then(function () {
							return unitBase.input();
						});
					} else {
						return Util.ep();
					}
				}
				unitBase.blur = function () {
					amc.addAction({type: 'caption.blur'});
					if (unitBase.isFocussed) {
						unitBase.isFocussed = false;
						if (caption.active.id === unitBase.id) {
							caption.isFocussed = false;
							autocomplete.isFocussed = false;
						}
						return Promise.all([
							unitBase.deactivate(),
							autocomplete.control.reset(),
						]);
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
		caption.behaviours.right = function (event) {
			if (caption.isFocussed) {
				return caption.active.isCaretInPosition('end').then(function (inPosition) {
					if (inPosition) {
						if (event) {
							event.preventDefault();
						}
						if (caption.active.phrase.isComplete) {
							return caption.next().then(function () {
								return caption.active.focus('start');
							});
						} else {
							caption.completionOverride = true;
							caption.active.completionOverride = true;
							caption.active.phrase.completionOverride = true;
							return autocomplete.behaviours.right();
						}
					} else {
						return autocomplete.behaviours.right();
					}
				});
			} else {
				return autocomplete.behaviours.right();
			}
		}
		caption.behaviours.left = function (event) {
			if (caption.isFocussed) {
				return caption.active.isCaretInPosition('start').then(function (inPosition) {
					if (inPosition) {
						if (event) {
							event.preventDefault();
						}
						return caption.previous().then(function () {
							return caption.active.focus('end');
						});
					} else {
						return Util.ep();
					}
				});
			} else {
				return Util.ep();
			}
		}
		caption.behaviours.backspace = function (event) {
			if (caption.isFocussed) {
				return caption.active.isCaretInPosition('start').then(function (inPosition) {
					if (inPosition && caption.active.metadata.query === '') {
						var noPhraseQuery = caption.active.phrase.query === '';
						if (event) {
							// prevent the delete from happening after 'caption.previous'. It is only there to 'remove' the 'space'.
							event.preventDefault();
						}
						if (noPhraseQuery) {
							// remove phrase
							var phrase = caption.active.phrase;
							if (phrase.index > 0) {
								return caption.previous().then(function () {
									return caption.active.setCaretPosition('end').then(function () {
										return caption.data.objects.phrase.remove(phrase);
									});
								});
							} else {
								return Util.ep();
							}
						} else {
							caption.active.phrase.backspaceOverride = true;
							autocomplete.target = caption.active.phrase.id;
							return autocomplete.search.setContent({query: caption.active.phrase.query.trim(), trigger: true});
						}
					} else {
						return Util.ep();
					}
				});
			} else {
				return Util.ep();
			}
		}
		caption.behaviours.enter = function () {
			// confirms current phrase, but does not complete.
			// splits phrase into sub-phrases, each containing a single token.
			if (caption.isFocussed) {
				return caption.active.isCaretInPosition('end').then(function (inPosition) {
					if (inPosition) {
						if (caption.active.isLastToken() && caption.active.isComplete) {
							var phrase = caption.active.phrase;
							return Promise.all([
								// TODO: modify this behaviour to complete only and move to next when at the end of the transcription
								counter.active.setComplete(),
								caption.data.objects.phrase.create(caption.active.phrase.index, {query: '', complete: '', tokens: [{content: '', type: 'word'}]}).then(function () {
									return caption.next().then(function () {
										return caption.active.setCaretPosition('start');
									});
								}).then(function () {
									return caption.data.objects.phrase.split(phrase);
								}),
							]);
						} else if (caption.active.isLastQueryToken()) {
							return caption.behaviours.right();
						} else {
							return Util.ep();
						}
					} else {
						return Util.ep();
					}
				});
			} else {
				return Util.ep();
			}
		}
		caption.behaviours.space = function () {
			// skip to the next token in the phrase.
			// if there is no next token, start a new phrase.
			if (caption.isFocussed) {
				return caption.active.isCaretInPosition('end').then(function (inPosition) {
					if (inPosition && caption.active.isLastQueryToken()) {
						var noMorePhrases = autocomplete.data.storage.virtual.list.filter(function (item) {return item.rule === 'phrase' && item.main !== caption.active.phrase.complete;}).length === 0;
						if (noMorePhrases && caption.active.phrase.isComplete) {
							return caption.behaviours.enter();
						} else {
							caption.active.phrase.spaceOverride = true;
							autocomplete.target	= caption.active.phrase.id;
							return autocomplete.search.setContent({query: caption.active.phrase.query + ' ', trigger: true});
						}
					} else {
						return caption.active.setCaretPosition('end');
					}
				});
			} else {
				return Util.ep();
			}
		}
		caption.behaviours.altright = function (event) {
			if (caption.isFocussed) {
				if (event) {
					event.preventDefault();
				}
				if (caption.active.phrase.isComplete) {
					return caption.next().then(function () {
						return caption.active.focus('end');
					});
				} else {
					caption.completionOverride = true;
					caption.active.completionOverride = true;
					caption.active.phrase.completionOverride = true;
					return autocomplete.behaviours.right();
				}
			} else {
				return autocomplete.behaviours.right();
			}
		}
		caption.behaviours.altleft = function (event) {
			if (caption.isFocussed) {
				if (event) {
					event.preventDefault();
				}
				return caption.previous().then(function () {
					return caption.active.focus('end');
				});
			} else {
				return Util.ep();
			}
		}
		caption.behaviours.altbackspace = function (event) {
			if (event) {
				// prevent the delete from happening after 'caption.previous'. It is only there to 'remove' the 'space'.
				event.preventDefault();
			}
			if (caption.isFocussed && caption.active.isLastQueryToken()) {
				var isOnlyToken = caption.active.phrase.tokens.length === 1;
				if (isOnlyToken) {
					// remove phrase
					var phrase = caption.active.phrase;
					if (phrase.index > 0) {
						return caption.previous().then(function () {
							return caption.active.setCaretPosition('end').then(function () {
								return caption.data.objects.phrase.remove(phrase);
							});
						});
					} else {
						return caption.active.setContent({query: ''}).then(function () {
							return caption.active.input(); // don't know trigger shouldn't work here
						});
					}
				} else {
					return caption.active.setContent({query: ''}).then(function () {
						caption.active.phrase.backspaceOverride = true;
						autocomplete.target = caption.active.phrase.id;
						var newQuery = caption.active.phrase.query.split(' ').slice(0, caption.active.phrase.queryTokens.length-1).join(' ').trim();
						return autocomplete.search.setContent({query: newQuery, trigger: true});
					});
				}
			} else {
				return Util.ep();
			}
		}

		// Counter
		counter.unit = function () {
			var unitId = '{counterId}-icon-{id}'.format({counterId: counter.id, id: Util.makeid()});
			return Promise.all([
				// base
				UI.createComponent(unitId, {
					template: UI.template('div', 'ie button border'),
					appearance: {
						style: {
							'height': '34px',
							'width': '34px',
							'float': 'left',
						},
					},
				}),

				// done glyph
				UI.createComponent('{id}-done'.format({id: unitId}), {

				}),

				// pending glyph
				UI.createComponent('{id}-pending'.format({id: unitId}), {

				}),
			]).then(function (components) {
				var [
					unitBase,
					doneGlyph,
					pendingGlyph,
				] = components;

				// methods
				unitBase.activate = function () {
					return Util.ep();
				}
				unitBase.deactivate = function () {
					return Util.ep();
				}
				unitBase.setComplete = function () {
					return Util.ep();
				}
				unitBase.setPending = function () {
					return Util.ep();
				}

				return Promise.all([

				]).then(function () {
					return unitBase.setChildren([
						doneGlyph,
						pendingGlyph,
					]);
				}).then(function () {
					return unitBase;
				})
			});
		}

		// connect
		return Promise.all([

			// base
			base.setAppearance({
				classes: ['hidden'],
			}),
			base.setState({
				defaultState: {preFn: UI.functions.hide},
				states: {
					'transcription-state': {
						fn: UI.functions.show,
					},
					'client-state': 'default',
					'role-state': 'default',
					'control-state': 'default',
				},
			}),

			// transcription master controller
			transcriptionMasterController.setState({
				states: {
					'transcription-state': {
						fn: function (_this) {
							_this.revision.start();
							return _this.update();
						}
					},
					'control-state': {
						fn: function (_this) {
							_this.revision.stop();
							return _this.reset();
						}
					},
				},
			}),

			// action master controller
			amc.setState({
				defaultState: {
					fn: function (_this) {
						_this.action.start();
						return Util.ep();
					}
				},
				states: {
					'client-state': 'default',
					'role-state': 'default',
					'control-state': 'default',
					'transcription-state': 'default',
				},
			}),

			// main panel
			mainPanel.setChildren([
				counter,
				audio,
				caption,
			]),

			// caption
			caption.setState({
				states: {
					'transcription-state': {
						fn: function (_this) {
							return _this.control.setup();
						},
					},
				},
			}),

			// autocomplete panel
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
			autocomplete.setTitle(),
			autocomplete.setSearch({mode: 'on', limit: 10, autocomplete: true}),
			autocomplete.components.search.setAppearance({
				style: {
					'border': '0px solid #fff',
					'border-bottom': '1px solid #888',
					'border-radius': '0px',
				},
			}),
			autocomplete.components.searchFilterBar.setAppearance({
				style: {
					'display': 'none',
				},
			}),
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

			// counter
			counter.setState({
				states: {
					'transcription-state': {
						fn: function (_this) {
							return _this.setup();
						}
					}
				},
			}),

		]).then(function () {
			return base.setChildren([
				mainPanel,
				autocompletePanel,
			]);
		}).then(function () {
			return base;
		});
	});
}
