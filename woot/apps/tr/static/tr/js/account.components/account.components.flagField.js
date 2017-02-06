
var AccountComponents = (AccountComponents || {});
AccountComponents.flagField = function (id, args) {
	return Promise.all([
		// base
		UI.createComponent(id, {
			template: UI.template('div', 'ie border border-radius'),
			appearance: {
				style: {
					'height': '100%',
					'width': 'calc(100% - 100px)',
					'float': 'left',
				},
			},
		}),

		// add button
		UI.createComponent('{id}-add'.format({id: id}), {
			template: UI.template('div', 'ie button'),
			appearance: {
				style: {
					'height': '100%',
					'width': '30px',
					'padding-top': '11px',
					'float': 'left',
				},
			},
		}),
		UI.createComponent('{id}-add-glyph'.format({id: id}), {
			template: UI.template('span', 'glyphicon glyphicon-plus'),
		}),

		// content
		UI.createComponent('{id}-content'.format({id: id}), {
			template: UI.template('div', 'ie'),
			appearance: {
				style: {
					'height': '100%',
					'width': 'calc(100% - 60px)',
					'float': 'left',
				},
			},
		}),

	]).then(function (components) {
		var [
			base,
			addButton,
			addGlyph,
			content,
		] = components;

		base.data = {
			list: [],
			add: function (name) {
				if (base.data.list.indexOf(name) === -1) {
					base.data.list.push(name);
					return base.unit(name).then(function (unit) {
						return content.setChildren([unit]);
					});
				} else {
					return Util.ep();
				}
			},
			remove: function (index) {
				base.data.list.splice(index, 1);
				return content.removeChild(content.children[index].id);
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

		return Promise.all([
			addButton.setChildren([addGlyph]),
		]).then(function () {
			base.components = {
				addButton: addButton,
			}
			return base.setChildren([
				addButton,
				content,
			]);
		}).then(function () {
			return base;
		});
	});
}
