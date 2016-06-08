
// 1. define component tree
UI.app('hook', [

	// COMPONENT TESTING
	// autocomplete field
	UI.createComponent('test-autocomplete-wrapper', {
		template: UI.template('div', ''),
		appearance: {
			style: {
				'position': 'absolute',
				'height': '600px',
				'width': '300px',
				'left': '30%',
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
							default: false,

							// path in Context
							path: function () {
								return 'clients';
							},

							// filter to apply to request
							fltr: function () {
								return {};
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
						list: function (_this, query) {
							return function (display) {
								// set main display
								var main = query !== undefined ? '{main}'.format({main: '{head}<span style="color:#fff;">{query}</span>{tail}'.format({
									head: display.main.substring(0, display.main.indexOf(query)),
									query: display.main.substr(display.main.indexOf(query), query.length),
									tail: display.main.substr(display.main.indexOf(query) + query.length),
								})}) : display.main;

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
												html: main,
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
							return function (target, index) {
								var display = target.filter;
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
										'mousedown': function (_this) {
											_this.parent().then(function (parent) {
												parent.set(target);
											});
										},
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

	// audio test
	UI.createComponent('test-audio-wrapper', {
		template: UI.template('div', 'ie border-radius'),
		appearance: {
			style: {
				'position': 'absolute',
				'height': '50px',
				'width': '400px',
				'left': '65%',
				'top': '17%',
				'transform': 'translate(-50%, -50%)',
			},
		},
		children: [
			Components.audio('test-audio', {
				appearance: {
					style: {

					},
				},
				registry: {
					'client-state': {
						path: 'clients',
						fn: function (_this) {
							_this.update().catch(function (error) {
								console.log(error);
							});
						}
					},
				},
				options: {

					// number of loads either side of current
					trigger: 3,

					// where to gather references
					source: {

						// adaptive location in Context to fetch audio references
						path: function () {
							return Promise.all([
								Active.get('client'),
								Active.get('project'),
							]).then(function (results) {
								// unpack variables
								var client = results[0];
								var project = results[1];

								// return path
								return 'clients.{client}.projects.{project}.transcriptions'.format({client: client, project: project});
							});
						},

						// fetch active token to filter transcription references
						token: function () {
							return Promise.all([
								Active.get('client'),
								Context.get('user').then(function (user) {
									return user.id;
								}),
								Permission.get(),
							]).then(function (results) {
								// unpack variable
								var client = results[0];
								var user_id = results[1];
								var role_id = results[2];

								return 'user.clients.{client}.roles.{role_id}.active_transcription_token'.format({client: client, role_id: role_id});
							});
						},
					},
				},
			}),
		],
	}),

]).then (function (app) {
	return app.render();
}).then(function () {
	return Promise.all([
		Context.get('clients').then(function (clients) {
			var productionClient = Object.keys(clients).filter(function (key) {
				return clients[key].is_production;
			})[0];
			var project = Object.keys(clients[productionClient].projects)[0];
			return Promise.all([
				Active.set('client', productionClient),
				Active.set('project', project),
				Context.get('user').then(function (user) {
					var workerRole = Object.keys(user.clients[productionClient].roles).filter(function (key) {
						return user.clients[productionClient].roles[key].type === 'worker';
					})[0];
					return Permission.set(workerRole);
				}),
			]);
		}),
	]);
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

// PLAN
// scroll list
// 1. [DONE] Add persistent search tokens for certain objects (TR, word, phrase, MOD, caption, utterance)
// 1a. [DONE] Filter list of transcriptions by relationship to active token.
// 1b. [DONE] Filter object in access using dict {'filter': 'value', 'filter2': 'value2'}
// 2. [DONE] Remove standalone requests for objects
// 3. [DONE] Add non-autocomplete option for list
// 4. Add multiple tag support for filtering.
// 5. Speed is ok, so see if objects can be sorted in place. The list can be reorganised with 'setAfter'.
// 6. [DONE] Add correct scroll structure for scroll list
// 7. [DONE] Ensure loading icon is formatted properly.
// 8. [DONE] Add filter element can that be formatted like any other component. NEED FILTER GROUP
// 9. [DONE] Add FILTER to database level in Context
// 10. Arrow keys + enter for selecting (later)
// 11. [DONE] Enter filter char to cause filter.

// audio element
// 1. Follow model for scroll list in terms of how to construct component composite.
// 2. It is just a glorified scroll list in the way it fetches transcriptions or moderations.
// 3. Have buffer that can load more and dismiss audio files,
// 		construct audio elements for them to live in, and connect the component to them.
// 4.

// sidebar
// 1. very simple, build the same way as scroll list
// 2. Link buttons to Active properties

//
