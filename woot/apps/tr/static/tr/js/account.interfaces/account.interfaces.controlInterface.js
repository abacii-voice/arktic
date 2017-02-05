var AccountInterfaces = (AccountInterfaces || {});
AccountInterfaces.controlInterface = function (id, args) {
	return Promise.all([
		// base
		UI.createComponent('{id}-base'.format({id: id}), {
			template: UI.template('div', 'ie'),
			appearance: {
				style: {
					'height': '100%',
				},
			},
		}),

		// sidebars
		Components.sidebar('client-sidebar', {
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
		}),
		Components.searchableList('cs-client-list', {
			appearance: {
				style: {
					'top': '2px',
				},
			}
		}),
		Components.sidebar('role-sidebar',{
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
				deactivate: ['client-state', 'transcription-state'],
			},
		}),
		Components.searchableList('cs-role-list', {
			appearance: {
				style: {
					'top': '2px',
				},
			},
		}),
		Components.sidebar('control-sidebar', {
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
				secondary: ['transcription-state'],
				deactivate: ['client-state', 'role-state'],
			},
		}),
		Components.searchableList('cs-control-list', {
			appearance: {
				style: {
					'top': '2px',
				},
			},
		}),
		UI.createComponent('cs-cl-transcription-button', {
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
				html: 'Transcription',
			},
			state: {
				stateMap: 'transcription-state',
			},
		}),
		UI.createComponent('cs-cl-moderation-button', {
			template: UI.template('div', 'ie button'),
			appearance: {
				style: {
					'left': '0px',
					'width': '100%',
					'height': '60px',
					'padding-top': '8px',
				},
				html: 'Moderation',
			},
		}),
		UI.createComponent('cs-cl-upload-button', {
			template: UI.template('div', 'ie button'),
			appearance: {
				style: {
					'left': '0px',
					'width': '100%',
					'height': '60px',
					'padding-top': '8px',
				},
				html: 'Upload',
			},
		}),

		// non-interface elements
		Components.actionMasterController('control'),

	]).then(function (components) {
		// unpack components
		var [
			base,
			clientSidebar,
			clientList,
			roleSidebar,
			roleList,
			controlSidebar,
			controlList,
			transcriptionButton,
			moderationButton,
			uploadButton,
			amc,
		] = components;

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
			var base = clientList.data.idgen(index);
			return Promise.all([
				// base component
				UI.createComponent(base, {
					template: UI.template('div', 'ie button base'),
					appearance: {
						classes: [datum.rule],
					},
					state: {
						stateMap: 'role-state',
					},
				}),

				// main wrapper
				UI.createComponent('{base}-main-wrapper'.format({base: base}), {
					template: UI.template('div', 'ie centred-vertically'),
					appearance: {
						style: {
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
						},
						html: datum.main,
					},
				}),

			]).then(function (unitComponents) {
				var [
					unitBase,
					unitMainWrapper,
					unitMainHead,
					unitMainTail,
				] = unitComponents;

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
						unitMainHead.setAppearance({html: (unitBase.datum || datum).main.substring(0, query.length)}),
						unitMainTail.setAppearance({html: (unitBase.datum || datum).main}),
					]);
				}

				// complete promises.
				return Promise.all([
					unitBase.setBindings({
						'click': function (_this) {
							amc.addAction({type: 'clientlist.click', metadata: {client: datum.id}});
							Active.set('client', datum.id).then(function () {
								return _this.triggerState();
							});
						},
					}),
					unitMainWrapper.setChildren([
						unitMainHead,
						unitMainTail,
					]),
				]).then(function () {
					return unitBase.setChildren([
						unitMainWrapper,
					]);
				}).then(function () {
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
			return Promise.all([
				// base component
				UI.createComponent(base, {
					template: UI.template('div', 'ie button base'),
					appearance: {
						classes: [datum.rule],
					},
					state: {
						stateMap: 'control-state',
					},
				}),

				// main wrapper
				UI.createComponent('{base}-main-wrapper'.format({base: base}), {
					template: UI.template('div', 'ie centred-vertically'),
					appearance: {
						style: {
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
						},
						html: datum.main,
					},
				}),

			]).then(function (unitComponents) {
				var [
					unitBase,
					unitMainWrapper,
					unitMainHead,
					unitMainTail,
				] = unitComponents;

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
						unitMainHead.setAppearance({html: (unitBase.datum || datum).main.substring(0, query.length)}),
						unitMainTail.setAppearance({html: (unitBase.datum || datum).main}),
					]);
				}

				// complete promises.
				return Promise.all([
					unitBase.setBindings({
						'click': function (_this) {
							return Active.get('client').then(function (client_id) {
								return Context.get('user.clients.{client_id}.roles.{role_id}.project'.format({client_id: client_id, role_id: datum.id}));
							}).then(function (project_id) {
								amc.addAction({type: 'rolelist.click', metadata: {project: project_id, role: datum.id}});
								return Promise.all([
									Active.set('project', project_id),
									Active.set('role', datum.id),
								]);
							}).then(function () {
								return _this.triggerState();
							});
						},
					}),
					unitMainWrapper.setChildren([
						unitMainHead,
						unitMainTail,
					]),
				]).then(function () {
					return unitBase.setChildren([
						unitMainWrapper,
					]);
				}).then(function () {
					return unitBase;
				});
			});
		}

		// CONTROL SIDEBAR


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
			clientList.components.title.setAppearance({
				style: {
					'width': '100%',
					'height': '32px',
					'font-size': '18px',
					'padding-top': '10px',
					'padding-left': '10px',
				},
			}),
			clientSidebar.components.main.setChildren([
				clientList,
			]),
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
			roleList.components.title.setAppearance({
				style: {
					'width': '100%',
					'height': '32px',
					'font-size': '18px',
					'padding-top': '10px',
					'padding-left': '10px',
				},
			}),
			roleSidebar.components.main.setChildren([
				roleList,
			]),
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
			transcriptionButton.setBindings({
				'click': function (_this) {
					amc.addAction({type: 'transcription-button.click'});
					return _this.triggerState();
				},
			}),
			moderationButton.setBindings({}),
			uploadButton.setBindings({}),

			controlSidebar.components.main.setChildren([
				controlList,
			]),
			controlList.setTitle({text: 'Menu', center: false}),
			controlList.setSearch({mode: 'off', placeholder: ''}),
			controlList.components.title.setAppearance({
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
										transcriptionButton.setAppearance({classes: {remove: 'hidden'}}),
										moderationButton.setAppearance({classes: {add: 'hidden'}}),
										uploadButton.setAppearance({classes: {add: 'hidden'}}),
									]);
								} else if (role.type === 'moderator') {
									// moderator
									return Promise.all([
										transcriptionButton.setAppearance({classes: {add: 'hidden'}}),
										moderationButton.setAppearance({classes: {remove: 'hidden'}}),
										uploadButton.setAppearance({classes: {add: 'hidden'}}),
									]);
								} else if (role.type === 'admin') {
									// admin
									return Promise.all([
										transcriptionButton.setAppearance({classes: {add: 'hidden'}}),
										moderationButton.setAppearance({classes: {add: 'hidden'}}),
										uploadButton.setAppearance({classes: {remove: 'hidden'}}),
									]);
								}
							});
						},
					},
				},
			}),
			controlList.list.setChildren([
				transcriptionButton,
				moderationButton,
				uploadButton,
			]),

		]).then(function () {
			// base children
			base.components = {
				sidebars: {
					client: clientSidebar,
					role: roleSidebar,
					control: controlSidebar,
				},
			}
			return base.setChildren([
				clientSidebar,
				roleSidebar,
				controlSidebar,
			]);
		}).then(function () {
			return base;
		});
	});
}
