// initialise
var AccountComponents = (AccountComponents || {});

// caption field
AccountComponents.captionField = function (id, args) {
	// CAPTION FIELD
	// A content panel with bindings for adding and removing tokens.
	// contenteditable is set to 'true' with appropriate bindings.
	return Promise.all([
		// base
		UI.createComponent(id, {
			template: UI.template('div', 'ie'),
			appearance: args.appearance,
		}),

		// content
		UI.createComponent('{id}-content'.format({id: id}), {

		}),
	]).then(function (components) {
		var [
			base,
			content,
		] = components;

		base.defaultUnitStyle = function () {

		}

		// data
		base.data = {

			// variables
			minimumPhraseLength: 3,
			currentId: undefined, // the id of the current transcription

			// datasets
			storage: {
				virtual: [], // stores data in order
			},

			// objects
			objects: {
				phrase: {
					// base
					Phrase: function () {
						// methods
						this.update = function (metadata) {
							// apply rules to metadata
							metadata.complete = metadata.complete || metadata.query || '';
							metadata.queryTokens = metadata.query.split(' ');
							metadata.completeTokens = metadata.complete.split(' ');
							metadata.tokens = metadata.tokens || [];
							metadata.tokens = metadata.completeTokens.map(function (completeToken, index) {
								return {
									complete: completeToken,
									query: (metadata.queryTokens[index] || ''),
									type: ((metadata.tokens[index] || {}).type || metadata.type || 'word'),
								}
							});

							// update complete changed
							var _this = this;
							_this.completeChanged = (_this.complete !== metadata.complete);
							_this.query = metadata.query || (_this.query || metadata.query);
							_this.queryTokens = _this.query.split(' ');

							_this.complete = metadata.complete;
							_this.focus = metadata.queryTokens.length - 1;
							_this.focus = _this.focus >= metadata.completeTokens.length ? metadata.completeTokens.length - 1 : _this.focus;
							_this.isComplete = _this.query === _this.complete;
							_this.tokens = metadata.tokens;

							var idMatches = (_this.id === metadata.target) || !_this.id;
							if ((_this.completeChanged || _this.completionOverride || _this.spaceOverride || _this.backspaceOverride) && idMatches) {
								// render to tokens
								return _this.render();
							} else {
								return Util.ep();
							}
						}
						this.render = function () {
							// based on index, start creating tokens in caption content.
							var _this = this;

							// 1. rendered units first
							_this.renderedUnits = (_this.renderedUnits || []);
							_this.currentAfter = undefined;
							if (!base.lock) {
								base.lock = true;
								return Promise.all(_this.renderedUnits.map(function (renderedUnit, index) {
									var token = _this.tokens[index];
									renderedUnit.isReserved = token === undefined;
									return renderedUnit.updateUnitMetadata(token).then(function () {
										if (renderedUnit.isReserved) {
											return renderedUnit.hide();
										} else {
											return Util.ep();
										}
									});
								})).then(function () {

									// 2. next render units for the rest of the tokens if necessary.
									if (_this.tokens.length > _this.renderedUnits.length) {
										return Promise.ordered(_this.tokens.slice(_this.renderedUnits.length).map(function (token, extraIndex) {
											return function () {
												return _this.newUnit(extraIndex, token);
											}
										}));
									} else {
										return Util.ep();
									}
								}).then(function () {

									// 3. render until the default unit limit
									var difference = base.data.minimumPhraseLength-_this.renderedUnits.length;
									if (difference > 0) {
										return Promise.ordered(Array.range(difference).map(function (extraIndex) {
											return function () {
												return _this.newUnit(extraIndex);
											}
										}));
									} else {
										return Util.ep();
									}
								}).then(function () {

									// 4. show what is hidden
									return _this.show();
								}).then(function () {

									// 5. focus last token if just completed.
									if (_this.completionOverride) {
										_this.completionOverride = false;
										return _this.lastUnit().focus('end');
									} else if (_this.spaceOverride) {
										_this.spaceOverride = false;
										return _this.renderedUnits[_this.focus].focus('end');
									} else  if (_this.backspaceOverride) {
										_this.backspaceOverride = false;
										return _this.renderedUnits[_this.focus].focus('end');
									} else {
										return Util.ep();
									}
								}).then(function () {
									base.lock = false;
									return Util.ep();
								});
							} else {
								return Util.ep();
							}
						}
						this.show = function () {
							var _this = this;
							if (!base.showOverride) {
								return Promise.all(_this.renderedUnits.filter(function (unit) {
									return unit.isHidden && !unit.isReserved;
								}).map(function (unit) {
									return unit.show();
								}));
							} else {
								return Util.ep();
							}
						}
						this.newUnit = function (extraIndex, token) {
							var _this = this;
							var trueIndex = _this.renderedUnits.length + extraIndex;
							var defaultAfter = _this.renderedUnits.length ? _this.renderedUnits[_this.renderedUnits.length-1].id : undefined; // not '' lol
							return base.unit().then(function (unit) {
								unit.after = base.globalAfter || _this.currentAfter || defaultAfter;
								unit.phrase = _this;
								unit.isReserved = token === undefined;
								_this.renderedUnits.push(unit);
								return unit.updateUnitMetadata(token).then(function () {
									return unit.hide().then(function () {

										return content.setChildren([unit]);
									});
								}).then(function () {
									_this.currentAfter = unit.id;
									base.globalAfter = undefined;
									return Util.ep();
								});
							});
						}
						this.updateQueryFromActive = function () {
							var _this = this;
							var tokenIndex = _this.renderedUnits.indexOf(base.active);
							_this.query = _this.tokens.slice(0, _this.focus+1).map(function (token, index) {
								if (index === tokenIndex) {
									token.query = base.active.metadata.query;
									return base.active.metadata.query;
								} else {
									return token.query;
								}
							}).join(' ');

							return Util.ep(_this.query);
						}
						this.completeQuery = function () {
							var _this = this;
							_this.query = _this.tokens.map(function (token) {
								token.query = token.complete;
								return token.complete;
							}).join(' ');

							return Util.ep(_this.query);
						}
						this.lastUnit = function () {
							if (this.renderedUnits) {
								var activeUnits = this.renderedUnits.filter(function (unit) {
									return !unit.isHidden;
								});
								return activeUnits[activeUnits.length-1];
							}
						}
						this.firstUnit = function () {
							if (this.renderedUnits) {
								var activeUnits = this.renderedUnits.filter(function (unit) {
									return !unit.isHidden;
								});
								return activeUnits[0];
							}
						}
						this.focus = function (position) {
							var _this = this;
							position = position || 'end';
							if (position === 'end') {
								// focus the end of the last Focusable unit
								return _this.lastUnit().focus('end');
							} else if (position === 'start') {
								// focus the start of the first Focusable unit
								return _this.firstUnit().focus('start');
							} else {
								return Util.ep();
							}
						}
					},
					create: function (index, metadata) {
						var phrase = new base.data.objects.phrase.Phrase();
						base.globalAfter = base.data.storage.virtual.length && base.data.storage.virtual[index] ? base.data.storage.virtual[index].lastUnit().id : undefined;
						base.data.storage.virtual.splice(index, 0, phrase);
						return phrase.update(metadata).then(function () {
							return base.data.objects.phrase.renumber();
						}).then(function () {
							phrase.id = Util.makeid();
							return Util.ep(phrase);
						});
					},
					remove: function (phrase) {
						return Promise.all(phrase.renderedUnits.map(function (renderedUnit) {
							return content.removeChild(renderedUnit.id);
						})).then(function () {
							base.data.storage.virtual.splice(phrase.index, 1);
							return Util.ep();
						});
					},
					split: function (phrase) {
						var activeUnits = phrase.renderedUnits.filter(function (unit) {
							return !unit.isHidden;
						});
						return Promise.all(phrase.renderedUnits.filter(function (unit) {
							return unit.isHidden;
						}).map(function (unit) {
							return content.removeChild(unit.id);
						})).then(function () {
							base.data.storage.virtual.splice(phrase.index, 1);
							return Util.ep();
						}).then(function () {
							var position = phrase.index - 1;
							return Promise.ordered(phrase.tokens.map(function (token, index) {
								return function () {
									var unit = activeUnits[index];
									var newPhrase = new base.data.objects.phrase.Phrase();
									newPhrase.renderedUnits = [unit];
									unit.phrase = newPhrase;
									base.data.storage.virtual.splice(position+index, 0, newPhrase);
									return newPhrase.update(token).then(function () {
										newPhrase.id = Util.makeid();
										return Util.ep();
									}).then(function () {
										return base.data.objects.phrase.renumber();
									});
								}
							}));
						});
					},
					renumber: function () {
						return Promise.all(base.data.storage.virtual.map(function (phrase, index) {
							phrase.index = index;
							return Util.ep();
						}));
					},
				},
			},

			// methods
			idgen: function () {
				return '{base}-{id}'.format({base: base.id, id: Util.makeid()});
			},
		}

		// control
		base.control = {
			setup: function () {
				// set styles - nothing else for now
				// NOW - may be something to do here. blank phrases? abandon?
				return base.styles();
			},
			setActive: function (options) {
				options = options || {};

				var previousUnit = base.active;
				if (options.unit) {
					base.active = options.unit;
				} else {
					// construct array of active units
					var visibleChildren = content.children.filter(function (unit) {
						return !unit.isHidden;
					});
					var newIndex = visibleChildren.indexOf(base.active) + (options.increment || 0);

					// boundary conditions
					newIndex = newIndex > 0 ? (newIndex < visibleChildren.length - 1 ? newIndex : visibleChildren.length - 1) : 0;

					// get new active
					base.active = visibleChildren[newIndex];
				}

				return base.control.deactivate(previousUnit).then(function () {
					return base.active.activate();
				});
			},
			deactivate: function (previousUnit) {
				if (previousUnit && previousUnit.id !== base.active.id) {
					return previousUnit.deactivate();
				} else {
					return Util.ep();
				}
			},
			input: {
				newCaption: function (metadata) {
					metadata = (metadata || {});
					base.data.currentId = metadata.parent;
					base.showOverride = true;

					return Promise.all(base.data.storage.virtual.map(function (phrase) {
						return base.data.objects.phrase.remove(phrase);
					})).then(function () {
						base.data.storage.virtual = [];
						return Promise.ordered((metadata.latestRevision || metadata.tokens || []).map(function (token, index) {
							return function () {
								return base.data.objects.phrase.create(index, {query: (token.content || token.query), complete: (token.content || token.complete), tokens: [token]});
							}
						})).then(function () {
							// if there is no caption, create an empty phrase.
							if ((metadata.latestRevision || metadata.tokens || []).length === 0) {
								return base.data.objects.phrase.create(0, {query: '', complete: ''});
							}
						});
					}).then(function () {
						base.showOverride = false;
						return Promise.all(base.data.storage.virtual.map(function (phrase) {
							return phrase.show();
						}));
					});
				},
				editActive: function (metadata) {
					return base.active.phrase.update(metadata);
				},
			},
			runChecks: function () {

			},
		}

		base.next = function () {
			return base.control.setActive({increment: 1});
		}
		base.previous = function () {
			return base.control.setActive({increment: -1});
		}
		base.focus = function () {
			// construct array of active units
			var visibleChildren = content.children.filter(function (unit) {
				return !unit.isHidden;
			});
			var lastIndex = visibleChildren.length - 1;

			// get new active
			base.active = visibleChildren[lastIndex];
			return base.active.activate().then(function () {
				return base.active.focus('end');
			});
		}

		base.behaviours = {};

		return Promise.all([
			base.setBindings({
				'click': function (_this) {
					return _this.focus();
				},
			}),
		]).then(function () {
			return base.setChildren([content]);
		}).then(function () {
			return base;
		});
	});
}
