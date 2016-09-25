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
			base.removeAll = function () {
				return wrapper.removeChildren();
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
					return (base.onFocus || emptyPromise)().then(function () {
						return base.setCaretPosition(position);
					});
				} else {
					return emptyPromise();
				}
			}
			base.blur = function () {
				base.isFocussed = false;
				return (base.onBlur || emptyPromise)().then(function () {
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
						return emptyPromise();
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
						(base.onInput || emptyPromise)(_this.model().text());
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
			base.dataset = [];
			base.virtual = [];
			base.filters = {};
			base.defaultFilters = [];
			base.list = list; // allow for swapable components
			base.search = search;
			base.isFocussed = false;
			base.lock = false;
			base.display = function (options) {
				// console.log('{} searchlist display'.format(base.id), base.lock);
				console.log(base.id, 'display', options);
				var query = (options || {}).query;
				var filter = (options || {}).filter;
				var forceLoad = ((options || {}).forceLoad || false);
				var sort = ((options || {}).sort || 'main');
				return base.load({forceLoad: forceLoad}).then(function () {
					if (!base.lock) {
						base.lock = true;
						return base.filter(query, filter).then(function () {
							base.currentIndex = undefined;
							console.log(base.id, base.virtual, base.list.components.wrapper.children);
							return base.list.removeAll();
						}).then(function () {
							base.virtual = base.virtual.sort(function (before, after) {
								return before[sort] < after[sort] ? -1 : (before[sort] > after[sort] ? 1 : 0);
							});
							return Promise.all(base.virtual.map(function (item, index) {
								return base.unit(base, item, query, index);
							})).then(function (listItems) {
								return base.setActive({set: listItems}).then(function () {
									return base.setMetadata(query);
								}).then(function () {
									return base.list.components.wrapper.setChildren(listItems);
								});
							});
						}).then(function () {
							return new Promise(function(resolve, reject) {
								base.lock = false;
								resolve();
							});
						});
					} else {
						return emptyPromise();
					}
				});
			}
			base.load = function (options) {
				// console.log('{} searchlist load'.format(base.id));
				// for each target, gather data and evaluate in terms of each process function. Store as virtual list.
				if (base.dataset.length !== 0 && !options.forceLoad) {
					return emptyPromise();
				} else {
					return Promise.all(base.targets.map(function (target) {
						return target.path().then(function (path) {
							return Context.get(path, {force: false});
						}).then(target.process).then(function (dataset) {
							return dataset;
						});
					})).then(function (datasets) {
						// consolidate datasets into a unified dataset. Ordering comes later.
						base.dataset = []; // might choose to do something smarter later.
						datasets.forEach(function (dataset) {
							dataset.forEach(function (datum) {
								base.dataset.push(datum);
							});
						});
					}).then(function () {
						// load filters
						return Promise.all(base.targets.map(function (target) {
							return new Promise(function(resolve, reject) {
								if (target.filter) {
									base.filters[target.filter.char] = target.filter;
									if (target.filter.default && base.defaultFilters.indexOf(target.filter.rule) === -1) {
										base.defaultFilters.push(target.filter.rule);
									}
								}
								resolve();
							});
						}));
					});
					// All data to be filtered now lives in base.dataset.
				}
			}
			base.filter = function (query, filter) {
				// console.log('{} searchlist filter'.format(base.id));
				query = (query || '');
				filter = (filter || '');
				var rule = filter ? base.filters[filter].rule : '';
				// filter called with no arguments should yield only the default filters
				// In this way, an autocomplete is simply a list with no default filters
				// The output of filter goes to base.buffer

				return new Promise(function(resolve, reject) {
					if (query || filter) {
						base.virtual = base.dataset.filter(function (datum) {
							return datum.rule.indexOf(rule) === 0 && datum.main.toLowerCase().indexOf(query.toLowerCase()) === 0 && !(base.autocomplete && query === '');
						});
					} else {
						base.virtual = base.dataset.filter(function (datum) {
							return (base.defaultFilters.contains(datum.rule) || base.defaultFilters.length === 0) && datum.main.toLowerCase().indexOf(query.toLowerCase()) === 0 && !(base.autocomplete && query === '');
						});
					}
					base.virtual = base.limit ? base.virtual.slice(0,base.limit) : base.virtual;

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
						return emptyPromise();
					}
				} else {
					return emptyPromise();
				}
			}
			base.deactivate = function () {
				// console.log('{} searchlist deactivate'.format(base.id));
				return ((base.active || {}).deactivate || emptyPromise)().then(function () {
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
				// console.log('{} search onFocus'.format(search.id));
				base.isFocussed = true;
				base.query = search.components.head.model().text();
				return Promise.all([
					base.display({query: base.query}),
					(base.searchExternal ? base.searchExternal.onFocus : emptyPromise)(),
				]);
			}
			search.onBlur = function () {
				base.isFocussed = false;
				base.currentIndex = undefined;
				return Promise.all([
					base.deactivate(),
					(base.searchExternal ? base.searchExternal.onBlur : emptyPromise)(),
				]);
			}
			search.onInput = function (value) {
				// console.log('{} search onInput'.format(search.id));
				base.query = value;
				return base.display({query: base.query});
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

			// process states
			Object.keys(args.state).forEach(function (category) {
				var stateSet = args.state[category];
				if (!$.isArray(stateSet)) {
					stateSet = [stateSet];
				}

				// This structure sets up the sidebar to have primary, secondary, and deactivate states
				// These can be sets of states. Primary, main is active; secondary, back is active; deactivate, neither is active.
				stateSet.forEach(function (state) {
					if (category === 'primary') {
						main.addState(state, onOff(args.position.main.on));
						back.addState(state, onOff(args.position.back.off));
					} else if (category === 'secondary') {
						main.addState(state, onOff(args.position.main.off));
						back.addState(state, onOff(args.position.back.on));
					} else if (category === 'deactivate') {
						main.addState(state, onOff(args.position.main.off));
						back.addState(state, onOff(args.position.back.off));
					}
				});
			});

			// complete promises.
			return Promise.all([
				back.setChildren([
					backButton,
				]),
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
