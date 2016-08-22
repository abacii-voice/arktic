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
		defaultAppearance = {
			style: {
				'width': '100%',
			},
			classes: ['border', 'border-radius'],
		}

		// set up components
		return Promise.all([
			// base component
			UI.createComponent('{id}-base'.format({id: id}), {
				template: UI.template('div', 'ie input'),
				appearance: (args.appearance || defaultAppearance),
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

		]).then(function (components) {
			// unpack components
			var [
				base,
				head,
				tail,
			] = components;

			// variables
			base.textLength = 0;
			base.caretOffset = 0;
			base.caretAtEnd = false;

			// logic, bindings, etc.
			base.setCurrent = function (current, condition) {
				base.current = current;
				return tail.setAppearance({html: condition ? base.current.query : ''});
			}

			base.complete = function () {
				return tail.setAppearance({html: ''}).then(function () {
					return head.setAppearance({html: base.current.complete});
				}).then(function () {
					head.model().focus();
					setEndOfContenteditable(head.element());
				});
			}

			base.increment = function (decrement) {
				return new Promise(function(resolve, reject) {
					base.textLength = head.model().text().length;
					resolve();
				}).then(function () {
					return new Promise(function(resolve, reject) {
						var increment = (decrement ? -1 : 1 || 1);
						if (base.caretOffset + increment >= 0 && base.caretOffset + increment <= base.textLength) {
							base.caretOffset += increment;
						}
						base.caretOffset = base.caretOffset > base.textLength ? base.textLength : base.caretOffset;
						resolve();
					});
				});
			}

			base.clear = function () {
				return new Promise(function(resolve, reject) {
					head.model().html('');
					head.model().trigger('input');
					resolve();
				});
			}

			// behaviours
			base.behaviours = {
				right: function () {
					return base.increment().then(function () {
						if (base.caretAtEnd) {
							return base.complete();
						}
					});
				},
				left: function () {
					return base.increment(true);
				},
				enter: function () {
					// 1. complete
					return base.complete().then(function () {
						// 2. pass data upwards
						if (base.onComplete !== undefined) {
							return base.onComplete();
						}
					}).then(function () {
						// 3. clear
						return base.clear();
					});
				},
				backspace: function () {
					return base.increment(true);
				},
				click: function () {
					// find caret
					return new Promise(function(resolve, reject) {
						base.caretOffset = getCaretOffsetWithin(base.element());
						base.caretAtEnd = base.caretOffset === head.model().html().length;
						resolve();
					});
				}
			}

			// complete promises.
			return Promise.all([
				base.setBindings({
					'input': function (_this) {
						var value = head.model().text();
						_this.increment().then(function () {
							if (_this.onInput !== undefined) {
								return _this.onInput(value);
							}
						});
					},
					'click': function (_this) {
						head.model().focus();
						return _this.behaviours.click();
					}
				}),
			]).then(function (results) {
				base.components = {
					head: head,
					tail: tail,
				}
				return base.setChildren([
					tail, // must be underneath
					head,
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
				'width': '100%',
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
					},
				},
			}),

			// search input
			Components.search('{id}-search'.format({id: id}), {

			}),

			// filter button
			UI.createComponent('{id}-filter-button'.format({id: id}), {
				template: UI.template('div', 'ie button'),
			}),

			// list
			Components.contentPanel('{id}-list'.format({id: id}), {

			}),

			// filter
			Components.contentPanel('{id}-filter'.format({id: id}), {

			}),

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
			base.display = function (query, filter) {
				return base.load().then(function () {
					return base.filter(query, filter); // returns a reduced dataset
				}).then(function () {
					return base.list.removeAll();
				}).then(function () {
					return Promise.all(base.virtual.map(function (item) {
						return base.unit(base, item, query);
					})).then(function (listItems) {
						if (listItems.length !== 0 && !(!base.autocomplete && (query === '' || query === undefined))) {
							listItems[0].activate();
						}
						return base.setCurrent(listItems, query, 0).then(function () {
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
			base.setCurrent = function (listItems, query, index) {
				var condition = (listItems.length !== 0 && query !== undefined && query !== '');
				var current = {
					complete: listItems.length !== 0 ? listItems[index].original : '',
					query: listItems.length !== 0 ? listItems[index].query : '',
					type: listItems.length !== 0 ? listItems[index].type : '',
				}
				return search.setCurrent(current, condition);
			}

			// control active list item
			base.next = function () {
				return new Promise(function(resolve, reject) {
					// 1. get new active with next index
					if (base.active.index < base.list.components.wrapper.children.length - 1) {
						var index = base.active.index + 1;
						base.setActive(index);
					}
					resolve(index);
				}).then(function (index) {
					if (index !== undefined) {
						return base.setCurrent(base.list.components.wrapper.children, base.query, index);
					}
				});
			}
			base.previous = function () {
				return new Promise(function(resolve, reject) {
					// 1. get new active with next index
					if (base.active.index > 0) {
						var index = base.active.index - 1;
						base.setActive(index);
					}
					resolve(index);
				}).then(function (index) {
					if (index !== undefined) {
						return base.setCurrent(base.list.components.wrapper.children, base.query, index);
					}
				});
			}
			base.setActive = function (index) {
				base.active.deactivate();
				base.active = base.list.components.wrapper.children.filter(function (child) {
					return child.index === index;
				})[0];
				base.active.activate();
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

				},
				enter: function () {
					return search.behaviours.enter();
				},
				backspace: function () {
					return search.behaviours.backspace();
				},
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
