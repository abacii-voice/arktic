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

		// ALL COMPONENTS
		var title, input, loadingIcon, list, filter;

		// TITLE
		// Optional title at the top, can be centred.
		if (titleText !== undefined) {
			title = UI.createComponent('{id}-title'.format({id: id}), {
				template: UI.template('h4', 'ie title'),
				appearance: {
					style: {
						'width': '100%',
						'height': '22px',
					},
					html: titleText,
				},
			});
		}

		// SEARCH
		


		if (search !== undefined) {
			input = UI.createComponent('{id}-search'.format({id: id}), {
				template: UI.template('input', 'ie input'),
				appearance: {
					style: {
						'width': '100%',
						'height': '40px',
					}
				},
				bindings: {
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
				},
			});

			filter = UI.createComponent('{id}-filter'.format({id: id}), {
				template: UI.template('div', 'ie hidden'),
				appearance: {
					style: {
						'width': '100%',
						'height': listHeight,
					},
				},
				children: args.filter,
			});
		}

		// LIST
		// The list is fundementally responsible for displaying the data. If this means getting stuff
		// from the registry, or calling a url for data, its behaviour should be the same.
		var loadingIcon = UI.createComponent('{id}-loading-icon'.format({id: id}), {
			template: UI.templates.loadingIcon,
			appearance: {
				classes: ['hidden'],
			},
		});
		var list = UI.createComponent('{id}-list'.format({id: id}), {
			// in future, allow this to be bound to another element.
			template: UI.template('div', 'ie'),
			appearance: {
				style: {
					'width': '100%',
					'height': listHeight,
				},
			},
			children: [
				loadingIcon,
			],
			registry: [
				{state: 'client-state', path: args.options.search.target.path, args: {}, fn: args.options.search.target.process},
			],
		});
		list.display = args.options.display;
		list.buffer = {};

		// create base component
		var base = UI.createComponent(id, {
			template: UI.template('div', ''),
			appearance: args.appearance,
			children: [
				title,
				input,
				list,
				filter,
			],
		});

		// define methods on the base component

		// return
		return base;
	},

}
