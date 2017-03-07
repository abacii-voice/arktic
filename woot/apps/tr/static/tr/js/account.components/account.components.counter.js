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
	return UI.createComponent(id, {
		name: args.name,
		template: UI.template('div', 'ie'),
		appearance: args.appearance,
		children: [
			// header wrapper
			UI.createComponent('{id}-header-wrapper'.format({id: id}), {
				name: 'headerWrapper',
				template: UI.template('div', 'ie border border-radius'),
				appearance: {
					style: {
						'height': '100%',
						'width': '105px',
						'float': 'left',
						'text-align': 'center',
					},
				},
				children: [
					UI.createComponent('{id}-session-value'.format({id: id}), {
						name: 'sessionValue',
						template: UI.template('h2'),
						appearance: {
							style: {
								'margin-top': '24px',
								'margin-bottom': '0px',
							},
						},
					}),
					UI.createComponent('{id}-remaining-value'.format({id: id}), {
						name: 'remainingValue',
						template: UI.template('h4'),
						appearance: {
							style: {
								'margin-top': '3px',
							},
						},
					}),
				],
			}),

			// counter wrapper
			UI.createComponent('{id}-counter-wrapper'.format({id: id}), {
				name: 'counterWrapper',
				template: UI.template('div', 'ie'),
				appearance: {
					style: {
						'height': style.height,
						'width': 'calc(100% - 105px)',
						'float': 'left',
					},
				},
			}),
		],
	}).then(function (base) {

		// methods
		base.setup = function () {
			return base.styles().then(function () {
				if (base.cc.counterWrapper.children.length === 0) {
					return Promise.ordered(Array.range(base.limit).map(function (index) {
						return function () {
							return base.unit().then(function (unit) {
								return base.cc.counterWrapper.setChildren([unit]);
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
		base.serverRemaining = 0;
		base.remaining = 0;
		base.offset = 0;
		base.setActive = function (current) {
			var previousIndex = base.currentIndex;
			base.currentIndex = current.index % base.limit;

			if (base.currentIndex !== previousIndex) {
				return base.clearAllIfReset(previousIndex).then(function () {
					return base.deactivate()
				}).then(function () {
					base.active = base.cc.counterWrapper.children[base.currentIndex];
					return base.active.activate();
				}).then(function () {
					if (!base.active.isPending && !base.active.isComplete) {
						return base.active.setPending();
					} else {
						return Util.ep();
					}
				}).then(function () {
					return base.updateHeader();
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
				return Promise.all(base.cc.counterWrapper.children.map(function (child) {
					return child.setClear();
				}));
			} else {
				return Util.ep();
			}
		}
		base.increment = function () {
			base.count++;
			base.offset--;
			return base.updateHeader();
		}
		base.decrement = function () {
			base.count--;
			base.offset++;
			return base.updateHeader();
		}

		return Promise.all([

		]).then(function () {
			return base;
		})
	});
}
