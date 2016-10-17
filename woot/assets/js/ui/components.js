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
			UI.createComponent('{id}-base'.format({id: id}), {
				template: UI.template('div', 'ie'),
				appearance: args.appearance,
			}),

			// wrapper
			UI.createComponent('{id}-wrapper'.format({id: id}), {
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
				base.components = {
					wrapper: wrapper,
				}
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
			},
			classes: ['border', 'border-radius'],
		});

		// set up components
		return Promise.all([
			// base component
			UI.createComponent('{id}-base'.format({id: id}), {
				template: UI.template('div', 'ie input'),
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
				// console.log('{} search setMetadata'.format(base.id));
				base.metadata = metadata;
				return tail.setAppearance({html: (metadata.combined || metadata.query || base.placeholder || '')});
			}
			base.isCaretInPosition = function (mode) {
				// console.log('{} search isCaretInPosition'.format(base.id));
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
				return caretInPosition;
			}
			base.setCaretPosition = function (position) {
				// set position
				var maxLength = head.model().text().length;
				var limits = {'start': 0, 'end': maxLength};
				position = position in limits ? limits[position] : position;

				// boundary conditions
				position = position > maxLength ? maxLength : (position < 0 ? 0 : position);

				return new Promise(function(resolve, reject) {
					// set the caret position to the end or the beginning
					if (position !== undefined) {
						var range = document.createRange(); // Create a range (a range is a like the selection but invisible)
						var lm = head.element();
						range.setStart(lm.childNodes.length ? lm.firstChild : lm, position);
						var selection = window.getSelection(); // get the selection object (allows you to change selection)
						selection.removeAllRanges(); // remove any selections already made
						selection.addRange(range); // make the range you have just created the visible selection
					}
					resolve();
				});
			}
			base.complete = function () {
				// console.log('{} search complete'.format(base.id));
				base.completeQuery = base.metadata.complete;
				return tail.setAppearance({html: base.metadata.complete}).then(function () {
					return head.setAppearance({html: base.metadata.complete});
				}).then(function () {
					return base.setCaretPosition('end');
				});
			}
			base.isComplete = function () {
				// console.log('{} search isComplete'.format(base.id));
				return (head.model().text() === base.completeQuery) || !base.metadata.complete;
			}
			base.focus = function (position) {
				if (!base.isFocussed) {
					base.isFocussed = true;
					return (base.onFocus || Util.ep)().then(function () {
						return base.setCaretPosition(position);
					});
				} else {
					return Util.ep();
				}
			}
			base.blur = function () {
				base.isFocussed = false;
				return (base.onBlur || Util.ep)().then(function () {
					return tail.setAppearance({html: (head.model().text() || base.placeholder)});
				});
			}
			base.clear = function () {
				// console.log('{} search clear'.format(base.id));
				return head.setAppearance({html: ''}).then(function () {
					return tail.setAppearance({html: base.placeholder});
				});
			}
			base.getContent = function () {
				return head.model().text();
			}
			base.setContent = function (options) {
				return head.setAppearance({html: options.content}).then(function () {
					if (options.trigger) {
						head.model().trigger('input');
					}
				});
			}

			// behaviours
			base.behaviours = {
				right: function () {
					// console.log('{} search behaviours right'.format(base.id));
					if (base.isCaretInPosition('end')) {
						return base.complete().then(function () {
							return base.onInput(base.metadata.complete);
						});
					} else {
						return Util.ep();
					}
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
						base.focus('end');
					}
				}),
				head.setBindings({
					'input': function (_this) {
						// console.log('{} search bindings head input'.format(base.id));
						(base.onInput || Util.ep)(_this.model().text());
					},
					'focus': function (_this) {
						// console.log('{} search bindings head focus'.format(base.id));
						base.focus();
					},
					'blur': function (_this) {
						// console.log('{} search bindings head blur'.format(base.id));
						base.blur();
					},
					'click': function (_this, event) {
						event.stopPropagation();
						base.focus();
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
	filterIcon: function (id, args) {

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
			UI.createComponent('{id}-base'.format({id: id}), {
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

			// search input
			Components.search('{id}-search'.format({id: id}), {}),

			// filter button
			UI.createComponent('{id}-filter-button'.format({id: id}), {
				template: UI.template('div', 'ie button'),
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
			Components.contentPanel('{id}-filter'.format({id: id}), {}),

		]).then(function (components) {
			// unpack components
			var [
				base,
				title,
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

			// control operation
			base.data = {

				// data sets
				dataset: {},
				filters: [],

				// variables
				limit: undefined, // if limit is undefined, there is no limit
				query: {
					previous: undefined,
					current: '',
					changed: function () {
						var changed = base.data.query.current !== base.data.query.previous;
						base.data.query.previous = base.data.query.current;
						return changed;
					}
				},
				filter: {
					previous: undefined,
					current: {},
					changed: function () {
						var changed = base.data.filter.current !== base.data.filter.previous;
						base.data.filter.previous = base.data.filter.current;
						return changed;
					}
				},
				index: {
					previous: undefined,
					current: 0,
					changed: function () {
						var changed = base.data.index.current !== base.data.index.previous;
						base.data.index.previous = base.data.index.current;
						return changed;
					},
				},

				// methods
				keygen: function (id) {
					return '{base}-{id}-base'.format({base: base.id, id: id})
				},
				get: function () {
					// this looks at the Context.get and Context.get:force, separately.
					if (base.data.query.changed() || base.reset) {
						if (base.reset) {
							base.data.dataset = {};
							base.reset = false;
						}
						return Promise.all(base.targets.map(function (target) {
							return Promise.all([
								Context.get(target.resolvedPath, {options: {filter: {'content__startswith': base.data.query.current}}}).then(target.process).then(base.data.append),

								// add one second delay before searching the server. Only do if query is the same as it was 1 sec ago.
								// new Promise(function(resolve, reject) {
								// 	var queryAtStart = base.data.query.current;
								// 	setTimeout(function () {
								// 		resolve(queryAtStart === base.data.query.current);
								// 	}, 1000);
								// }).then(function (timeout) {
								// 	if (timeout) {
								// 		return Context.get(target.resolvedPath, {options: {filter: {'content__startswith': base.data.query.current}}, force: true}).then(target.process).then(base.data.append);
								// 	} else {
								// 		return Util.ep();
								// 	}
								// }),
							]);
						}));
					} else {
						return Util.ep();
					}
				},
				append: function (data) {
					// Add to dataset. Nothing is ever removed.
					return Promise.all(data.map(function (datum) {
						return new Promise(function(resolve, reject) {
							base.data.dataset[datum.id] = datum;
							resolve();
						});
					}));
				},
				display: {
					lock: false,
					virtual: {
						list: [],
						ids: [],
					},
					subset: {},
					execute: function () {
						if (!base.data.display.lock) {
							base.data.display.lock = true;
							return base.data.display.queue();
						} else {
							return Util.ep();
						}
					},
					queue: function () {
						var query = base.data.query.current;
						var lowercaseQuery = query.toLowerCase();
						var filter = base.data.filter.current;

						// remove non-matches from subset and the corresponding ones from virtual
						return Promise.all(base.data.display.virtual.list.filter(function (item, index) {
							item.index = index;
							return !(((filter && item.rule === filter) || $.isEmptyObject(filter)) && item.main.toLowerCase().indexOf(lowercaseQuery) === 0 && item.id in base.data.dataset); // reject
						}).map(function (item) {
							base.data.display.virtual.list.splice(item.index, 1);
							delete base.data.display.subset[item.id]; // remove from filtered data
							return Util.ep();
						})).then(function () {
							// add new data to subset
							return new Promise(function(resolve, reject) {
								Object.keys(base.data.dataset).forEach(function (key) {
									var datum = base.data.dataset[key];
									if (((filter && datum.rule === filter) || $.isEmptyObject(filter)) && datum.main.toLowerCase().indexOf(lowercaseQuery) === 0 && datum.id in base.data.dataset) {
										base.data.display.subset[key] = datum;
									}
								});
								resolve();
							});
						}).then(function () {

							// save previous virtual
							var previousVirtualIds = base.data.display.virtual.ids;

							// create virtual
							return new Promise(function(resolve, reject) {
								base.data.display.virtual.list = Object.keys(base.data.display.subset).map(function (key) {
									return base.data.display.subset[key];
								});
								resolve();
							}).then(function () {

								// sort virtual
								return new Promise(function(resolve, reject) {
									base.data.display.virtual.list.sort(base.sort);
									resolve();
								});
							}).then(function () {
								var newList = [];
								// So the new idea is to have constant list items with no specific id.
								// The elements such as text and indicies would simply be swapped out when the order of the top elements is determined.

								// determine differences in arrays and add objects one by one
								// console.log(base.data.display.virtual.list.length);
								// if (!base.id.contains('autocomplete')) {
									return Promise.ordered(base.data.display.virtual.list.slice(0).map(function (datum, index) {
										return function (after) {
											after = (after || '');
											if (previousVirtualIds.contains(datum.id)) {
												// datum.id is in the previousVirtual list of ids, so all that needs to be done is visually updating any index display.
												return UI.getComponent(base.data.keygen(datum.id)).then(function (existingListItem) {
													return existingListItem.updateMetadata(lowercaseQuery, after);
												}).then(function () {
													return Util.ep(base.data.keygen(datum.id));
												});
											} else {
												var start = Date.now();
												// Fully render a new unit using the previous id as the "after".
												return base.unit(datum, lowercaseQuery, index).then(function (newListItem) {
													console.log(Date.now() - start);
													return newListItem.setAfter(after).then(function () {
														base.data.display.virtual.ids.push(datum.id);
														newList.push(newListItem);
														return Util.ep(newListItem.id);
													});
												});
											}
										}
									})).then(function () {
										if (newList.length) {
											return base.list.components.wrapper.setChildren(newList);
										} else {
											return Util.ep();
										}
									});
								// } else {
								// 	return Util.ep();
								// }
							}).then(function () {
								base.data.display.lock = false;
								return Util.ep();
							}).catch(function (error) {
								console.log(error);
							});
						});
					},
				},
			}

			// operation methods
			base.start = function () {
				// setup paths
				return Promise.all(base.targets.map(function (target) {
					return target.path().then(function (path) {
						target.resolvedPath = path; // this can be recalculated upon stopping and restarting.
					});
				})).then(function () {
					return new Promise(function(resolve, reject) {
						// start loop
						base.data.requestId = requestAnimationFrame(base.loop);
						resolve(base.data.requestId);
					});
				});
			}
			base.loop = function () {
				// start processing
				Promise.all([
					base.data.get(),
					base.data.display.execute(),
				]);

				// continue loop
				// setTimeout(function () {
				base.data.requestId = requestAnimationFrame(base.loop);
				// }, 100);
			}
			base.stop = function () {
				// cancel animation request
				return new Promise(function(resolve, reject) {
					base.reset = true;
					cancelAnimationFrame(base.data.requestId);
					resolve();
				});
			}
			base.updateData = function (data, defaults) {
				var _this = base;
				return new Promise(function(resolve, reject) {
					// apply changes
					_this.data.query.current = (((data || {}).query !== undefined ? (data || {}).query : _this.data.query.current) || ((defaults || {}).query || ''));
					_this.data.filter.current = (((data || {}).filter || _this.data.filter.current) || ((defaults || {}).filter || {}));
					resolve();
				});
			}
			base.setMetadata = function (query) {
				// console.log('{} searchlist setMetadata'.format(base.id));
				base.query = ((base.query || query) || '');
				// condition is that there are filtered items and the query is not nothing

				var metadata = {
					query: base.query,
				}
				if (base.virtual.length && base.currentIndex !== undefined) {
					var item = base.virtual[base.currentIndex].metadata;
					metadata = {
						query: base.query,
						complete: item.complete,
						combined: item.combined,
						type: item.type,
					}
				}
				return search.setMetadata(metadata);
			}
			base.setActive = function (options) {
				// console.log('{} searchlist setActive'.format(base.id));
				options = (options || {});
				var set = (options.set || base.list.components.wrapper.children);

				// if there are any results
				if (set.length && base.isFocussed) {

					// changes
					var previousIndex = base.currentIndex;
					base.currentIndex = (options.index !== undefined ? options.index : undefined || ((base.currentIndex || 0) + (options.increment || 0)));

					// boundary conditions
					base.currentIndex = base.currentIndex > set.length - 1 ? set.length - 1 : (base.currentIndex < 0 ? 0 : base.currentIndex);

					if (base.currentIndex !== previousIndex) {
						return base.deactivate().then(function () {
							base.active = set[base.currentIndex];
							return base.active.activate();
						});
					} else {
						return Util.ep();
					}
				} else {
					return Util.ep();
				}
			}
			base.deactivate = function () {
				// console.log('{} searchlist deactivate'.format(base.id));
				return ((base.active || {}).deactivate || Util.ep)().then(function () {
					return new Promise(function(resolve, reject) {
						base.active = undefined;
						resolve();
					});
				});
			}
			base.getContent = function () {
				return search.getContent();
			}
			base.setContent = function (options) {
				return search.setContent(options);
			}

			// list methods
			base.next = function () {
				// console.log('{} searchlist next'.format(base.id));
				return base.setActive({increment: 1}).then(function () {
					return base.setMetadata();
				});
			}
			base.previous = function () {
				// console.log('{} searchlist previous'.format(base.id));
				return base.setActive({increment: -1}).then(function () {
					return base.setMetadata();
				});
			}

			// search methods
			search.onFocus = function () {
				base.isFocussed = true;
				return Promise.all([
					(base.searchExternal ? base.searchExternal.onFocus : Util.ep)(),
					base.updateData({query: search.components.head.model().text()}),
				]);
			}
			search.onBlur = function () {
				return Util.ep();
			}
			search.onInput = function (value) {
				return base.updateData({query: search.components.head.model().text()});
			}
			base.setSearch = function (options) {
				options.mode = (options.mode || 'on');
				options.placeholder = (options.placeholder || 'search...');
				base.limit = options.limit;

				search.placeholder = options.placeholder;
				return search.setAppearance({classes: {add: (options.mode === 'off' ? ['hidden'] : [])}}).then(function () {
					return search.components.tail.setAppearance({html: options.placeholder});
				}).then(function () {
					return list.setAppearance({style: {'height': 'calc(100% - 40px)'}});
				});
			}

			// set title
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
					if (index < base.list.components.wrapper.children.length) {
						return base.setActive({index: index}).then(function () {
							return base.setMetadata();
						}).then(function () {
							// don't know what behaviour to have here
							return search.behaviours.right();
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

			// clone
			base.clone = function (copy) {
				// console.log('{} searchlist clone'.format(base.id));
				// confusing, but properties of copy get sent to this object.
				base.autocomplete = copy.autocomplete;
				base.targets = copy.targets;
				base.list = copy.list;
				base.unit = copy.unit;
			}

			// complete promises.
			return Promise.all([

			]).then(function (results) {
				base.components = {
					title: title,
					search: search,
					list: list,
					filter: filter,
				}
				return base.setChildren([
					title,
					search,
					list,
					filter,
				]);
			}).then(function () {
				return base;
			});
		});
	},

	// AUTOCOMPLETE

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
