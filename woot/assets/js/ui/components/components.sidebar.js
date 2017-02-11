// initialise
var Components = (Components || {});

// sidebar
Components.sidebar = function (id, args) {
	// SIDEBAR
	// A panel with a state structure and space for a content panel.

	return Promise.all([

		// base
		UI.createComponent('{id}-base'.format({id: id}), {
			template: UI.template('div', 'ie abstract'),
			appearance: {
				style: {
					'height': '100%',
				},
			},
		}),

		// main
		UI.createComponent('{id}-main'.format({id: id}), {
			template: UI.template('div', 'ie abs centred-vertically'),
			appearance: {
				style: {
					'left': args.position.main.off,
					'height': '100%',
					'width': '200px',
					'opacity': (args.fade ? '0.0' : '1.0')
				},
			},
			children: args.children,
		}),

		// back
		UI.createComponent('{id}-back'.format({id: id}), {
			template: UI.template('div', 'ie abs centred-vertically'),
			appearance: {
				style: {
					'left': '-500px',
					'height': '100%',
					'width': '50px',
				},
			},
		}),

		// back button
		UI.createComponent('{id}-back-button'.format({id: id}), {
			template: UI.template('div', 'ie button'),
			children: [
				UI.createComponent('{id}-back-button-span'.format({id: id}), {
					template: UI.template('span', 'glyphicon glyphicon-chevron-left'),
				}),
			],
			state: {
				stateMap: args.state.primary,
			},
			bindings: {
				'click': function (_this) {
					_this.triggerState();
				},
			}
		}),

	]).then(function (components) {
		// unpack components
		var [
			base,
			main,
			back,
			backButton,
		] = components;

		// complete promises.
		return Promise.all([
			back.setChildren([
				backButton,
			]),
			Promise.all(Object.keys(args.state).map(function (category) {
				// get array of sets
				var stateSet = args.state[category];
				if (!$.isArray(stateSet)) {
					stateSet = [stateSet];
				}

				// add each one as a state
				return Promise.all(stateSet.map(function (stateName) {
					return Promise.all([
						main.addState(stateName, {
							preFn: category === 'primary' ? (args.fade ? UI.functions.show({
								'left': args.position.main.on,
							}) : undefined) : undefined,
							style: (args.fade ? undefined : {'left': (category === 'primary' ? args.position.main.on : args.position.main.off)}),
							fn: category === 'primary' ? undefined : (args.fade ? UI.functions.hide({
								'left': args.position.main.off,
							}) : undefined),
						}),
						back.addState(stateName, {
							preFn: category === 'secondary' ? (args.fade ? UI.functions.show({
								'left': args.position.back.on,
							}) : undefined) : undefined,
							style: {'left': (category === 'secondary' ? args.position.back.on : args.position.back.off)},
							fn: category === 'secondary' ? undefined : (args.fade ? UI.functions.hide({
								'left': args.position.back.off,
							}) : undefined),
						}),
					]);
				}));
			})),
		]).then(function (results) {
			base.components = {
				main: main,
				back: back,
			}
			return base.setChildren([
				main,
				back,
			]);
		}).then(function () {
			return base;
		});
	});
}
