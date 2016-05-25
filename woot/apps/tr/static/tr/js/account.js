
// 1. define component tree
UI.app('hook', [

	// COMPONENT TESTING
	// autocomplete field
	UI.createComponent('test-autocomplete-wrapper', {
		template: UI.template('div', ''),
		appearance: {
			style: {
				'position': 'relative',
				'height': '600px',
				'width': '300px',
				'left': '50%',
				'top': '50%',
				'transform': 'translate(-50%, -50%)',
			},
		},
		children: [
			Components.scroll('test-scroll', {
				appearance: {
					style: {
						'height': '100%',
						'width': '100%',
					}
				},

				// modifiers and features
				options: {

					// Simple text title
					title: 'Title',

					// If the data is to be sorted.
					sort: true,

					// This defines what is being searched for, i.e. paths in context.
					// This is the source of the data for the list.
					targets: {
						'clients': {
							// default targets are always displayed if no filter is applied
							default: true,

							// url for requests, should return things in expected form
							url: function () {
								// return 'search/clients';
								return '';
							},

							// path in Context
							path: function () {
								return 'clients';
							},

							// process search results from the path.
							process: function (data) {
								// expects structure like:
								// unit: {
								// 	id: 'id',
								// 	main: 'text',
								// 	tag: 'text',
								// 	index: '0',
								// },

								return new Promise(function(resolve, reject) {
									var results = Object.keys(data).map(function (key, index) {
										var client = data[key];
										return {
											id: key,
											main: client.name,
											index: index,
										}
									});

									resolve(results);
								});
							},

							// filter
							filter: {
								char: '/',
								key: 'forwardslash',
								display: 'Clients',
								button: 'Clients',
								rule: 'client',
							},
						},
					},

					// Defines the search bar.
					search: {
						// Autocomplete tells the filter panel (if present) to be shown first, else show nothing until a query is submitted.
						autocomplete: true,

						// Filter tells the element what structure to give to the filter panel, buttons, etc.
						filter: true,
					},

					// Define a way of display individual list items
					display: {
						list: function (_this) {
							return function (display) {
								// 'data' is a single unit of the full dataset to be included.
								return UI.createComponent('{id}-{key}'.format({id: _this.id, key: display.id}), {
									root: _this.id,
									template: UI.template('div', 'ie button border-bottom'),
									appearance: {
										style: {
											'width': '100%',
											'height': '80px',
										},
									},
									children: [
										UI.createComponent('{id}-{key}-main'.format({id: _this.id, key: display.id}), {
											template: UI.template('span', 'ie'),
											appearance: {
												style: {

												},
												html: '{main}'.format({main: display.main}),
											},
										}),
										UI.createComponent('{id}-{key}-index'.format({id: _this.id, key: display.id}), {
											template: UI.template('span', 'ie'),
											appearance: {
												style: {

												},
												html: '{index}'.format({index: display.index}),
											},
										}),
									],
								}).then(function (unit) {
									return unit.render();
								});
							}
						},
						filter: function (id) {
							return function (display, index) {
								return UI.createComponent('{id}-{key}'.format({id: id, key: display.key}), {
									index: index,
									root: id,
									template: UI.template('div', 'ie button border-bottom'),
									appearance: {
										style: {
											'width': '100%',
											'height': '60px',
											'padding-top': '20px',
										},
									},
									bindings: {
										// 'click' occurs on mouseup, so any blur will happen before it.
										// 'mousedown' occurs before 'blur'.
										'mousedown': {
											'fn': function (_this) {
												_this.parent().then(function (parent) {
													parent.set(display);
												});
											},
										}
									},
									children: [
										UI.createComponent('{id}-{key}-text'.format({id: id, key: display.key}), {
											template: UI.template('span'),
											appearance: {
												html: '"{char}" : {main}'.format({char: display.char, main: display.display}),
											},
										}),
									],
								});
							}
						},
					},
				},
			}),
		],
	}),
]).then (function (app) {
	return app.render();
}).then(function () {
	return UI.changeState('client-state');
}).catch(function (error) {
	console.log(error);
});

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
