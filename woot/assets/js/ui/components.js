var Components = {
	breadcrumbs: function (id, args) {
		// displays position in heirarchy
		return UI.createComponent(id, args);
	},

	scrollList: function (id, args) {
		// search field toggle
		// scroll toggle
		// infinite scroll loading
		return UI.createComponent(id, args);
	},

	listButton: function (id, args) {
		// displays a title, but also other information at key points
		return UI.createComponent(id, args);
	},

	scrollPanel: function (id, args) {
		// simple scroll wrapper and container for a bunch of divs or whatever
		return UI.createComponent(id, args);
	},

	searchFilterField: function (id, args) {
		// pop over panel for filter suggestions and search results
		// keywords and functions
			// eg. ".." -> function () {} - search for single words
			// "worker" -> filter by workers
		return UI.createComponent(id, args);
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


// UI.createComponent('client-sidebar', {
// 	template: UI.template('div', 'ie sidebar border-right centred-vertically'),
// 	state: {
// 		defaultState: {
// 			style: {
// 				'left': '-300px',
// 				'display': 'none',
// 			},
// 		},
// 		states: [
// 			{name: 'client-state', args: {
// 				style: {
// 					'left': '0px',
// 					'display': 'block',
// 				},
// 			}},
// 			{name: 'role-state', args: 'default'},
// 			{name: 'control-state', args: 'default'},
// 			{name: 'user-management-state', args: 'default'},
// 		],
// 	},
// 	children: [
// 		UI.createComponent('cs-title', {
// 			template: UI.template('h4', 'ie sidebar-title centred-horizontally show'),
// 			appearance: {
// 				html: 'Clients',
// 				style: {
// 					'height': '40px',
// 				},
// 			},
// 		}),
// 		UI.createComponent('cs-client-list-wrapper', {
// 			template: UI.template('div', 'ie scroll-wrapper show'),
// 			appearance: {
// 				style: {
// 					'position': 'relative',
// 					'top': '40px',
// 					'height': 'calc(100% - 40px)',
// 				},
// 			},
// 			children: [
// 				UI.createComponent('cs-client-list', {
// 					template: UI.template('div', 'ie scroll show'),
// 					registry: {
// 						path: function () {
// 							return ['clients'];
// 						},
// 						fn: function (_this, data) {
// 							// create buttons from Context and remove loading icon
// 							// 'data' is a list of client names
//
// 							// remove loading button
// 							var loadingIcon = UI.getComponent('cs-loading-icon');
// 							loadingIcon.model().fadeOut();
//
// 							var clientList = Object.keys(data);
//
// 							// map data to new buttons
// 							clientList.sort(alphaSort()).forEach(function (clientName) {
// 								var child = UI.createComponent('cs-{name}-button'.format({name: clientName}), {
// 									root: _this.id,
// 									template: UI.templates.button,
// 									appearance: {
// 										style: {
// 											'opacity': '0.0',
// 										},
// 										html: '{name}'.format({name: clientName}),
// 									},
// 									state: {
// 										svitches: [
// 											{stateName: 'role-state', fn: function (_this) {
// 												Context.set('current_client', clientName);
// 											}},
// 										],
// 										stateMap: {
// 											'client-state': 'role-state',
// 										},
// 									},
// 									bindings: [
// 										{name: 'click', fn: function (_this) {
// 											_this.triggerState();
// 										}}
// 									],
// 								});
//
// 								_this.children[child.id] = child;
// 								child.render();
//
// 								// make buttons visible
// 								child.model().css({'opacity': '1.0'});
// 							});
// 						}
// 					},
// 				}),
// 				UI.createComponent('cs-loading-icon', {
// 					template: UI.templates.loadingIcon,
// 					appearance: {
// 						classes: ['ie centred show'],
// 					},
// 				}),
// 			],
// 		}),
// 	],
// }),
// UI.createComponent('client-back-sidebar', {
// 	template: UI.template('div', 'ie sidebar mini border-right centred-vertically'),
// 	state: {
// 		defaultState: {
// 			style: {
// 				'left': '-100px',
// 			}
// 		},
// 		states: [
// 			{name: 'client-state', args: 'default'},
// 			{name: 'role-state', args: {
// 				style: {
// 					'left': '0px',
// 				},
// 			}},
// 			{name: 'control-state', args: 'default'},
// 		],
// 	},
// 	children: [
// 		UI.createComponent('cbs-back-button', {
// 			template: UI.templates.button,
// 			state: {
// 				stateMap: 'client-state',
// 			},
// 			children: [
// 				UI.createComponent('cbs-bb-span', {
// 					template: UI.template('span', 'glyphicon glyphicon-chevron-left'),
// 				}),
// 			],
// 			bindings: [
// 				{name: 'click', fn: function (_this) {
// 					_this.triggerState();
// 				}}
// 			],
// 		}),
// 	],
// }),
