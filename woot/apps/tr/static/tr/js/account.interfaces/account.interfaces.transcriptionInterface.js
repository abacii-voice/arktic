// LIST OF CHANGES
// ##### version 1:
// 1. New component glyph
// 2. Autocomplete targets changed to object
// 3. Make mousetrap fundamental to changing states. Anything can register a shortcut anywhere.
// 4. Action controller should be more pervasive, more tightly integrated.
// 5.

// ACTIONS:
// 1. Something is defined below for connections, but does not make any, so move it to the top.
// 2. Move all setState, setBinding up out of promises.
// 3. Redo component paths
// 4. Each component needs a consistent API (ways of getting and setting useful data about it)
// 5. Do I need a way for parents to register children to hop over containers?

// WHAT IS THIS FOR? CAN IT BE GENERALISED?
// Need to search for a series of consistent external controls for common functions.
// 1. caption.completionOverride
// 2. caption.control.input
// 3. audio.display
// 4. flags.data.reset
// 5. audio.controller
// 6. autocomplete.currentIndex
// 7. autocomplete.data.storage.virtual.list.length
// 8. caption.active
// 9. autocomplete.data.storage.virtual.rendered.length
// 10. autocomplete.control
// 11. unitBase.completeChanged
// 12. unitBase.queryChanged
// 13. unitBase.typeChanged
// 14. autocomplete.data.storage.filters[autocomplete.data.filter] WTF
// 15. metadata, query, complete, combined
// 16.

var AccountInterfaces = (AccountInterfaces || {});
AccountInterfaces.transcriptionInterface = function () {
	return UI.createComponent('transcriptionInterface', {
		template: 'div.ie.abs',
		children: [
			UI.createComponent('main', {
				ui: {
					template: 'div.ie',
				},
				children: [
					AccountComponents.counter('counter'),
					AccountComponents.audio('audio'),
					AccountComponents.captionField('caption', {
						ui: {
							state: {
								states: [
									UI.createState('transcription', {
										fn: function (_this) {
											return _this.control.setup();
										},
									}),
								],
							},
						},
					}),
					UI.createComponent('buttons', {
						ui: {
							template: 'div.ie',
						},
						children: [
							AccountComponents.flagField('flags'),
							Components.button('previous', {
								children: [
									Components.glyph('glyph', {
										options: {
											set: 'glyphicon',
											content: 'glyphicon-chevron-up',
										},
									}),
								],
							}),
							Components.button('confirm', {
								children: [
									Components.glyph('glyph', {
										options: {
											set: 'glyphicon',
											content: 'glyphicon-ok',
										},
									}),
								],
							}),
						],
					}),
				],
			}),
			UI.createComponent('autocomplete', {
				ui: {
					template: 'div.ie',
				},
				children: [
					Components.searchableList('list', {
						options: {
							title: false,
							search: {
								placeholder: 'Search...',
							},
							mode: 'autocomplete',
							targets: {
								word: {
									path: function () {
										return Active.get({client: 'client', project: 'project'}).then(function (result) {
											return `clients.${result.client}.projects.${result.project}.dictionary.tokens`;
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
								tag: {
									path: function () {
										return Active.get({client: 'client', project: 'project'}).then(function (result) {
											return `clients.${result.client}.projects.${result.project}.dictionary.tokens`;
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
											return {tokens: {'content__startswith': query, 'type': 'tag'}};
										},
									},
								},
								phrase: {
									path: function () {
										return Active.get({client: 'client', project: 'project'}).then(function (result) {
											return `clients.${result.client}.projects.${result.project}.dictionary.phrases`;
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

												return sortedTokens.map(function (token) {
													return token.content;
												}).join(' ');

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
											return {phrases: {'content__startswith': query, 'token_count__gt': '1'}};
										},
									},
								},
								flag: {
									path: function () {
										return Active.get('client').then(function (client) {
											return `clients.${client}.flags`;
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
														Promise.all([
															flags.behaviours.shortcut(flag.name),
														]);
													});
												}
											}

											return flag_data;
										});
										return _.ep(results);
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
										activate: function (_this) {
											return _this.get('search').focus();
										},
									},
								},
							},
						},
					}),
				],
			}),
			UI.createComponent('complete', {
				// Project has been completed. Please return to you homes.
			}),

			// Non interface elements
			AccountComponents.transcriptionMasterController('tmc', {
				ui: {
					state: {
						states: [
							UI.createState('control', {
								fn: function (_this) {
									_this.revision.stop();
									return _.ep();
								},
							}),
							UI.createState('transcription', {
								fn: function (_this) {
									_this.revision.start();
									return _.ep();
								},
							}),
						],
					},
				},
				options: {

				},
				data: {
					update: 4,
				},
			}),
		],
	}).then(function (base) {

		var counter = base.get('main.counter');
		var audio = base.get('main.audio');
		var caption = base.get('main.caption');
		var flags = base.get('main.buttons.flags');
		var tmc = base.get('tmc');
		var autocomplete = base.get('autocomplete.list');

		// Transcription Master Controller
		// MOVE TO MAIN CLASS
		tmc.path = function () {
			return Active.get({client: 'client', role: 'role'}).then(function (result) {
				return `user.clients.${result.client}.roles.${result.role}.active_transcription_token`;
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

		// THIS CAN STAY HERE
		tmc.pre.interface = function () {
			var _this = tmc;
			return _this.data.current().then(function (current) {
				current.isAvailable = false;

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
			var _this = tmc;
			var tokens = caption.export();
			var flagList = flags.export();
			return _this.data.current().then(function (current) {
				current.revisions = (current.revisions || []);
				var revisionAlreadyExists = current.revisions.filter(function (revision) {
					return _.json(revision.tokens) === _.json(tokens) && revision.isComplete === current.isComplete;
				}).length > 0;
				if (!revisionAlreadyExists && (!(tokens[0].complete === '') || flagList.length)) {
					current.revisions.push({
						time: new Date().toString(),
						tokens: tokens,
						isComplete: (current.isComplete || false),
						content: current.complete,
						key: _.name(),
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
		autocomplete.options.targets.flag.filter.confirm = function () {

		}
		autocomplete.options.sort = _.sort.usageAlpha();

		var search = autocomplete.get('search');
		search.setMetadata = function (metadata) {
			var _this = search;
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
		search.complete = function () {
			var _this = search;
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
		search.behaviours.right = function () {
			var _this = search;
			if ((_this.isCaretInPosition('end') && !_this.isComplete) || caption.completionOverride) {
				autocomplete.currentIndex = 0;
				caption.completionOverride = false;
				return _this.complete().then(function () {
					return _this.input();
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
		caption.unit = function () {
			var id = caption.data.idgen();
			return Components.search(id).then(function (unitBase) {

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
