var Components = {
	breadcrumbs: function (id, args) {
		// displays position in heirarchy
		return UI.createComponent(id, args);
	},

	scrollList: function (id, args) {
		// search field toggle
		// scroll toggle
		// infinite scroll loading

		// 1. set search and filter toggles
		var showTitle = args.title !== undefined ? 'show' : '';
		var showSearch = args.search !== undefined ? 'show' : '';
		var scrollHeight = args.search !== undefined ? 'calc(100% - 30px)' : '100%';
		scrollHeight = args.title !== undefined ? 'calc(100% - 60px)' : scrollHeight;

		var scrollOverflow = args.scroll !== undefined ? (args.scroll ? 'scroll' : 'hidden') : 'scroll';
		var showLoadingIcon = args.loadingIcon !== undefined ? (args.loadingIcon ? 'show' : '') : '';

		var container = UI.createComponent(id, {
			template: UI.template('div', 'ie scroll-wrapper show relative'),
			appearance: args.appearance,
			children: [
				UI.createComponent('{id}-title'.format({id: id}), {
					template: UI.template('h4', 'ie sidebar-title'),
					appearance: {
						html: args.title,
						style: {
							'height': '30px',
						},
						classes: ['relative', showTitle],
					},
				}),
				Components.searchFilterField('{id}-search'.format({id: id}), {
					show: showSearch,
				}),
				UI.createComponent('{id}-scroll'.format({id: id}), {
					template: UI.template('div', 'ie scroll show relative'),
					appearance: {
						style: {
							'height': scrollHeight,
							'overflow-y': scrollOverflow,
						},
					},
					state: args.state,
					children: args.content,
					registry: args.registry,
				}),
				UI.createComponent('{id}-filter'.format({id: id}), {
					template: UI.template('div', 'ie scroll relative'),
					appearance: {
						style: {
							'height': 'calc(100% - 30px)',
						},
					},
				}),
				UI.createComponent('{id}-loading-icon'.format({id: id}), {
					template: UI.templates.loadingIcon,
					appearance: {
						classes: [showLoadingIcon],
					},
				}),
			],
		});

		// add methods
		container.loadingIcon = function () {
			return UI.getComponent('{id}-loading-icon'.format({id: id}));
		}

		container.filter = function () {
			return UI.getComponent('{id}-filter'.format({id: id}));
		}

		container.searchField = function () {
			return UI.getComponent('{id}-search'.format({id: id}));
		}

		// return
		return container;
	},

	searchFilterField: function (id, args) {
		// pop over panel for filter suggestions and search results
		// keywords and functions
			// eg. ".." -> function () {} - search for single words
			// "worker" -> filter by workers
		var show = args.show !== undefined ? args.show : '';

		var container =	UI.createComponent(id, {
			template: UI.template('input', 'ie input relative'),
			appearance: {
				style: {
					'width': '100%',
					'margin-bottom': '10px',
				},
				classes: [show],
				properties: {
					'placeholder': 'Search or filter...',
				},
			},
			bindings: args.bindings,
		});

		return container;
	},

	roleIndicator: function (id, args) {
		// change based on standard conditions
		// dispatch requests for each state
		return UI.createComponent(id, args);
	},

	sidebar: function (id, args) {
		// Structure
		// Top: Container
			// a. Primary sidebar
				// i. Title container
					// - Title
				// ii. Content container
			// b. Back sidebar
				// i. Back button

		// The args entered need to be split into several different things:
		// 1. The title is the html of the Title component.
		// 2. The state primitives are split into state definitions for back and primary.
		// 3. The content array is passed to the children of the content component

		// 1. Calculate states for primary and back
		var backStateMap;
		var primaryStates = Object.keys(args.state.states).map(function (stateName) {
			var value = args.state.states[stateName];
			if (value === 'active') {
				backStateMap = stateName;
				return {name: stateName, args: args.state.active};
			} else {
				return {name: stateName, args: 'default'};
			}
		});

		var backStates = Object.keys(args.state.states).map(function (stateName) {
			var value = args.state.states[stateName];
			if (value === 'next') {
				return {name: stateName, args: {
					style: {
						'left': '0px',
					},
				}};
			} else {
				return {name: stateName, args: 'default'};
			}
		});

		// 2. Define components and return
		return UI.createComponent(id, {
			children: [
				UI.createComponent('{id}-primary'.format({id: id}), {
					template: UI.template('div', 'ie sidebar border-right centred-vertically'),
					state: {
						defaultState: {
							style: {
								'left': '-300px',
							},
						},
						states: primaryStates,
					},
					children: [
						UI.createComponent('{id}-title'.format({id: id}), {
							template: UI.template('h4', 'ie sidebar-title centred-horizontally show'),
							appearance: {
								html: args.title,
								style: {
									'height': '30px',
								},
							},
						}),
						UI.createComponent('{id}-content'.format({id: id}), {
							template: UI.template('div', 'ie show'),
							appearance: {
								style: {
									'top': '30px',
									'width': '100%',
									'height': 'calc(100% - 30px)',
								},
							},
							children: args.content,
						}),
					],
				}),
				UI.createComponent('{id}-back'.format({id: id}), {
					template: UI.template('div', 'ie sidebar mini border-right centred-vertically'),
					state: {
						defaultState: {
							style: {
								'left': '-100px',
							},
						},
						states: backStates,
					},
					children: [
						UI.createComponent('{id}-back-button'.format({id: id}), {
							template: UI.templates.button,
							state: {
								stateMap: backStateMap,
							},
							children: [
								UI.createComponent('cbs-bb-span', {
									template: UI.template('span', 'glyphicon glyphicon-chevron-left'),
								}),
							],
							bindings: [
								{name: 'click', fn: function (_this) {
									_this.triggerState();
								}}
							],
						})
					],
				}),
			],
		});
	},
}
