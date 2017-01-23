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
					'width': '105px',
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
					'width': 'calc(100% - 105px)',
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
			// blank
			jss.set('#{id} .unit'.format({id: base.id}), {
				'background-color': 'transparent',
				'border': '1px solid #ddd',
			});
			jss.set('#{id} .unit.active'.format({id: base.id}), {
				'border-width': '2px !important',
			});

			// pending
			jss.set('#{id} .unit.pending'.format({id: base.id}), {
				'border': '1px solid #888',
			});
			jss.set('#{id} .unit.pending:hover'.format({id: base.id}), {
				'border': '1px solid #ddd',
			});

			// complete
			jss.set('#{id} .unit.complete'.format({id: base.id}), {
				'color': '#ccc',
			});
			jss.set('#{id} .unit.complete:hover'.format({id: base.id}), {
				'color': '#ccc',
			});

			return Util.ep();
		}

		base.limit = 20;
		base.setActive = function (current) {
			var previousIndex = base.currentIndex;
			base.currentIndex = current.index % base.limit;

			if (base.currentIndex !== previousIndex) {
				return base.deactivate().then(function () {
					base.active = counterWrapper.children[base.currentIndex];
					return base.active.activate();
				}).then(function () {
					if (!base.active.isPending && !base.active.isComplete) {
						return base.active.setPending();
					} else {
						return Util.ep();
					}
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
