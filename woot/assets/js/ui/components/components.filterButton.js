// initialise
var Components = (Components || {});

// filter button
Components.filterButton = function (id, args) {
	return UI.createComponent('{id}'.format({id: id}), {
		name: args.name,
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
		children: [
			// glyphs
			UI.createComponent('{id}-filter-glyph'.format({id: id}), {
				name: 'glyph',
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'height': '100%',
						'width': '100%',
					},
				},
				children: [
					UI.createComponent('{id}-filter-glyph'.format({id: id}), {
						name: 'filter',
						template: UI.template('span', 'glyphicon glyphicon-filter'),
					}),
				],
			}),

			// content
			UI.createComponent('{id}-content'.format({id: id}), {
				name: 'content',
				template: UI.template('span', 'ie hidden'),
			}),
		],
	}).then(function (base) {

		base.setContent = function (char) {
			if (char) {
				return base.cc.glyph.setAppearance({classes: {add: 'hidden'}}).then(function () {
					return base.cc.content.setAppearance({classes: {remove: 'hidden'}, html: char});
				});
			} else {
				return base.cc.glyph.setAppearance({classes: {remove: 'hidden'}}).then(function () {
					return base.cc.content.setAppearance({classes: {add: 'hidden'}, html: ''});
				});
			}
		}

		return Promise.all([]).then(function () {
			return base;
		});
	});
}
