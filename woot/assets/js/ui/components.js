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

		// create child components
		var input = UI.createComponent('{id}-'.format({id: id}), {});
		var loadingIcon = UI.createComponent('{id}-'.format({id: id}), {});
		var filterPanel = UI.createComponent('{id}-'.format({id: id}), {});
		var list = UI.createComponent('{id}-'.format({id: id}), {}); // in future, allow this to be bound to another element.
		var info = UI.createComponent('{id}-'.format({id: id}), {});
		var title = UI.createComponent('{id}-'.format({id: id}), {});

		// styling
		// - The entire device should occupy 100% of the width and height of its container, or the base component.
		// - space needs to be reserved for the title and input field.

		// create base component
		var base = UI.createComponent(id, {
			template: UI.template('div', ''),
			appearance: args.appearance,
			children: [

			],
		});

		// define methods on the base component

		// return
		return base;
	},

}
