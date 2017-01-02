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
					'height': args.appearance.style.width,
					'width': args.appearance.style.width,
					'border-bottom-left-radius': '0px',
					'border-bottom-right-radius': '0px',
					'border-bottom': '0px',
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
			template: UI.template('div', 'ie border'),
			appearance: {
				style: {
					'height': 'calc(100% - {width}px)'.format({width: parseInt(args.appearance.style.width)}),
					'width': args.appearance.style.width,
					'border-bottom-left-radius': '5px',
					'border-bottom-right-radius': '5px',
				},
			},
		}),

		// left column
		UI.createComponent('{id}-left-column'.format({id: id}), {
			template: UI.template('div', 'ie'),
			appearance: {
				style: {
					'height': '100%',
					'width': '50%',
					'float': 'left',
				},
			},
		}),

		// right column
		UI.createComponent('{id}-right-column'.format({id: id}), {
			template: UI.template('div', 'ie'),
			appearance: {
				style: {
					'height': '100%',
					'width': '50%',
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
			leftColumn,
			rightColumn,
		] = components;

		// COMBINE

		// header properties
		headerWrapper.counter = counterWrapper;
		headerWrapper.dailyCount = 0;
		headerWrapper.cycleCount = 0;
		headerWrapper.increment = function () {
			// add one to the daily and cycle counts and increment counter wrapper
			var _this = headerWrapper;
			// counterWrapper.increment();
			return Promise.all([
				new Promise(function(resolve, reject) {
					_this.dailyCount += 1;
					_this.cycleCount += 1;
					resolve();
				}),
				counterWrapper.increment(),
			]).then(function () {
				return _this.set();
			});
		}
		headerWrapper.set = function () {
			var _this = headerWrapper;
			return new Promise(function(resolve, reject) {
				dailyHeader.model().html(_this.dailyCount);
				cycleHeader.model().html(_this.cycleCount);
				resolve();
			});
		}
		headerWrapper.load = function () {
			// set value and is_loaded, display value
			var _this = headerWrapper;
			return Promise.all([
				args.options.source.daily(),
				args.options.source.cycle(),
			]).then(function (paths) {
				return Promise.all([
					Context.get(paths[0]),
					Context.get(paths[1]),
				]);
			}).then(function (values) {
				return new Promise(function(resolve, reject) {
					_this.dailyCount = values[0];
					_this.cycleCount = values[1];
					resolve();
				});
			}).then(function () {
				return _this.set();
			});
		}
		headerWrapper.setChildren([
			dailyHeader,
			cycleHeader,
		]);

		// counter properties
		counterWrapper.columnMax = 15; // calculate based on height
		counterWrapper.leftColumnCount = 0;
		counterWrapper.rightColumnCount = 0;
		counterWrapper.increment = function () {
			var _this = counterWrapper;
			// if within limit, add another token
			// else reset and clear all tokens and add a new one
			return UI.createComponent('completion-token-{index}'.format({index: (_this.leftColumnCount + _this.rightColumnCount)}), {
				template: UI.template('div', 'ie border'),
				appearance: {
					style: {
						'margin-left': '5px',
						'margin-top': '5px',
						'height': '10px',
						'width': '10px',
					},
				},
			}).then(function (newCompletionToken) {
				if (_this.leftColumnCount == _this.columnMax) {
					if (_this.rightColumnCount == _this.columnMax) {
						// reset both and add to left column
						_this.leftColumnCount = 0;
						_this.rightColumnCount = 0;
						return leftColumn.removeChildren().then(function () {
							return rightColumn.removeChildren();
						}).then(function () {
							_this.leftColumnCount++;
							return leftColumn.setChildren([
								newCompletionToken,
							]);
						});
					} else {
						// add to right column
						_this.rightColumnCount++;
						return rightColumn.setChildren([
							newCompletionToken,
						]);
					}
				} else {
					// add to left column
					_this.leftColumnCount++;
					return leftColumn.setChildren([
						newCompletionToken,
					]);
				}
			})
		}
		counterWrapper.setChildren([
			leftColumn,
			rightColumn,
		]);

		base.head = headerWrapper;
		base.setChildren([
			headerWrapper,
			counterWrapper,
		]);

		return base;
	});
}
