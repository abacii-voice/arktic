// These components are larger abstractions built on the back of the generalised component system.

var Components = {

	// CONTENT PANEL
	// Nested panel components meant to hide scroll bar.
	contentPanel: function (id, args) {
		// config
		args.appearance = (args.appearance || {
			style: {
				'width': '100%',
			},
		});

		// set up components
		return Promise.all([
			// base component
			UI.createComponent('{id}'.format({id: id}), {
				template: UI.template('div', 'ie'),
				appearance: args.appearance,
			}),

			// wrapper
			UI.createComponent('{id}-wrapper'.format({id: id}), {
				name: 'wrapper',
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'height': '100%',
						'width': 'calc(100% + 20px)',
						'padding-right': '20px',
						'overflow-y': 'scroll',
					}
				},
			}),

		]).then(function (components) {
			// unpack components
			var [
				base,
				wrapper,
			] = components;

			// set up promises to be completed before returning the base.

			// logic, bindings, etc.
			base.setWrapper = base.setChildren;
			base.setChildren = function (children) {
				return wrapper.setChildren(children);
			}
			base.remove = function (id) {
				return wrapper.removeChild(id);
			}

			// behaviours
			base.behaviours = {
				up: function () {

				},
				down: function () {

				},
				left: function () {

				},
				right: function () {

				},
				enter: function () {

				},
			}

			// complete promises.
			return Promise.all([

			]).then(function (results) {
				return base.setWrapper([wrapper]);
			}).then(function () {
				return base;
			});
		});
	},

	// SEARCH INPUT
	// Formatted input field with events for input and key presses.
	search: function (id, args) {
		// config
		args.appearance = (args.appearance || {
			style: {
				'width': '100%',
				'height': '40px',
			},
		});

		// set up components
		return Promise.all([
			// base component
			UI.createComponent('{id}'.format({id: id}), {
				template: UI.template('div', 'ie input border border-radius'),
				appearance: args.appearance,
			}),

			// head
			UI.createComponent('{id}-head'.format({id: id}), {
				template: UI.template('div', 'ie head mousetrap'),
				appearance: {
					properties: {
						'contenteditable': 'true',
					},
				},
			}),

			// tail
			UI.createComponent('{id}-tail'.format({id: id}), {
				template: UI.template('div', 'ie tail'),
			}),

			// space
			UI.createComponent('{id}-space'.format({id: id}), {
				template: UI.template('div', 'ie tail'),
				appearance: {
					html: '&nbsp;',
				},
			}),

		]).then(function (components) {
			// unpack components
			var [
				base,
				head,
				tail,
				space,
			] = components;

			// variables
			base.isFocussed = false;

			// logic, bindings, etc.
			base.setMetadata = function (metadata) {
				metadata = (metadata || {});
				base.metadata = (base.metadata || {});
				base.metadata.query = metadata.query !== undefined ? metadata.query : (base.metadata.query || '');
				base.metadata.complete = metadata.complete !== undefined ? metadata.complete : base.metadata.query;
				base.metadata.combined = base.metadata.query + base.metadata.complete.substring(base.metadata.query.length);
				return tail.setAppearance({html: ((base.isComplete ? base.metadata.complete : '') || base.metadata.combined || base.metadata.query || base.filterString || base.placeholder || '')}).then(function () {
					base.isComplete = false;
					return Util.ep();
				});
			}
			base.isCaretInPosition = function (mode) {
				// console.log('{} search isCaretInPosition'.format(base.id));
				return new Promise(function(resolve, reject) {
					mode = (mode || 'end');
					// determine caret position after an action. Only important thing is whether or not it is at the end.
					var selection = window.getSelection();
					var caretInPosition = false;
					if (base.isFocussed && head.element() === selection.focusNode.parentNode) { // is the selection inside
						var range = selection.getRangeAt(0); // get the only range
						if (mode === 'end') {
							caretInPosition = range.endOffset === selection.focusNode.length; // check the offset == the node value length
						} else if (mode === 'start') {
							caretInPosition = range.endOffset === 0; // or 0
						}
					} else if (head.element() === selection.focusNode) {
						caretInPosition = true;
					}
					resolve(caretInPosition);
				});
			}
			base.setCaretPosition = function (position) {
				// set position
				var maxLength = head.model().text().length;
				var limits = {'start': 0, 'end': maxLength};
				position = position in limits ? limits[position] : position;

				// boundary conditions
				position = position > maxLength ? maxLength : (position < 0 ? 0 : position);

				// set the caret position to the end or the beginning
				if (position !== undefined) {
					var range = document.createRange(); // Create a range (a range is a like the selection but invisible)
					var lm = head.element();
					range.setStart(lm.childNodes.length ? lm.firstChild : lm, position);
					var selection = window.getSelection(); // get the selection object (allows you to change selection)
					selection.removeAllRanges(); // remove any selections already made
					selection.addRange(range); // make the range you have just created the visible selection
				}

				return Util.ep();
			}
			base.complete = function () {
				base.completeQuery = ((base.metadata || {}).complete || '');
				base.isComplete = true;
				return tail.setAppearance({html: base.completeQuery}).then(function () {
					return head.setAppearance({html: base.completeQuery});
				}).then(function () {
					return base.setCaretPosition('end');
				});
			}
			base.focus = function (position) {
				if (!base.isFocussed) {
					base.isFocussed = true;
					return base.setCaretPosition(position);
				} else {
					return Util.ep();
				}
			}
			base.blur = function () {
				base.isFocussed = false;
				return base.getContent().then(function (content) {
					return tail.setAppearance({html: (content || base.placeholder)});
				});
			}
			base.clear = function () {
				return head.setAppearance({html: ''}).then(function () {
					return tail.setAppearance({html: base.placeholder});
				});
			}
			base.getContent = function () {
				return Util.ep(head.model().text());
			}
			base.setContent = function (options) {
				return head.setAppearance({html: options.content}).then(function () {
					if (options.trigger) {
						return base.input();
					} else {
						return base.setMetadata({query: options.content});
					}
				});
			}
			base.input = function () {
				return base.getContent().then(function (content) {
					return base.setMetadata({query: content});
				});
			}

			// behaviours
			base.behaviours = {
				right: function () {
					return base.isCaretInPosition('end').then(function (inPosition) {
						if (inPosition && !base.isComplete) {
							return base.complete().then(function () {
								return base.input();
							});
						} else {
							return Util.ep();
						}
					});
				},
				left: function () {

				},
				enter: function () {

				},
				backspace: function () {

				},
				click: function () {

				}
			}

			// complete promises.
			return Promise.all([
				base.setBindings({
					'click': function (_this) {
						event.stopPropagation();
						return base.focus('end');
					}
				}),
				head.setBindings({
					'input': function (_this) {
						// console.log('{} search bindings head input'.format(base.id));
						return base.input();
					},
					'focus': function (_this) {
						// console.log('{} search bindings head focus'.format(base.id));
						return base.focus();
					},
					'blur': function (_this) {
						// console.log('{} search bindings head blur'.format(base.id));
						return base.blur();
					},
					'click': function (_this, event) {
						event.stopPropagation();
						return base.focus();
					},
				}),
			]).then(function (results) {
				base.components = {
					head: head,
					tail: tail,
				}
				return base.setChildren([
					head,
					tail, // must be underneath
					space,
				]);
			}).then(function () {
				return base;
			});
		});
	},

	// FILTER ICON
	filterButton: function (id, args) {
		return Promise.all([
			// base
			UI.createComponent('{id}'.format({id: id}), {
				template: UI.template('div', 'ie abs button border border-radius hidden'),
				appearance: {
					style: {
						'height': '28px',
						'width': '28px',
						'right': '6px',
						'top': '6px',
						'padding-top': '6px',
					},
				},
			}),

			// glyphs
			UI.createComponent('{id}-filter-glyph'.format({id: id}), {
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'height': '100%',
						'width': '100%',
					},
				},
				children: [
					UI.createComponent('{id}-filter-glyph'.format({id: id}), {
						template: UI.template('span', 'glyphicon glyphicon-filter'),
					}),
				],
			}),

			// content
			UI.createComponent('{id}-content'.format({id: id}), {
				template: UI.template('span', 'ie hidden'),
			}),

		]).then(function (components) {
			// bindings
			var [
				base,
				glyph,
				content,
			] = components;

			base.setContent = function (char) {
				if (char) {
					return glyph.setAppearance({classes: {add: 'hidden'}}).then(function () {
						return content.setAppearance({classes: {remove: 'hidden'}, html: char});
					});
				} else {
					return glyph.setAppearance({classes: {remove: 'hidden'}}).then(function () {
						return content.setAppearance({classes: {add: 'hidden'}, html: ''});
					});
				}
			}

			return Promise.all([]).then(function () {
				return base.setChildren([
					glyph,
					content,
				]);
			}).then(function () {
				return base;
			});
		});
	},

	// SEARCHABLE LIST
	// A combination of the content panel and search input components with an option title.
	// A source can be defined along with a display method, insert/delete, and filter.
	// Optional filter panel
	searchableList: function (id, args) {
		// default appearance
		var defaultAppearance = {
			style: {
				'height': '100%',
			},
		}

		// set up components
		return Promise.all([
			// base component
			UI.createComponent('{id}'.format({id: id}), {
				template: UI.template('div', 'ie'),
				appearance: (args.appearance || defaultAppearance),
			}),

			// title
			UI.createComponent('{id}-title'.format({id: id}), {
				template: UI.template('h4', 'ie title'),
				appearance: {
					style: {
						'width': '100%',
						'height': '22px',
						'font-size': '18px',
						'display': 'none',
					},
				},
			}),

			// search filter bar
			UI.createComponent('{id}-search-filter-bar'.format({id: id}), {
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'width': '100%',
						'height': '40px',
					},
				},
			}),

			// search input
			Components.search('{id}-search'.format({id: id}), {}),

			// filter button
			Components.filterButton('{id}-filter-button'.format({id: id}), {

			}),

			// list
			Components.contentPanel('{id}-list'.format({id: id}), {
				appearance: {
					style: {
						'width': '100%',
						'height': '100%',
					},
				},
			}),

			// filter
			Components.contentPanel('{id}-filter'.format({id: id}), {
				appearance: {
					style: {
						'width': '100%',
						'height': '100%',
					},
					classes: ['hidden'],
				},
			}),

		]).then(function (components) {
			// unpack components
			var [
				base,
				title,
				searchFilterBar,
				search,
				filterButton,
				list,
				filter,
			] = components;

			// set up promises to be completed before returning the base.
			// logic, bindings, etc.
			// allow for swapable components
			base.list = list;
			base.search = search;

			// storage
			base.data = {
				// variables
				limit: undefined,
				query: '',
				filter: '',
				lock: false,
				reset: false,

				// actual datasets
				storage: {
					dataset: {},
					subset: {},
					virtual: {
						list: [],
						rendered: [],
					},
					queries: [],
					filters: {},
					defaultfilters: [],
				},

				// methods
				idgen: function (id) {
					return '{base}-{id}'.format({base: base.id, id: id});
				},
				defaultSort: function (d1, d2) {
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
				},
				load: {
					get: function () {
						// this looks at the Context.get and Context.get:force, separately.
						base.data.lock = false;
						if (base.data.reset) {
							base.data.storage.dataset = {};
							base.data.storage.subset = {};
							base.data.storage.queries = [];
							base.data.reset = false;
						}

						// Load each target
						return Promise.all(base.targets.map(function (target) {
							console.log(target.resolvedPath);
							return Promise.all([
								Context.get(target.resolvedPath, {options: {filter: target.filterRequest(base.data.query)}}).then(target.process).then(base.data.load.append).then(base.data.display.main),

								// add one second delay before searching the server. Only do if query is the same as it was 1 sec ago.
								// Also, only query if this query has never been queried before
								(!target.queries.contains(base.data.query) ? function () {
									target.queries.push(base.data.query);
									return new Promise(function(resolve, reject) {
										var queryAtStart = base.data.query;
										setTimeout(function () {
											resolve(queryAtStart === base.data.query);
										}, 1000);
									}).then(function (timeout) {
										if (timeout) {
											return Context.get(target.resolvedPath, {options: {filter: target.filterRequest(base.data.query)}, force: true}).then(target.process).then(base.data.load.append).then(base.data.display.main);
										} else {
											return Util.ep();
										}
									});
								} : Util.ep)(),
							]);
						}));
					},
					append: function (data) {
						// Add to dataset. Nothing is ever removed.
						return Promise.all(data.map(function (datum) {
							return new Promise(function(resolve, reject) {
								base.data.storage.dataset[datum.id] = datum;
								resolve();
							});
						}));
					},
				},
				display: {
					main: function () {
						// 1. filter the current dataset
						return base.data.display.filter.main().then(function () {
							// 2. render the current dataset
							return base.data.display.render.main();
						});
					},
					filter: {
						main: function () {
							// 1. remove non matching in subset
							return base.data.display.filter.out().then(function () {

								// 2. filter dataset to produce new subset
								return base.data.display.filter.in();
							})
						},
						condition: function (datum) {

							// Here, the lack of matching query and the global autocomplete mode can be overridden by base.data.autocompleteOverride.
							// For the null query, the override only diplays everything if the query is still null, then is more specific when something is typed.
							var conditions = [
								(datum.rule === base.data.filter || base.data.filter === ''), // filter matches or no filter
								(datum.main.toLowerCase().indexOf(base.data.query.toLowerCase()) === 0 || ((base.data.autocompleteOverride || false) && base.data.query === '')), // lower case query match at beginning
								(!base.autocomplete || (base.autocomplete && base.data.query !== '') || (base.data.autocompleteOverride || false)), // autocomplete mode or no query
								datum.id in base.data.storage.dataset, // datum is currently in dataset (prevent bleed over from change of dataset)
							]
							return Util.ep(conditions.reduce(function (a,b) {
								return a && b;
							}));
						},
						out: function () {
							return Promise.all(base.data.storage.virtual.list.map(function (datum, index) {
								datum.index = index;
								return base.data.display.filter.condition(datum).then(function (condition) {
									if (!condition) {
										base.data.storage.virtual.list.splice(datum.index, 1);
										delete base.data.storage.subset[datum.id]; // remove from filtered data
									}
									return Util.ep();
								})
							}));
						},
						in: function () {
							return Promise.all(Object.keys(base.data.storage.dataset).map(function (key) {
								var datum = base.data.storage.dataset[key];
								return base.data.display.filter.condition(datum).then(function (condition) {
									if (condition) {
										base.data.storage.subset[key] = datum;
									}
									return Util.ep();
								});
							}));
						},
					},
					render: {
						main: function () {
							return base.data.display.render.virtual().then(function () {
								return base.data.display.render.sort();
							}).then(function () {
								// for each item in the list, generate a new list item and add to it using the setMetadata function.
								// Never remove a list item, simply make it display:none if the end of the list is reached.
								var virtualList = base.data.limit ? base.data.storage.virtual.list.slice(0, base.data.limit) : base.data.storage.virtual.list;
								return Promise.ordered(virtualList.map(function (datum, index) {
									return function () {
										if (index < base.data.storage.virtual.rendered.length) {
											// element already exists. Update using info in datum.
											// NO RETURN: releases promise immediately. No need to wait for order if one exists.
											UI.getComponent(base.data.storage.virtual.rendered[index]).then(function (existingListItem) {
												// console.log(datum);
												return existingListItem.updateMetadata(datum, base.data.query.toLowerCase());
											}).then(function () {
												if (base.currentIndex === undefined) {
													return base.control.setActive.main({index: 0});
												} else {
													return Util.ep();
												}
											});
										} else {
											if (!base.lock) {
												base.lock = true;
												// element does not exist. Create using info in datum.
												return base.unit(datum, base.data.query.toLowerCase(), index).then(function (newListItem) {
													base.data.storage.virtual.rendered.push(newListItem.id);
													return base.list.components.wrapper.setChildren([newListItem]);
												}).then(function () {
													base.lock = false;
													return Util.ep();
												});
											} else {
												return Util.ep();
											}
										}
									}
								})).then(function () {
									// hide anything that does not contain something to display
									return Promise.all(base.data.storage.virtual.rendered.slice(virtualList.length).map(function (listItemId) {
										return UI.getComponent(listItemId).then(function (listItem) {
											return listItem.hide();
										});
									}));
								})
							}).then(function () {
								return base.data.display.render.setMetadata();
							});
						},
						virtual: function () {
							base.data.storage.virtual.list = Object.keys(base.data.storage.subset).map(function (key) {
								return base.data.storage.subset[key];
							});
							return Util.ep();
						},
						sort: function () {
							base.data.storage.virtual.list.sort((base.sort || base.data.defaultSort));
							return Util.ep();
						},
						setMetadata: function () {
							var query = base.data.query; // query is set no matter the status of virtual

							// MAYBE RESET THE FILTER ON ENTER FOR THE AUTOCOMPLETE

							var complete = '';
							if (!base.data.storage.virtual.list.length) {
								base.currentIndex = undefined;
							} else {
								complete = (base.data.storage.virtual.list[base.currentIndex] || {}).main;
							}
							return base.search.setMetadata({query: query, complete: complete});
						},
					},
				},
			}

			// actions
			base.control = {
				// global control
				setup: {
					main: function () {
						return Promise.all([
							base.control.setup.resolvePaths(),
							base.control.setup.renderUntilDefaultLimit(),
							base.control.setup.extractFilters(),
						]).then(function () {
							return base.control.start();
						});
					},
					resolvePaths: function () {
						return Promise.all(base.targets.map(function (target) {
							return target.path().then(function (path) {
								target.resolvedPath = path; // this can be recalculated upon stopping and restarting.
								target.queries = [];
							});
						}));
					},
					renderUntilDefaultLimit: function () {
						if (base.data.storage.virtual.rendered.length === 0) {
							return Promise.ordered(Array.range(base.data.limit).map(function (index) {
								return function () {
									return base.unit({main: ''}, '', index).then(function (newListItem) {
										base.data.storage.virtual.rendered.push(newListItem.id);
										return newListItem.hide().then(function () {
											return base.list.components.wrapper.setChildren([newListItem]);
										});
									});
								}
							}));
						} else {
							return Util.ep();
						}
					},
					extractFilters: function () {
						// filters
						if (Util.isEmptyObject(base.data.storage.filters)) {
							return Promise.ordered(base.targets.map(function (target) {

								return function () {
									// add to filters and default filters
									if (target.filter) {
										base.data.storage.filters[target.filter.rule] = target.filter;
										if (target.filter.default) {
											base.data.storage.defaultfilters.push(target.filter.rule);
										}

										// create filter unit and add to list
										return base.defaultFilterUnit('{filterid}-{rule}'.format({filterid: filter.id, rule: target.filter.rule}), target.filter).then(function (filterUnit) {
											// bindings
											return filterUnit.setBindings({
												'click': function (_this) {
													return base.control.setFilter(target.filter.rule);
												},
											}).then(function () {
												filter.setChildren([filterUnit]);
											});
										}).then(function () {
											Mousetrap.bind(target.filter.char, function (event) {
												event.preventDefault();
												if (base.isFocussed) {
													if (base.data.filter === target.filter.rule) {
														base.control.setFilter();
													} else {
														base.control.setFilter(target.filter.rule);
													}
												}
											});
											return Util.ep();
										});
									} else {
										return Util.ep();
									}
								}
							})).then(function () {
								// if any filters have been added, make the filter button appear
								if (!Util.isEmptyObject(base.data.storage.filters)) {
									return filterButton.setAppearance({classes: {remove: 'hidden'}});
								} else {
									return Util.ep();
								}
							});
						} else {
							return Util.ep();
						}
					},
				},
				reset: function () {
					base.data.reset = true;
					return base.control.update({query: '', filter: ''}).then(function () {
						return base.search.clear();
					}).then(function () {
						return base.search.setMetadata({query: '', complete: ''});
					});
				},
				update: function (data, defaults) {
					// apply changes
					base.data.query = (((data || {}).query !== undefined ? (data || {}).query : base.data.query) || ((defaults || {}).query || ''));
					base.data.filter = (((data || {}).filter || base.data.filter) || ((defaults || {}).filter || ''));
					return Util.ep();
				},
				start: function () {
					return base.data.load.get();
				},

				// element control
				setFilter: function (rule) {
					// 0. update data filter
					base.data.filter = rule;
					if (rule in base.data.storage.filters) {
						base.data.limit = base.data.storage.filters[rule].limit !== 0 ? (base.data.storage.filters[rule].limit !== undefined ? base.data.storage.filters[rule].limit : base.data.limit) : undefined;
						base.data.autocompleteOverride = base.data.storage.filters[rule].autocompleteOverride;
					} else {
						base.data.limit = base.defaultLimit;
						base.data.autocompleteOverride = undefined;
					}

					// 1. update search
					search.filterString = rule ? base.data.storage.filters[rule].input : undefined;
					return Promise.all([
						// 2. update data
						base.control.update({filter: (rule || '')}),

						// 3. update filter button
						filterButton.setContent(rule ? base.data.storage.filters[rule].char : undefined),

						// 4. search
						search.setMetadata(),
					]).then(function () {
						return base.control.start();
					});
				},
				setActive: {
					main: function (options) {
						options = (options || {});

						// if there are any results
						if (base.data.storage.virtual.rendered.length && base.isFocussed) {

							// changes
							var previousIndex = base.currentIndex;
							base.currentIndex = (options.index !== undefined ? options.index : undefined || ((base.currentIndex || 0) + (base.currentIndex !== undefined ? (options.increment || 0) : 0)));

							// boundary conditions
							var max = (base.data.limit !== undefined ? (base.data.limit > base.data.storage.virtual.list.length ? base.data.storage.virtual.list.length : base.data.limit) : base.data.storage.virtual.list.length) - 1;
							base.currentIndex = base.currentIndex > max ? max : (base.currentIndex < 0 ? 0 : base.currentIndex);

							if (base.currentIndex !== previousIndex) {
								return base.control.setActive.set();
							} else {
								return Util.ep();
							}
						} else {
							return Util.ep();
						}
					},
					set: function () {
						return base.control.deactivate().then(function () {
							return UI.getComponent(base.data.storage.virtual.rendered[base.currentIndex]).then(function (activeListItem) {
								base.active = activeListItem;
								return base.active.activate().then(function () {
									var datum = base.data.storage.virtual.list[base.currentIndex];
									var complete = (datum || {}).main;
									return base.control.setActive.final(datum, complete);
								});
							})
						});
					},
					final: function (datum, complete) {
						return base.search.setMetadata({complete: complete});
					},
				},
				deactivate: function () {
					return ((base.active || {}).deactivate || Util.ep)().then(function () {
						return new Promise(function(resolve, reject) {
							base.active = undefined;
							resolve();
						});
					});
				},
			}

			// list item formatting
			base.unitStyle = {
				apply: function () {
					return base.unitStyle.base().then(function () {
						return Promise.all(base.targets.map(function (target) {
							return base.unitStyle.set(target);
						}));
					});
				},
				set: function (target) {
					return (target.setStyle || base.unitStyle.default(target))();
				},
				base: function () {
					// base class
					jss.set('#{id} .base'.format({id: base.id}), {
						'height': '30px',
						'width': '100%',
						'padding': '0px',
						'padding-left': '10px',
						'text-align': 'left',
					});
					jss.set('#{id} .base.active'.format({id: base.id}), {
						'background-color': 'rgba(255,255,255,0.1)'
					});
					return Util.ep();
				},
				default: function (target) {
					return function () {
						jss.set('#{id} .{type}'.format({id: base.id, type: target.name}), {
							'background-color': 'rgba(255,255,255,0.00)'
						});
						jss.set('#{id} .base.{type}.active'.format({id: base.id, type: target.name}), {
							'background-color': 'rgba(255,255,255,0.1)'
						});
						return Util.ep();
					}
				},
			}
			base.defaultFilterUnit = function (id, args) {
				return Promise.all([
					// Base
					UI.createComponent('{id}'.format({id: id}), {
						template: UI.template('div', 'ie'),
						appearance: {
							style: {
								'height': '80px',
								'width': '100%',
								'border-bottom': '1px solid #ccc',
							},
						},
					}),

					// Title description bar
					UI.createComponent('{id}-title-description-bar'.format({id: id}), {
						template: UI.template('div', 'ie'),
						appearance: {
							style: {
								'float': 'left',
								'height': '100%',
								'width': 'calc(100% - 30px)',
							},
						},
					}),

					// Title
					UI.createComponent('{id}-title'.format({id: id}), {
						template: UI.template('div', 'ie'),
						appearance: {
							style: {
								'float': 'left',
								'width': '100%',
							},
						},
					}),

					// Description
					UI.createComponent('{id}-description'.format({id: id}), {
						template: UI.template('div', 'ie'),
						appearance: {
							style: {
								'float': 'left',
								'width': '100%',
							},
						},
					}),

					// Button
					UI.createComponent('{id}-button'.format({id: id}), {
						template: UI.template('div', 'ie button border border-radius'),
						appearance: {
							style: {
								'float': 'left',
								'width': '28px',
								'height': '28px',
								'padding-top': '4px',
								'top': '5px',
								'right': '5px',
							},
						},
					}),

					// Button content
					UI.createComponent('{id}-button-content'.format({id: id}), {
						template: UI.template('span', 'ie'),
						appearance: {
							html: args.char,
						},
					}),

				]).then(function (components) {
					var [
						base,
						titleDescriptionBar,
						title,
						description,
						button,
						buttonContent,
					] = components;

					return Promise.all([

						// title and description
						titleDescriptionBar.setChildren([
							title,
							description,
						]),

						// button
						button.setChildren([
							buttonContent,
						]),

					]).then(function () {
						return base.setChildren([
							titleDescriptionBar,
							button,
						]);
					}).then(function () {
						return base;
					});
				});
			}

			// list methods
			base.next = function () {
				return base.control.setActive.main({increment: 1});
			}
			base.previous = function () {
				return base.control.setActive.main({increment: -1});
			}

			// search methods
			search.focus = function (position) {
				if (!search.isFocussed) {
					search.isFocussed = true;
					base.isFocussed = true;
					return Promise.all([
						search.setCaretPosition(position),
						search.input(),
					]);
				} else {
					return Util.ep();
				}
			}
			search.blur = function () {
				search.isFocussed = false;
				base.isFocussed = true;
				return search.getContent().then(function (content) {
					return tail.setAppearance({html: (content || search.placeholder)});
				});
			}
			search.input = function () {
				return search.getContent().then(function (content) {
					return base.control.update({query: content}).then(function () {
						return base.control.start();
					});
				});
			}
			base.setSearch = function (options) {
				options.mode = (options.mode || 'on');
				options.placeholder = (options.placeholder || 'search...');
				base.data.limit = options.limit;
				base.defaultLimit = base.data.limit;
				base.autocomplete = (options.autocomplete || false);

				search.placeholder = options.placeholder;
				return searchFilterBar.setAppearance({classes: {add: (options.mode === 'off' ? ['hidden'] : [])}}).then(function () {
					return search.components.tail.setAppearance({html: options.placeholder});
				}).then(function () {
					if (options.mode !== 'off') {
						return Promise.all([
							list.setAppearance({style: {'height': 'calc(100% - 40px)'}}),
							filter.setAppearance({style: {'height': 'calc(100% - 40px)'}}),
						]);
					} else {
						return Util.ep();
					}
				});
			}

			// title methods
			base.setTitle = function (options) {
				if (options.text) {
					return title.setAppearance({
						html: options.text,
						style: {
							'text-align': (options.centre ? 'center': 'left'),
						},
					});
				} else {
					return title.setAppearance({
						style: {
							'display': 'none',
						}
					});
				}
			}

			// behaviours
			base.behaviours = {
				up: function () {
					// console.log('{} searchlist behaviours up'.format(base.id));
					return base.previous();
				},
				down: function () {
					// console.log('{} searchlist behaviours down'.format(base.id));
					return base.next();
				},
				left: function () {
					// console.log('{} searchlist behaviours left'.format(base.id));
					return search.behaviours.left();
				},
				right: function () {
					// console.log('{} searchlist behaviours right'.format(base.id));
					return search.behaviours.right();
				},
				number: function (char) {
					// console.log('{} searchlist behaviours number'.format(base.id));
					var index = parseInt(char);
					if (index < base.data.storage.virtual.rendered.length) {
						return base.control.setActive.main({index: index}).then(function () {
							// don't know what behaviour to have here
							return search.behaviours.right();

							// Maybe do this
							// return search.behaviours.enter();
						});
					}
				},
				enter: function () {
					// console.log('{} searchlist behaviours enter'.format(base.id));
					return search.behaviours.enter();
				},
				backspace: function () {
					// console.log('{} searchlist behaviours backspace'.format(base.id));
					return search.behaviours.backspace();
				},
			}

			// complete promises.
			return Promise.all([
				searchFilterBar.setChildren([
					search,
					filterButton,
				]),
				filterButton.setBindings({
					'click': function (_this) {
						return _this.triggerState();
					},
				}),
			]).then(function (results) {
				base.components = {
					title: title,
					search: search,
					list: list,
					filter: filter,
					filterButton: filterButton,
				}
				return base.setChildren([
					title,
					searchFilterBar,
					list,
					filter,
				]);
			}).then(function () {
				return base;
			});
		});
	},

	// A panel with a state structure and space for a content panel.
	sidebar: function (id, args) {
		return Promise.all([

			// base
			UI.createComponent('{id}-base'.format({id: id}), {
				template: UI.template('div', 'ie abstract'),
				appearance: {
					style: {
						'height': '100%',
					},
				},
			}),

			// main
			UI.createComponent('{id}-main'.format({id: id}), {
				template: UI.template('div', 'ie abs border-right centred-vertically'),
				appearance: {
					style: {
						'left': '-500px',
						'height': '70%',
						'width': '200px',
					},
				},
				children: args.children,
			}),

			// back
			UI.createComponent('{id}-back'.format({id: id}), {
				template: UI.template('div', 'ie abs border-right centred-vertically'),
				appearance: {
					style: {
						'left': '-500px',
						'height': '70%',
						'width': '50px',
					},
				},
			}),

			// back button
			UI.createComponent('{id}-back-button'.format({id: id}), {
				template: UI.template('div', 'ie button'),
				children: [
					UI.createComponent('{id}-back-button-span'.format({id: id}), {
						template: UI.template('span', 'glyphicon glyphicon-chevron-left'),
					}),
				],
				state: {
					stateMap: args.state.primary,
				},
				bindings: {
					'click': function (_this) {
						_this.triggerState();
					},
				}
			}),

		]).then(function (components) {
			// unpack components
			var [
				base,
				main,
				back,
				backButton,
			] = components;

			// complete promises.
			return Promise.all([
				back.setChildren([
					backButton,
				]),
				Promise.all(Object.keys(args.state).map(function (category) {
					// get array of sets
					var stateSet = args.state[category];
					if (!$.isArray(stateSet)) {
						stateSet = [stateSet];
					}

					// add each one as a state
					return Promise.all(stateSet.map(function (stateName) {
						return Promise.all([
							main.addState(stateName, {
								style: {
									'left': category === 'primary' ? args.position.main.on : args.position.main.off,
								},
							}),
							back.addState(stateName, {
								style: {
									'left': category === 'secondary' ? args.position.back.on : args.position.back.off,
								},
							}),
						]);
					}));
				})),
			]).then(function (results) {
				base.components = {
					main: main,
					back: back,
				}
				return base.setChildren([
					main,
					back,
				]);
			}).then(function () {
				return base;
			});
		});
	},

}
