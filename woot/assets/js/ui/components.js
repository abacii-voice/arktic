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
			base.textLength = 0;
			base.caretOffset = 0;
			base.caretAtEnd = false;
			base.isFocussed = false;

			// logic, bindings, etc.
			base.setMetadata = function (metadata) {
				base.metadata = metadata;
				return tail.setAppearance({});
			}
			base.complete = function () {

			}
			base.clear = function () {

			}
			base.focus = function (start) {

			}

			// behaviours
			base.behaviours = {
				right: function () {

				},
				left: function () {

				},
				enter: function () {

				},
				backspace: function () {

				},
				click: function (end) {

				}
			}

			// complete promises.
			return Promise.all([
				base.setBindings({
					'input': function (_this) {
						var value = head.model().text();
					},
					'click': function (_this) {

					}
				}),
				head.setBindings({
					'blur': function (_this) {

					},
					'click': function (_this, event) {
						event.stopPropagation();

					}
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
			Components.contentPanel('{id}-list'.format({id: id}), {}),

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
			base.display = function (query, filter) {
				return base.load().then(function () {
					return base.filter(query, filter); // returns a reduced dataset
				}).then(function () {
					return base.list.removeAll();
				}).then(function () {
					return Promise.all(base.virtual.map(function (item, index) {
						return base.unit(base, item, query, index);
					})).then(function (listItems) {
						return base.setActive({set: listItems}).then(function () {
							return base.setMetadata(query);
						}).then(function () {
							return base.list.components.wrapper.setChildren(listItems);
						});
					});
				});
			}
			base.load = function () {
				// for each target, gather data and evaluate in terms of each process function. Store as virtual list.
				if (base.dataset.length !== 0) {
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
						datasets.forEach(function (dataset) {
							dataset.forEach(function (datum) {
								base.dataset.push(datum);
							});
						});
					}).then(function () {
						// load filters
						return Promise.all(base.targets.map(function (target) {
							return new Promise(function(resolve, reject) {
								base.filters[target.filter.char] = target.filter;
								if (target.filter.default && base.defaultFilters.indexOf(target.filter.rule) === -1) {
									base.defaultFilters.push(target.filter.rule);
								}
								resolve();
							});
						}));
					});
					// All data to be filtered now lives in base.dataset.
				}
			}
			base.filter = function (query, filter) {
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
							return base.defaultFilters.contains(datum.rule) && datum.main.toLowerCase().indexOf(query.toLowerCase()) === 0 && !(base.autocomplete && query === '');
						});
					}

					resolve();
				});
			}
			base.setMetadata = function (query) {
				base.query = ((base.query || query) || '');
				// condition is that there are filtered items and the query is not nothing

				var metadata = {};
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
				options = (options || {});
				var set = (options.set || base.list.components.wrapper.children);

				// if there are any results
				if (set.length && base.isFocussed) {

					// changes
					var previousIndex = base.currentIndex;
					base.currentIndex = (options.index || ((base.currentIndex || 0) + (options.increment || 0)));

					// boundary conditions
					base.currentIndex = base.currentIndex > set.length - 1 ? set.length - 1 : (base.currentIndex < 0 ? 0 : base.currentIndex);

					if (base.currentIndex !== previousIndex) {
						return ((base.active || {}).deactivate || emptyPromise)().then(function () {
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

			// list methods
			base.next = function () {
				return base.setActive({increment: 1}).then(function () {
					return base.setMetadata();
				});
			}
			base.previous = function () {
				return base.setActive({increment: -1}).then(function () {
					return base.setMetadata();
				});
			}

			// activate search
			base.toggleSearch = function () {

			}

			// set title
			base.setTitle = function (text, center) {
				return title.set(text, center);
			}

			// behaviours
			base.behaviours = {
				up: function () {
					return base.previous();
				},
				down: function () {
					return base.next();
				},
				left: function () {
					return search.behaviours.left();
				},
				right: function () {
					return search.behaviours.right();
				},
				number: function (char) {
					var index = parseInt(char);
					if (index < base.list.components.wrapper.children.length && base.query) {
						return base.setActive(index).then(function (index) {
							return base.setCurrent(base.list.components.wrapper.children, base.query, index);
						}).then(function () {
							return search.behaviours.enter(); // behaviour could also be "right" here.
						});
					}
				},
				enter: function () {
					return search.behaviours.enter();
				},
				backspace: function () {
					return search.behaviours.backspace();
				},
			}

			// clone
			base.clone = function (copy) {
				// confusing, but properties of copy get sent to this object.
				base.autocomplete = copy.autocomplete;
				base.targets = copy.targets;
				base.list = copy.list;
				base.unit = copy.unit;
			}

			// set title
			title.set = function (text, centre) {
				return title.setAppearance({
					html: text,
					style: {
						'text-align': (centre ? 'center': 'left'),
					},
				});
			}

			// search input methods
			search.onInput = function (value) {
				base.query = value;
				return base.display(value).then(function () {
					if (base.onInput !== undefined) {
						return base.onInput(value);
					}
				});
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

			// main
			UI.createComponent('{id}-main'.format({id: id}), {
				template: UI.template('div', 'ie abs border-right centred-vertically'),
				appearance: {
					style: {
						'height': '70%',
						'width': '200px',
						'left': args.position.main.initial,
					},
				},
				children: args.children,
			}),

			// back
			UI.createComponent('{id}-back'.format({id: id}), {
				template: UI.template('div', 'ie abs border-right centred-vertically'),
				appearance: {
					style: {
						'height': '70%',
						'width': '50px',
						'left': args.position.back.initial,
					},
				},
				children: [
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
				]
			}),

		]).then(function (components) {
			// unpack components
			var [
				main,
				back,
			] = components;

			return new Promise(function(resolve, reject) {

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
							main.addState({name: state, args: onOff(args.position.main.on)});
							back.addState({name: state, args: onOff(args.position.back.off)});
						} else if (category === 'secondary') {
							main.addState({name: state, args: onOff(args.position.main.off)});
							back.addState({name: state, args: onOff(args.position.back.on)});
						} else if (category === 'deactivate') {
							main.addState({name: state, args: onOff(args.position.main.off)});
							back.addState({name: state, args: onOff(args.position.back.off)});
						}
					});
				});
				resolve([main, back]);
			});
		}).then(function (components) {
			return UI.createComponent('{id}-base'.format({id: id}), {
				template: UI.template('div', 'ie abstract'),
				appearance: {
					style: {
						'height': '100%',
					},
				},
				children: components,
			});
		});
	},

}
