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
					'text-align': 'center',
				},
			},
		}),

		UI.createComponent('{id}-session-value'.format({id: id}), {
			template: UI.template('h2'),
			appearance: {
				style: {
					'margin-top': '24px',
					'margin-bottom': '0px',
				},
			},
		}),

		UI.createComponent('{id}-remaining-value'.format({id: id}), {
			template: UI.template('h4'),
			appearance: {
				style: {
					'margin-top': '3px',
				},
			},
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
			sessionValue,
			remainingValue,
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
			}).then(function () {
				return base.updateHeader();
			});
		}
		base.styles = function () {
			// TODO: update styles

			// blank
			jss.set('#{id} .unit'.format({id: base.id}), {
				'background-color': 'transparent',
				'border': '1px solid {color}'.format({color: Color.grey.lightest}),
			});
			jss.set('#{id} .unit.active'.format({id: base.id}), {
				'border': '1px solid {color} !important'.format({color: Color.grey.dark}),
			});

			// pending
			jss.set('#{id} .unit.pending'.format({id: base.id}), {
				'border': '1px solid {color}'.format({color: Color.grey.lightest}),
			});
			jss.set('#{id} .unit.pending:hover'.format({id: base.id}), {
				'border': '1px solid {color}'.format({color: Color.grey.normal}),
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
		base.count = 0;
		base.setActive = function (current) {
			var previousIndex = base.currentIndex;
			base.currentIndex = current.index % base.limit;

			if (base.currentIndex !== previousIndex) {
				return base.clearAllIfReset(previousIndex).then(function () {
					return base.deactivate()
				}).then(function () {
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
		base.clearAllIfReset = function (previousIndex) {
			if (base.currentIndex === 0 && previousIndex === base.limit - 1) {
				return Promise.all(counterWrapper.children.map(function (child) {
					return child.setClear();
				}));
			} else {
				return Util.ep();
			}
		}
		base.updateHeader = function () {
			console.log();
			return base.headerPath().then(function (headerPath) {
					return Context.get(headerPath);
			}).then(function (remainingCount) {
				return Promise.all([
					sessionValue.setAppearance({html: base.count}),
					remainingValue.setAppearance({html: (remainingCount - base.count)}),
				]);
			});
		}
		base.increment = function () {
			base.count++;
			return base.updateHeader();
		}
		base.decrement = function () {
			base.count--;
			return base.updateHeader();
		}

		return Promise.all([
			headerWrapper.setChildren([
				sessionValue,
				remainingValue,
			]),
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
