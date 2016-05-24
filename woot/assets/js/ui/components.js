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

		// filter id for extended use
		var filterId = '{id}-filter'.format({id: id});

		// CREATE ALL ELEMENTS
		// create elements in parallel
		return Promise.all([
			// title
			UI.createComponent('{id}-title'.format({id: id}), {
				template: UI.template('h4', 'ie title'),
				appearance: {
					style: {
						'width': '100%',
						'height': '22px',
					},
					html: titleText,
				},
			}),

			// list
			UI.createComponent('{id}-list'.format({id: id}), {
				// in future, allow this to be bound to another element.
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'width': '100%',
						'height': listHeight,
					},
				},
				children: [
					UI.createComponent('{id}-loading-icon'.format({id: id}), {
						template: UI.templates.loadingIcon,
						appearance: {
							classes: ['hidden'],
						},
					}),
				],
				registry: [
					// {state: 'client-state', path: args.options.target.path, args: {}, fn: args.options.target.process},
				],
			}),

			// make input
			UI.createComponent('{id}-search'.format({id: id}), {
				template: UI.template('input', 'ie input'),
				appearance: {
					style: {
						'width': '100%',
						'height': '40px',
					}
				},
			}),

			// make filter
			UI.createComponent(filterId, {
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'width': '100%',
						'height': listHeight,
					},
				},
			}),

		]).then(function (components) {
			var title = components[0];
			var list = components[1];
			var input = components[2];
			var filter = components[3];

			// set bindings, children, etc.
			return new Promise(function(resolve, reject) {
				// title
				title.defined = true;

				// list modifications
				list.display = args.options.display;
				list.buffer = {};
				list.defined = true;

				// search options
				// SEARCH
				// If the search option is filled, include a search bar and an optional filter panel
				if (search !== undefined) {
					// search functions engaged. can be in autocomplete mode and include filter panel.
					// INPUT: if search, define input field
					input.defined = true;
					input.setBindings({
						'focus': {
							'fn': function (_this) {
								list.model().hide();
								filter.model().show();
							}
						},
						'blur': {
							'fn': function (_this) {
								list.model().show();
								filter.model().hide();
							}
						},
						'input': {
							'fn': function (_this) {
								var tokens = _this.model().val().split('');
								console.log(tokens);
							}
						}
					});

					if (search.filter !== undefined) {
						// the filter panel will be displayed
						// autocomplete will decide whether the panel is displayed before the list of data.
						// FILTER: if filter, define filter panel
						filter.defined = true;
						filter.setChildren(search.filter.options.map(search.filter.display(filterId)));

						// Autocomplete mode only affects present elements, it does not add any.
						if (search.autocomplete !== undefined && search.autocomplete) {
							// autocomplete mode: display filter first
							list.setAppearance({
								classes: ['hidden'],
							});

						} else {
							// display data first, display filter panel upon focussing input, hide again on input.
							filter.setAppearance({
								classes: ['hidden'],
							});

						}

					} else {
						// No filter panel
						filter.defined = false;
						if (search.autocomplete !== undefined && search.autocomplete) {
							// autocomplete mode: show no data until search query is entered.
							list.setAppearance({
								classes: ['ie', 'hidden'],
							});

						} else {
							// data is displayed first and filtered when search query is entered.

						}

					}

				} else {
					// display immediately, buffer can only be changed by scrolling.
					input.defined = false;

				}

				// return elements as they entered to be added to the base
				resolve([title, input, list, filter]);
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

}
