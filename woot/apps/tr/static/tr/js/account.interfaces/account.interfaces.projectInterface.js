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
					on: '50px',
					off: '-300px',
				},
				back: {
					on: '-200px',
					off: '-200px',
				},
			},
			fade: false,
			state: {
				primary: '-project-state-focus',
				secondary: [],
				deactivate: ['project-state', '-project-state-project'],
			},
		}),
		UI.createComponent('{id}-3-fs-1-title'.format({id: id}), {
			template: UI.template('h4', 'ie'),
			appearance: {
				style: {
					'width': '100%',
					'height': '32px',
					'font-size': '18px',
					'padding-top': '12px',
					'padding-left': '0px',
				},
				html: '',
			},
		}),
		UI.createComponent('{id}-3-fs-2-subtitle'.format({id: id}), {
			template: UI.template('h4', 'ie'),
			appearance: {
				style: {
					'height': '40px',
					'font-size': '14px',
					'padding-top': '5px',
					'padding-left': '0px',
					'float': 'left',
					'color': Color.grey.light,
				},
				html: '',
			},
		}),
		UI.createComponent('{id}-3-fs-2-1-status'.format({id: id}), {
			template: UI.template('h4', 'ie'),
			appearance: {
				style: {
					'height': '40px',
					'font-size': '14px',
					'padding-top': '5px',
					'padding-left': '8px',
					'float': 'left',
					'color': Color.red.normal,
				},
				html: 'incomplete',
			},
		}),

		// 3.3 Transcriptions button
		UI.createComponent('{id}-3-fs-3-transcriptions'.format({id: id}), {
			template: UI.template('div', 'ie border border-radius menu-button'),
			appearance: {
				style: {
					'width': '100%',
					'height': '70px',
					'margin-bottom': '10px',
				},
			},
		}),
		UI.createComponent('{id}-3-fs-3-t-2-transcription'.format({id: id}), {
			template: UI.template('h1', 'ie'),
			appearance: {
				style: {
					'font-size': '15px',
					'padding-top': '10px',
					'padding-left': '12px',
					'float': 'left',
					'display': 'inline-block',
				},
				html: 'Transcription',
			},
		}),
		UI.createComponent('{id}-3-fs-3-t-4-transcriber-number'.format({id: id}), {
			template: UI.template('span', 'ie'),
			appearance: {
				style: {
					'font-size': '15px',
					'padding-top': '10px',
					'padding-left': '12px',
					'float': 'left',
					'clear': 'left',
					'display': 'inline-block',
					'color': Color.grey.normal,
				},
				html: '4 Transcribers',
			},
		}),
		UI.createComponent('{id}-3-fs-3-t-1-percentage-completion'.format({id: id}), {
			template: UI.template('span', 'ie abs'),
			appearance: {
				style: {
					'right': '0px',
					'font-size': '15px',
					'padding-top': '10px',
					'padding-right': '12px',
					'display': 'inline-block',
					'color': Color.green.normal,
				},
				html: '34%',
			},
		}),
		UI.createComponent('{id}-3-fs-3-t-3-count-remaining'.format({id: id}), {
			template: UI.template('span', 'ie'),
			appearance: {
				style: {
					'font-size': '15px',
					'padding-top': '10px',
					'padding-right': '12px',
					'float': 'right',
					'clear': 'right',
					'display': 'inline-block',
					'color': Color.red.normal,
				},
				html: '6600',
			},
		}),

		// 3.4 Export
		UI.createComponent('{id}-3-fs-4-export'.format({id: id}), {
			template: UI.template('div', 'ie border border-radius menu-button'),
			appearance: {
				style: {
					'width': '100%',
					'height': '40px',
					'margin-bottom': '10px',
				},
			},
		}),
		UI.createComponent('{id}-3-fs-4-t-1-export'.format({id: id}), {
			template: UI.template('h1', 'ie'),
			appearance: {
				style: {
					'font-size': '15px',
					'padding-top': '10px',
					'padding-left': '12px',
					'float': 'left',
					'display': 'inline-block',
				},
				html: 'Export',
			},
		}),
		UI.createComponent('{id}-3-fs-4-t-2-completed'.format({id: id}), {
			template: UI.template('span', 'ie'),
			appearance: {
				style: {
					'font-size': '15px',
					'padding-top': '10px',
					'padding-right': '12px',
					'float': 'right',
					'display': 'inline-block',
					'color': Color.green.normal,
				},
				html: '3400',
			},
		}),

		// 3.5 Upload
		UI.createComponent('{id}-3-fs-5-upload'.format({id: id}), {
			template: UI.template('div', 'ie border border-radius'),
			appearance: {
				style: {
					'width': '100%',
					'height': '200px',
					'margin-bottom': '10px',
					'border-style': 'dashed',
				},
			},
		}),
		UI.createComponent('{id}-3-fs-5-t-1-upload'.format({id: id}), {
			template: UI.template('span', 'ie abs centred'),
			appearance: {
				style: {
					'font-size': '15px',
					'color': Color.grey.normal,
				},
				html: 'Upload',
			},
		}),

		// 4. transcription panel
		// -project-state-transcription
		UI.createComponent('{id}-4-transcription-panel'.format({id: id}), {
			template: UI.template('div', 'ie abs centred-vertically border'),
			appearance: {
				style: {
					'height': '100%',
					'width': '714px',
					'left': '310px',
				},
			},
		}),
		UI.createComponent('{id}-4-tp-1-title'.format({id: id}), {

		}),
		UI.createComponent('{id}-4-tp-2-statistics'.format({id: id}), {

		}),
		UI.createComponent('{id}-4-tp-3-progress'.format({id: id}), {

		}),
		UI.createComponent('{id}-4-tp-4-user-lists'.format({id: id}), {

		}),
		UI.createComponent('{id}-4-tp-5-ul-1-lists-title'.format({id: id}), {

		}),
		Components.searchableList('{id}-5-tp-3-ul-2-assigned-list'.format({id: id}), {

		}),
		Components.searchableList('{id}-5-tp-3-ul-3-all-list'.format({id: id}), {

		}),

		// 5. export panel
		// -project-state-export
		UI.createComponent('{id}-5-export-panel'.format({id: id}), {
			template: UI.template('div', 'ie abs centred-vertically border'),
			appearance: {
				style: {
					'height': '100%',
					'width': '714px',
					'left': '310px',
				},
			},
		}),

		// 6. upload panel
		// -project-state-upload
		UI.createComponent('{id}-6-upload-panel'.format({id: id}), {
			template: UI.template('div', 'ie abs centred-vertically border'),
			appearance: {
				style: {
					'height': '100%',
					'width': '714px',
					'left': '310px',
				},
			},
		}),

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
			focusSidebarSubtitle,
			focusSidebarStatus,

			// 3.3
			focusSidebarTranscriptionButton,
			focusSidebarTranscriptionButtonTranscription,
			focusSidebarTranscriptionButtonTranscriberNumber,
			focusSidebarTranscriptionButtonPercentageCompletion,
			focusSidebarTranscriptionButtonCountRemaining,

			// 3.4
			focusSidebarExportButton,
			focusSidebarExportButtonExport,
			focusSidebarExportButtonCompleted,

			// 3.5
			focusSidebarUploadButton,
			focusSidebarUploadButtonUpload,

			// 4. transcription panel
			transcriptionPanel,
			transcriptionPanelTitle,
			transcriptionPanelStatistics,
			transcriptionPanelProgress,
			transcriptionPanelUserLists,
			transcriptionPanelUserListsListsTitle,
			transcriptionPanelAssignedList,
			transcriptionPanelAllList,

			// 5. export panel
			exportPanel,

			// 6. upload panel

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
							return Active.set('contract_client.id', datum.id).then(function () {
								return _this.triggerState();
							})
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
						Active.get('contract_client.id'),
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
							return Active.set('contract_client.project', datum.id).then(function () {
								return _this.triggerState();
							})
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

		// focus sidebar
		jss.set('#{id} .menu-button:hover'.format({id: id}), {
			'border-color': Color.grey.light,
			'cursor': 'pointer',
		})

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

			// 3. FOCUS SIDEBAR
			focusSidebar.components.main.setAppearance({
				style: {
					'width': '250px',
					'height': '100%',
				},
			}),
			focusSidebar.components.main.setChildren([
				focusSidebarTitle,
				focusSidebarSubtitle,
				focusSidebarStatus,
				focusSidebarTranscriptionButton,
				focusSidebarExportButton,
				focusSidebarUploadButton,
			]),
			focusSidebar.components.main.addState('-project-state-focus', {
				preFn: function (_this) {
					return Promise.all([
						// Active
						Active.get('client'),
						Active.get('contract_client'),
					]).then(function (results) {
						var [client_id, contract_client] = results;
						// Context
						return Context.get('clients.{client_id}.contract_clients.{contract_client_id}'.format({client_id: client_id, contract_client_id: contract_client.id})).then(function (contract_client_data) {
							var project = contract_client_data.projects[contract_client.project];
							return Promise.all([
								focusSidebarTitle.setAppearance({html: '{contract_client}'.format({contract_client: contract_client_data.name})}),
								focusSidebarSubtitle.setAppearance({html: '{contract_client_project}'.format({contract_client_project: project.name})}),
								focusSidebarStatus.setAppearance({
									html: (project.is_transcription_complete ? 'complete' : 'incomplete'),
									style: {
										'color': (project.is_transcription_complete ? Color.green.normal : Color.red.normal),
									},
								}),
								focusSidebarTranscriptionButtonTranscriberNumber.setAppearance({html: '{transcribers} Transcribers'.format({transcribers: project.workers_assigned})}),
								focusSidebarTranscriptionButtonPercentageCompletion.setAppearance({html: '{completion}%'.format({completion: project.completion_percentage})}),
								focusSidebarTranscriptionButtonCountRemaining.setAppearance({html: '{remaining}'.format({remaining: project.transcriptions_remaining})}),
								focusSidebarExportButtonCompleted.setAppearance({html: '{done}'.format({done: project.transcriptions_completed})}),
							]);
						});
					});
				},
			}),

			// 3.3
			focusSidebarTranscriptionButton.setChildren([
				focusSidebarTranscriptionButtonTranscription,
				focusSidebarTranscriptionButtonTranscriberNumber,
				focusSidebarTranscriptionButtonPercentageCompletion,
				focusSidebarTranscriptionButtonCountRemaining,
			]),
			focusSidebarTranscriptionButton.setState({
				stateMap: '-project-state-transcription',
			}),
			focusSidebarTranscriptionButton.setBindings({
				'click': function (_this) {
					return _this.triggerState();
				},
			}),

			// 3.4
			focusSidebarExportButton.setChildren([
				focusSidebarExportButtonExport,
				focusSidebarExportButtonCompleted,
			]),
			focusSidebarExportButton.setState({
				stateMap: '-project-state-export',
			}),
			focusSidebarExportButton.setBindings({
				'click': function (_this) {
					return _this.triggerState();
				},
			}),

			// 3.5
			focusSidebarUploadButton.setChildren([
				focusSidebarUploadButtonUpload,
			]),

			// 4. TRANSCRIPTION PANEL
			transcriptionPanel.setState({
				defaultState: {
					preFn: UI.functions.hide(),
				},
				states: {
					'project-state': 'default',
					'-project-state-project': 'default',
					'-project-state-transcription': {
						preFn: function (_this) {
							// load data
							return Util.ep();
						},
						fn: UI.functions.show(),
					},
					'-project-state-export': 'default',
					'-project-state-upload': 'default',
				},
			}),

			// 5. EXPORT PANEL
			exportPanel.setState({
				defaultState: {
					preFn: UI.functions.hide(),
				},
				states: {
					'project-state': 'default',
					'-project-state-project': 'default',
					'-project-state-transcription': 'default',
					'-project-state-export': {
						preFn: function (_this) {
							// load data
							return Util.ep();
						},
						fn: UI.functions.show(),
					},
					'-project-state-upload': 'default',
				},
			}),

		]).then(function () {
			return base.setChildren([
				clientSidebar,
				projectSidebar,
				focusSidebar,
				transcriptionPanel,
				exportPanel,
			]);
		}).then(function () {
			return base;
		});
	});
}
