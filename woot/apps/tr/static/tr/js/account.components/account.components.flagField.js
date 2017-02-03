
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
	]).then(function (components) {
		var [
			base,
		] = components;

		base.data = {
			list: [],
			add: function () {

			},
			remove: function () {

			},
			reset: function () {
				
			},
		}

		return Promise.all([

		]).then(function () {
			return base.setChildren([

			]);
		}).then(function () {
			return base;
		});
	});
}
