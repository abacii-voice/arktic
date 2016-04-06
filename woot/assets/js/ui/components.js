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
		// contains and list and a "back" sidebar from any state it goes to.
		// the main point here is that instead of a single object being returned,
		// the call will be converted into multiple objects.
		// In this case, the return value will be a UI.component object with two children, a sidebar and
		// a back bar. The sidebar should assume all the args that are entered with some of
		// the obvious ones like state and templates simplified and taken care of.

		// 1. update args
		// initialise
		// these will be the args of the primary sidebar object
		args = args !== undefined ? args : {}; // these args will be the args of the primary sidebar object

		// args for primary sidebar
		primaryArgs = {
			template: UI.template('div', 'ie sidebar border-right centred-vertically'),
			state: {
				next: args.state.next,
				defaultState: {
					style: {
						'left': '-300px',
					},
				},
				states: args.state.states,
			},
			children: [

			],
		}
		Object.keys(primaryArgs).forEach(function (key) {
			args[key] = primaryArgs[key];
		});

		// args for back sidebar
		// state
		var backStateMap;
		var backStates = args.state.states.map(function (state) {
			if (state.args === 'next') {
				state.args = 'default';
				return {name: state.name, args: {
					style: {
						'left': '0px',
					},
				}};
			} else {
				if (state.args !== 'default') {
					backStateMap = state.name;
				}
				return {name: state.name, args: 'default'};
			}
		});

		// 2. return component
		return UI.createComponent(id, {
			children: [
				UI.createComponent('{id}-primary'.format({id: id}), args),
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
						}),
					],
				})
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
