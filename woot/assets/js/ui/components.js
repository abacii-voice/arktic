// These components are larger abstractions built on the back of the generalised component system.

var Components = {

	// CONTENT PANEL
	// Nested panel components meant to hide scroll bar.
	contentPanel: function (id, args) {
		// config
		args.appearance.style['overflow'] = 'hidden';

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

		// set up components
		return Promise.all([
			// base component
			UI.createComponent(id, {
				template: UI.template('input', 'ie input'),
				appearance: args.appearance,
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
		// SETUP
		// arg setup and initialisation
		// - if no title is given, leave no room for a title.
		// - if no search is given, leave no room for an input.
		// - looking for final variable 'listHeight'
		var listHeight = '100%', offset = 0, titleText = '', titleCentered = false, search, titleHeight = 22;
		var searchHeight = args.interface !== undefined ? args.interface.size : 40;
		if (args.options !== undefined) {
			// title
			if (args.options.title !== undefined) {
				titleText = args.options.title.text;
				titleCentered = args.options.title.center;
				offset += titleHeight;
			}

			// search
			if (args.options.search !== undefined) {
				search = args.options.search;
				offset += searchHeight;
			}

			// listHeight
			listHeight = 'calc(100% - {offset}px)'.format({offset: offset});

			// reset
			if (!$.isArray(args.options.reset)) {
				args.options.reset = [args.options.reset];
			}
		}

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
						'text-align': (titleCentered ? 'center' : 'left'),
					},
					html: titleText,
				},
			}),

			// search input
			Components.searchInput('{id}-search'.format({id: id}), {

			}),

			// content
			Components.contentPanel('{id}-content'.format({id: id}), {
				appearance: defaultAppearance,
			}),

			Components.contentPanel('{id}-filter'.format({id: id}), {
				appearance: defaultAppearance,
			}),

		]).then(function (components) {
			// unpack components
			var [
				base,
			] = components;

			// set up promises to be completed before returning the base.
			// logic, bindings, etc.
			base.load = function () {

			}
			base.insert = function (index, data) {
				// use base.unit method

			}
			base.remove = function (index) {
				

			}

			// complete promises.
			return Promise.all([

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
