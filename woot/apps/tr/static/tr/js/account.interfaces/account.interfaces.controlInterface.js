var AccountInterfaces = (AccountInterfaces || {});
AccountInterfaces.controlInterface = function (name) {
	return UI.createComponent('control-interface', {
		name: name,
		template: UI.template('div', 'ie abstract'),
		appearance: {
			style: {
				'height': '100%',
			},
		},
		children: [
			UI.createComponent('transcription-button', {
				name: 'transcriptionButton',
				template: UI.template('div', 'ie button border border-radius'),
				appearance: {
					style: {
						'top': '10px',
						'width': '80px',
						'height': '80px',
						'left': '10px',
						'padding-top': '30px',
					},
				},
				state: {
					stateMap: 'transcription-state',
				},
				children: [
					UI.createComponent('tb-glyph', {
						name: 'glyph',
						template: UI.template('span', 'glyphicon glyphicon-headphones'),
					}),
				],
			}),

			UI.createComponent('faq-button', {
				name: 'faqButton',
				template: UI.template('div', 'ie button border border-radius'),
				appearance: {
					style: {
						'top': '20px',
						'width': '80px',
						'height': '40px',
						'left': '10px',
						'padding-top': '6px',
						'font-size': '22px',
					},
					html: '?',
				},
				state: {
					stateMap: 'faq-state',
				},
			}),

			UI.createComponent('rules-button', {
				name: 'rulesButton',
				template: UI.template('div', 'ie button border border-radius'),
				appearance: {
					style: {
						'top': '30px',
						'width': '80px',
						'height': '40px',
						'left': '10px',
						'padding-top': '10px',
					},
				},
				state: {
					stateMap: 'rule-state',
				},
				children: [
					UI.createComponent('tb-glyph', {
						name: 'glyph',
						template: UI.template('span', 'glyphicon glyphicon-book'),
					}),
				],
			}),

			// clients
			Components.sidebar('client-sidebar', {
				name: 'clientSidebar',
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
				children: [
					Components.searchableList('cs-client-list', {
						name: 'clientList',
						appearance: {
							style: {
								'top': '2px',
							},
						}
					}),
				],
			}),

			// roles
			Components.sidebar('role-sidebar', {
				name: 'roleSidebar',
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
				children: [
					Components.searchableList('cs-role-list', {
						name: 'roleList',
						appearance: {
							style: {
								'top': '2px',
							},
						},
					}),
				],
			}),

			// control

			/*

			Components.sidebar('control-sidebar', {
				name: 'controlSidebar',
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
				children: [
					Components.searchableList('cs-control-list', {
						name: 'controlList',
						appearance: {
							style: {
								'top': '2px',
							},
						},
						children: [
							UI.createComponent('cs-cl-transcription-button', {
								name: 'transcriptionButton',
								template: UI.template('div', 'ie button'),
								appearance: {
									style: {
										'left': '0px',
										'width': '100%',
										'height': '30px',
										'padding-top': '8px',
										'padding-left': '10px',
										'border-radius': '0px',
										'text-align': 'left',
									},
									html: 'Transcription',
								},
								state: {
									stateMap: 'transcription-state',
								},
							}),
							UI.createComponent('cs-cl-settings-button', {
								name: 'settingsButton',
								template: UI.template('div', 'ie button'),
								appearance: {
									style: {
										'left': '0px',
										'width': '100%',
										'height': '30px',
										'padding-top': '8px',
										'padding-left': '10px',
										'border-radius': '0px',
										'text-align': 'left',
									},
									html: 'Settings',
								},
								state: {
									stateMap: 'settings-state',
								},
							}),
							UI.createComponent('cs-cl-moderation-button', {
								name: 'moderationButton',
								template: UI.template('div', 'ie button'),
								appearance: {
									style: {
										'left': '0px',
										'width': '100%',
										'height': '30px',
										'padding-top': '8px',
										'padding-left': '10px',
										'border-radius': '0px',
										'text-align': 'left',
									},
									html: 'Moderation',
								},
							}),
							UI.createComponent('cs-cl-project-button', {
								name: 'projectButton',
								template: UI.template('div', 'ie button'),
								appearance: {
									style: {
										'left': '0px',
										'width': '100%',
										'height': '30px',
										'padding-top': '8px',
										'padding-left': '10px',
										'border-radius': '0px',
										'text-align': 'left',
									},
									html: 'Projects',
								},
								state: {
									stateMap: 'project-state',
								},
							}),
						],
					}),
				],
			}),

			*/

			// settings
			Components.sidebar('settings-sidebar', {
				name: 'settingsSidebar',
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
				children: [
					Components.searchableList('ss-settings-list', {
						name: 'settingsList',
						appearance: {
							style: {
								'top': '2px',
							},
						},
						children: [
							UI.createComponent('ss-sl-shortcuts-button', {
								name: 'shortcutsButton',
								template: UI.template('div', 'ie button'),
								appearance: {
									style: {
										'left': '0px',
										'width': '100%',
										'height': '60px',
										'padding-top': '8px',
										'padding-left': '10px',
										'border-radius': '0px',
										'text-align': 'left',
									},
									html: 'Shortcuts',
								},
								state: {
									stateMap: 'shortcut-state',
								},
							}),
						],
					}),
				],
			}),

			// action controller
			Components.actionMasterController('amc'),
		],
	}).then(function (base) {

		// unpack components
		var amc = base.cc.amc;
		var clientList = base.cc.clientSidebar.cc.main.cc.clientList;
		var roleList = base.cc.roleSidebar.cc.main.cc.roleList;
		// var controlList = base.cc.controlSidebar.cc.main.cc.controlList;
		var settingsList = base.cc.settingsSidebar.cc.main.cc.settingsList;

		// action master controller
		amc.action.period = 20000;

		// CLIENT SIDEBAR
		clientList.autocomplete = false;
		clientList.targets = [
			{
				name: 'clients',
				path: function () {
					return new Promise(function(resolve, reject) {
						resolve('clients');
					});
				},
				process: function (data) {
					return new Promise(function(resolve, reject) {
						var results = Object.keys(data).map(function (key) {
							var client = data[key];
							return {
								id: key,
								main: client.name,
								rule: 'clients',
							}
						});

						resolve(results);
					});
				},
				filterRequest: function () {
					return {};
				},
			},
		]
		clientList.sort = Util.sort.alpha('main');
		clientList.unit = function (datum, query, index) {
			query = (query || '');
			var baseId = clientList.data.idgen(index);
			return UI.createComponent(baseId, {
				name: 'unit{index}'.format({index: index}),
				template: UI.template('div', 'ie button base'),
				appearance: {
					classes: [datum.rule],
				},
				state: {
					stateMap: 'role-state',
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
						'click': function (_this) {
							amc.addAction({type: 'click.clientlist', metadata: {client: datum.id}});
							Active.set('client', datum.id).then(function () {
								return _this.triggerState();
							});
						},
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
						return new Promise(function(resolve, reject) {
							resolve('user.clients.{client_id}.roles'.format({client_id: clientId}));
						});
					});
				},
				process: function (data) {
					return new Promise(function(resolve, reject) {
						var results = Object.keys(data).map(function (key) {
							var role = data[key];
							return {
								id: key,
								main: role.display,
								rule: 'roles',
							}
						});

						resolve(results);
					});
				},
				filterRequest: function () {
					return {};
				},
			},
		]
		roleList.sort = Util.sort.alpha('main');
		roleList.unit = function (datum, query, index) {
			query = (query || '');
			var base = roleList.data.idgen(index);
			return UI.createComponent(base, {
				name: 'unit{index}'.format({index: index}),
				template: UI.template('div', 'ie button base'),
				appearance: {
					classes: [datum.rule],
				},
				state: {
					stateMap: 'control-state',
				},
				children: [
					// main wrapper
					UI.createComponent('{base}-main-wrapper'.format({base: base}), {
						name: 'mainWrapper',
						template: UI.template('div', 'ie centred-vertically'),
						appearance: {
							style: {
								'display': 'inline-block',
							},
						},
						children: [
							// main
							UI.createComponent('{base}-mw-head'.format({base: base}), {
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
							UI.createComponent('{base}-mw-tail'.format({base: base}), {
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
						'click': function (_this) {
							return Active.get('client').then(function (client_id) {
								return Context.get('user.clients.{client_id}.roles.{role_id}.project'.format({client_id: client_id, role_id: datum.id}));
							}).then(function (project_id) {
								amc.addAction({type: 'click.rolelist', metadata: {project: project_id, role: datum.id}});
								return Promise.all([
									Active.set('project', project_id),
									Active.set('role', datum.id),
								]);
							}).then(function () {
								return _this.triggerState();
							});
						},
					}),
				]).then(function () {
					return unitBase;
				});
			});
		}

		// complete promises
		return Promise.all([

			// action master controller
			amc.setState({
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
			}),

			// CLIENT SIDEBAR
			clientList.unitStyle.apply(),
			clientList.search.setAppearance({
				style: {
					'left': '0px',
					'width': '100%',
					'height': '30px',
					'padding-top': '8px',
				},
			}),
			clientList.cc.title.setAppearance({
				style: {
					'width': '100%',
					'height': '32px',
					'font-size': '18px',
					'padding-top': '10px',
					'padding-left': '10px',
				},
			}),
			clientList.setState({
				states: {
					'client-state': {
						preFn: function (_this) {
							return _this.control.setup.main();
						},
					},
				},
			}),
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

			base.cc.transcriptionButton.setBindings({
				'click': function (_this) {
					return _this.triggerState();
				},
			}),

			base.cc.faqButton.setBindings({
				'click': function (_this) {
					return _this.triggerState();
				},
			}),

			base.cc.rulesButton.setBindings({
				'click': function (_this) {
					return _this.triggerState();
				},
			}),

			// CONTROL SIDEBAR
			/*

			controlList.cc.list.cc.wrapper.cc.transcriptionButton.setBindings({
				'click': function (_this) {
					amc.addAction({type: 'click.transcription-button'});
					return _this.triggerState();
				},
			}),
			controlList.cc.list.cc.wrapper.cc.settingsButton.setBindings({
				'click': function (_this) {
					amc.addAction({type: 'click.settings-button'});
					return _this.triggerState();
				},
			}),
			controlList.cc.list.cc.wrapper.cc.moderationButton.setBindings({}),
			controlList.cc.list.cc.wrapper.cc.projectButton.setBindings({
				'click': function (_this) {
					amc.addAction({type: 'click.project-button'});
					return _this.triggerState();
				},
			}),

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

			*/

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
