
// 1. define component tree
// UI.app('hook', [
//
// 	// COMPONENT TESTING
// 	// autocomplete field
// 	UI.createComponent('test-autocomplete-wrapper', {
// 		template: UI.template('div', ''),
// 		appearance: {
// 			style: {
// 				'position': 'relative',
// 				'height': '600px',
// 				'width': '300px',
// 				'left': '50%',
// 				'top': '50%',
// 				'transform': 'translate(-50%, -50%)',
// 			},
// 		},
// 		children: [
// 			Components.scroll('test-scroll', {
// 				appearance: {
// 					style: {
// 						'height': '100%',
// 						'width': '100%',
// 					}
// 				},
//
// 				// modifiers and features
// 				options: {
//
// 					// Simple text title
// 					title: 'Title',
//
// 					// If the data is to be sorted.
// 					sort: true,
//
// 					// This defines what is being searched for, i.e. paths in context.
// 					// This is the source of the data for the list.
// 					target: {
// 						path: function () {
// 							return 'clients';
// 						},
// 						// url: 'commands/transcription_set/', // expects a list of stuff obviously
//
// 						// convert target into a list if it is not already.
// 						process: function (_this, data) {
// 							// 'data' is the lump of stuff returned from the path.
// 							return Promise.all(Object.keys(data).map(function (key, i) {
// 								// process client list
// 								var display = {
// 									main: data[key].name,
// 									index: i,
// 									tag: 'tag',
// 									key: key,
// 								}
//
// 								_this.buffer[key] = display;
//
// 								return display;
// 							}).map(_this.display(_this)));
// 						},
//
// 						states: [
// 							'client-state',
// 						],
// 					},
//
// 					// Define a way of display individual list items
// 					display: function (_this) {
// 						return function (display) {
// 							// 'data' is a single unit of the full dataset to be included.
// 							return UI.createComponent('{id}-{key}'.format({id: _this.id, key: display.key}), {
// 								root: _this.id,
// 								template: UI.template('div', 'ie button border-bottom'),
// 								appearance: {
// 									style: {
// 										'width': '100%',
// 										'height': '80px',
// 									},
// 								},
// 								children: [
// 									UI.createComponent('{id}-{key}-main'.format({id: _this.id, key: display.key}), {
// 										template: UI.template('span', 'ie'),
// 										appearance: {
// 											style: {
//
// 											},
// 											html: '{main}'.format({main: display.main}),
// 										},
// 									}),
// 									UI.createComponent('{id}-{key}-tag'.format({id: _this.id, key: display.key}), {
// 										template: UI.template('span', 'ie'),
// 										appearance: {
// 											style: {
//
// 											},
// 											html: '{main}'.format({main: display.tag}),
// 										},
// 									}),
// 									UI.createComponent('{id}-{key}-index'.format({id: _this.id, key: display.key}), {
// 										template: UI.template('span', 'ie'),
// 										appearance: {
// 											style: {
//
// 											},
// 											html: '{main}'.format({main: display.index}),
// 										},
// 									}),
// 								],
// 							}).then(function (unit) {
// 								return unit.render();
// 							});
// 						}
// 					},
//
// 					// Defines the search bar.
// 					search: {
// 						// Autocomplete tells the filter panel (if present) to be shown first, else show nothing until a query is submitted.
// 						autocomplete: true,
//
// 						// Filter tells the element what structure to give to the filter panel, buttons, etc.
// 						filter: {
// 							options: [
// 								{key: 'forwardslash', args: {
// 									char: '/',
// 									main: 'Display only rules',
// 									status: 'Rules',
// 									rule: 'rules',
// 								}},
// 							],
//
// 							// How to display an individual option.
// 							display: function (id) {
// 								return function (display, index) {
// 									return UI.createComponent('{id}-{key}'.format({id: id, key: display.key}), {
// 										index: index,
// 										root: id,
// 										template: UI.template('div', 'ie button border-bottom'),
// 										appearance: {
// 											style: {
// 												'width': '100%',
// 												'height': '60px',
// 												'padding-top': '20px',
// 											},
// 										},
// 										bindings: {
// 											// 'click' occurs on mouseup, so any blur will happen before it.
// 											// 'mousedown' occurs before 'blur'.
// 											'mousedown': {
// 												'fn': function (_this) {
// 													_this.parent().then(function (parent) {
// 														parent.set(display.args);
// 													});
// 												},
// 											}
// 										},
// 										children: [
// 											UI.createComponent('{id}-{key}-text'.format({id: id, key: display.key}), {
// 												template: UI.template('span'),
// 												appearance: {
// 													html: '"{char}" : {main}'.format({char: display.args.char, main: display.args.main}),
// 												},
// 											}),
// 										],
// 									});
// 								}
// 							}
// 						},
//
// 						// Instructions on how to process queried data.
// 						process: {
// 							// This defines how to respond to a query.
// 							// This is a filter in a way, as in the total list of results will be filtered based on the query,
// 							// but it does not respond to any filter other than the query.
// 							query: function (query) {
// 								// 'query' is the text entered by the user after having been cleaned by the standard function
// 								return function (resolve, reject) {
// 									// This returns a function ready for a promise to use in the response chain.
//
// 									resolve();
// 								}
// 							},
//
// 							// This filters a search in progress by the currently imposed filter.
// 							filter: function (query) {
// 								return function (resolve, reject) {
// 									// This returns a function ready for a promise to use in the response chain.
//
// 									resolve();
// 								}
// 							},
// 						},
// 					},
// 				},
// 			}),
// 		],
// 	}),
// ]).then (function (app) {
// 	return app.render();
// }).then(function () {
// 	return UI.changeState('client-state');
// }).catch(function (error) {
// 	console.log(error);
// });

// Search would go something like:
// enterText (text) {
// 	return this.clean(text).then(this.query).then(this.filter).then(function (listOfSearchResults) {
// 		listOfSearchResults.forEach(function (searchResult) {
//
// 			searchResult = {
// 				body: 'Piano, Nicholas',
// 				tag: 'user',
// 				index: '#1',
// 			}
//
// 			if () {
// 				result = UI.createComponent('id based on id or whatever', {
// 					// stuff
// 				});
//
// 				result.render();
// 			}
// 		});
// 	});
// }
