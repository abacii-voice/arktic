// initialise
var Components = (Components || {});

// content panel
Components.contentPanel = function (id, args) {
	// CONTENT PANEL
	// Nested panel components meant to hide scroll bar.

	// config
	args.appearance = (args.appearance || {
		style: {
			'width': '100%',
		},
	});

	// set up components
	return Promise.all([
		// base component
		UI.createComponent('{id}'.format({id: id}), {
			template: UI.template('div', 'ie'),
			appearance: args.appearance,
		}),

		// wrapper
		UI.createComponent('{id}-wrapper'.format({id: id}), {
			name: 'wrapper',
			template: UI.template('div', 'ie'),
			appearance: {
				style: {
					'height': '100%',
					'width': 'calc(100% + 20px)',
					'padding-right': '20px',
					'overflow-y': 'scroll',
				}
			},
		}),

	]).then(function (components) {
		// unpack components
		var [
			base,
			wrapper,
		] = components;

		// set up promises to be completed before returning the base.

		// logic, bindings, etc.
		base.setWrapper = base.setChildren;
		base.setChildren = function (children) {
			return wrapper.setChildren(children);
		}
		base.remove = function (id) {
			return wrapper.removeChild(id);
		}

		// behaviours
		base.behaviours = {
			up: function () {

			},
			down: function () {

			},
			left: function () {

			},
			right: function () {

			},
			enter: function () {

			},
		}

		// complete promises.
		return Promise.all([

		]).then(function (results) {
			return base.setWrapper([wrapper]);
		}).then(function () {
			return base;
		});
	});
}
