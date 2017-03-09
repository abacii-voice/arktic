
var AccountComponents = (AccountComponents || {});

AccountComponents.autocompleteControls = function (id, args) {
	return UI.createComponent(id, {
		name: args.name,
		template: UI.template('div', 'ie abs'),
		appearance: {
			style: {
				'width': '100%',
				'height': '100px',
			},
		},
		children: [
			// magnifying glass
			UI.createComponent('{id}-search'.format({id: id}), {
				name: 'search',
				template: UI.template('div', 'ie abs'),
				children: [
					UI.createComponent('{id}-search-icon'.format({id: id}), {
						name: 'searchIcon',
						template: UI.template('span', 'glyphicon glyphicon-search'),
					}),
				],
			}),

			// filter
			UI.createComponent('{id}-filter'.format({id: id}), {
				name: 'filter',
				template: UI.template('div', 'ie abs'),
				children: [
					UI.createComponent('{id}-filter-icon'.format({id: id}), {
						name: 'filterIcon',
						template: UI.template('span', 'glyphicon glyphicon-filter'),
					}),
				],
			}),
		],
	}).then(function (components) {
		return Promise.all([

		]).then(function () {
			return base;
		});
	});
}
