var AccountInterfaces = (AccountInterfaces || {});
AccountInterfaces.faqInterface = function (id, args) {

	var autocompleteWidth = '350px';
	return UI.createComponent('faq-base', {
		name: 'faqInterface',
		template: UI.template('div', 'ie abs'),
		appearance: {
			style: {
				'height': '100%',
				'left': '100px',
				'width': 'calc(100% - 100px)',
			},
			classes: ['centred-vertically'],
		},
		children: [
			Components.searchableList('faq-autocomplete', {
				name: 'autocomplete',
				appearance: {
					style: {
						'top': '10px',
						'height': '100%',
						'width': '500px',
					},
					classes: ['ie','abs'],
				},
			}),
		],
	}).then(function (base) {

		var autocomplete = base.cc.autocomplete;

		// MODIFY UNIT TO PROPERLY DISPLAY TITLE AND BODY

		autocomplete.data.preventIncomplete = true;
		autocomplete.targets = [
			{name: 'faq',
				path: function () {
					return Util.ep('faq');
				},
				process: function (data) {
					return new Promise(function(resolve, reject) {
						var results = data.map(function (datum, index) {
							return {
								id: index,
								main: datum.title,
								body: datum.body,
							}
						});

						resolve(results);
					});
				},
			},
		]
		autocomplete.sort = function (d1, d2) {
			// by id
			if (d1.id > d2.id) {
				return 1;
			} else {
				return -1;
			}
		},
		autocomplete.unitStyle.base = function () {
			return new Promise(function(resolve, reject) {
				// base class
				jss.set('#{id} .base'.format({id: autocomplete.id}), {
					'min-height': '30px',
					'width': '100%',
					'padding': '0px',
					'padding-left': '10px',
					'text-align': 'left',
					'border-bottom': '1px solid #ccc',
				});
				resolve();
			});
		}
		autocomplete.unit = function (datum, query, index) {
			query = (query || '');
			var base = autocomplete.data.idgen(index);
			return UI.createComponent(base, {
				name: 'unit{index}'.format({index: index}),
				template: UI.template('div', 'ie button base'),
				appearance: {
					style: {
						'height': 'auto',
					},
				},
				children: [
					// main container
					UI.createComponent('{base}-main-container'.format({base: base}), {
						name: 'container',
						template: UI.template('div', 'ie'),
						appearance: {
							style: {
								'left': '0px',
								'padding-top': '11px',
								'padding-bottom': '5px',
								'width': 'calc(100% - 15px)'
							},
						},
						children: [
							// main wrapper
							UI.createComponent('{base}-main-wrapper'.format({base: base}), {
								name: 'wrapper',
								template: UI.template('div', 'ie'),
								appearance: {
									style: {
										'font-size': '20px',
										'left': '0px',
										'display': 'inline-block',
									},
								},
								children: [
									// main
									UI.createComponent('{base}-main-head'.format({base: base}), {
										name: 'head',
										template: UI.template('span', 'ie'),
										appearance: {
											style: {
												'color': Color.grey.normal,
												'display': 'inline-block',
												'position': 'absolute',
											},
										},
									}),
									UI.createComponent('{base}-main-tail'.format({base: base}), {
										name: 'tail',
										template: UI.template('span', 'ie'),
										appearance: {
											style: {
												'display': 'inline-block',
												'max-width': '100%',
											},
											html: `${datum.id+1}. ${datum.main}`,
										},
									}),
								],
							}),
						],
					}),
					// body
					UI.createComponent('{base}-body'.format({base: base}), {
						name: 'body',
						template: UI.template('div', 'ie'),
						appearance: {
							style: {
								'margin-bottom': '10px',
							},
							html: datum.body,
						},
					}),
				],
			}).then(function (unitBase) {

				unitBase.activate = function () {
					return unitBase.setAppearance({classes: {add: ['active']}});
				}
				unitBase.deactivate = function () {
					return unitBase.setAppearance({classes: {remove: ['active']}});
				}
				unitBase.show = function () {
					unitBase.isHidden = false;
					return unitBase.setAppearance({classes: {remove: 'hidden'}});
				}
				unitBase.hide = function () {
					unitBase.isHidden = true;
					return unitBase.setAppearance({classes: {add: 'hidden'}});
				}
				unitBase.updateMetadata = function (ndatum, query) {
					// if there are changes, do stuff.
					return unitBase.updateDatum(ndatum).then(function () {
						return unitBase.updateQuery(query);
					}).then(function () {
						return (unitBase.isHidden ? unitBase.show : Util.ep)();
					});
				}
				unitBase.updateDatum = function (ndatum) {
					return unitBase.setAppearance({classes: {add: ndatum.rule, remove: (unitBase.datum || datum).rule}}).then(function () {
						unitBase.datum = ndatum;
						return Util.ep();
					});
				}
				unitBase.updateQuery = function (query) {
					unitBase.query = query;
					return Promise.all([
						unitBase.cc.container.cc.wrapper.cc.tail.setAppearance({html: `${unitBase.datum.id+1}. ${unitBase.datum.main}`}),
						unitBase.cc.body.setAppearance({html: unitBase.datum.body}),
					]);
				}

				// complete promises.
				return Promise.all([

				]).then(function () {
					return unitBase;
				});
			});
		}
		autocomplete.data.display.filter.condition = function (datum) {
			var _this = autocomplete;

			// Modify condition to search both the title and the body of the faq
			// var _tokens = _this.

			// Here, the lack of matching query and the global autocomplete mode can be overridden by base.data.autocompleteOverride.
			// For the null query, the override only diplays everything if the query is still null, then is more specific when something is typed.
			if (datum && datum.main && datum.body) {
				return Util.ep((
					(
						// lower case query match anywhere in the body
						datum.body.toLowerCase().indexOf(_this.data.query.toLowerCase()) !== -1
						&&
						_this.data.query.toLowerCase() !== ''
					)
					||
					(
						// lower case query match anywhere in the title
						datum.main.toLowerCase().indexOf(_this.data.query.toLowerCase()) !== -1
						&&
						_this.data.query.toLowerCase() !== ''
					)
					||
					(
						// allow autocomplete mode to display everything
						(_this.data.autocompleteOverride || !_this.autocomplete || false)
						&&
						_this.data.query === ''
					)
				));
			} else {
				return Util.ep(false);
			}
		}
		autocomplete.search.setMetadata = function (metadata) {
			var _this = autocomplete.search;
			metadata = (metadata || {});
			_this.metadata = (_this.metadata || {});
			_this.metadata.query = metadata.query !== undefined ? metadata.query : (_this.metadata.query || '');
			return _this.cc.tail.setAppearance({html: (_this.metadata.query || _this.placeholder)}).then(function () {
				_this.isComplete = false;
				return Util.ep();
			});
		}

		// connect
		return Promise.all([

			// base
			base.setAppearance({
				classes: ['hidden'],
			}),
			base.setState({
				defaultState: {preFn: UI.functions.hide()},
				states: {
					'faq-state': {
						fn: UI.functions.show(),
					},
					'client-state': 'default',
					'role-state': 'default',
					'control-state': 'default',
					'rule-state': 'default',
					'transcription-state': 'default',
				},
			}),

			// autocomplete
			autocomplete.setTitle({text: 'FAQ'}),
			autocomplete.setSearch({mode: 'on', autocomplete: false}),
			autocomplete.search.setAppearance({
				style: {
					'border': '0px solid #fff',
					'border-bottom': '1px solid #888',
					'border-radius': '0px',
				},
			}),
			autocomplete.cc.searchFilterBar.setAppearance({
				style: {
					'display': 'block',
				},
			}),
			autocomplete.unitStyle.apply(),
			autocomplete.setState({
				states: {
					'faq-state': {
						preFn: function (_this) {
							return _this.control.setup.main();
						},
					},
				},
			}),

		]).then(function () {
			return base;
		});
	});
}
