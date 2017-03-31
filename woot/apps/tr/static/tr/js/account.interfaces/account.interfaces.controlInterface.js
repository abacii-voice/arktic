var AccountInterfaces = (AccountInterfaces || {});
AccountInterfaces.controlInterface = function () {
	return UI.createComponent('control-interface', {
		ui: {
			template: UI.template('div', 'ie abstract'),
			appearance: {
				style: {
					'height': '100%',
				},
			},
			styles: {
				// list units
				// list searches
				// list titles
			},
		},
		children: [
			Components.sidebar('client-sidebar', {
				ui: {
					position: {
						main: {
							on: '0px',
							off: '-300px',
						},
						back: {
							on: '0px',
							off: '-200px',
						},
					},
					state: {
						primary: 'client-state',
						secondary: 'role-state',
						deactivate: 'control-state',
					},
				},
				children: [
					Components.searchableList('list'),
				],
			}),
			Components.sidebar('role-sidebar', {
				ui: {
					position: {
						main: {
							on: '50px',
							off: '-300px',
						},
						back: {
							on: '0px',
							off: '-200px',
						},
					},
					state: {
						primary: 'role-state',
						secondary: 'control-state',
						deactivate: ['client-state', 'transcription-state', 'settings-state', 'project-state'],
					},
				},
				children: [
					Components.searchableList('list'),
				],
			}),
			Components.sidebar('control-sidebar', {
				ui: {
					position: {
						main: {
							on: '50px',
							off: '-300px',
						},
						back: {
							on: '0px',
							off: '-200px',
						},
					},
					state: {
						primary: 'control-state',
						secondary: ['transcription-state', 'settings-state', 'project-state', '-project-state-project'],
						deactivate: ['client-state', 'role-state', '-settings-state-shortcuts', '-project-state-focus'],
					},
				},
				children: [
					Components.searchableList('list', {
						children: [
							Components.button('transcription-button', {
								ui: {
									appearance: {
										html: 'Transcription',
									},
									state: {
										stateMap: 'transcription-state',
									},
								},
							}),
							Components.button('settings-button', {
								ui: {
									appearance: {
										html: 'Settings',
									},
									state: {
										stateMap: 'settings-state',
									},
								},
							}),
							Components.button('moderation-button', {
								ui: {
									appearance: {
										html: 'Moderation',
									},
								},
							}),
							Components.button('project-button', {
								ui: {
									appearance: {
										html: 'Projects',
									},
									state: {
										stateMap: 'project-state',
									},
								},
							}),
						],
					}),
				],
			}),
			Components.sidebar('settings-sidebar', {
				ui: {
					position: {
						main: {
							on: '50px',
							off: '-300px',
						},
						back: {
							on: '0px',
							off: '-200px',
						},
					},
					state: {
						primary: 'settings-state',
						secondary: ['shortcut-state'],
						deactivate: ['control-state'],
					},
				},
				children: [
					Components.searchableList('list', {
						children: [
							Components.button('shortcuts-button', {
								ui: {
									appearance: {
										html: 'Shortcuts',
									},
									state: {
										stateMap: 'shortcut-state',
									},
								},
							}),
						],
					}),
				],
			}),
			Components.actionMasterController('amc'),
		],
	}).then(function (base) {

		// unpack components
		var amc = base.get('amc');
		var clientList = base.get('client-sidebar.list');
		var roleList = base.get('role-sidebar.list');
		var controlList = base.get('control-sidebar.list');
		var settingsList = base.get('settings-sidebar.list');

		// action master controller
		amc.action.period = 20000;
		amc.state = {
			defaultState: {
				fn: function (_this) {
					_this.action.start();
					return Util.ep();
				}
			},
			states: {
				'client-state': 'default',
				'role-state': 'default',
				'control-state': 'default',
				'transcription-state': 'default',
			},
		}

		// CLIENT SIDEBAR
		clientList.autocomplete = false;
		clientList.targets = [
			{
				name: 'clients',
				path: function () {
					return Util.ep('clients');
				},
				process: function (data) {
					var results = Object.keys(data).map(function (key) {
						var client = data[key];
						return {
							id: key,
							main: client.name,
							rule: 'clients',
						}
					});
					return Util.ep(results);
				},
				filterRequest: function () {
					return {};
				},
			},
		]
		clientList.sort = Util.sort.alpha('main');
		clientList.unit.ui.state.stateMap = 'role-state';
		clientList.unit.bindings = {
			'click': function (_unit) {
				amc.addAction({type: 'click.clientlist', metadata: {client: _unit.datum.id}});
				Active.set('client', _unit.datum.id).then(function () {
					return _unit.triggerState();
				});
			},
		}
		clientList.state = {
			states: {
				'client-state': {
					preFn: function (_this) {
						return _this.control.setup.main();
					},
				},
			},
		}

		// MOVE TO SEARCHABLE LIST UNIT
		function (datum, query, index) {
			query = (query || '');
			return UI.createComponent(`${index}`, {
				ui: {
					template: UI.template('div', 'ie button'),
					appearance: {
						classes: [datum.rule],
					},
					state: {
						stateMap: 'role-state',
					},
				},

				children: [
					// main wrapper
					UI.createComponent('{base}-main-wrapper'.format({base: baseId}), {
						name: 'mainWrapper',
						template: UI.template('div', 'ie centred-vertically'),
						appearance: {
							style: {
								'display': 'inline-block',
							},
						},
						children: [
							// main
							UI.createComponent('{base}-mw-head'.format({base: baseId}), {
								name: 'head',
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
							UI.createComponent('{base}-mw-tail'.format({base: baseId}), {
								name: 'tail',
								template: UI.template('span', 'ie'),
								appearance: {
									style: {
										'display': 'inline-block',
									},
									html: datum.main,
								},
							}),
						],
					}),
				],
			}).then(function (unitBase) {

				unitBase.activate = function () {
					return unitBase.setAppearance({classes: {add: ['active']}});
				}
				unitBase.deactivate = function () {
					return unitBase.setAppearance({classes: {remove: ['active']}});
				}
				unitBase.hide = function () {
					unitBase.isHidden = true;
					return unitBase.setAppearance({classes: {add: 'hidden'}});
				}
				unitBase.show = function () {
					unitBase.isHidden = false;
					return unitBase.setAppearance({classes: {remove: 'hidden'}});
				}
				unitBase.updateMetadata = function (ndatum, query) {
					// if there are changes, do stuff.
					return ((!unitBase.datum || ndatum.id !== unitBase.datum.id) ? unitBase.updateDatum : Util.ep)(ndatum).then(function () {
						return (query !== unitBase.query ? unitBase.updateQuery : Util.ep)(query);
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
						unitBase.cc.mainWrapper.cc.head.setAppearance({html: (unitBase.datum || datum).main.substring(0, query.length)}),
						unitBase.cc.mainWrapper.cc.tail.setAppearance({html: (unitBase.datum || datum).main}),
					]);
				}

				// complete promises.
				return Promise.all([
					unitBase.setBindings({

					}),
				]).then(function () {
					return unitBase;
				});
			});
		}

		// ROLE SIDEBAR
		roleList.autocomplete = false;
		roleList.targets = [
			{
				name: 'roles',
				path: function () {
					return Active.get('client').then(function (clientId) {
						return Util.ep(`user.clients.${clientId}.roles`);
					});
				},
				process: function (data) {
					var results = Object.keys(data).map(function (key) {
						var role = data[key];
						return {
							id: key,
							main: role.display,
							rule: 'roles',
						}
					});
					return Util.ep(results);
				},
				filterRequest: function () {
					return {};
				},
			},
		]
		roleList.sort = Util.sort.alpha('main');
		roleList.unit.ui.state.stateMap = 'control-state';
		roleList.unit.bindings = {
			'click': function (_unit) {
				amc.addAction({type: 'click.rolelist', metadata: {role: _unit.data.id}});
				Active.set('client', _unit.data.id).then(function () {
					return _unit.triggerState();
				});
			},
		}

		// CONTROL SIDEBAR
		controlList.get('transcription-button').bindings = {
			'click': function (_this) {
				amc.addAction({type: 'click.transcription-button'});
				return _this.triggerState();
			},
		}
		controlList.get('settings-button').bindings = {
			'click': function (_this) {
				amc.addAction({type: 'click.settings-button'});
				return _this.triggerState();
			},
		}
		controlList.get('moderation-button').bindings = {
			'click': function (_this) {
				amc.addAction({type: 'click.moderation-button'});
				return _this.triggerState();
			},
		}
		controlList.get('project-button').bindings = {
			'click': function (_this) {
				amc.addAction({type: 'click.project-button'});
				return _this.triggerState();
			},
		}

		// SETTINGS SIDEBAR


		// complete promises
		return Promise.all([

			// CLIENT SIDEBAR
			clientList.setTitle({text: 'Clients', center: false}),
			clientList.setSearch({mode: 'off', placeholder: 'Search clients...'}),

			// ROLE SIDEBAR
			roleList.unitStyle.apply(),
			roleList.search.setAppearance({
				style: {
					'left': '0px',
					'width': '100%',
					'height': '30px',
					'padding-top': '8px',
				},
			}),
			roleList.cc.title.setAppearance({
				style: {
					'width': '100%',
					'height': '32px',
					'font-size': '18px',
					'padding-top': '10px',
					'padding-left': '10px',
				},
			}),
			roleList.setState({
				states: {
					'role-state': {
						preFn: function (_this) {
							return _this.control.setup.main();
						},
					},
				}
			}),
			roleList.setTitle({text: 'Roles', center: false}),
			roleList.setSearch({mode: 'off', placeholder: 'Search roles...'}),

			// CONTROL SIDEBAR
			controlList.setTitle({text: 'Menu', center: false}),
			controlList.setSearch({mode: 'off', placeholder: ''}),
			controlList.cc.title.setAppearance({
				style: {
					'width': '100%',
					'height': '32px',
					'font-size': '18px',
					'padding-top': '10px',
					'padding-left': '10px',
				},
				html: 'Menu',
			}),
			controlList.setState({
				states: {
					'control-state': {
						preFn: function (_this) {
							return Promise.all([
								Active.get('client'),
								Active.get('role'),
							]).then(function (results) {
								var [clientId, roleId] = results;
								return Context.get('user.clients.{client_id}.roles.{role_id}'.format({client_id: clientId, role_id: roleId}));
							}).then(function (role) {
								if (role.type === 'worker') {
									// worker
									return Promise.all([
										controlList.cc.list.cc.wrapper.cc.transcriptionButton.setAppearance({classes: {remove: 'hidden'}}),
										controlList.cc.list.cc.wrapper.cc.moderationButton.setAppearance({classes: {add: 'hidden'}}),
										controlList.cc.list.cc.wrapper.cc.projectButton.setAppearance({classes: {add: 'hidden'}}),
									]);
								} else if (role.type === 'moderator') {
									// moderator
									return Promise.all([
										controlList.cc.list.cc.wrapper.cc.transcriptionButton.setAppearance({classes: {add: 'hidden'}}),
										controlList.cc.list.cc.wrapper.cc.moderationButton.setAppearance({classes: {remove: 'hidden'}}),
										controlList.cc.list.cc.wrapper.cc.projectButton.setAppearance({classes: {add: 'hidden'}}),
									]);
								} else if (role.type === 'admin') {
									// admin
									return Promise.all([
										controlList.cc.list.cc.wrapper.cc.transcriptionButton.setAppearance({classes: {add: 'hidden'}}),
										controlList.cc.list.cc.wrapper.cc.moderationButton.setAppearance({classes: {add: 'hidden'}}),
										controlList.cc.list.cc.wrapper.cc.projectButton.setAppearance({classes: {remove: 'hidden'}}),
									]);
								}
							});
						},
					},
				},
			}),

			// SETTINGS SIDEBAR
			settingsList.cc.list.cc.wrapper.cc.shortcutsButton.setBindings({
				'click': function (_this) {
					amc.addAction({type: 'click.shortcuts-button'});
					return _this.triggerState();
				},
			}),
			settingsList.cc.title.setAppearance({
				style: {
					'width': '100%',
					'height': '32px',
					'font-size': '18px',
					'padding-top': '10px',
					'padding-left': '10px',
				},
			}),
			settingsList.setTitle({text: 'Settings', center: false}),
			settingsList.setSearch({mode: 'off', placeholder: ''}),

		]).then(function () {
			return base;
		});
	});
}
