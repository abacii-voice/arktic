var AccountInterfaces = (AccountInterfaces || {});
AccountInterfaces.shortcutInterface = function (id, args) {

	var autocompleteWidth = '300px';
	return Promise.all([
		// base
		UI.createComponent('shortcut-base', {
			template: UI.template('div', 'ie abs'),
			appearance: {
				style: {
					'height': '100%',
					'left': '60px',
					'width': 'calc(100% - 60px)',
				},
				classes: ['centred-vertically'],
			},
		}),

		// main panel
		UI.createComponent('sb-1-main-panel', {
			template: UI.template('div', 'ie'),
			appearance: {
				style: {
					'height': '100%',
					'left': '0px',
					'width': 'calc(100% - {width})'.format({width: autocompleteWidth}),
					'float': 'left',
				},
			},
		}),

		// autocomplete panel
		UI.createComponent('sb-2-autocomplete-panel', {
			template: UI.template('div', 'ie'),
			appearance: {
				style: {
					'height': '100%',
					'width': autocompleteWidth,
					'float': 'left',
				},
				classes: ['centred-vertically'],
			},
		}),

		// autocomplete
		Components.searchableList('sb-2-ap-1-autocomplete', {
			appearance: {
				style: {
					'height': '100%',
					'width': '100%',
				},
				classes: ['ie','abs'],
			},
		}),

	]).then(function (components) {
		var [
			base,

			mainPanel,

			autocompletePanel,
			autocomplete,
		] = components;

		// autocomplete
		autocomplete.targets = [
			{name: 'tag',
				path: function () {
					return Promise.all([
						Active.get('client'),
						Active.get('project'),
					]).then(function (results) {
						return 'clients.{client_id}.projects.{project_id}.dictionary.tokens'.format({client_id: results[0], project_id: results[1]});
					});
				},
				process: function (data) {
					return new Promise(function(resolve, reject) {
						var results = Object.keys(data).filter(function (key) {
							return data[key].type === 'tag';
						}).map(function (key) {
							var tag = data[key];
							var tag_data = {
								id: key,
								main: tag.content,
								rule: 'tag',
							}

							if (tag.shortcut) {
								if (tag.shortcut.is_active) {
									tag_data.shortcut = tag.shortcut.combo;
									Mousetrap.unbind(tag.shortcut.combo);
									Mousetrap.bind(tag.shortcut.combo, function (event) {
										event.preventDefault();
										amc.addAction({type: 'key.shortcut.{combo}'.format({combo: tag.shortcut.combo})});
										Promise.all([
											autocomplete.behaviours.shortcut(key),
										]);
									});
								}
							}

							return tag_data;
						});
						resolve(results);
					});
				},
				setStyle: function () {
					return new Promise(function(resolve, reject) {
						jss.set('#{id} .tag'.format({id: autocomplete.id}), {
							'background-color': Color.green.lightest,
						});
						jss.set('#{id} .tag.active'.format({id: autocomplete.id}), {
							'background-color': Color.green.light,
						});
						resolve();
					});
				},
				filter: {
					default: true,
					char: ':',
					key: 'colon',
					input: 'Tags',
					display: 'Tag',
					rule: 'tag',
					blurb: 'Filter semantic tags',
					limit: 10,
					autocompleteOverride: true,
					preventIncomplete: true,
					request: function (query) {
						var dict = {};
						dict['tokens'] = {'content__startswith': query, 'type': 'tag'};
						return dict;
					},
				},
			},
		]
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
		autocomplete.sort = function (d1, d2) {
			// sort by usage
			if (d1.usage && d2.usage) {
				if (d1.usage > d2.usage) {
					return 1;
				} else if (d1.usage < d2.usage) {
					return -1;
				}
			}

			// then alphabetically
			if (d1.main.toLowerCase() > d2.main.toLowerCase()) {
				return 1;
			} else {
				return -1;
			}
		}
		autocomplete.unit = function (datum, query, index) {
			query = (query || '');
			var base = autocomplete.data.idgen(index);
			return Promise.all([
				// base component
				UI.createComponent(base, {
					template: UI.template('div', 'ie button base'),
					appearance: {
						classes: [datum.rule],
						style: {
							'height': 'auto',
						},
					}
				}),

				// main container
				UI.createComponent('{base}-main-container'.format({base: base}), {
					template: UI.template('div', 'ie'),
					appearance: {
						style: {
							'left': '0px',
							'padding-top': '11px',
							'padding-bottom': '5px',
							'width': 'calc(100% - 15px)'
						},
					},
				}),

				// main wrapper
				UI.createComponent('{base}-main-wrapper'.format({base: base}), {
					template: UI.template('div', 'ie'),
					appearance: {
						style: {
							'left': '0px',
							'display': 'inline-block',
						},
					},
				}),

				// main
				UI.createComponent('{base}-main-head'.format({base: base}), {
					template: UI.template('span', 'ie'),
					appearance: {
						style: {
							'color': Color.grey.normal,
							'display': 'inline-block',
							'position': 'absolute',
						},
						html: datum.main.substring(0, query.length),
					},
				}),
				UI.createComponent('{base}-main-tail'.format({base: base}), {
					template: UI.template('span', 'ie'),
					appearance: {
						style: {
							'display': 'inline-block',
							'max-width': '100%',
						},
						html: datum.main,
					},
				}),
				UI.createComponent('{base}-main-shortcut'.format({base: base}), {
					template: UI.template('span', 'ie'),
					appearance: {
						style: {
							'display': 'inline-block',
							'left': '8px',
							'opacity': '0.6',
							'top': '-4px',
						},
						html: (datum.shortcut || ''),
					},
				}),

				// index
				UI.createComponent('{base}-index'.format({base: base}), {
					template: UI.template('div', 'ie abs'),
					appearance: {
						style: {
							'width': '10px',
							'right': '5px',
							'top': '11px',
						},
						html: index,
					},
				}),

			]).then(function (unitComponents) {
				var [
					unitBase,
					unitMainContainer,
					unitMainWrapper,
					unitMainHead,
					unitMainTail,
					unitMainShortcut,
					unitIndex,
				] = unitComponents;

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
					// console.log(ndatum, query);
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
						return unitMainShortcut.setAppearance({html: (ndatum.shortcut || '')});
					});
				}
				unitBase.updateQuery = function (query) {
					unitBase.query = query;
					return Promise.all([
						unitMainHead.setAppearance({html: unitBase.datum.main.substring(0, query.length)}),
						unitMainTail.setAppearance({html: unitBase.datum.main}),
					]);
				}

				// complete promises.
				return Promise.all([
					unitMainWrapper.setChildren([
						unitMainHead,
						unitMainTail,
					]),
					unitMainContainer.setChildren([
						unitMainWrapper,
						unitMainShortcut,
					]),
				]).then(function () {
					return unitBase.setChildren([
						unitMainContainer,
						unitIndex,
					]);
				}).then(function () {
					return unitBase;
				});
			});
		}
		autocomplete.behaviours.number = function (char) {
			var index = parseInt(char);
			if (index < autocomplete.data.storage.virtual.rendered.length) {
				return autocomplete.control.setActive.main({index: index}).then(function () {
					return autocomplete.behaviours.right();
				});
			}
		}
		autocomplete.search.behaviours.right = function () {
			if (autocomplete.search.isCaretInPosition() && !autocomplete.search.isComplete) {
				autocomplete.currentIndex = 0;
				return autocomplete.search.complete().then(function () {
					return autocomplete.search.input();
				});
			} else {
				return Util.ep();
			}
		}

		return Promise.all([

			// base
			base.setAppearance({
				classes: ['hidden'],
			}),
			base.setState({
				defaultState: {preFn: UI.functions.hide},
				states: {
					'role-state': 'default',
					'control-state': 'default',
					'settings-state': 'default',
					'shortcut-state': {
						preFn: function () {
							// KEYBINDINGS
							Mousetrap.bind('up', function (event) {
								if (UI.globalState.contains('shortcut')) {
									event.preventDefault();
									if (autocomplete.isFocused) {
										Promise.all([
											autocomplete.behaviours.up(),
										]);
									}
								}
							});
							Mousetrap.bind('down', function (event) {
								if (UI.globalState.contains('shortcut')) {
									event.preventDefault();
									if (autocomplete.isFocused) {
										Promise.all([
											autocomplete.behaviours.down(),
										]);
									}
								}
							});
							Mousetrap.bind(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], function (event) {
								if (UI.globalState.contains('shortcut')) {
									event.preventDefault();
									var char = String.fromCharCode(event.which);
									Promise.all([
										autocomplete.behaviours.number(char),
									]);
								}
							});
							return Util.ep();
						},
						fn: UI.functions.show,
					},
				},
			}),

			// autocomplete panel
			autocompletePanel.setChildren([
				autocomplete,
			]),

			// autocomplete
			autocomplete.components.filterButton.setState({
				stateMap: {
					'shortcut-state': 'shortcut-state-filter',
					'shortcut-state-filter': 'shortcut-state',
				},
			}),
			autocomplete.list.setState({
				states: {
					'shortcut-state': {
						classes: {remove: 'hidden'},
					},
					'shortcut-state-filter': {
						classes: {add: 'hidden'},
					},
				},
			}),
			autocomplete.components.filter.setState({
				states: {
					'shortcut-state': {
						classes: {add: 'hidden'},
					},
					'shortcut-state-filter': {
						classes: {remove: 'hidden'},
					},
				},
			}),
			autocomplete.setTitle(),
			autocomplete.setSearch({mode: 'on', limit: 10, autocomplete: true}),
			autocomplete.components.search.setAppearance({
				style: {
					'border': '0px solid #fff',
					'border-bottom': '1px solid #888',
					'border-radius': '0px',
				},
			}),
			autocomplete.components.searchFilterBar.setAppearance({
				style: {
					'display': 'block',
				},
			}),
			autocomplete.unitStyle.apply(),
			autocomplete.setState({
				states: {
					'shortcut-state': {
						preFn: function (_this) {
							return _this.control.setup.main();
						},
					},
					'settings-state': {
						fn: function (_this) {
							return _this.control.reset();
						}
					}
				},
			}),

		]).then(function () {
			return base.setChildren([
				mainPanel,
				autocompletePanel,
			]);
		}).then(function () {
			return base;
		});
	});
}
