
// 1. define component tree
UI.createApp('hook', [

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
				options: {
					title: 'Title',
					scroll: true,
					sort: true,
					search: {

						// This defines what is being searched for, i.e. paths in context.
						target: function () {

						},

						// This defines how to respond to a query.
						query: function (query) {
							// 'query' is the text entered by the user after having been cleaned by the standard function
							return function (resolve, reject) {
								// This returns a function ready for a promise to use in the response chain.

								resolve();
							}
						},

						// This filters a search in progress by the currently imposed filter.
						filter: function (query) {
							return function (resolve, reject) {
								// This returns a function ready for a promise to use in the response chain.

								resolve();
							}
						},
					},

					// Define a way of display individual list items
					display: function (id, data) {
						// 'data' is a single unit of the full dataset to be included.
						var unit = UI.createComponent('{id}-{key}'.format({id: id, key: data.key}), {
							root: id,
							template: UI.template('div', 'ie button'),
							appearance: {
								style: {

								},
							},
							children: [
								UI.createComponent('{id}-{key}-main'.format({id: id, key: data.key}), {
									template: UI.template('span', 'ie'),
								}),
								UI.createComponent('{id}-{key}-tag'.format({id: id, key: data.key}), {
									template: UI.template('span', 'ie'),
								}),
								UI.createComponent('{id}-{key}-index'.format({id: id, key: data.key}), {
									template: UI.template('span', 'ie'),
								}),
							],
						});

						unit.render();
					}
				},
			}),
		],
	}),
]);

UI.renderApp('client-state');


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
