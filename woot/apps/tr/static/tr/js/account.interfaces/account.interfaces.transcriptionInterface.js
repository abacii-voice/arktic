var AccountInterfaces = (AccountInterfaces || {});
AccountInterfaces.transcriptionInterface = function (id, args) {

	var autocompleteWidth = '300px';
	return UI.createComponent('transcription-base', {
		name: 'transcriptionInterface',
		template: UI.template('div', 'ie abs'),
		appearance: {
			style: {
				'height': '100%',
				'left': '60px',
				'width': 'calc(100% - 60px)',
			},
			classes: ['centred-vertically'],
		},
		children: [
			// main panel
			UI.createComponent('tb-main-panel', {
				name: 'mainPanel',
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'height': '100%',
						'left': '0px',
						'width': 'calc(100% - {width})'.format({width: autocompleteWidth}),
						'float': 'left',
					},
				},
				children: [
					// counter
					AccountComponents.counter('tb-mp-counter', {
						name: 'counter',
						appearance: {
							style: {
								'margin-top': '10px',
								'height': '80px',
								'width': '555px',
							},
						},
					}),

					// audio
					AccountComponents.audio('tb-mp-audio', {
						name: 'audio',
						appearance: {
							style: {
								'margin-top': '10px',
								'height': '60px',
								'width': '555px',
							},
						},
					}),

					// caption
					AccountComponents.captionField('tb-mp-caption', {
						name: 'caption',
						appearance: {
							style: {
								'margin-top': '10px',
								'height': '200px',
								'width': '555px',
								'border': '1px solid #888',
								'padding': '10px',
							},
							classes: ['border-radius'],
						},
					}),

					// button panel
					UI.createComponent('tb-1-mp-4-button-panel', {
						name: 'buttonPanel',
						appearance: {
							style: {
								'margin-top': '10px',
								'height': '40px',
								'width': '555px',
								'float': 'left',
							},
						},
						children: [
							// flag field
							AccountComponents.flagField('tb-mp-bp-flag-field', {name: 'flagField'}),

							// previous button
							UI.createComponent('tb-mp-bp-previous-button', {
								name: 'previousButton',
								template: UI.template('div', 'ie button border border-radius'),
								appearance: {
									style: {
										'margin-left': '10px',
										'height': '100%',
										'width': '40px',
										'float': 'left',
										'padding-top': '10px',
									},
								},
								children: [
									UI.createComponent('tb-mp-bp-pb-glyph', {
										name: 'glyph',
										template: UI.template('span', 'glyphicon glyphicon-chevron-up'),
									}),
								],
							}),

							// next/confirm button
							UI.createComponent('tb-mp-bp-next-confirm-button', {
								name: 'nextConfirmButton',
								template: UI.template('div', 'ie button border border-radius'),
								appearance: {
									style: {
										'margin-left': '10px',
										'height': '100%',
										'width': '40px',
										'float': 'left',
										'padding-top': '10px',
									},
								},
								children: [
									UI.createComponent('tb-mp-bp-cb-glyph', {
										name: 'glyph',
										template: UI.template('span', 'glyphicon glyphicon-ok'),
									}),
								],
							}),
						],
					}),
				],
			}),

			// autocomplete panel
			UI.createComponent('tb-autocomplete-panel', {
				name: 'autocompletePanel',
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'height': '100%',
						'width': autocompleteWidth,
						'float': 'left',
					},
					classes: ['centred-vertically'],
				},
				children: [
					// autocomplete
					Components.searchableList('tb-ap-autocomplete', {
						name: 'autocomplete',
						appearance: {
							style: {
								'height': '100%',
								'width': '100%',
							},
							classes: ['ie','abs'],
						},
					}),

					// autocomplete controls
					// AccountComponents.autocompleteControls('tb-2-ap-2-autocomplete-controls', {}),
				],
			}),

			// Non interface elements
			// transcription master controller
			AccountComponents.transcriptionMasterController(),
			Components.actionMasterController('transcriptionActions'),
		],
	}).then(function (base) {

		var counter = base.cc.mainPanel.cc.counter;
		var audio = base.cc.mainPanel.cc.audio;
		var caption = base.cc.mainPanel.cc.caption;
		var flags = base.cc.mainPanel.cc.buttonPanel.cc.flagField;
		var amc = base.cc.transcriptionActions;
		var tmc = base.cc.transcriptionMasterController;
		var autocomplete = base.cc.autocompletePanel.cc.autocomplete;

		// Transcription Master Controller
		tmc.data.updateThreshold = 4;
		tmc.path = function () {
			return Promise.all([
				Active.get('client'),
				Active.get('role'),
			]).then(function (results) {
				// unpack variable
				var [client_id, role_id] = results;

				// return path
				return 'user.clients.{client_id}.roles.{role_id}.active_transcription_token'.format({client_id: client_id, role_id: role_id});
			});
		}
		tmc.process = function (result) {
			var _this = tmc;
			var fragments = result.fragments;
			_this.data.totalRemaining = result.remaining;
			_this.data.tokenSize = Object.keys(fragments).length;
			return Promise.all(Object.keys(fragments).sort(function (a,b) {
				return fragments[a].index > fragments[b].index ? 1 : -1;
			}).map(function (key) {
				_this.data.buffer[key] = {
					content: fragments[key].phrase.content,
					is_available: true,
					index: Object.keys(_this.data.buffer).length,
					parent: fragments[key].parent,
					tokens: Object.keys(fragments[key].phrase.token_instances).sort(function (a,b) {
						return fragments[key].phrase.token_instances[a].index > fragments[key].phrase.token_instances[b].index ? 1 : -1;
					}).map(function (tokenKey) {
						return {
							'content': fragments[key].phrase.token_instances[tokenKey].content,
							'type': fragments[key].phrase.token_instances[tokenKey].type,
						}
					}),
				}
				return Util.ep();
			})).then(function () {
				return Util.ep(Object.keys(fragments).length !== 0);
			});
		}
		tmc.pre.interface = function () {
			var _this = tmc;
			return _this.data.current().then(function (current) {
				current.is_available = false;

				return Promise.all([
					audio.display(current),
					caption.control.input.newCaption(current),
					counter.setActive(current),
					flags.data.reset(current),
				]);
			});
		}
		tmc.setActive = function (options) {
			var _this = tmc;
			options = (options || {});

			audio.controller.isLoaded = false;
			return Promise.all([
				audio.stop(),
				audio.audioTrackCanvas.removeCut(),
			]).then(function () {
				return _this.save()
			}).then(function () {
				var previousIndex = _this.active;

				// change active
				_this.active = (options.index !== undefined ? options.index : undefined || ((_this.active || 0) + (_this.active !== undefined ? (options.increment || 0) : 0)));

				// boundary conditions
				_this.active = _this.active < 0 ? 0 : _this.active; // cannot be less than zero
				_this.active = _this.active >= Object.keys(_this.data.buffer).length ? Object.keys(_this.data.buffer).length : _this.active; // cannot be past end
				_this.active = (previousIndex > _this.active && previousIndex % _this.data.releaseThreshold === 0) ? previousIndex : _this.active; // cannot move back before threshold

				return _this.data.update().then(function () {
					return audio.play();
				});
			});
		}
		tmc.save = function () {
			var tokens = caption.export();
			var flagList = flags.export();
			var _this = tmc;
			return _this.data.current().then(function (current) {
				current.revisions = (current.revisions || []);
				var revisionAlreadyExists = current.revisions.filter(function (revision) {
					return JSON.stringify(revision.tokens) === JSON.stringify(tokens) && revision.isComplete === current.isComplete;
				}).length > 0;
				if (!revisionAlreadyExists && (!(tokens[0].complete === '') || flagList.length)) {
					current.revisions.push({
						time: new Date().toString(),
						tokens: tokens,
						isComplete: (current.isComplete || false),
						content: current.complete,
						key: Util.makeid(),
						flags: flagList,
					});
					current.latestRevision = tokens;
					current.latestFlags = flagList;
				}
			});
		}
		tmc.setComplete = function () {
			return Promise.all([
				counter.active.setComplete(),
				tmc.data.current().then(function (current) {
					current.isPending = false;
					current.isComplete = true;
					return Util.ep();
				}),
			]);
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
				filter: {
					default: true,
					char: '/',
					key: 'forwardslash',
					input: 'Words',
					display: 'Word',
					rule: 'word',
					blurb: 'Filter single words',
					limit: 10,
					request: function (query) {
						return {tokens: {'content__startswith': query, 'type': 'word'}};
					},
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
							var tag_data = {
								id: key,
								main: tag.content,
								rule: 'tag',
							}

							if (tag.shortcut) {
								if (tag.shortcut.is_active) {
									tag_data.shortcut = tag.shortcut.combo;
									Mousetrap.unbind(tag.shortcut.combo);
									Mousetrap.bind(tag.shortcut.combo, function (event) {
										event.preventDefault();
										amc.addAction({type: 'key.shortcut.{combo}'.format({combo: tag.shortcut.combo})});
										Promise.all([
											autocomplete.behaviours.shortcut(key),
										]);
									});
								}
							}

							return tag_data;
						});
						resolve(results);
					});
				},
				setStyle: function () {
					return new Promise(function(resolve, reject) {
						jss.set('#{id} .tag'.format({id: autocomplete.id}), {
							'background-color': Color.green.lightest,
						});
						jss.set('#{id} .tag.active'.format({id: autocomplete.id}), {
							'background-color': Color.green.light,
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
					blurb: 'Filter semantic tags',
					limit: 10,
					autocompleteOverride: true,
					preventIncomplete: true,
					request: function (query) {
						var dict = {};
						dict['tokens'] = {'content__startswith': query, 'type': 'tag'};
						return dict;
					},
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
				setStyle: function () {
					return new Promise(function(resolve, reject) {
						jss.set('#{id} .phrase'.format({id: autocomplete.id}), {
							'background-color': Color.purple.uberlight,
						});
						jss.set('#{id} .phrase.active'.format({id: autocomplete.id}), {
							'background-color': Color.purple.lightest,
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
					blurb: 'Filter phrases',
					limit: 10,
					request: function (query) {
						var dict = {};
						dict['phrases'] = {'content__startswith': query, 'token_count__gt': '1'};
						return dict;
					},
				},
			},
			{name: 'flag',
				path: function () {
					return Active.get('client').then(function (client) {
						return 'clients.{client_id}.flags'.format({client_id: client});
					});
				},
				process: function (data) {
					var results = Object.keys(data).map(function (key) {
						var flag = data[key];
						var flag_data = {
							id: key,
							main: flag.name,
							rule: 'flag',
						}

						if (flag.shortcut) {
							if (flag.shortcut.is_active) {
								flag_data.shortcut = flag.shortcut.combo;
								Mousetrap.unbind(flag.shortcut.combo);
								Mousetrap.bind(flag.shortcut.combo, function (event) {
									event.preventDefault();
									amc.addAction({type: 'key.shortcut.{combo}'.format({combo: flag.shortcut.combo})});
									Promise.all([
										flags.behaviours.shortcut(flag.name),
									]);
								});
							}
						}

						return flag_data;
					});
					return Util.ep(results);
				},
				setStyle: function () {
					return new Promise(function(resolve, reject) {
						jss.set('#{id} .flag'.format({id: autocomplete.id}), {
							'background-color': Color.red.light,
						});
						jss.set('#{id} .flag.active'.format({id: autocomplete.id}), {
							'background-color': Color.red.normal,
						});
						resolve();
					});
				},
				filter: {
					default: false,
					char: '>',
					key: 'right carrot',
					input: 'Flags',
					display: 'Flag',
					rule: 'flag',
					blurb: 'Filter transcription flags',
					limit: 10,
					autocompleteOverride: true,
					preventIncomplete: true,
					request: function () {
						return {};
					},
					activate: function () {
						return autocomplete.search.cc.head.model().focus();
					},
					confirm: function () {
						return flags.data.add(autocomplete.data.storage.virtual.list[autocomplete.currentIndex].main);
					},
				},
			}
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
			return UI.createComponent(base, {
				name: 'unit{index}'.format({index: index}),
				template: UI.template('div', 'ie button base'),
				appearance: {
					classes: [datum.rule],
					style: {
						'height': 'auto',
					},
				},
				children: [
					// main container
					UI.createComponent('{base}-main-container'.format({base: base}), {
						name: 'container',
						template: UI.template('div', 'ie'),
						appearance: {
							style: {
								'left': '0px',
								'padding-top': '11px',
								'padding-bottom': '5px',
								'width': 'calc(100% - 15px)'
							},
						},
						children: [
							// main wrapper
							UI.createComponent('{base}-main-wrapper'.format({base: base}), {
								name: 'wrapper',
								template: UI.template('div', 'ie'),
								appearance: {
									style: {
										'left': '0px',
										'display': 'inline-block',
									},
								},
								children: [
									// main
									UI.createComponent('{base}-main-head'.format({base: base}), {
										name: 'head',
										template: UI.template('span', 'ie'),
										appearance: {
											style: {
												'color': Color.grey.normal,
												'display': 'inline-block',
												'position': 'absolute',
											},
											html: datum.main.substring(0, query.length),
										},
									}),
									UI.createComponent('{base}-main-tail'.format({base: base}), {
										name: 'tail',
										template: UI.template('span', 'ie'),
										appearance: {
											style: {
												'display': 'inline-block',
												'max-width': '100%',
											},
											html: datum.main,
										},
									}),
								],
							}),
							UI.createComponent('{base}-main-shortcut'.format({base: base}), {
								name: 'shortcut',
								template: UI.template('span', 'ie'),
								appearance: {
									style: {
										'display': 'inline-block',
										'left': '8px',
										'opacity': '0.6',
										'top': '-4px',
									},
									html: (datum.shortcut || ''),
								},
							}),
						],
					}),
					// index
					UI.createComponent('{base}-index'.format({base: base}), {
						name: 'index',
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
				],
			}).then(function (unitBase) {

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
						return unitBase.cc.container.cc.shortcut.setAppearance({html: (ndatum.shortcut || '')});
					});
				}
				unitBase.updateQuery = function (query) {
					unitBase.query = query;
					return Promise.all([
						unitBase.cc.container.cc.wrapper.cc.head.setAppearance({html: unitBase.datum.main.substring(0, query.length)}),
						unitBase.cc.container.cc.wrapper.cc.tail.setAppearance({html: unitBase.datum.main}),
					]);
				}

				// complete promises.
				return Promise.all([

				]).then(function () {
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
			_this.metadata.tokens = (metadata.tokens || []);
			_this.metadata.type = metadata.type;
			return _this.cc.tail.setAppearance({html: ((_this.isComplete ? _this.metadata.complete : '') || _this.metadata.combined || _this.metadata.query || _this.filterString || _this.placeholder || '')}).then(function () {
				// reset complete
				if (_this.isComplete && _this.metadata.query !== _this.metadata.complete) {
					_this.isComplete = false;
				}

				// Should trigger caption set metadata to check for phrase and other expansions.
				// return caption action
				if (caption.isFocused) {
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
			return _this.cc.tail.setAppearance({html: _this.completeQuery}).then(function () {
				return _this.cc.head.setAppearance({html: _this.completeQuery});
			}).then(function () {
				if (!caption.isFocused) {
					return _this.setCaretPosition('end');
				} else {
					return Util.ep();
				}
			});
		}
		autocomplete.search.behaviours.right = function () {
			if ((autocomplete.search.isCaretInPosition('end') && !autocomplete.search.isComplete) || caption.completionOverride) {
				autocomplete.currentIndex = 0;
				caption.completionOverride = false;
				return autocomplete.search.complete().then(function () {
					return autocomplete.search.input();
				});
			} else {
				return Util.ep();
			}
		}
		autocomplete.behaviours.number = function (char) {
			var index = parseInt(char);
			if (autocomplete.data.storage.virtual.list.length === 0) {
				var numbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
				if (caption.isFocused && !caption.active.query) {
					return caption.active.setContent({query: numbers[index]}).then(function () {
						return caption.active.setCaretPosition('end').then(function () {
							return caption.active.input();
						});
					});
				} else {
					return autocomplete.search.setContent({query: numbers[index], trigger: true});
				}
			} else if (index < autocomplete.data.storage.virtual.rendered.length) {
				return autocomplete.control.setActive.main({index: index}).then(function () {
					return autocomplete.behaviours.right();
				});
			}
		}
		autocomplete.behaviours.shortcut = function (key) {
			var shortcutDatum = autocomplete.data.storage.dataset[key];
			if (caption.isFocused && !caption.active.query) {
				return caption.active.setContent({query: shortcutDatum.main}).then(function () {
					return caption.active.setCaretPosition('end').then(function () {
						return caption.active.input();
					});
				});
			} else {
				return autocomplete.search.setContent({query: shortcutDatum.main, trigger: true});
			}
		}
		autocomplete.behaviours.enter = function (event) {
			// run confirm behaviour for current filter
			var autocompleteFilter = autocomplete.data.storage.filters[autocomplete.data.filter];
			if (autocompleteFilter) {
				if (autocompleteFilter.confirm) {
					return autocompleteFilter.confirm();
				} else {
					return Util.ep();
				}
			} else {
				return Util.ep();
			}
		}

		// Caption
		caption.export = function () {
			var i, j, tokens = [];
			for (i=0; i<caption.data.storage.virtual.length; i++) {
				var virtual = caption.data.storage.virtual[i];
				for (j=0; j<virtual.tokens.length; j++) {
					tokens.push(virtual.tokens[j]);
				}
			}
			return tokens;
		}
		caption.styles = function () {
			// word
			jss.set('#{id} .word'.format({id: caption.id}), {
				'color': Color.grey.normal,
			});
			jss.set('#{id} .word.active'.format({id: caption.id}), {
				'color': Color.grey.light,
			});

			// tag
			jss.set('#{id} .tag'.format({id: caption.id}), {
				'color': Color.green.darkest,
			});
			jss.set('#{id} .tag.active'.format({id: caption.id}), {
				'color': Color.green.dark,
			});

			return Util.ep();
		}
		caption.unit = function () {
			var id = caption.data.idgen();
			return Components.search(id, {
				name: id,
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
			}).then(function (unitBase) {

				// caption unit display
				unitBase.activate = function () {
					return unitBase.setAppearance({classes: {add: 'active'}});
				}
				unitBase.deactivate = function () {
					return unitBase.setAppearance({classes: {remove: 'active'}});
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
					if (!unitBase.isFocused) {
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
				unitBase.reset = function () {
					unitBase.getContent().then(function (unitContent) {
						return unitBase.updateUnitMetadata({query: unitContent, complete: unitContent});
					});
				}
				unitBase.setMetadata = function (metadata) {
					metadata = (metadata || {});
					unitBase.metadata = (unitBase.metadata || {});
					unitBase.metadata.query = metadata.query !== undefined ? metadata.query.trim() : (unitBase.metadata.query || '');
					unitBase.metadata.complete = metadata.complete !== undefined ? metadata.complete : unitBase.metadata.query;
					unitBase.metadata.combined = unitBase.metadata.query + unitBase.metadata.complete.substring(unitBase.metadata.query.length);
					return unitBase.cc.tail.setAppearance({html: ((unitBase.isComplete ? unitBase.metadata.complete : '') || unitBase.metadata.combined || unitBase.metadata.query || unitBase.filterString || unitBase.placeholder || '')}).then(function () {
						unitBase.isComplete = unitBase.metadata.query === unitBase.metadata.complete;
						return Util.ep();
					}).then(function () {
						// set type
						return unitBase.setType(metadata.type);
					});
				}
				unitBase.input = function () {
					amc.addAction({type: 'caption.input'});
					if (unitBase.isFocused) {
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
							tmc.setPending(),
						]);
					} else {
						return Util.ep();
					}
				}
				unitBase.focus = function (position) {
					amc.addAction({type: 'caption.focus'});
					if (!unitBase.isFocused) {
						caption.isFocused = true;
						unitBase.isFocused = true;
						autocomplete.isFocused = true;
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
					if (unitBase.isFocused) {
						unitBase.isFocused = false;
						if (caption.active.id === unitBase.id) {
							caption.isFocused = false;
							autocomplete.isFocused = false;
						}
						return Promise.all([
							unitBase.deactivate(),
							unitBase.reset(),
							autocomplete.control.reset(),
						]);
					} else {
						return Util.ep();
					}
				}

				return Promise.all([
					unitBase.cc.head.setBindings({
						'focus': function (_this) {
							return unitBase.focus();
						},
					}),
				]).then(function () {
					return unitBase;
				});
			});
		}
		caption.behaviours.right = function (event) {
			if (caption.isFocused) {
				if (caption.active.isCaretInPosition('end')) {
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
			} else {
				return autocomplete.behaviours.right();
			}
		}
		caption.behaviours.left = function (event) {
			if (caption.isFocused) {
				if (caption.active.isCaretInPosition('start')) {
					if (event) {
						event.preventDefault();
					}
					return caption.previous().then(function () {
						return caption.active.focus('end');
					});
				} else {
					return Util.ep();
				}
			} else {
				return Util.ep();
			}
		}
		caption.behaviours.backspace = function (event) {
			if (caption.isFocused) {
				if (caption.active.isCaretInPosition('start') && caption.active.metadata.query === '') {
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
							if (caption.data.storage.virtual.length > 1) {
								return caption.next().then(function () {
									return caption.active.setCaretPosition('end').then(function () {
										return caption.data.objects.phrase.remove(phrase);
									});
								});
							} else {
								return Util.ep();
							}
						}
					} else {
						caption.active.phrase.backspaceOverride = true;
						autocomplete.target = caption.active.phrase.id;
						return autocomplete.search.setContent({query: caption.active.phrase.query.trim(), trigger: true});
					}
				} else {
					return Util.ep();
				}
			} else {
				return Util.ep();
			}
		}
		caption.behaviours.enter = function () {
			// confirms current phrase, but does not complete.
			// splits phrase into sub-phrases, each containing a single token.
			if (caption.isFocused) {
				// only if the caret is at the end
				if (caption.active.isCaretInPosition('end')) {
					// only if the last token is active, it is complete, and the query is not empty (must be empty complete as well)
					if (caption.active.isLastToken() && (caption.active.metadata.query !== '' || flags.data.list.length > 0)) {
						return Promise.all([
							tmc.setComplete(),
						]).then(function () {
							return caption.active.blur();
						}).then(function () {
							return tmc.behaviours.down();
						}).then(function () {
							return caption.focus();
						});
					} else {
						return Promise.all([
							caption.focus(),
							audio.play(),
						]);
					}
				} else {
					return Promise.all([
						caption.focus(),
						audio.play(),
					]);
				}
			} else {
				return Promise.all([
					caption.focus(),
					audio.play(),
				]);
			}
		}
		caption.behaviours.space = function (options) {
			options = (options || {});
			// skip to the next token in the phrase.
			// if there is no next token, start a new phrase.
			if (caption.isFocused) {
				var newForward = (caption.active.isCaretInPosition('end') && caption.active.isLastQueryToken())
				var newBackward = (caption.active.isCaretInPosition('start') && caption.active.index === 0)

				if (newForward || newBackward) {
					var newIndex = newForward ? caption.active.phrase.index + 1 : 0;
					var moveMethod = newForward ? caption.next : caption.previous;

					var phrase = caption.active.phrase;
					return autocomplete.control.setFilter().then(function () {
						return caption.data.objects.phrase.create(newIndex, {query: '', complete: '', tokens: [{content: '', type: 'word'}]}).then(function () {
							return moveMethod().then(function () {
								return caption.active.setCaretPosition('start');
							});
						}).then(function () {
							return caption.data.objects.phrase.split(phrase);
						});
					});
				} else {
					return caption.active.setCaretPosition('end')
				}
			} else {
				return Util.ep();
			}
		}
		caption.behaviours.altright = function (event) {
			if (caption.isFocused) {
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
			if (caption.isFocused) {
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
			if (caption.isFocused && caption.active.isLastQueryToken()) {
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
		caption.behaviours.ctrlbackspace = function (event) {
			// remove entire caption
			return caption.control.input.newCaption().then(function () {
				return caption.focus();
			});
		}

		// Counter
		counter.updateHeader = function () {
			var _this = counter;

			// update remaining
			if (_this.serverRemaining !== tmc.data.totalRemaining) {
				if (_this.offset !== 0) {
					_this.offset = tmc.data.updateThreshold - 2;
				}
				_this.serverRemaining = tmc.data.totalRemaining;
			}
			_this.remaining = _this.serverRemaining + _this.offset + tmc.data.tokenSize;

			var _this = counter;
			return Promise.all([
				_this.sessionValue.setAppearance({html: _this.count}),
				_this.remainingValue.setAppearance({html: _this.remaining}),
			]);
		}
		counter.unit = function () {
			var unitId = '{counterId}_icon_{id}'.format({counterId: counter.id, id: Util.makeid()});
			return UI.createComponent(unitId, {
				name: unitId,
				template: UI.template('div', 'ie unit border-radius'),
				appearance: {
					style: {
						'height': '35px',
						'width': '35px',
						'float': 'left',
						'margin-left': '10px',
						'margin-bottom': '10px',
						'box-sizing': 'border-box',
					},
				},
				children: [
					// done glyph
					UI.createComponent('{id}-done'.format({id: unitId}), {
						name: 'done',
						template: UI.template('div', 'ie hidden'),
						appearance: {
							style: {
								'height': '100%',
								'width': '100%',
								'background-color': Color.green.normal,
							},
						},
						children: [
							UI.createComponent('{id}-done-glyphicon'.format({id: unitId}), {
								name: 'glyph',
								template: UI.template('span', 'glyphicon glyphicon-ok centred'),
								appearance: {
									style: {
										'font-size': '15px',
										'color': Color.grey.uberlight,
										'top': '10px',
										'left': '9px',
									},
								},
							}),
						],
					}),

					// pending glyph
					UI.createComponent('{id}-pending'.format({id: unitId}), {
						name: 'pending',
						template: UI.template('div', 'ie hidden'),
						appearance: {
							style: {
								'height': '100%',
								'width': '100%',
								'background-color': Color.grey.uberlight,
							},
						},
					}),
				],
			}).then(function (unitBase) {

				// methods
				unitBase.isComplete = false;
				unitBase.isPending = false;
				unitBase.activate = function () {
					return unitBase.setAppearance({classes: {add: 'active'}});
				}
				unitBase.deactivate = function () {
					return unitBase.setAppearance({classes: {remove: 'active'}});
				}
				unitBase.setComplete = function () {
					unitBase.isComplete = true;
					unitBase.isPending = false;
					return Promise.all([
						unitBase.setAppearance({classes: {add: 'complete', remove: 'pending'}}),
						unitBase.cc.done.setAppearance({classes: {remove: 'hidden'}}),
						unitBase.cc.pending.setAppearance({classes: {add: 'hidden'}}),

						// also increment the counter - must happen
						counter.increment(),
					]);
				}
				unitBase.setPending = function () {
					var previousComplete = unitBase.isComplete;
					unitBase.isComplete = false;
					unitBase.isPending = true;
					return Promise.all([
						unitBase.setAppearance({classes: {remove: 'complete', add: 'pending'}}),
						unitBase.cc.done.setAppearance({classes: {add: 'hidden'}}),
						unitBase.cc.pending.setAppearance({classes: {remove: 'hidden'}}),
					]).then(function () {
						if (previousComplete) {
							// only if the unit was previously complete
							return counter.decrement();
						}
					});
				}
				unitBase.setClear = function () {
					unitBase.isComplete = false;
					unitBase.isPending = false;
					return Promise.all([
						unitBase.setAppearance({classes: {remove: ['complete', 'pending']}}),
						unitBase.cc.done.setAppearance({classes: {add: 'hidden'}}),
						unitBase.cc.pending.setAppearance({classes: {add: 'hidden'}}),
					]);
				}

				return Promise.all([

				]).then(function () {
					return unitBase;
				})
			});
		}

		// Flags
		flags.behaviours.shortcut = function (name) {
			return flags.data.add(name);
		}
		flags.unit = function (name) {
			var unitId = '{base}-{id}'.format({base: flags.id, id: Util.makeid()});

			return UI.createComponent(unitId, {
				name: unitId,
				template: UI.template('div', 'ie border border-radius'),
				appearance: {
					style: {
						'height': '30px',
						'margin-top': '4px',
						'display': 'inline-block',
						'margin-right': '5px',
						'background-color': Color.red.light,
					},
				},
				children: [
					// unit content
					UI.createComponent('{id}-content'.format({id: unitId}), {
						name: 'content',
						template: UI.template('span', 'ie'),
						appearance: {
							html: name,
							style: {
								'float': 'left',
								'margin-top': '5px',
								'margin-right': '5px',
								'margin-left': '10px',
							},
						}
					}),
					// unit button
					UI.createComponent('{id}-button'.format({id: unitId}), {
						name: 'button',
						template: UI.template('div', 'ie button'),
						appearance: {
							style: {
								'height': '40px',
								'width': '30px',
								'float': 'left',
								'padding-top': '6px',
							},
						},
						children: [
							UI.createComponent('{id}-glyph'.format({id: unitId}), {
								name: 'glyph',
								template: UI.template('span', 'glyphicon glyphicon-remove'),
							}),
						],
					}),
				],
			}).then(function (unitBase) {

				return Promise.all([
					unitBase.cc.button.setBindings({
						'click': function (_this) {
							return flags.data.remove(unitBase.index);
						},
					}),
				]).then(function () {
					return unitBase;
				});
			});
		}

		// connect
		return Promise.all([

			// base
			base.setAppearance({
				classes: ['hidden'],
			}),
			base.setState({
				defaultState: {preFn: UI.functions.hide()},
				states: {
					'transcription-state': {
						preFn: function () {
							// KEYBINDINGS
							Mousetrap.bind('up', function (event) {
								event.preventDefault();
								amc.addAction({type: 'key.up'});
								if (autocomplete.isFocused || caption.isFocused) {
									Promise.all([
										autocomplete.behaviours.up(),
									]);
								} else {
									Promise.all([
										tmc.behaviours.up(),
									]);
								}
							});
							Mousetrap.bind('down', function (event) {
								event.preventDefault();
								amc.addAction({type: 'key.down'});
								if (autocomplete.isFocused || caption.isFocused) {
									Promise.all([
										autocomplete.behaviours.down(),
									]);
								} else {
									Promise.all([
										tmc.behaviours.down(),
									]);
								}
							});
							Mousetrap.bind('alt+up', function (event) {
								event.preventDefault();
								amc.addAction({type: 'key.alt+up'});
								caption.active.blur().then(function () {
									return tmc.behaviours.up();
								}).then(function () {
									return caption.focus();
								});
							});
							Mousetrap.bind('alt+down', function (event) {
								event.preventDefault();
								amc.addAction({type: 'key.alt+down'});
								caption.active.blur().then(function () {
									return tmc.behaviours.down();
								}).then(function () {
									return caption.focus();
								});
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
								event.preventDefault();
								amc.addAction({type: 'key.enter'});
								if (caption.isFocused) {
									Promise.all([
										caption.behaviours.enter(),
									]);
								} else if (autocomplete.isFocused) {
									Promise.all([
										autocomplete.behaviours.enter(),
									]);
								}
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
							Mousetrap.bind('ctrl+backspace', function (event) {
								event.preventDefault();
								amc.addAction({type: 'key.ctrl+backspace'});
								Promise.all([
									caption.behaviours.ctrlbackspace(event),
								]);
							});
							Mousetrap.bind('alt+shift+backspace', function (event) {
								amc.addAction({type: 'key.alt+shift+backspace'});
								Promise.all([
									flags.data.removeLast(),
								]);
							});
							Mousetrap.bind('ctrl+shift+backspace', function (event) {
								event.preventDefault();
								amc.addAction({type: 'key.ctrl+shift+backspace'});
								Promise.all([
									flags.data.removeAll(),
								]);
							});
							Mousetrap.bind('space', function (event) {
								amc.addAction({type: 'key.space'});
								if (caption.isFocused) {
									event.preventDefault();
								}
								Promise.all([
									caption.behaviours.space({checkNoMorePhrases: true}),
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
							Mousetrap.bind('ctrl+space', function (event) {
								if (caption.isFocused) {
									event.preventDefault();
								}
								amc.addAction({type: 'key.ctrl+space'});
								Promise.all([
									caption.behaviours.space(),
								]);
							});
							Mousetrap.bind('tab', function (event) {
								event.preventDefault();
								amc.addAction({type: 'key.tab'});
								Promise.all([
									audio.play(),
									autocomplete.control.setFilter().then(function () {
										return caption.focus();
									}),
								]);
							});
							Mousetrap.bind('alt+tab', function (event) {
								event.preventDefault();
								amc.addAction({type: 'key.alt+tab'});
								Promise.all([
									autocomplete.focus(),
								]);
							});
							return Util.ep();
						},
						fn: UI.functions.show(),
					},
					'client-state': 'default',
					'role-state': 'default',
					'control-state': 'default',
					'-transcription-project-complete-state': 'default',
				},
			}),

			// transcription master controller
			tmc.setState({
				states: {
					'control-state': {
						fn: function (_this) {
							_this.revision.stop();
							return Util.ep();
						}
					},
					'transcription-state': {
						fn: function (_this) {
							_this.revision.start();
							return _this.data.update();
						}
					},
				},
			}),

			// action master controller
			amc.setState({
				states: {
					'control-state': {
						fn: function (_this) {
							_this.action.stop();
							return Util.ep();
						}
					},
					'transcription-state': {
						fn: function (_this) {
							_this.action.start();
							return Util.ep();
						}
					},
				},
			}),

			// button panel

			// main panel

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

			// autocomplete
			autocomplete.cc.searchFilterBar.cc.filterButton.setState({
				stateMap: {
					'transcription-state': '-transcription-state-filter',
					'-transcription-state': '-transcription-state-filter',
					'-transcription-state-filter': '-transcription-state',
				},
				states: {
					'transcription-state': {},
				}
			}),
			autocomplete.cc.list.setState({
				states: {
					'transcription-state': {
						classes: {remove: 'hidden'},
					},
					'-transcription-state': {
						classes: {remove: 'hidden'},
					},
					'-transcription-state-filter': {
						classes: {add: 'hidden'},
					},
				},
			}),
			autocomplete.cc.filter.setState({
				states: {
					'transcription-state': {
						classes: {add: 'hidden'},
					},
					'-transcription-state': {
						classes: {add: 'hidden'},
					},
					'-transcription-state-filter': {
						classes: {remove: 'hidden'},
					},
				},
			}),
			autocomplete.setTitle(),
			autocomplete.setSearch({mode: 'on', limit: 10, autocomplete: true}),
			autocomplete.search.setAppearance({
				style: {
					'border': '0px solid #fff',
					'border-bottom': '1px solid #888',
					'border-radius': '0px',
				},
			}),
			autocomplete.cc.searchFilterBar.setAppearance({
				style: {
					'display': 'block',
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

			// flags add button binding
			flags.cc.addButton.setBindings({
				'click': function (_this) {
					amc.addAction({type: 'click.flagAddButton'});
					return autocomplete.control.setFilter('flag').then(function () {
						return autocomplete.search.cc.head.model().focus();
					});
				},
			}),

			// buttons
			base.cc.mainPanel.cc.buttonPanel.cc.previousButton.setBindings({
				'click': function (_this) {
					amc.addAction({type: 'click.previousButton'});
					return tmc.behaviours.up();
				},
			}),
			base.cc.mainPanel.cc.buttonPanel.cc.nextConfirmButton.setBindings({
				'click': function (_this) {
					amc.addAction({type: 'click.confirmButton'});
					return tmc.setComplete().then(function () {
						if (caption.isFocused) {
							return caption.active.blur();
						} else {
							return Util.ep();
						}
					}).then(function () {
						return tmc.behaviours.down();
					}).then(function () {
						return caption.focus();
					});
				},
			}),

		]).then(function () {
			return base;
		});
	});
}
