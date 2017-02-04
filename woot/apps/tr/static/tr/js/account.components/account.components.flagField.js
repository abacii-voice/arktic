
var AccountComponents = (AccountComponents || {});
AccountComponents.flagField = function (id, args) {
	return Promise.all([
		// base
		UI.createComponent(id, {
			template: UI.template('div', 'ie border border-radius'),
			appearance: {
				style: {
					'height': '100%',
					'width': 'calc(100% - 140px)',
					'float': 'left',
				},
			},
		}),

		// add button
		UI.createComponent('{id}-add'.format({id: id}), {
			template: UI.template('div', 'ie button'),
			appearance: {
				style: {
					'height': '60px',
					'width': '30px',
					'padding-top': '20px',
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
			reset: function () {

			},
		}

		return Promise.all([
			addButton.setChildren([addGlyph]),
		]).then(function () {
			return base.setChildren([
				addButton,
				content,
			]);
		}).then(function () {
			return base;
		});
	});
}
