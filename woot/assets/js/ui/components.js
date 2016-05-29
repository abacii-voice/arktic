// These components are larger abstractions built on the back of the generalised component system.

var Components = {

	//////////// SCROLL
	// This component is meant to hold related data in a list format.
	// Has several parts:
	// 1. A input field
	// 2. A filter panel that appears when the input is focussed, but disappears when any input is entered.
	// 3. A list where results appear
	// 4. A small info line showing the currently selected command or filter
	// 5. An optional title
	// 6. An optional loading icon
	scroll: function (id, args) {

		// SETUP
		// arg setup and initialisation
		// - if no title is given, leave no room for a title.
		// - if no search is given, leave no room for an input.
		// - looking for final variable 'listHeight'
		var listHeight = '100%', offset = 0, titleText, search;
		if (args.options !== undefined) {
			// title
			if (args.options.title !== undefined) {
				titleText = args.options.title;
				offset += 22;
			}

			// search
			if (args.options.search !== undefined) {
				search = args.options.search;
				offset += 40;
			}

			// listHeight
			listHeight = 'calc(100% - {offset}px)'.format({offset: offset});
		}

		// CREATE ALL COMPONENTS
		// create elements in parallel
		return Promise.all([
			// title
			UI.createComponent('{id}-title'.format({id: id}), {
				template: UI.template('h4', 'ie title'),
				appearance: {
					style: {
						'width': '100%',
						'height': '22px',
						'font-size': '18px',
					},
					html: titleText,
				},
			}),


			// SEARCH GROUP
			// search wrapper
			UI.createComponent('{id}-search-wrapper'.format({id: id}), {
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'width': '100%',
						'height': '40px',
					},
				},
			}),

			// search input
			UI.createComponent('{id}-search-input'.format({id: id}), {
				template: UI.template('input', 'ie input abs'),
				appearance: {
					style: {
						'width': '100%',
						'height': '100%',
					},
					properties: {
						'autocomplete': 'off',
					},
				},
			}),

			// search button
			UI.createComponent('{id}-search-button'.format({id: id}), {
				template: UI.template('div', 'ie button abs border border-radius'),
				appearance: {
					style: {
						'top': '5px',
						'height': '30px',
						'width': 'auto',
						'right': '5px',
						'padding': '7px',
						'font-size': '12px',
					},
				},
			}),


			// LIST GROUP
			// list wrapper
			UI.createComponent('{id}-list-wrapper'.format({id: id}), {
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'width': '100%',
						'height': listHeight,
						'overflow': 'hidden',
					},
				},
			}),

			// list
			UI.createComponent('{id}-list'.format({id: id}), {
				// in future, allow this to be bound to another element.
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'width': 'calc(100% + 20px)',
						'height': listHeight,
						'padding-right': '20px',
						'overflow-y': 'scroll',
					},
				},
				// registry: args.options.target.states.map(function (state) {
				// 	return {state: state, path: args.options.target.path(), args: {}, fn: args.options.target.process};
				// }),
			}),

			// list loading icon
			UI.createComponent('{id}-list-loading-icon'.format({id: id}), {
				template: UI.templates.loadingIcon,
			}),


			// FILTER GROUP
			// filter wrapper
			UI.createComponent('{id}-filter-wrapper'.format({id: id}), {
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'width': '100%',
						'height': listHeight,
					},
				},
			}),

			// filter list
			UI.createComponent('{id}-filter'.format({id: id}), {
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'width': '100%',
					},
				},
			}),

			// filter info
			UI.createComponent('{id}-filter-info'.format({id: id}), {
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'width': '100%',
					},
				},
			}),


		]).then(function (components) {
			// unpack components
			// title
			var title = components[0];

			// SEARCH GROUP
			var searchWrapper = components[1];
			var searchInput = components[2];
			var searchButton = components[3];

			// LIST GROUP
			var listWrapper = components[4];
			var list = components[5];
			var listLoadingIcon =  components[6];

			// FILTER GROUP
			var filterWrapper = components[7];
			var filter = components[8];
			var filterInfo = components[9];

			// SET PROPERTIES AND METHODS
			// set bindings, children, etc.
			return new Promise(function(resolve, reject) {
				// TITLE
				title.defined = titleText !== undefined;

				// SEARCH
				// If the search option is filled, include a search bar and an optional filter panel
				if (search !== undefined) {
					// search functions engaged. can be in autocomplete mode and include filter panel.

					if (search.filter !== undefined && search.filter) {
						// the filter panel will be displayed
						// autocomplete will decide whether the panel is displayed before the list of data.
						// FILTER: if filter, define filter panel
						filterWrapper.defined = true;
						filter.setChildren(Object.keys(args.options.targets).map(function (key, index) {
							var display = args.options.display.filter(filter.id);
							return display(args.options.targets[key], index);
						}));
						filter.set = function (target) {
							filter.active = target;
							searchInput.model().focus();
							listWrapper.setAppearance({classes: {remove: ['hidden']}});
							searchButton.setAppearance({classes: {remove: ['hidden']}, html: target.filter.button});
							filterWrapper.setAppearance({classes: {add: ['hidden']}});
						}
						filter.defaults = Object.keys(args.options.targets).filter(function (key) {
							return args.options.targets[key].default;
						}).map(function (key) {
							return key;
						});

						// set filterWrapper
						filterWrapper.setChildren([
							filter,
							filterInfo,
						]);

						// INPUT: if search, define input field
						searchInput.setBindings({

							// FOCUS INPUT
							// autocomplete ? show filter : hide filter
							'focus': {
								'fn': function (_this) {
									listWrapper.setAppearance({classes: {add: ['hidden']}});
									searchButton.setAppearance({classes: {add: ['hidden']}});
									filterWrapper.setAppearance({classes: {remove: ['hidden']}});
								}
							},

							// BLUR INPUT:
							'blur': {
								'fn': function (_this) {
									listWrapper.setAppearance({classes: {add: ['hidden']}});
									searchButton.setAppearance({classes: {add: ['hidden']}});
									filterWrapper.setAppearance({classes: {remove: ['hidden']}});
								}
							},

							// TYPE INPUT:
							'input': {
								'fn': function (_this) {
									// get words
									var query = _this.model().val();
									var tokens = query.split('');

									// show or hide
									if (tokens.length !== 0) {
										listWrapper.setAppearance({classes: {remove: ['hidden']}});
										filterWrapper.setAppearance({classes: {add: ['hidden']}});

										// Materials
										// 1. tokens or value -> filters values
										// 2. active filter -> filters rules
										// 3. sources: paths and urls

										// remove all previous results (this is before buffer is implemented)
										list.removeChildren().then(function () {
											// Steps
											// 1. If active filter is set, use only the url/path of that filter.
											if (filter.active !== undefined) {
												// get only active filter
												var path = filter.active.path !== undefined ? filter.active.path() : '';
												var fltr = filter.active.fltr !== undefined ? {options: {filter: filter.active.fltr()}} : {};

												// Context
												if (filter.active.path !== undefined) {
													Context.get(path, fltr).then(filter.active.process).then(function (results) {
														results.filter(function (result) {
															// apply actual filter
															return result.main.indexOf(query) !== -1;
														}).forEach(args.options.display.list(list, query));
													});
												}

											} else {
												if (filter.defaults.length !== 0) {
													// display only defaults
													for (i=0; i<filter.defaults.length; i++) {
														var details = args.options.targets[filter.defaults[i]];
														var path = details.path !== undefined ? details.path() : '';
														var fltr = details.fltr !== undefined ? {options: {filter: details.fltr()}} : {};

														// Context
														if (details.path !== undefined) {
															Context.get(path, fltr).then(details.process).then(function (results) {
																results.filter(function (result) {
																	// apply actual filter
																	return result.main.indexOf(query) !== -1;
																}).forEach(args.options.display.list(list, query));
															});
														}
													}
												} else {
													// display everything
													var targets = Object.keys(args.options.targets);
													for (i=0; i<targets.length; i++) {
														var details = args.options.targets[targets[i]];
														var path = details.path !== undefined ? details.path() : '';
														var fltr = details.fltr !== undefined ? {options: {filter: details.fltr()}} : {};

														// Context
														if (details.path !== undefined) {
															Context.get(path, fltr).then(details.process).then(function (results) {
																results.filter(function (result) {
																	return result.main.indexOf(query) !== -1;
																}).forEach(args.options.display.list(list, query));
															});
														}
													}
												}
											}
										});
									} else {
										listWrapper.setAppearance({classes: {add: ['hidden']}});
										filterWrapper.setAppearance({classes: {remove: ['hidden']}});
										list.removeChildren();
									}
								}
							}
						});

						// Search button behaviour
						searchButton.setBindings({
							'mousedown': {
								'fn': function (_this) {
									filter.active = undefined;
								},
							},
						});

						// Autocomplete mode only affects present elements, it does not add any.
						if (search.autocomplete !== undefined && search.autocomplete) {
							// autocomplete mode: display filter first
							listWrapper.setAppearance({
								classes: ['hidden'],
							});
							searchButton.setAppearance({
								classes: ['hidden'],
							});

						} else {
							// display data first, display filter panel upon focussing input, hide again on input.
							filterWrapper.setAppearance({
								classes: ['hidden'],
							});

						}

						// DEFINE INPUT GROUP
						searchWrapper.defined = true;
						searchWrapper.setChildren([
							searchInput,
							searchButton
						]);

					} else {
						// No filter panel
						filterWrapper.defined = false;

						// INPUT: if search, define input field
						searchInput.setBindings({

							// FOCUS INPUT
							// autocomplete ? show filter : hide filter
							'focus': {
								'fn': function (_this) {

								}
							},

							// BLUR INPUT:
							'blur': {
								'fn': function (_this) {

								}
							},

							// TYPE INPUT:
							'input': {
								'fn': function (_this) {
									// get words
									var query = _this.model().val();
									var tokens = query.split('');

									if (tokens.length !== 0) {
										// show or hide
										listWrapper.setAppearance({
											classes: {remove: ['hidden']},
										});

										// Materials
										// 1. tokens or value -> filters values
										// 2. active filter -> filters rules
										// 3. sources: paths and urls

										// remove all previous results (this is before buffer is implemented)
										list.removeChildren().then(function () {
											// display everything
											var targets = Object.keys(args.options.targets);
											for (i=0; i<targets.length; i++) {
												var details = args.options.targets[targets[i]];
												var path = details.path !== undefined ? details.path() : '';
												var fltr = details.fltr !== undefined ? {options: {filter: details.fltr()}} : {};

												// Context
												if (details.path !== undefined) {
													Context.get(path, fltr).then(details.process).then(function (results) {
														results.filter(function (result) {
															return result.main.indexOf(query) !== -1;
														}).forEach(args.options.display.list(list, query));
													});
												}
											}
										});
									} else {
										listWrapper.setAppearance({
											classes: {add: ['hidden']},
										});
										list.removeChildren();
									}
								}
							}
						});

						// DEFINE INPUT GROUP
						searchWrapper.defined = true;
						searchWrapper.setChildren([
							searchInput,
						]);

						if (search.autocomplete !== undefined && search.autocomplete) {
							// autocomplete mode: show no data until search query is entered.
							listWrapper.setAppearance({
								classes: ['ie', 'hidden'],
							});

						} else {
							// data is displayed first and filtered when search query is entered.

						}

					}

				} else {
					// display immediately, buffer can only be changed by scrolling.
					searchWrapper.defined = false;
				}

				// LIST
				listWrapper.defined = true;
				list.display = args.options.display;
				list.buffer = {};

				listWrapper.setChildren([
					list,
					listLoadingIcon,
				]);

				// return elements as they entered to be added to the base
				resolve([title, searchWrapper, listWrapper, filterWrapper]);
			});
		}).then(function (children) {
			// return base
			return UI.createComponent(id, {
				template: UI.template('div'),
				appearance: args.appearance,
				children: children.filter(function (child) {
					return child.defined;
				}),
			})
		});
	},

	//////////// AUDIO PLAYER
	// Plays audio given a source
	// Has a buffer for storing multiple tracks and cycling between them.
	// Parts:
	// 1.
	audio: function (id, args) {

	},
}
