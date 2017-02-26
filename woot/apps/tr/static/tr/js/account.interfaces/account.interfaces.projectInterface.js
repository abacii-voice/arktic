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
		UI.createComponent('{id}-3-fs-5-u-1-upload'.format({id: id}), {
			template: UI.template('span', 'ie abs centred'),
			appearance: {
				style: {
					'font-size': '15px',
					'color': Color.grey.normal,
				},
				html: 'Upload',
			},
		}),
		UI.createComponent('{id}-3-fs-5-u-2-dropzone'.format({id: id}), {
			template: UI.template('div', 'ie abs centred'),
			appearance: {
				style: {
					'height': '100%',
					'width': '100%',
				},
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
			template: UI.template('div', 'ie abs centred-vertically border hidden'),
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
			template: UI.template('div', 'ie abs centred-vertically hidden'),
			appearance: {
				style: {
					'height': '100%',
					'width': '714px',
					'left': '310px',
				},
			},
		}),
		UI.createComponent('{id}-6-up-1-upload-check'.format({id: id}), {
			template: UI.template('div', 'ie'),
			appearance: {
				style: {
					'height': '100%',
					'width': '100%',
				},
			},
		}),

		// relfile display
		UI.createComponent('{id}-6-up-1-uc-1-relfile-display-container'.format({id: id}), {
			template: UI.template('div', 'ie'),
			appearance: {
				style: {
					'height': '45px', // 45, 60, 250
					'width': '500px',
					'margin-top': '20px',
				},
			},
		}),
		UI.createComponent('{id}-6-up-1-uc-1-rdc-1-relfile-display'.format({id: id}), {
			template: UI.template('div', 'ie border border-radius'),
			appearance: {
				style: {
					'height': '100%',
					'width': '50%',
					'float': 'left',
				},
			},
		}),
		UI.createComponent('{id}-6-up-1-uc-1-rdc-1-rd-1-title'.format({id: id}), {
			template: UI.template('h3', 'ie'),
			appearance: {
				style: {
					'font-size': '18px',
					'margin-top': '10px',
					'margin-left': '10px',
				},
				html: 'No relfile',
			},
		}),
		UI.createComponent('{id}-6-up-1-uc-1-rdc-1-rd-2-entries'.format({id: id}), {
			template: UI.template('span', 'ie'),
			appearance: {
				style: {
					'margin-left': '10px',
				},
			},
		}),
		Components.searchableList('{id}-6-up-1-uc-1-rdc-1-rd-3-duplicates'.format({id: id}), {
			appearance: {
				style: {
					'width': 'calc(100% - 20px)',
					'height': '200px',
					'left': '10px',
				},
			},
		}),
		UI.createComponent('{id}-6-up-1-uc-1-rdc-2-relfile-error-container'.format({id: id}), {
			template: UI.template('div', 'ie'),
			appearance: {
				style: {
					'height': '100%',
					'width': 'calc(50% - 10px)',
					'margin-left': '10px',
					'float': 'left',
				},
			},
		}),
		UI.createComponent('{id}-6-up-1-uc-1-rdc-2-rec-1-no-relfile-error'.format({id: id}), {
			template: UI.template('div', 'ie hidden'),
			appearance: {
				style: {
					'height': '30px',
				},
			},
		}),
		UI.createComponent('{id}-6-up-1-uc-1-rdc-2-rec-1-nre-1-text'.format({id: id}), {
			template: UI.template('div', 'ie border border-radius'),
			appearance: {
				style: {
					'height': '100%',
					'width': '110px',
					'color': Color.red.dark,
					'border-color': Color.red.dark,
					'float': 'left',
					'text-align': 'center',
					'font-size': '15px',
					'padding-top': '6px',
					'border-bottom-right-radius': '0px',
					'border-top-right-radius': '0px',
				},
				html: 'No relfile',
			},
		}),
		UI.createComponent('{id}-6-up-1-uc-1-rdc-2-rec-1-nre-2-ignore-button'.format({id: id}), {
			template: UI.template('div', 'ie border border-radius button no'),
			appearance: {
				style: {
					'height': '30px',
					'width': '80px',
					'float': 'left',
					'padding-top': '6px',
					'border-left': '0px',
					'border-bottom-left-radius': '0px',
					'border-top-left-radius': '0px',
				},
				html: 'Ignore',
			},
		}),
		UI.createComponent('{id}-6-up-1-uc-1-rdc-2-rec-2-duplicates-error'.format({id: id}), {
			template: UI.template('div', 'ie border border-radius hidden'),
			appearance: {
				style: {
					'height': '30px',
					'width': '110px',
					'color': Color.red.dark,
					'border-color': Color.red.dark,
					'float': 'left',
					'text-align': 'center',
					'font-size': '15px',
					'padding-top': '6px',
				},
				html: 'Duplicates',
			},
		}),

		// audio display
		UI.createComponent('{id}-6-up-1-uc-2-audio-display-container'.format({id: id}), {
			template: UI.template('div', 'ie'),
			appearance: {
				style: {
					'height': '45px',
					'width': '500px',
					'margin-top': '10px',
				},
			},
		}),
		UI.createComponent('{id}-6-up-1-uc-2-adc-1-audio-display'.format({id: id}), {
			template: UI.template('div', 'ie border border-radius'),
			appearance: {
				style: {
					'height': '100%',
					'width': '50%',
					'float': 'left',
				},
			},
		}),
		UI.createComponent('{id}-6-up-1-uc-2-adc-1-ad-1-title'.format({id: id}), {
			template: UI.template('h3', 'ie'),
			appearance: {
				style: {
					'font-size': '18px',
					'margin-top': '10px',
					'margin-left': '10px',
				},
				html: 'No audio',
			},
		}),
		UI.createComponent('{id}-6-up-1-uc-2-adc-1-ad-2-entries'.format({id: id}), {
			template: UI.template('span', 'ie'),
			appearance: {
				style: {
					'margin-left': '10px',
				},
			},
		}),
		Components.searchableList('{id}-6-up-1-uc-2-adc-1-ad-3-no-caption-list'.format({id: id}), {
			appearance: {
				style: {
					'width': 'calc(100% - 20px)',
					'height': '200px',
					'left': '10px',
				},
			},
		}),
		UI.createComponent('{id}-6-up-1-uc-1-adc-2-audio-error-container'.format({id: id}), {
			template: UI.template('div', 'ie'),
			appearance: {
				style: {
					'height': '100%',
					'width': 'calc(50% - 10px)',
					'margin-left': '10px',
					'float': 'left',
				},
			},
		}),
		UI.createComponent('{id}-6-up-1-uc-1-adc-2-aec-1-no-caption'.format({id: id}), {
			template: UI.template('div', 'ie hidden'),
			appearance: {
				style: {
					'height': '30px',
				},
			},
		}),
		UI.createComponent('{id}-6-up-1-uc-1-adc-2-aec-1-nc-1-text'.format({id: id}), {
			template: UI.template('div', 'ie border border-radius'),
			appearance: {
				style: {
					'height': '100%',
					'width': '110px',
					'color': Color.red.dark,
					'border-color': Color.red.dark,
					'float': 'left',
					'text-align': 'center',
					'font-size': '15px',
					'padding-top': '6px',
					'border-bottom-right-radius': '0px',
					'border-top-right-radius': '0px',
				},
				html: 'No caption',
			},
		}),
		UI.createComponent('{id}-6-up-1-uc-1-adc-2-aec-1-nc-2-ingore-button'.format({id: id}), {
			template: UI.template('div', 'ie border border-radius button no'),
			appearance: {
				style: {
					'height': '30px',
					'width': '80px',
					'float': 'left',
					'padding-top': '6px',
					'border-left': '0px',
					'border-bottom-left-radius': '0px',
					'border-top-left-radius': '0px',
				},
				html: 'Ignore',
			},
		}),

		// button panel
		UI.createComponent('{id}-6-up-1-uc-3-button-panel'.format({id: id}), {
			template: UI.template('div', 'ie'),
			appearance: {
				style: {
					'height': '45px',
					'width': '250px',
					'margin-top': '10px',
				},
			},
		}),

		// cancel button
		UI.createComponent('{id}-6-up-1-uc-3-bp-1-cancel-button'.format({id: id}), {
			template: UI.template('div', 'ie border border-radius button no'),
			appearance: {
				style: {
					'height': '45px',
					'width': '80px',
					'margin-right': '10px',
					'float': 'left',
				},
				html: 'Cancel',
			},
		}),

		// confirm button
		UI.createComponent('{id}-6-up-1-uc-3-bp-2-confirm-upload-button'.format({id: id}), {
			template: UI.template('div', 'ie border border-radius button yes'),
			appearance: {
				style: {
					'height': '45px',
					'width': 'calc(100% - 90px)',
					'float': 'left',
				},
				html: 'Upload',
			},
		}),

		// 6.2 previous uploads
		UI.createComponent('{id}-6-up-2-previous-uploads'.format({id: id}), {
			template: UI.template('div', 'ie hidden'),
			appearance: {
				style: {
					'height': '100%',
					'width': '100%',
				},
			},
		}),

		// non-interface elements
		AccountComponents.uploadController(),

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
			focusSidebarUploadButtonDropzone,

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
			uploadPanel,
			uploadPanelUploadCheck,

			// relfile display
			uploadPanelUploadCheckRelfileDisplayContainer,
			uploadPanelUploadCheckRelfileDisplay,
			uploadPanelUploadCheckRelfileDisplayTitle,
			uploadPanelUploadCheckRelfileDisplayEntries,
			uploadPanelUploadCheckRelfileDisplayDuplicates,
			uploadPanelUploadCheckRelfileErrorContainer,
			uploadPanelUploadCheckRelfileErrorContainerNoRelfileError,
			uploadPanelUploadCheckRelfileErrorContainerNoRelfileErrorText,
			uploadPanelUploadCheckRelfileErrorContainerNoRelfileErrorIgnoreButton,
			uploadPanelUploadCheckRelfileErrorContainerDuplicatesError,

			// audio display
			uploadPanelUploadCheckAudioDisplayContainer,
			uploadPanelUploadCheckAudioDisplay,
			uploadPanelUploadCheckAudioDisplayTitle,
			uploadPanelUploadCheckAudioDisplayEntries,
			uploadPanelUploadCheckAudioDisplayNoCaptionList,
			uploadPanelUploadCheckAudioErrorContainer,
			uploadPanelUploadCheckAudioErrorContainerNoCaptionError,
			uploadPanelUploadCheckAudioErrorContainerNoCaptionErrorText,
			uploadPanelUploadCheckAudioErrorContainerNoCaptionErrorIgnoreButton,

			// confirm button
			uploadPanelButtonPanel,
			uploadPanelButtonPanelCancelButton,
			uploadPanelButtonPanelConfirmUploadButton,

			// 6.2 previous uploads
			uploadPanelPreviousUploads,

			// non-interface elements
			uploadController,

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

		// relfile duplicates
		uploadPanelUploadCheckRelfileDisplayDuplicates.data.load.source = function (path, options) {
			return Util.ep(uploadController.upload.buffer.relfile.entries);
		}
		uploadPanelUploadCheckRelfileDisplayDuplicates.autocomplete = false;
		uploadPanelUploadCheckRelfileDisplayDuplicates.targets = [
			{
				name: 'duplicates',
				path: function () {
					return Util.ep();
				},
				process: function (data) {
					var results = Object.keys(data).filter(function (key) {
						return data[key].isDuplicate;
					}).map(function (key) {
						var entry = data[key];
						return {
							id: key,
							main: key,
							rule: 'duplicates',
						}
					});
					return Util.ep(results);
				},
			}
		]
		uploadPanelUploadCheckRelfileDisplayDuplicates.unit = function (datum, query, index) {
			query = (query || '');
			var base = uploadPanelUploadCheckRelfileDisplayDuplicates.data.idgen(index);
			return Promise.all([
				// base component
				UI.createComponent(base, {
					template: UI.template('div', 'ie base'),
					appearance: {
						style: {
							'height': '20px',
						},
						classes: [datum.rule],
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

		// audio captions
		uploadPanelUploadCheckAudioDisplayNoCaptionList.data.load.source = function (path, options) {
			return Util.ep(uploadController.upload.buffer.audio);
		}
		uploadPanelUploadCheckAudioDisplayNoCaptionList.autocomplete = false;
		uploadPanelUploadCheckAudioDisplayNoCaptionList.targets = [
			{
				name: 'noCaption',
				path: function () {
					return Util.ep();
				},
				process: function (data) {
					var results = Object.keys(data).filter(function (key) {
						return !(key in uploadController.upload.buffer.relfile.entries);
					}).map(function (key) {
						return {
							id: key,
							main: key,
							rule: 'noCaption',
						}
					});
					return Util.ep(results);
				},
			}
		]
		uploadPanelUploadCheckAudioDisplayNoCaptionList.unit = function (datum, query, index) {
			query = (query || '');
			var base = uploadPanelUploadCheckAudioDisplayNoCaptionList.data.idgen(index);
			return Promise.all([
				// base component
				UI.createComponent(base, {
					template: UI.template('div', 'ie base'),
					appearance: {
						style: {
							'height': '20px',
						},
						classes: [datum.rule],
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

		// upload panel buttons
		jss.set('#{id} .button.yes'.format({id: id}), {
			'border-color': Color.green.normal,
			'color': Color.green.normal,
			'text-align': 'center',
			'padding-top': '14px',
		});
		jss.set('#{id} .button.yes:hover'.format({id: id}),{
			'border-color': Color.green.light,
			'color': Color.green.light,
		});
		jss.set('#{id} .button.no'.format({id: id}), {
			'border-color': Color.red.dark,
			'color': Color.red.dark,
			'text-align': 'center',
			'padding-top': '14px',
		});
		jss.set('#{id} .button.no:hover'.format({id: id}), {
			'border-color': Color.red.normal,
			'color': Color.red.normal,
		});

		// upload controller
		uploadController.triggerState = function () {
			return UI.changeState('-project-state-upload-check');
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
				focusSidebarUploadButtonDropzone,
			]),
			focusSidebarUploadButtonDropzone.setState({
				states: {
					'project-state': {
						preFn: function (_this) {
							if (!_this.isDropzoneSetup) {
								_this.isDropzoneSetup = true;
								_this.dropzone = new Dropzone('#{id}'.format({id: _this.id}), {
									url: '#',
									accept: uploadController.upload.accept,
								});
								return Util.ep();
							}
						},
					},
				},
			}),

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
					'-project-state-upload-check': 'default',
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
					'-project-state-upload-check': 'default',
					'-project-state-upload': 'default',
				},
			}),

			// 6. UPLOAD PANEL
			uploadPanel.setState({
				defaultState: {
					preFn: UI.functions.hide(),
				},
				states: {
					'project-state': 'default',
					'-project-state-project': 'default',
					'-project-state-transcription': 'default',
					'-project-state-export': 'default',
					'-project-state-upload-check': {
						preFn: function (_this) {
							// load data
							return Util.ep();
						},
						fn: UI.functions.show(),
					},
					'-project-state-upload': 'default',
				},
			}),
			uploadPanel.setChildren([
				uploadPanelUploadCheck,
				uploadPanelPreviousUploads,
			]),

			// CONVERT TO FUNCTION CALLS ON THE RELEVANT OBJECTS SET ABOVE
			uploadPanelUploadCheck.setState({
				defaultState: {
					preFn: UI.functions.hide(),
					fn: function (_this) {
						// return uploadPanelUploadCheck.reset();
						return Util.ep();
					},
				},
				states: {
					'-project-state-upload-check': {
						fn: function (_this) {
							// load data
							return Promise.all([

								// adjust relfile display container
								Util.ep(Object.keys(uploadController.upload.buffer.relfile.entries).length).then(function (numberOfEntries) {
									if (uploadController.upload.addingRelfile) {
										uploadController.upload.addingRelfile = false;
										if (numberOfEntries) {
											return Promise.all([
												uploadPanelUploadCheckRelfileDisplayTitle.setAppearance({html: 'Relfile'}),
												uploadPanelUploadCheckRelfileDisplayEntries.setAppearance({html: '{entries} entries'.format({entries: numberOfEntries})}),
											]).then(function () {
												var numberOfDuplicates = Object.keys(uploadController.upload.buffer.relfile.entries).filter(function (key) {
													return uploadController.upload.buffer.relfile.entries[key].isDuplicate;
												}).length;
												if (numberOfDuplicates) {
													return Promise.all([
														uploadPanelUploadCheckRelfileDisplayDuplicates.setTitle({text: '{duplicates} duplicates'.format({duplicates: numberOfDuplicates}), center: false}),
														uploadPanelUploadCheckRelfileDisplayContainer.setAppearance({style: {'height': '250px'}}),
													]);
												} else {
													return uploadPanelUploadCheckRelfileDisplayContainer.setAppearance({style: {'height': '60px'}});
												}
											});


										} else {
											return Promise.all([
												uploadPanelUploadCheckRelfileDisplayTitle.setAppearance({html: 'No relfile'}),
												uploadPanelUploadCheckRelfileDisplayContainer.setAppearance({style: {'height': '45px'}}),
											]);
										}
									}
								}),

								// adjust audio display container
								Util.ep(Object.keys(uploadController.upload.buffer.audio).length).then(function (numberOfEntries) {
									if (uploadController.upload.addingAudio) {
										uploadController.upload.addingAudio = false;
										if (numberOfEntries) {
											return Promise.all([
												uploadPanelUploadCheckAudioDisplayTitle.setAppearance({html: 'Audio'}),
												uploadPanelUploadCheckAudioDisplayEntries.setAppearance({html: '{entries} entries'.format({entries: numberOfEntries})}),
											]).then(function () {
												var numberOfNoCaption = Object.keys(uploadController.upload.buffer.audio).filter(function (key) {
													return !(key in uploadController.upload.buffer.relfile.entries);
												}).length;
												if (numberOfNoCaption) {
													return uploadPanelUploadCheckAudioDisplayNoCaptionList.setTitle({text: '{nocaption} without captions'.format({nocaption: numberOfNoCaption}), center: false}).then(function () {
														if (uploadController.upload.addingAudioTarget !== 1) {
															uploadController.upload.addingAudioTarget = 1;
															return uploadPanelUploadCheckAudioDisplayContainer.setAppearance({style: {'height': '250px'}}).then(function () {
																uploadController.upload.addingAudioTarget = 0;
															});
														}
													});
												} else {
													if (uploadController.upload.addingAudioTarget !== 2) {
														uploadController.upload.addingAudioTarget = 2;
														return uploadPanelUploadCheckAudioDisplayContainer.setAppearance({style: {'height': '60px'}}).then(function () {
															uploadController.upload.addingAudioTarget = 0;
														});
													}
												}
											});
										} else {
											return uploadPanelUploadCheckAudioDisplayTitle.setAppearance({html: 'No audio'}).then(function () {
												if (uploadController.upload.addingAudioTarget !== 3) {
													uploadController.upload.addingAudioTarget = 3;
													return uploadPanelUploadCheckAudioDisplayContainer.setAppearance({style: {'height': '45px'}}).then(function () {
														uploadController.upload.addingAudioTarget = 0;
													});
												}
											});
										}
									}
								}),
							]).then(function () {
								return Promise.all([
									// display audio no caption
									uploadPanelUploadCheckAudioDisplayNoCaptionList.control.setup.main(),

									// display relfile duplicates
									uploadPanelUploadCheckRelfileDisplayDuplicates.control.setup.main(),
								]);
							});
						},
						preFn: UI.functions.show(),
					},
					'-project-state-upload': 'default',
				},
			}),
			uploadPanelUploadCheck.setChildren([
				uploadPanelUploadCheckRelfileDisplayContainer,
				uploadPanelUploadCheckAudioDisplayContainer,
				uploadPanelButtonPanel,
			]),

			// relfile display
			uploadPanelUploadCheckRelfileDisplayDuplicates.setTitle({text: 'Duplicates', center: false, style: {'font-size': '14px', 'margin-bottom': '0px'}}),
			uploadPanelUploadCheckRelfileDisplayDuplicates.setSearch({mode: 'off', placeholder: ''}),
			uploadPanelUploadCheckRelfileDisplayDuplicates.components.list.setAppearance({
				style: {
					'height': '158px',
				},
			}),
			uploadPanelUploadCheckRelfileDisplayContainer.setChildren([
				uploadPanelUploadCheckRelfileDisplay,
				uploadPanelUploadCheckRelfileErrorContainer,
			]),
			uploadPanelUploadCheckRelfileDisplay.setChildren([
				uploadPanelUploadCheckRelfileDisplayTitle,
				uploadPanelUploadCheckRelfileDisplayEntries,
				uploadPanelUploadCheckRelfileDisplayDuplicates,
			]),
			uploadPanelUploadCheckRelfileErrorContainer.setChildren([
				uploadPanelUploadCheckRelfileErrorContainerNoRelfileError,
				uploadPanelUploadCheckRelfileErrorContainerDuplicatesError,
			]),
			uploadPanelUploadCheckRelfileErrorContainerNoRelfileError.setChildren([
				uploadPanelUploadCheckRelfileErrorContainerNoRelfileErrorText,
				uploadPanelUploadCheckRelfileErrorContainerNoRelfileErrorIgnoreButton,
			]),

			// audio display
			uploadPanelUploadCheckAudioDisplayNoCaptionList.setTitle({text: 'Without captions', center: false, style: {'font-size': '14px', 'margin-bottom': '0px'}}),
			uploadPanelUploadCheckAudioDisplayNoCaptionList.setSearch({mode: 'off', placeholder: ''}),
			uploadPanelUploadCheckAudioDisplayNoCaptionList.components.list.setAppearance({
				style: {
					'height': '158px',
				},
			}),
			uploadPanelUploadCheckAudioDisplayContainer.setChildren([
				uploadPanelUploadCheckAudioDisplay,
				uploadPanelUploadCheckAudioErrorContainer,
			]),
			uploadPanelUploadCheckAudioDisplay.setChildren([
				uploadPanelUploadCheckAudioDisplayTitle,
				uploadPanelUploadCheckAudioDisplayEntries,
				uploadPanelUploadCheckAudioDisplayNoCaptionList,
			]),
			uploadPanelUploadCheckAudioErrorContainer.setChildren([
				uploadPanelUploadCheckAudioErrorContainerNoCaptionError,
			]),
			uploadPanelUploadCheckAudioErrorContainerNoCaptionError.setChildren([
				uploadPanelUploadCheckAudioErrorContainerNoCaptionErrorText,
				uploadPanelUploadCheckAudioErrorContainerNoCaptionErrorIgnoreButton,
			]),

			// button panel
			uploadPanelButtonPanel.setChildren([
				uploadPanelButtonPanelCancelButton,
				uploadPanelButtonPanelConfirmUploadButton,
			]),

		]).then(function () {
			return base.setChildren([
				clientSidebar,
				projectSidebar,
				focusSidebar,
				transcriptionPanel,
				exportPanel,
				uploadPanel,
			]);
		}).then(function () {
			return base;
		});
	});
}
