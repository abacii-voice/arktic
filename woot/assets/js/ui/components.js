// These components are larger abstractions built on the back of the generalised component system.

var Components = {

	// CONTENT PANEL
	// Nested panel components meant to hide scroll bar.
	contentPanel: function (id, args) {
		// config


		// set up components
		return Promise.all([
			// base component
			UI.createComponent('{id}-base'.format({id: id}), {
				template: UI.template('div', 'ie'),
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
			base.add = function (childComponent) {
				return wrapper.addChild(childComponent);
			}
			base.remove = function (id) {
				return wrapper.removeChild(id);
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
	searchInput: function (id, args) {
		// config
		defaultAppearance = {
			style: {
				'height': '40px',
				'width': '100%',
			},
		}

		// set up components
		return Promise.all([
			// base component
			UI.createComponent(id, {
				template: UI.template('input', 'ie input'),
				appearance: (args.appearance || defaultAppearance),
			}),

		]).then(function (components) {
			// unpack components
			var [
				base,
			] = components;

			// set up promises to be completed before returning the base.
			var setInputBindings = function () {
				return base.setBindings({
					'input': function (_this) {
						var value = _this.model().val();

						if (_this.onInput !== undefined) {
							_this.onInput(value);
						}
					},
				});
			}

			// logic, bindings, etc.
			base.clear = function () {
				return new Promise(function(resolve, reject) {
					base.model().val('');
					resolve();
				});
			}
			base.focus = function () {
				return new Promise(function(resolve, reject) {
					base.model().focus();
					resolve();
				});
			}

			// complete promises.
			return Promise.all([
				setInputBindings(),
			]).then(function (results) {
				base.components = {

				}
				return base.setChildren([

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
			Components.searchInput('{id}-search'.format({id: id}), {

			}),

			// filter button
			UI.createComponent('{id}-filter-button'.format({id: id}), {
				template: UI.template('div', 'ie button'),
			}),

			// content
			Components.contentPanel('{id}-content'.format({id: id}), {

			}),

			// filter
			Components.contentPanel('{id}-filter'.format({id: id}), {

			}),

		]).then(function (components) {
			// unpack components
			var [
				base,
				title,
				searchInput,
				listPanel,
				filterPanel,
			] = components;

			// set up promises to be completed before returning the base.
			// logic, bindings, etc.
			base.dataset = [];
			base.buffer = [];
			base.virtual = [{id: '8b7d36ef-3387-40a8-a98d-3541110e161f'}, {id: '05ff19e5-446f-43cb-ae3e-8b2a3f7d5a40'}, {id: 'a'}];
			base.filters = {};
			base.defaultFilters = [];
			base.display = function (query, filter) {
				// 1. load
				// 2. filter by nothing for defaults
				// 3. diff on nothing
				// 4. run commands in sequence
				return base.load().then(function () {
					return base.filter(query, filter); // returns a reduced dataset
				}).then(function () {
					return base.resolve(); // compare base.buffer and base.virtual and generate list of commands
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
						base.buffer = base.dataset.filter(function (datum) {
							return datum.rule.indexOf(rule) === 0 && datum.main.toLowerCase().indexOf(query) === 0;
						});
					} else {
						base.buffer = base.dataset.filter(function (datum) {
							return base.defaultFilters.contains(datum.rule);
						});
					}

					resolve();
				});
			}
			base.resolve = function () {
				return new Promise(function(resolve, reject) {
					// compares base.buffer and base.virtual
					// outputs list of commands necessary to execute to achieve change.
					// 1. find max length to iterate over
					var commands = {};
					var build = base.virtual; // a copy of the current order
					var length = base.buffer.length > base.virtual.length ? base.buffer.length : base.virtual.length;
					for (i = 0; i < length; i++) {
						// 2. get ids to be compared
						var bufferId = i < base.buffer.length ? base.buffer[i].id : '';
						var virtualId = i < base.virtual.length ? base.virtual[i].id : '';

						// 3. unless the id is blank, generate a command to insert or remove
						if (bufferId !== virtualId) {
							if (bufferId) {
								// insert
								commands[bufferId] = (commands[bufferId] || {});
								commands[bufferId].insert = i;
							}

							if (virtualId) {
								// remove
								commands[virtualId] = (commands[virtualId] || {});
								commands[virtualId].remove = i;
							}
						}
					}

					// 4. given list of commands, for each remove, if there is an insert with the same id, change to move.
					var segmentedCommands = {'remove': [], 'move': [], 'insert': []};
					Object.keys(commands).forEach(function (id) {
						var command = commands[id];
						var newCommand = {};
						if ('insert' in command) {
							newCommand[id] = command.insert;
							segmentedCommands[('remove' in command ? 'move' : 'insert')].push(newCommand);
						} else {
							newCommand[id] = command.remove
							segmentedCommands.remove.push(newCommand);
						}
					});

					////// NOT FOR REAL
					// 5a. do removal
					segmentedCommands.remove.forEach(function (command) {
						var [id, index] = singleKeyPair(command);
						base.build.splice(index, 1);
					});

					// 5b. do insertion
					segmentedCommands.insert.forEach(function (command) {
						var [id, index] = singleKeyPair(command);
						base.build.splice(index, 0, id);
					});

					// 5c. do moving - test moves
					segmentedCommands.move.forEach(function (command) {
						var [id, index] = singleKeyPair(command);
						base.build.splice(index, 0);
						base.build.splice(index, 0, id);
					});

					console.log(base.virtual, base.build, base.buffer);

					resolve(segmentedCommands);
				}).then(function (commands) {
					////// FOR REAL

					// 6. removal
					return Promise.all(commands.remove.map(function (command) {
						var [id, index] = singleKeyPair(command);
						return base.remove(id, index);
					})).then(function () {
						// 7. insertion
						return Promise.ordered(commands.insert.map(function (command) {

						}));
					}).then(function () {
						// 8. moving
						return Promise.ordered(commands.move.map(function (command) {

						}));
					});
				});
			}
			base.insert = function (index, datum) {
				return new Promise(function(resolve, reject) {
					// 1. add to base.virtual
					base.virtual.splice(index, 0, datum);
					resolve();
				}).then(function () {
					return // use base.unit method
					listPanel.add(base.unit(datum));
				});
			}
			base.remove = function (id, index) {
				return new Promise(function(resolve, reject) {
					// 1. remove from base.virtual
					base.virtual.splice(index, 1);
					resolve();
				}).then(function () {
					// 2. remove from parent
					return listPanel.remove(id);
				});
			}
			base.move = function (fromIndex, toIndex) {

			}

			// activate search
			base.toggleSearch = function () {

			}

			// set title
			base.setTitle = function (text, center) {

			}

			// set title
			title.set = function (text, centre) {
				title.setAppearance({
					html: text,
					style: {
						'text-align': (centre ? 'center': 'left'),
					},
				});
			}

			// search input methods


			// complete promises.
			return Promise.all([

			]).then(function (results) {
				base.components = {
					title: title,
					searchInput: searchInput,
					listPanel: listPanel,
					filterPanel: filterPanel,
				}
				return base.setChildren([
					title,
					searchInput,
					listPanel,
					filterPanel,
				]);
			}).then(function () {
				return base;
			});
		});
	},

	// AUTOCOMPLETE
	// Slightlight modified searchableList
	autocomplete: function (id, args) {

	},

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
