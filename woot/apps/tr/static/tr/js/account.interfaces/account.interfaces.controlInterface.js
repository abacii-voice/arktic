// LIST OF CHANGES
// ##### version 1:
// 1. component, state names camelCase
// 2. 3 top level args: options, ui, children
// 3. Move away from functions to nested arguments
// 4. new ui.styles arg for child styles and classes
// 5. Util -> _
// 6. Active.get, Active.set, Context.get, and Context.set should take an object and single value
//
// Active.get('path');
// Active.get({output1: 'path1', output2: 'path2'}).then(function (results) {
// 	results.output1;
// 	results.output2;
// });
// Active.set('path', value);
// Active.set({'path1': value1, 'path2', value2});
//
// 7. 3 modes for searchable list: list, autocomplete, and dropdown
// 8. Change stateMap to state.map
// 9. Change default state to state.modes.default
// 10. Change template to css path format: UI.template('div', 'ie') -> 'div.ie'
// 11. Add .get method to component
// 12. remove 'State' from state names
// 13. Perhaps add type variable to component for searchableList, etc.
// 14. implied 'show' method on component
// 15. other top level args could be 'data', 'control', 'behaviours'.
// 16. Consider doing sidebar states with state.modes

var AccountInterfaces = (AccountInterfaces || {});
AccountInterfaces.controlInterface = function () {
	return UI.createComponent('controlInterface', {
		ui: {
			template: 'div.ie.abstract',
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
						primary: 'client',
						secondary: 'role',
						deactivate: 'control',
					},
				},
				children: [
					Components.searchableList('list', {
						options: {
							title: {
								text: 'Clients',
								center: false,
							},
							search: false,
							mode: 'list', // 3 modes: list, autocomplete, and dropdown
							targets: {
								clients: {
									path: function () {
										return _.ep('clients');
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
										return _.ep(results);
									},
									filterRequest: function () {
										return {};
									},
								},
							},
							unit: {
								ui: {
									state: {
										map: 'role',
									},
								},
							},
						},
						ui: {
							state: {
								states: [
									UI.state('client', {
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
						primary: 'role',
						secondary: 'control',
						deactivate: ['client', 'transcription', 'settings', 'project'],
					},
				},
				children: [
					Components.searchableList('list', {
						options: {
							title: {
								text: 'Roles',
								center: false,
							},
							search: false,
							mode: 'list',
							targets: {
								roles: {
									path: function () {
										return Active.get('client').then(function (clientId) {
											return _.ep(`user.clients.${clientId}.roles`);
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
										return _.ep(results);
									},
									filterRequest: function () {
										return {};
									},
								},
							},
							unit: {
								ui: {
									state: {
										map: 'control',
									},
								},
							},
						},
						ui: {
							state: {
								states: [
									UI.state('role', {
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
						primary: 'control',
						secondary: ['transcription', 'settings', 'project', 'project.project'],
						deactivate: ['client', 'role', 'settings.shortcuts', 'project.focus'],
					},
				},
				children: [
					Components.searchableList('list', {
						options: {
							title: {
								text: 'Menu',
								center: false,
							},
							search: false,
							mode: 'list',
						},
						ui: {
							state: {
								states: [
									UI.state('control', {
										preFn: function (_this) {
											return Active.get({client: 'client', role: 'role'}).then(function (results) {
												return Context.get(`user.clients.${results.client}.roles.${results.role}`);
											}).then(function (role) {
												return Promise.all([
													_this.get('transcriptionButton').show(role.type === 'worker'),
													_this.get('moderationButton').show(role.type === 'moderator'),
													_this.get('projectButton').show(_.accept(role.type, ['moderator', 'admin'])),
												]);
											})
										},
									}),
								],
							},
						},
						children: [
							Components.button('transcriptionButton', {
								options: {
									label: 'Transcription',
								},
								ui: {
									state: {
										map: 'transcription',
									},
								}.
							}),
							Components.button('settingsButton', {
								options: {
									label: 'Settings',
								},
								ui: {
									state: {
										map: 'settings',
									},
								},
							}),
							Components.button('moderationButton', {
								options: {
									label: 'Moderation',
								},
								ui: {
									state: {
										map: 'moderation',
									},
								},
							}),
							Components.button('projectButton', {
								options: {
									label: 'Projects',
								},
								ui: {
									state: {
										map: 'project',
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
						primary: 'settings',
						secondary: ['shortcut'],
						deactivate: ['control'],
					},
				},
				children: [
					Components.searchableList('list', {
						options: {
							title: {
								text: 'Settings',
								center: false,
							},
							search: false,
							mode: 'list',
						},
						children: [
							Components.button('shortcuts', {
								options: {
									label: 'Shortcuts',
								},
								ui: {
									state: {
										map: 'shortcut',
									},
								},
							}),
						],
					}),
				],
			}),
		],
	});
}
