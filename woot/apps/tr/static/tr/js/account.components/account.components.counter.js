// initialise
var AccountComponents = (AccountComponents || {});

// counter
AccountComponents.counter = function (id, args) {
	//////////// COUNTER
	// Counts the number of transcriptions or moderations done in a session
	// Parts:
	// 1. Large number counter with date stamp
	// 2. Counter field
	// 3. Counters

	// styling
	var style = (((args || {}).appearance || {}).style || {
		'height': '100%',
		'width': '100%',
	});

	// components
	return Promise.all([
		// base
		UI.createComponent(id, {
			template: UI.template('div', 'ie'),
			appearance: args.appearance,
		}),

		// header wrapper
		UI.createComponent('{id}-header-wrapper'.format({id: id}), {
			template: UI.template('div', 'ie border border-radius'),
			appearance: {
				style: {
					'height': '100%',
					'width': '60px',
					'float': 'left',
				},
			},
		}),

		// daily header
		UI.createComponent('{id}-daily-header'.format({id: id}), {
			template: UI.template('h2', 'ie'),
		}),

		// cycle header
		UI.createComponent('{id}-cycle-header'.format({id: id}), {
			template: UI.template('h3', 'ie'),
		}),

		// counter wrapper
		UI.createComponent('{id}-counter-wrapper'.format({id: id}), {
			template: UI.template('div', 'ie'),
			appearance: {
				style: {
					'height': style.height,
					'width': 'calc(100% - 60px)',
					'float': 'left',
				},
			},
		}),

	]).then(function (components) {
		// unpack components
		var [
			base,
			headerWrapper,
			dailyHeader,
			cycleHeader,
			counterWrapper,
		] = components;

		// methods
		base.limit = 20;
		base.setup = function () {
			return base.styles().then(function () {
				if (counterWrapper.children.length === 0) {
					return Promise.ordered(Array.range(base.limit).map(function (index) {
						return function () {
							return base.unit().then(function (unit) {
								return counterWrapper.setChildren([unit]);
							});
						}
					}));
				} else {
					return Util.ep();
				}
			});
		}
		base.styles = function () {

			return Util.ep();
		}
		base.update = function (current) {
			return base.setActive({index: current.index});
		}
		base.setActive = function (options) {
			options = (options || {});

			// changes
			var previousIndex = base.currentIndex;
			base.currentIndex = (options.index !== undefined ? options.index : undefined || ((base.currentIndex || 0) + (base.currentIndex !== undefined ? (options.increment || 0) : 0)));

			// boundary conditions
			base.currentIndex = base.currentIndex > counterWrapper.children.length - 1 ? counterWrapper.children.length - 1 : (base.currentIndex < 0 ? 0 : base.currentIndex);

			if (base.currentIndex !== previousIndex) {
				return base.deactivate().then(function () {
					base.active = counterWrapper.children.filter(function (unit) {
						return unit.bufferIndex === base.currentIndex;
					})[0];;
					return base.active.activate();
				});
			} else {
				return Util.ep();
			}
		}
		base.deactivate = function () {
			if (base.active) {
				return base.active.deactivate();
			} else {
				return Util.ep();
			}
		}

		return Promise.all([

		]).then(function () {
			return base.setChildren([
				headerWrapper,
				counterWrapper,
			]);
		}).then(function () {
			return base;
		})
	});
}
