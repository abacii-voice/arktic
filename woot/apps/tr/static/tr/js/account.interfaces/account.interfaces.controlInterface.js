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
			Components.sidebar('clients', {
				options: {
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
					Components.searchableList('list', {
						options: {
							title: {
								text: 'Clients',
								center: false,
							},
							search: {
								show: false,
							},
							mode: 'list', // 3 modes: list, autocomplete, and dropdown
							targets: [
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
							],
							sort: Util.sort.alpha('main'),
							unit: {
								ui: {
									state: {
										map: 'role-state',
									},
								},
							},
						},
						ui: {
							state: {
								states: [
									UI.state('client-state', {
										preFn: function (_this) {
											return _this.control.setup.main();
										}
									}),
								],
							},
						},
					}),
				],
			}),
			Components.sidebar('roles', {
				options: {
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
					Components.searchableList('list', {
						options: {
							title: {
								text: 'Roles',
								center: false,
							},
							search: {
								show: false,
							},
							mode: 'list',
							targets: [
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
							],
							sort: Util.sort.alpha('main'),
							unit: {
								ui: {
									state: {
										map: 'control-state',
									},
								},
							},
						},
						ui: {
							state: {
								states: [
									UI.state('role-state', {
										preFn: function (_this) {
											return _this.control.setup.main();
										}
									}),
								],
							},
						},
					}),
				],
			}),
			Components.sidebar('controls', {
				options: {
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
						secondary: ['transcription-state', 'settings-state', 'project-state', 'project-state.project'],
						deactivate: ['client-state', 'role-state', 'settings-state.shortcuts', 'project-state.focus'],
					},
				},
				children: [
					Components.searchableList('list', {
						options: {
							title: {
								text: 'Menu',
								center: false,
							},
							search: {
								show: false,
							},
							mode: 'list',
						},
						children: [
							Components.button('transcription', {
								options: {
									label: 'Transcription',
								},
								ui: {
									state: {
										map: 'transcription-state',
									},
								}.
							}),
							Components.button('settings', {
								options: {
									label: 'Settings',
								},
								ui: {
									state: {
										map: 'settings-state',
									},
								},
							}),
							Components.button('moderation', {
								options: {
									label: 'Moderation',
								},
								ui: {
									state: {
										map: 'settings-state',
									},
								},
							}),
							Components.button('project', {
								options: {
									label: 'Projects',
								},
								ui: {
									state: {
										map: 'settings-state',
									},
								},
							}),
						],
					}),
				],
			}),
			Components.sidebar('settings', {
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
						options: {
							title: {
								text: 'Settings',
								center: false,
							},
							search: {
								show: false,
							},
							mode: 'list',
						},
						children: [
							Components.button('shortcuts', {
								options: {
									label: 'Shortcuts',
								},
								ui: {
									state: {
										map: 'shortcut-state',
									},
								},
							}),
						],
					}),
				],
			}),
			Components.actionMasterController('amc', {
				options: {
					action: {
						period: 20000,
					}
				},
				ui: {
					state: {
						modes: {
							default: {
								fn: function (_this) {
									_this.action.start();
									return Util.ep();
								}
							}
						},
						states: [
							UI.state('client-state', {
								mode: 'default',
							}),
							UI.state('role-state', {
								mode: 'default',
							}),
							UI.state('control-state', {
								mode: 'default',
							}),
							UI.state('transcription-state', {
								mode: 'default',
							}),
						],
					},
				},
			}),
		],
	}).then(function (base) {

		// unpack components
		var amc = base.get('amc');
		var clientList = base.get('clients.list');
		var roleList = base.get('roles.list');
		var controlList = base.get('controls.list');
		var settingsList = base.get('settings.list');

		// CLIENT SIDEBAR
		clientList.unit.bindings = {
			'click': function (_unit) {
				amc.addAction({type: 'click.clientlist', metadata: {client: _unit.datum.id}});
				Active.set('client', _unit.datum.id).then(function () {
					return _unit.triggerState();
				});
			},
		}

		// ROLE SIDEBAR
		roleList.unit.bindings = {
			'click': function (_unit) {
				amc.addAction({type: 'click.rolelist', metadata: {role: _unit.data.id}});
				Active.set('client', _unit.data.id).then(function () {
					return _unit.triggerState();
				});
			},
		}

		// CONTROL SIDEBAR
		controlList.get('transcription').bindings = {
			'click': function (_this) {
				amc.addAction({type: 'click.transcription'});
				return _this.triggerState();
			},
		}
		controlList.get('settings').bindings = {
			'click': function (_this) {
				amc.addAction({type: 'click.settings'});
				return _this.triggerState();
			},
		}
		controlList.get('moderation').bindings = {
			'click': function (_this) {
				amc.addAction({type: 'click.moderation'});
				return _this.triggerState();
			},
		}
		controlList.get('projects').bindings = {
			'click': function (_this) {
				amc.addAction({type: 'click.projects'});
				return _this.triggerState();
			},
		}

		// SETTINGS SIDEBAR
		settingsList.get('shortcuts').bindings = {
			'click': function (_this) {
				amc.addAction({type: 'click.shortcuts-button'});
				return _this.triggerState();
			},
		}

		// complete promises
		return Promise.all([

			// CLIENT SIDEBAR

			// ROLE SIDEBAR

			// CONTROL SIDEBAR
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

		]).then(function () {
			return base;
		});
	});
}
