
var AccountComponents = (AccountComponents || {});

AccountComponents.autocompleteControls = function (id, args) {
	return Promise.all([
		// base
		UI.createComponent(id, {
			template: UI.template('div', 'ie abs'),
			appearance: {
				style: {
					'width': '100%',
					'height': '100px',
				},
			},
		}),

		// magnifying glass
		UI.createComponent('{id}-search'.format({id: id}), {
			template: UI.template('div', 'ie abs'),
		}),
		UI.createComponent('{id}-search-icon'.format({id: id}), {
			template: UI.template('span', 'glyphicon glyphicon-search'),
		}),

		// filter
		UI.createComponent('{id}-filter'.format({id: id}), {
			template: UI.template('div', 'ie abs'),
		}),
		UI.createComponent('{id}-filter-icon'.format({id: id}), {
			template: UI.template('span', 'glyphicon glyphicon-filter'),
		}),

	]).then(function (components) {
		var [
			base,
			search,
			searchIcon,
			filter,
			filterIcon,
		] = components;

		return Promise.all([
			// search.setChildren([searchIcon]),
			// filter.setChildren([filterIcon]),
		]).then(function () {
			return base.setChildren([
				search,
				filter,
			]);
		}).then(function () {
			return base;
		});
	});
}
