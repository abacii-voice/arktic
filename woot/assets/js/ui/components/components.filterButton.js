// initialise
var Components = (Components || {});

// filter button
Components.filterButton = function (id, args) {
	return Promise.all([
		// base
		UI.createComponent('{id}'.format({id: id}), {
			template: UI.template('div', 'ie abs button border border-radius hidden'),
			appearance: {
				style: {
					'height': '28px',
					'width': '28px',
					'right': '6px',
					'top': '6px',
					'padding-top': '6px',
				},
			},
		}),

		// glyphs
		UI.createComponent('{id}-filter-glyph'.format({id: id}), {
			template: UI.template('div', 'ie'),
			appearance: {
				style: {
					'height': '100%',
					'width': '100%',
				},
			},
			children: [
				UI.createComponent('{id}-filter-glyph'.format({id: id}), {
					template: UI.template('span', 'glyphicon glyphicon-filter'),
				}),
			],
		}),

		// content
		UI.createComponent('{id}-content'.format({id: id}), {
			template: UI.template('span', 'ie hidden'),
		}),

	]).then(function (components) {
		// bindings
		var [
			base,
			glyph,
			content,
		] = components;

		base.setContent = function (char) {
			if (char) {
				return glyph.setAppearance({classes: {add: 'hidden'}}).then(function () {
					return content.setAppearance({classes: {remove: 'hidden'}, html: char});
				});
			} else {
				return glyph.setAppearance({classes: {remove: 'hidden'}}).then(function () {
					return content.setAppearance({classes: {add: 'hidden'}, html: ''});
				});
			}
		}

		return Promise.all([]).then(function () {
			return base.setChildren([
				glyph,
				content,
			]);
		}).then(function () {
			return base;
		});
	});
}
