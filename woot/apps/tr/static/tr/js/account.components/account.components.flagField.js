
var AccountComponents = (AccountComponents || {});
AccountComponents.flagField = function (id, args) {
	return UI.createComponent(id, {
		name: args.name,
		template: UI.template('div', 'ie border border-radius'),
		appearance: {
			style: {
				'height': '100%',
				'width': 'calc(100% - 100px)',
				'float': 'left',
			},
		},
		children: [
			// add button
			UI.createComponent('{id}-add'.format({id: id}), {
				name: 'addButton',
				template: UI.template('div', 'ie button'),
				appearance: {
					style: {
						'height': '100%',
						'width': '30px',
						'padding-top': '11px',
						'float': 'left',
					},
				},
				children: [
					// add glyph
					UI.createComponent('{id}-add-glyph'.format({id: id}), {
						name: 'addGlyph',
						template: UI.template('span', 'glyphicon glyphicon-plus'),
					}),
				],
			}),

			// content
			UI.createComponent('{id}-content'.format({id: id}), {
				name: 'content',
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'height': '100%',
						'width': 'calc(100% - 60px)',
						'float': 'left',
					},
				},
			}),
		],
	}).then(function (base) {

		base.data = {
			list: [],
			add: function (name) {
				if (base.data.list.indexOf(name) === -1) {
					base.data.list.push(name);
					return base.unit(name).then(function (unit) {
						return base.cc.content.setChildren([unit]);
					});
				} else {
					return Util.ep();
				}
			},
			remove: function (index) {
				base.data.list.splice(index, 1);
				return base.cc.content.removeChild(base.cc.content.children[index].id);
			},
			removeLast: function () {
				if (base.data.list.length) {
					var lastIndex = base.data.list.length - 1;
					return base.data.remove(lastIndex);
				} else {
					return Util.ep();
				}
			},
			removeAll: function () {
				if (base.data.list.length) {
					var length = base.data.list.length;
					return Promise.ordered(base.data.list.map(function (name, index) {
						return function () {
							var lastIndex = length - index - 1;
							return base.data.remove(lastIndex);
						}
					}));
				} else {
					return Util.ep();
				}
			},
			reset: function (metadata) {
				return base.data.removeAll().then(function () {
					return Promise.ordered((metadata.latestFlags || []).map(function (flag) {
						return function () {
							return base.data.add(flag);
						}
					}));
				});
			},

		}
		base.export = function () {
			return base.data.list.slice();
		}
		base.behaviours = {};

		return Promise.all([

		]).then(function () {
			return base;
		});
	});
}
