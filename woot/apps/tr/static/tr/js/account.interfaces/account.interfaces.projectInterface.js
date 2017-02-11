var AccountInterfaces = (AccountInterfaces || {});
AccountInterfaces.projectInterface = function () {
	var id = 'project-interface';
	return Promise.all([

		// base
		UI.createComponent(id, {
			template: UI.template('div', 'ie abstract hidden'),
			appearance: {
				style: {
					'height': '100%',
					'left': '0px',
					'top': '0px',
				},
			},
		}),

		// 1. client sidebar
		Components.sidebar('{id}-1-client-sidebar'.format({id: id}), {
			position: {
				main: {
					on: '50px',
					off: '40px',
				},
				back: {
					on: '-200px',
					off: '-200px',
				},
			},
			fade: true,
			state: {
				primary: ['project-state', '-project-state-project'],
				secondary: [],
				deactivate: ['-project-state-focus'],
			},
		}),
		Components.searchableList('{id}-1-cs-1-client-list'.format({id: id}), {
			appearance: {
				style: {
					'top': '2px',
				},
			}
		}),

		// 2. project sidebar
		// -project-state-client
		Components.sidebar('{id}-2-project-sidebar'.format({id: id}), {
			position: {
				main: {
					on: '260px',
					off: '250px',
				},
				back: {
					on: '0px',
					off: '-50px',
				},
			},
			fade: true,
			state: {
				primary: '-project-state-project',
				secondary: ['-project-state-focus'],
				deactivate: ['project-state', 'control-state'],
			},
		}),
		Components.searchableList('{id}-2-ps-1-project-list'.format({id: id}), {
			appearance: {
				style: {
					'top': '2px',
				},
			}
		}),

		// 3. focus sidebar: viewing a single project
		// -project-state-focus
		Components.sidebar('{id}-3-focus-sidebar'.format({id: id}), {
			position: {
				main: {
					on: '60px',
					off: '-300px',
				},
				back: {
					on: '-200px',
					off: '-200px',
				},
			},
			state: {
				primary: '-project-state-focus',
				secondary: [],
				deactivate: ['project-state'],
			},
		}),

		// 4. users panel
		// -project-state-users

		// 5. upload panel
		// -project-state-upload

		// 6. export panel
		// -project-state-export

	]).then(function (components) {
		var [
			base,

			// 1. client sidebar
			clientSidebar,
			clientList,

			// 2. project sidebar
			projectSidebar,
			projectList,

			// 3. focus sidebar
			focusSidebar,
			focusSidebarTitle,


			// 4. users panel
			// 5. upload panel
			// 6. export panel

		] = components;

		// client sidebar
		clientList.autocomplete = false;
		clientList.targets = [
			{
				name: 'clients',
				path: function () {
					return Active.get('client').then(function (client) {
						return Util.ep('clients.{client}.contract_clients'.format({client: client}));
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
						stateMap: '-project-state-project',
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
							// amc.addAction({type: 'click.clientlist', metadata: {client: datum.id}});
							Active.set('contract_client', datum.id).then(function () {
								return _this.triggerState();
							})
							return Util.ep();;
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

		// project sidebar
		projectList.autocomplete = false;
		projectList.targets = [
			{
				name: 'clients',
				path: function () {
					return Promise.all([
						Active.get('client'),
						Active.get('contract_client'),
					]).then(function (results) {
						var [client, contract_client] = results;
						return Util.ep('clients.{client}.contract_clients.{contract_client}.projects'.format({client: client, contract_client: contract_client}));
					});
				},
				process: function (data) {
					return new Promise(function(resolve, reject) {
						var results = Object.keys(data).map(function (key) {
							var project = data[key];
							return {
								id: key,
								main: project.name,
								rule: 'projects',
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
		projectList.sort = Util.sort.alpha('main');
		projectList.unit = function (datum, query, index) {
			query = (query || '');
			var base = projectList.data.idgen(index);
			return Promise.all([
				// base component
				UI.createComponent(base, {
					template: UI.template('div', 'ie button base'),
					appearance: {
						classes: [datum.rule],
					},
					state: {
						stateMap: '-project-state-focus',
						states: {
							'-project-state-project': {},
						},
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
							// amc.addAction({type: 'click.clientlist', metadata: {client: datum.id}});
							Active.set('contract_client.project', datum.id).then(function () {
								return _this.triggerState();
							})
							return Util.ep();;
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

		return Promise.all([

			// base
			base.setState({
				defaultState: {preFn: UI.functions.hide()},
				states: {
					'project-state': {
						preFn: function (_this) {
							// keybindings
							return Util.ep();
						},
						fn: UI.functions.show(),
					},
					'control-state': 'default',
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
					'border': '0px',
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
					'project-state': {
						preFn: function (_this) {
							return _this.control.setup.main();
						},
					},
				},
			}),
			clientList.setTitle({text: 'Clients', center: false}),
			clientList.setSearch({mode: 'on', placeholder: 'Search clients...'}),
			clientSidebar.components.main.addStates({
				'-project-state-focus': {
					style: {
						'left': '40px',
						'opacity': '0.0',
					},
					fn: UI.functions.hide(),
				},
			}),

			// PROJECT SIDEBAR
			projectList.unitStyle.apply(),
			projectList.search.setAppearance({
				style: {
					'left': '0px',
					'width': '100%',
					'height': '30px',
					'padding-top': '8px',
					'border': '0px',
				},
			}),
			projectList.components.title.setAppearance({
				style: {
					'width': '100%',
					'height': '32px',
					'font-size': '18px',
					'padding-top': '10px',
					'padding-left': '10px',
				},
			}),
			projectSidebar.components.main.setChildren([
				projectList,
			]),
			projectList.setState({
				states: {
					'-project-state-project': {
						preFn: function (_this) {
							return _this.control.setup.main();
						},
					},
				},
			}),
			projectList.setTitle({text: 'Projects', center: false}),
			projectList.setSearch({mode: 'on', placeholder: 'Search projects...'}),
			projectSidebar.components.main.addStates({
				'-project-state-focus': {
					style: {
						'left': '250px',
						'opacity': '0.0',
					},
					fn: UI.functions.hide(),
				},
			}),

			// FOCUS SIDEBAR


		]).then(function () {
			return base.setChildren([
				clientSidebar,
				projectSidebar,
				// focusSidebar,
			]);
		}).then(function () {
			return base;
		});
	});
}
