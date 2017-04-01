var AccountInterfaces = (AccountInterfaces || {});
AccountInterfaces.controlInterface = function () {
	return UI.createComponent('controlInterface', {
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
			Components.sidebar('clientSidebar', {
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
						primary: 'clientState',
						secondary: 'roleState',
						deactivate: 'controlState',
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
			Components.sidebar('roleSidebar', {
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
						primary: 'roleState',
						secondary: 'controlState',
						deactivate: ['clientState', 'transcriptionState', 'settingsState', 'projectState'],
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
			Components.sidebar('controlSidebar', {
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
						primary: 'controlState',
						secondary: ['transcriptionState', 'settingsState', 'projectState', 'projectState.project'],
						deactivate: ['clientState', 'roleState', 'settingsState.shortcuts', 'projectState.focus'],
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
							Components.button('transcriptionButton', {
								options: {
									label: 'Transcription',
								},
								ui: {
									state: {
										map: 'transcription-state',
									},
								}.
							}),
							Components.button('settingsButton', {
								options: {
									label: 'Settings',
								},
								ui: {
									state: {
										map: 'settings-state',
									},
								},
							}),
							Components.button('moderationButton', {
								options: {
									label: 'Moderation',
								},
								ui: {
									state: {
										map: 'settings-state',
									},
								},
							}),
							Components.button('projectButton', {
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
			Components.sidebar('settingsSidebar', {
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
						primary: 'settingsState',
						secondary: ['shortcutState'],
						deactivate: ['controlState'],
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
										map: 'shortcutState',
									},
								},
							}),
						],
					}),
				],
			}),
		],
	}).then(function (base) {

		// unpack components
		var controlList = base.get('controlSidebar.list');
		var settingsList = base.get('settingsSidebar.list');

		// CONTROL SIDEBAR
		controlList.state = {
			states: [
				UI.state('controlState', {
					preFn: function (_this) {
						return Active.get({client: 'client', role: 'role'}).then(function (results) {
							return Context.get(`user.clients.${results.client}.roles.${results.role}`);
						}).then(function (role) {
							if (role.type === 'worker') {
								
							} else if (role.type === 'moderator') {

							} else if (role.type === 'admin') {

							}
						})
					},
				}),
			],
		}

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

		// complete promises
		return base;
	});
}
