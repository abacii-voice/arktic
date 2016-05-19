
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

				// modifiers and features
				options: {
					title: 'Title',
					scroll: true,
					sort: true,
					filter: true,
					search: {

						// This defines what is being searched for, i.e. paths in context.
						target: {
							path: 'clients',
							// url: 'commands/transcription_set/', // expects a list of stuff obviously

							// convert target into a list if it is not already.
							process: function (_this, data) {
								// 'data' is the lump of stuff returned from the path.
								return function (resolve, reject) {

									// process client list
									Object.keys(data).forEach(function (key, i) {
										var display = {
											main: data[key].name,
											index: i,
											tag: 'tag',
											key: key,
										}

										_this.display(_this, display);
									});

									resolve();
								}
							}
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
					display: function (_this, data) {
						// 'data' is a single unit of the full dataset to be included.
						var unit = UI.createComponent('{id}-{key}'.format({id: _this.id, key: data.key}), {
							root: _this.id,
							template: UI.template('div', 'ie button border-bottom'),
							appearance: {
								style: {
									'width': '100%',
									'height': '80px',
								},
							},
							children: [
								UI.createComponent('{id}-{key}-main'.format({id: _this.id, key: data.key}), {
									template: UI.template('span', 'ie'),
									appearance: {
										style: {

										},
										html: '{main}'.format({main: data.main}),
									},
								}),
								UI.createComponent('{id}-{key}-tag'.format({id: _this.id, key: data.key}), {
									template: UI.template('span', 'ie'),
									appearance: {
										style: {

										},
										html: '{main}'.format({main: data.tag}),
									},
								}),
								UI.createComponent('{id}-{key}-index'.format({id: _this.id, key: data.key}), {
									template: UI.template('span', 'ie'),
									appearance: {
										style: {

										},
										html: '{main}'.format({main: data.index}),
									},
								}),
							],
						});

						unit.render();
					}
				},

				// children of the filter panel
				filter: [

				],
			}),
		],
	}),
]).then (function (app) {
	return new Promise(function(resolve, reject) {
		app.render();
		resolve();
	}).then(function () {
		UI.changeState('client-state');
	});
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
